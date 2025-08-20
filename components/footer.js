import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-0">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 text-sm text-black">
        {/* Brand */}
        <div>
          <div className="text-xl font-bold">AgriKunba</div>
          <p className="mt-2">A Full Stack Agri Platform</p>
          <p className="mt-4">
            <a href="mailto:contact@agrikunba.com" className="underline">
              contact@agrikunba.com
            </a>
          </p>

          {/* Social icons */}
          <div className="flex space-x-4 mt-6">
            <a href="https://instagram.com/agrikunba" target="_blank" rel="noopener noreferrer">
              <img src="/images/instagram.svg" alt="Instagram" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="https://linkedin.com/company/agrikunba" target="_blank" rel="noopener noreferrer">
              <img src="/images/linkedin.svg" alt="LinkedIn" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="https://facebook.com/agrikunba" target="_blank" rel="noopener noreferrer">
              <img src="/images/facebook.svg" alt="Facebook" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
            <a href="https://x.com/agrikunba" target="_blank" rel="noopener noreferrer">
              <img src="/images/x.svg" alt="X (Twitter)" className="w-6 h-6 hover:opacity-80 transition" />
            </a>
          </div>
        </div>

        {/* Company */}
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-2">
            <li><Link href="/about" className="underline">About Us</Link></li>
            <li><Link href="/contact" className="underline">Contact</Link></li>
            <li><Link href="/blog" className="underline">Blog</Link></li>
            <li><Link href="/terms" className="underline">Terms</Link></li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <div className="font-semibold mb-2">Products</div>
          <ul className="space-y-2">
            <li><Link href="/products/predictPrices" className="underline">Predict Prices</Link></li>
            <li><Link href="/products/com-Qual-Calc" className="underline">Com-Qual-Calc</Link></li>
            <li><Link href="/products/agriTrace" className="underline">AgriTrace</Link></li>
            <li><Link href="/products/agentic-AI" className="underline">Agentic AI</Link></li>
          </ul>
        </div>

        {/* Platforms (new) */}
        <div>
          <div className="font-semibold mb-2">Platforms</div>
          <ul className="space-y-2">
            <li><Link href="/platform#tech" className="underline">Technology Platform</Link></li>
            <li><Link href="/platform#dhoorvi" className="underline">Dhoorvi (D2C)</Link></li>
            <li><Link href="/platform#b2b" className="underline">Tharena (Trading)</Link></li>
            <li><Link href="/platform#consulting" className="underline">Agri Consultancy</Link></li>
          </ul>
        </div>

        {/* Reserved space for infographic / image */}
        <div className="flex items-start justify-end">
          <div className="w-full sm:w-56 h-32 bg-white border border-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
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
