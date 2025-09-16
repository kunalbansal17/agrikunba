export function classifyIntent(msg: string): string {
  const text = msg.toLowerCase();
  if (text.includes("rain") || text.includes("spray")) return "weather";
  if (text.includes("urea") || text.includes("fertilizer")) return "nutrition";
  if (text.includes("price") || text.includes("mandi")) return "prices";
  if (text.includes("armyworm") || text.includes("pest")) return "pest";
  if (text.includes("pm-kisan") || text.includes("scheme")) return "schemes";
  return "general";
}
