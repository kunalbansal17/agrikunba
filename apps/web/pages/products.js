// pages/products.js
import Link from "next/link";
import Image from "next/image";
// components/KrishiGPTDemo.js
import KrishiGPTDemo from "../components/KrishiGPTDemo";


export default function Products() {
  return (
    <>
      {/* Fold 1 — three big gradient cards */}
      <section className="px-6 pt-8 pb-12 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black">Products</h1>
          <p className="mt-3 text-black/80">
            One GenAI-powered stack for modern agri trade.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KrishiGPT */}
          <div className="rounded-3xl overflow-hidden shadow-sm ring-1 ring-gray-200 bg-gradient-to-b from-emerald-100 to-white min-h-[28rem] flex flex-col">
            {/* Image area (replace when ready) */}
            <div className="relative h-48 md:h-56 w-full">
              { <Image src="/images/krishigpt-card.png" alt="KrishiGPT" fill className="object-cover" /> }
            </div>
            {/* Copy */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                AI Copilot
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-black">KrishiGPT</h3>
              <p className="mt-2 text-black/80">
                Multilingual AI copilot for the agri value chain. Answers, explains, drafts contracts, and much more.
              </p>
              <div className="mt-auto pt-4">
                <Link
                  href="/krishigpt/live"
                  className="inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  Try Now
                </Link>
              </div>
            </div>
          </div>

          {/* ComMatrix */}
          <div className="rounded-3xl overflow-hidden shadow-sm ring-1 ring-gray-200 bg-gradient-to-b from-sky-100 to-white min-h-[28rem] flex flex-col">
            <div className="relative h-48 md:h-56 w-full">
              { <Image src="/images/commatrix-card.png" alt="ComMatrix" fill className="object-cover" /> }
   
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-xs font-medium text-sky-700 uppercase tracking-wide">
                Intelligent Pricing
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-black">ComMatrix</h3>
              <p className="mt-2 text-black/80">
          Dynamic, real-time intelligence - integrating market signals, supply-chain shifts, and risk alerts into one live view.              </p>
              <div className="mt-auto pt-4">
                <Link
                  href="/commatrix"
                  className="inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>

          {/* AgriTrace */}
          <div className="rounded-3xl overflow-hidden shadow-sm ring-1 ring-gray-200 bg-gradient-to-b from-teal-100 to-white min-h-[28rem] flex flex-col">
            <div className="relative h-48 md:h-56 w-full">
              {<Image src="/images/agritrace-card.png" alt="AgriTrace" fill className="object-cover" /> }
  
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-xs font-medium text-teal-700 uppercase tracking-wide">
                Traceability
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-black">AgriTrace</h3>
              <p className="mt-2 text-black/80">
                Lot-to-shipment trace with milestone linked settlements. Cleaner audit trails for buyers, sellers, and financiers.
              </p>
              <div className="mt-auto pt-4">
                <Link
                  href="/agritrace"
                  className="inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2 — KrishiGPT spotlight (interactive) */}
    
      <KrishiGPTDemo />


    
      {/* Bottom line */}
      <section className="full-bleed bg-white">
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-black/80">
            Questions about AgriKunba products?{" "}
            <Link href="/contact" className="underline">
              Contact us
            </Link>{" "}
            or write to{" "}
            <a href="mailto:contact@agrikunba.com" className="underline">
              contact@agrikunba.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

