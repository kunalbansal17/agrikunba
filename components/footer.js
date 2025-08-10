import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-0">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-black">
        {/* Brand */}
        <div>
          <div className="text-xl font-bold">AgriKunba</div>
          <p className="mt-2">Built with agri workers — not for them.</p>
          <p className="mt-4">
            <a href="mailto:contact@agrikunba.com" className="underline">
              contact@agrikunba.com
            </a>
          </p>
          <div className="mt-3 flex gap-4">
            <a href="#" className="underline">X</a>
            <a href="#" className="underline">LinkedIn</a>
            <a href="#" className="underline">Instagram</a>
          </div>
        </div>

        {/* Company */}
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/term" className="hover:underline">Terms</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <div className="font-semibold mb-2">Products</div>
          <ul className="space-y-2">
            <li><Link href="/products/predictPrices" className="hover:underline">Predict Prices</Link></li>
            <li><Link href="/products/com-Qual-Calc" className="hover:underline">Com-Qual-Calc</Link></li>
            <li><Link href="/products/agriTrace" className="hover:underline">AgriTrace</Link></li>
            <li><Link href="/products/agentic-AI" className="hover:underline">Agentic AI</Link></li>
          </ul>
        </div>

        {/* Reserved space for infographic / image */}
        <div className="flex items-start justify-end">
          <div className="w-full sm:w-56 h-32 bg-white border border-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
            {/* Replace this box later with an <img src="/images/your-infographic.png" … /> */}
            Infographic area
          </div>
        </div>
      </div>

        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-700 text-center">
          <span>© {new Date().getFullYear()} AgriKunba. All rights reserved.</span>
        </div>
     
    </footer>
  );
}
