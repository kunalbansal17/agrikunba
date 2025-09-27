import type { NextApiRequest, NextApiResponse } from "next";
import { pgpool } from "@/lib/intent-search/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const { rows } = await pgpool.query(
      "select now() as now, inet_server_addr() as host, inet_server_port() as port"
    );
    return res.status(200).json({ ok: true, db: rows[0] });
  } catch (e: any) {
    console.error("DB health error:", e);
    return res.status(500).json({ ok: false, error: e.message, stack: e.stack });
  }
}
