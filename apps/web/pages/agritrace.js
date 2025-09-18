// pages/products/agriTrace.js
import Head from "next/head";
import Link from "next/link";

export default function AgriTrace() {
  return (
    <>
      <Head>
        <title>AgriTrace | AgriKunba</title>
        <meta
          name="description"
          content="AgriTrace is the traceability and verification layer for lots, contracts, and settlements."
        />
      </Head>

      <section className="px-6 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-black">AgriTrace</h1>

          <p className="mt-3 text-black/80">
            The traceability and verification layer for modern agri trade. Link every lot to a
            QR page, record chain-of-custody events, and keep clean audit trails that build trust.
          </p>

          <ul className="mt-4 list-disc list-inside text-black/70 space-y-1 text-sm">
            <li>QR-linked lot pages with origin, QC, photos, and certificates</li>
            <li>Dispatch → in-transit → delivered → accepted timeline</li>
            <li>COA and document vault with shareable links</li>
            <li>APIs to connect labs, ERPs, and logistics partners</li>
          </ul>
     <div className="mt-6">
          <Link
            href="/contact?product=b2b-trading"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Start a conversation
          </Link>
        </div>

        </div>
      </section>
    </>
  );
}
