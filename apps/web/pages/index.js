import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto min-h-screen bg-white text-black px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mt-16">
        <h1 className="text-4xl font-bold">AgriKunba 👨‍🌾</h1>
        <p className="mt-4 text-xl font-medium text-gray-800">
          AI rails for the entire agri value chain
        </p>

        <p className="mt-2 text-gray-600">
          Built by agritech operators & IIT alumni, AgriKunba combines KrishiGPT with SaaS rails for 
          contracts, settlement, trading, and D2C.
        </p>
        <p className="mt-2 text-gray-600">
 From farmers & fishermen to FPOs, transporters, warehouse teams, processors, bankers, and exporters—we unify everyone on one trusted digital layer.
       </p>
        <p className="mt-1 text-gray-600">
          Agriculture becomes faster, transparent, and scalable — the way it should be.
        </p>
      </section>

      {/* Quick Links */}
      <section className="mt-6 flex flex-wrap justify-center gap-6 text-lg font-medium">
            {/* CTA: Experience Now */}
<div className="mt-2">
  <Link
    href="/krishigpt/live"
    className="inline-block rounded-lg bg-emerald-600 px-4 py-3 text-white font-semibold shadow-lg hover:bg-emerald-700 hover:scale-105 transition"
  >
    🚀 Experience KrishiGPT Now
  </Link>

  
</div>
      </section>
    </main>
  );
}
