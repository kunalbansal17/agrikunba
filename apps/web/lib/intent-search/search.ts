import { pgpool } from "./db";
import { embedText, translateQueryIfNeeded } from "./embeddings";

export type SearchParams = {
  site_id: string;
  q: string;
  page?: number;
  size?: number;
};

function normLang(q: string) {
  return q.trim().toLowerCase();
}

export async function hybridSearch(params: SearchParams): Promise<{ total: number; items: any[] }> {
  const page = Math.max(1, params.page ?? 1);
  const size = Math.min(50, Math.max(1, params.size ?? 20));
  const offset = (page - 1) * size;

  let q = normLang(params.q);

  // 🔑 Step 1: Try embedding directly
  let embed = await embedText(q);
  let vectorParam = "[" + embed.map((x: number) => x.toString()).join(",") + "]";

  const client = await pgpool.connect();
  try {
    // Vector candidates
    const vecK = 100;
    const { rows: vecRows } = await client.query(
      `select id, title, url, image_url, price_cents, brand, category,
              1 - (embedding <=> $1::vector) as vec_score
       from products
       where site_id = $2::uuid and available = true
       order by embedding <=> $1::vector asc
       limit $3`,
      [vectorParam, params.site_id, vecK]
    );

    // Keyword candidates
    const kwK = 100;
    const { rows: kwRows } = await client.query(
      `select id, title, url, image_url, price_cents, brand, category,
              ts_rank_cd(tsv, plainto_tsquery('simple', $1)) as bm25
       from products
       where site_id = $2::uuid
         and (tsv @@ plainto_tsquery('simple', $1)
              or title ilike '%' || $1 || '%')
       order by bm25 desc
       limit $3`,
      [q, params.site_id, kwK]
    );

    // Merge results
    const map = new Map<string, any>();
    for (const r of vecRows) map.set(r.id, { ...r, bm25: 0 });
    for (const r of kwRows) {
      const ex = map.get(r.id);
      map.set(r.id, {
        ...(ex ?? r),
        bm25: r.bm25 ?? ex?.bm25 ?? 0,
        vec_score: ex?.vec_score ?? 0,
      });
    }

    let combined = Array.from(map.values())
      .map((r) => ({
        ...r,
        score: 0.7 * (r.vec_score ?? 0) + 0.3 * (r.bm25 ?? 0),
      }))
      .sort((a, b) => b.score - a.score);

    // 🔑 Step 2: If empty OR too few results, try translation
    if (combined.length < 2) {
      const translated = await translateQueryIfNeeded(q);
      if (translated && translated !== q) {
        console.log(`Translation fallback: "${q}" → "${translated}"`);
        return await hybridSearch({ ...params, q: translated });
      }
    }

    const total = combined.length;
    const pageItems = combined.slice(offset, offset + size);

    return { total, items: pageItems };
  } finally {
    client.release();
  }
}
