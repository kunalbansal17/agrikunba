// apps/web/lib/visitor.ts
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

export function getOrSetVisitorId(req: NextApiRequest, res: NextApiResponse) {
  const cookieName = "kgpt_vid";
  const cookie = req.headers.cookie || "";
  const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`));
  if (match) return match[1];

  const id = randomUUID();
  // simple cookie, 180 days
  res.setHeader("Set-Cookie", `${cookieName}=${id}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax`);
  return id;
}
