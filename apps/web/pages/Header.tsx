// ==============================
// File: components/Footer.tsx
// ==============================
import Link from "next/link";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 bg-gray-950 text-gray-300">
      {/* Top strip */}
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-200">
        Built by agri-tech experts & IIT alumni • AI that farmers actually use.
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 pb-10 pt-6 sm:grid-cols-3 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/team" className="hover:text-white">Team</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Products</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products/predictPrices" className="hover:text-white">predictPrices</Link></li>
            <li><Link href="/products/agentic-AI" className="hover:text-white">agentic-AI</Link></li>
            <li><Link href="/products/com-Qual-Calc" className="hover:text-white">com-Qual-Calc</Link></li>
            <li><Link href="/products/agriTrace" className="hover:text-white">agriTrace</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/platform/dhoorvi" className="hover:text-white">dhoorvi</Link></li>
            <li><Link href="/platform/consulting" className="hover:text-white">consulting</Link></li>
            <li><Link href="/platform/kap" className="hover:text-white">kap</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/case-studies" className="hover:text-white">Case Studies</Link></li>
            <li><Link href="/docs" className="hover:text-white">Docs</Link></li>
            <li><Link href="/press" className="hover:text-white">Press Kit</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <div className="text-xs text-gray-400">© AgriKunba {year}. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-white">Terms</Link>
            <Link href="/cookies" className="text-xs text-gray-400 hover:text-white">Cookie Preferences</Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Socials (replace # with your handles) */}
            <a href="#" aria-label="X" className="hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.53 7.46L22 22h-6.955l-4.555-6.03L4.9 22H2l6.99-7.98L2 2h6.955l4.19 5.56L18.244 2Zm-1.222 18h2.131L7.05 4h-2.2l12.172 16Z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.5-.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 8a3 3 0 1 0 .002 6.002A3 3 0 0 0 12 8Z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.983 2.12 4.983 3.5ZM.29 22h4.42V7.98H.29V22ZM7.98 7.98H12.2v1.92h.06c.59-1.11 2.03-2.28 4.18-2.28 4.47 0 5.3 2.94 5.3 6.76V22h-4.42v-5.73c0-1.37-.02-3.12-1.9-3.12-1.9 0-2.19 1.48-2.19 3.02V22H7.98V7.98Z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
