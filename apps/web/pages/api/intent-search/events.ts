import type { NextApiRequest, NextApiResponse } from "next";
import { pgpool } from "@/lib/intent-search/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { site_id, query_id, user_token, product_id, event_type } = req.body;
    if (!site_id || !event_type) {
      return res.status(400).json({ error: "Missing site_id or event_type" });
    }

    await pgpool.query(
      `insert into events (site_id, query_id, user_token, product_id, event_type)
       values ($1,$2,$3,$4,$5)`,
      [site_id, query_id ?? null, user_token ?? null, product_id ?? null, event_type]
    );

    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
