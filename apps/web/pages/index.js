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
          The full-stack platform for global agriculture.
        </p>
        <p className="mt-2 text-gray-600">
          Built by AgriTech experts & IIT alumni, we combine generative AI with deep trade expertise 
          to power contracts, settlements, marketplace and consulting. 
        </p>
        <p className="mt-2 text-gray-600">
         From farmers to fishermen, warehouse workers to exporters, we unify the entire ecosystem into one trusted digital layer.  
        </p>
        <p className="mt-1 text-gray-600">
          Agriculture becomes faster, transparent, and scalable — the way it should be.
        </p>
      </section>

      {/* Quick Links */}
      <section className="mt-12 flex flex-wrap justify-center gap-6 text-lg font-medium">
        <Link href="/products" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">
          Discover Products
        </Link>
        <Link href="/platform" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">
          Explore Platform
        </Link>
      </section>
    </main>
  );
}
