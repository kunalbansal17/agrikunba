// pages/traceability.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Traceability() {
  return (
    <>
      <Head>
        <title>AgriKunba Traceability</title>
        <meta name="description" content="Complete origin to consumer traceability for agri produce. QR, compliance, transparency." />
      </Head>

      {/* Hero */}
      <section className="full-bleed bg-white">
        <div className="px-6 py-12 md:py-20 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-5xl font-bold text-black">
              Traceability You Can Trust
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              From farms to oceans — track crops, fruits, livestock, and fisheries with QR codes, origin maps, and compliance reports. AgriKunba delivers trust and transparency across the entire agri-food chain.
            </p>
            <div className="mt-6">
              <Link href="/contact?product=agritrace" className="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800 transition">
                Start your Traceability Journey
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              {/* Replace with your traceability hero image */}
              <Image
                src="/images/traceability-hero.png"
                alt="AgriTrace Traceability Dashboard"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="bg-gray-50 py-12">
        <div className="px-6 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-semibold text-black">Why Origin Transparency Matters</h2>
          <p className="text-gray-700 leading-relaxed">
            Consumers demand to know where their food comes from, how it was grown, and whether safety & sustainability practices were followed. Traceability establishes trust, differentiates your brand, and opens new markets.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="feature-item flex items-start gap-4">
            <div className="icon w-30 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              {/* put icon: QR */}
              <Image src="/images/qrtrace.png" alt="QR code icon" width={50} height={40} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black">Scannable QR Codes</h3>
              <p className="text-gray-700">Each product package gets a QR code that reveals origin, field, inputs, harvest date, and safety reports.</p>
            </div>
          </div>
          <div className="feature-item flex items-start gap-4">
            <div className="icon  w-30 h-20 bg-gray-100  rounded-full flex items-center justify-center">
              <Image src="/images/settlement.png" alt="Origin Map icon" width={50} height={40} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black">Field-to-Consumer Map</h3>
              <p className="text-gray-700">View the exact origin fields and trace every step of the supply chain through our dashboard.</p>
            </div>
          </div>
          <div className="feature-item flex items-start gap-4">
            <div className="icon  w-30 h-20 bg-gray-100  rounded-full flex items-center justify-center">
              <Image src="/images/compliance.png" alt="Compliance icon" width={50} height={40} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black">Standards & Compliance</h3>
              <p className="text-gray-700">Meet export, food safety, and sustainability regulations through trace logs, test certificates and audit trails.</p>
            </div>
          </div>
          <div className="feature-item flex items-start gap-4">
            <div className="icon  w-30 h-20 bg-gray-100  rounded-full flex items-center justify-center">
              <Image src="/images/agritrace-hero.png" alt="Analytics icon" width={50} height={40} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black">Consumer Insights Dashboard</h3>
              <p className="text-gray-700">Track consumer scans, behavior, and feedback to improve quality and marketing strategies.</p>
            </div>
          </div>
        </div>
      </section>

     
      {/* Industries / Use Cases */}
<section className="bg-gray-50 py-10">
  <h2 className="text-center text-2xl font-bold mb-8">
    Industries That Trust Traceability
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 max-w-6xl mx-auto">
    {/* Exporters */}
    <div className="rounded-lg overflow-hidden shadow  bg-white flex flex-col">
      <img
        src="/images/exporters.jpg"
        alt="Export"
        className="w-full h-48 object-cover"
      />
      <div className="py-3 text-center text-gray-700 font-medium">Exporters</div>
    </div>

    {/* Retail */}
    <div className="rounded-lg overflow-hidden shadow bg-white flex flex-col">
      <img
        src="/images/retail-store.jpg"
        alt="Retail"
        className="w-full h-48 object-cover"
      />
      <div className="py-3 text-center text-gray-700 font-medium">Retail</div>
    </div>

    {/* FPOs */}
    <div className="rounded-lg overflow-hidden shadow  bg-white flex flex-col">
      <img
        src="/images/fpo.png"
        alt="FPOs"
        className="w-full h-48 object-cover"
      />
      <div className="py-3 text-center text-gray-700 font-medium">FPOs</div>
    </div>

    {/* Organic Food */}
    <div className="rounded-lg overflow-hidden shadow bg-white flex flex-col">
      <img
        src="/images/organic.png"
        alt="Organic Food"
        className="w-full h-48 object-cover"
      />
      <div className="py-3 text-center text-gray-700 font-medium">Organic Food</div>
    </div>
  </div>
</section>


      {/* Contact / CTA */}
      <section className="full-bleed bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-black">Ready to add traceability to your value chain?</h2>
          <p className="mt-4 text-gray-700">
            Make food transparency your brand promise. Let’s create trust, together.
          </p>
          <div className="mt-6">
            <Link href="/contact?product=agritrace" className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition">
              Book a Trial / Talk to Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
