export function composeAnswer({
  message,
  intent,
  lang,
}: {
  message: string;
  intent: string;
  lang: string;
}) {
  return {
    now: `Answer for ${intent} question (demo).`,
    why: "Because it matches your context.",
    next: "Next step you should take…",
    safety: "Remember: educational only. Follow local guidelines."
  };
}
