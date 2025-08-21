import Navbar from "../components/navbar";
import Footer from "../components/footer";

import Link from 'next/link';
export default function Home() {
  return (
    <main className="max-w-6xl mx-auto min-h-screen bg-white text-black px-4 py-4">
      <h1 className="text-4xl font-bold">Welcome to AgriKunba 👨‍🌾</h1>
      <p className="mt-4 text-lg">
        Hello World
      </p>
      <p className="mt-2">Created by AgriTech Experts and IIT Alumni.</p>

      <div className="mt-8">
<Link href="/products" className="text-blue-600 underline mr-4">Products</Link>
<Link href="/platform" className="text-blue-600 underline mr-4">Platform</Link>
<Link href="/about" className="text-blue-600 underline mr-4">About Us</Link>
<Link href="/contact" className="text-blue-600 underline mr-4">Contact</Link>

      </div>
    </main>
  );
}
