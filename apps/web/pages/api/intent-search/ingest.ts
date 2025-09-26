import type { NextApiRequest, NextApiResponse } from "next";
import { upsertProduct } from "@/lib/intent-search/ingest";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const id = await upsertProduct(req.body);
    return res.json({ id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
