import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";

type Props = { chats: { id: string; createdAt: string; lang: string }[] };

export default function History({ chats }: Props) {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Your KrishiGPT chats</h1>
      <ul className="space-y-3">
        {chats.map((c) => (
          <li key={c.id} className="rounded border p-3">
            <div className="text-sm text-gray-600">
              {new Date(c.createdAt).toLocaleString()} · lang: {c.lang}
            </div>
            <a className="text-emerald-700 underline" href={`/krishigpt/live?chat=${c.id}`}>
              Open chat
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/kgpt_vid=([^;]+)/);
  const visitorId = match?.[1] || "";
  if (!visitorId) return { props: { chats: [] } };

  const chats = await prisma.chat.findMany({
    where: { visitorId },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, lang: true },
  });

  return { props: { chats: chats.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })) } };
};
