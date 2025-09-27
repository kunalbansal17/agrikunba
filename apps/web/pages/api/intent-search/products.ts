import type { NextApiRequest, NextApiResponse } from "next";
import { pgpool } from "@/lib/intent-search/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await pgpool.connect();
    try {
      const { rows } = await client.query(
        `select id, title, description, price_cents, currency, url, brand, category
         from products
         where site_id = $1::uuid and available = true
         order by created_at desc
         limit 50`,
        ["11111111-2222-4333-8444-555555555555"] // replace with your real site_id
      );

      return res.status(200).json({ products: rows });
    } finally {
      client.release();
    }
  } catch (e: any) {
    console.error("Products API error:", e);
    return res.status(500).json({ error: e.message });
  }
}
