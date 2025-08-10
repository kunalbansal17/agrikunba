import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-black">
          AgriKunba
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm text-black">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/platform" className="hover:underline">Platform</Link>
          <Link
            href="/contact"
            className="ml-2 bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800 cursor-pointer"
          >
            Talk to Us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden border px-3 py-2 rounded text-black"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden">
          <div className="max-w-6xl mx-auto px-4 pb-3 flex flex-col gap-3 text-sm text-black">
            <Link href="/" className="hover:underline" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/about" className="hover:underline" onClick={() => setOpen(false)}>About</Link>
            <Link href="/products" className="hover:underline" onClick={() => setOpen(false)}>Products</Link>
            <Link href="/platform" className="hover:underline" onClick={() => setOpen(false)}>Platform</Link>
            <Link
              href="/contact"
              className="mt-1 bg-green-700 text-white px-3 py-2 rounded text-center hover:bg-green-800 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Talk to Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
