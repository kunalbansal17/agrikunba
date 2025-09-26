import type { NextApiRequest, NextApiResponse } from "next";
import { pgpool } from "@/lib/intent-search/db";
import { translateQueryIfNeeded } from "@/lib/intent-search/embeddings";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { site_id, q } = req.query as { site_id: string; q: string };

    if (!site_id || !q) {
      return res.status(400).json({ error: "site_id and q required" });
    }

    console.log("SUGGEST request", { site_id, q });

    const client = await pgpool.connect();
    try {
      let { rows } = await client.query(
        `select id, title
         from products
         where site_id = $1::uuid
           and title ilike $2
         order by title asc
         limit 10`,
        [site_id, q + "%"]
      );

      if (rows.length === 0) {
        const translated = await translateQueryIfNeeded(q);
        if (translated && translated !== q) {
          const { rows: trRows } = await client.query(
            `select id, title
             from products
             where site_id = $1::uuid
               and title ilike $2
             order by title asc
             limit 10`,
            [site_id, translated + "%"]
          );
          rows = trRows;
        }
      }

      return res.status(200).json({ suggestions: rows });
    } finally {
      client.release();
    }
  } catch (e: any) {
    console.error("Suggest API error:", e);
    return res.status(500).json({ error: e.message });
  }
}
