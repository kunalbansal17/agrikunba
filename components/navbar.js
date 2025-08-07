import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black">
          AgriKunba
        </Link>
        <div className="space-x-6 text-sm text-gray-700">
          <Link href="/products" className="hover:text-black">Products</Link>
          <Link href="/platform" className="hover:text-black">Platform</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/contact" className="hover:text-black">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
