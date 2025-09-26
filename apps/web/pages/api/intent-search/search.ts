import type { NextApiRequest, NextApiResponse } from "next";
import { hybridSearch } from "@/lib/intent-search/search";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const params = req.body;
    const results = await hybridSearch(params);
    return res.status(200).json(results);
  } catch (e: any) {
    console.error("Search API error:", e);
    return res.status(500).json({ error: e.message });
  }
}
