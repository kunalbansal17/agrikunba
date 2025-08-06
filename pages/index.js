import Link from 'next/link';
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-8">
      <h1 className="text-4xl font-bold">Welcome to AgriKunba 👨‍🌾</h1>
      <p className="mt-4 text-lg">
        Hello World
      </p>
      <p className="mt-2">Created by AgriTech Experts and IIT Alumni.</p>
      <p className="mt-2 italic">Meet KrishiGPT - our agentic AI that resolves queries on the fly.</p>

      <div className="mt-8">
<Link href="/about" className="text-blue-600 underline mr-4">About Us</Link>
<Link href="/products" className="text-blue-600 underline mr-4">Products</Link>
<Link href="/platform" className="text-blue-600 underline">Platform</Link>

      </div>
    </main>
  );
}
