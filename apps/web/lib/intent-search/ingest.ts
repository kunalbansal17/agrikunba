import { pgpool } from "./db";
import { embedText } from "./embeddings";

export type ProductUpsert = {
  site_id: string;
  sku?: string;
  title: string;
  description?: string;
  price_cents?: number;
  currency?: string;
  url?: string;
  image_url?: string;
  brand?: string;
  category?: string;
  attributes?: Record<string, any>;
  locale?: string;
};

export async function upsertProduct(p: ProductUpsert) {
  // Text used for embeddings
  const textForEmbed = [p.title, p.brand, p.category, p.description]
    .filter(Boolean)
    .join(" ");

  const embedding = await embedText(textForEmbed);
  const vectorParam = "[" + embedding.map((x: number) => x.toString()).join(",") + "]";

  const client = await pgpool.connect();
  try {
    await client.query("begin");
    const { rows } = await client.query(
      `insert into products (
        site_id, sku, title, description, price_cents, currency, url, image_url,
        brand, category, attributes, locale, embedding, tsv
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::vector,
        to_tsvector('simple', coalesce($3,'') || ' ' || coalesce($4,''))
      )
      on conflict (sku) do update set
        title = excluded.title,
        description = excluded.description,
        price_cents = excluded.price_cents,
        currency = excluded.currency,
        url = excluded.url,
        image_url = excluded.image_url,
        brand = excluded.brand,
        category = excluded.category,
        attributes = excluded.attributes,
        locale = excluded.locale,
        embedding = excluded.embedding,
        tsv = excluded.tsv
      returning id`,
      [
        p.site_id,
        p.sku ?? null,
        p.title,
        p.description ?? null,
        p.price_cents ?? null,
        p.currency ?? "INR",
        p.url ?? null,
        p.image_url ?? null,
        p.brand ?? null,
        p.category ?? null,
        p.attributes ?? {},
        p.locale ?? "en",
        vectorParam,
      ]
    );
    const id = rows[0]?.id;
    await client.query("commit");
    return id;
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.release();
  }
}
