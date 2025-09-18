import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between">
        
        {/* Left section: Brand + Social */}
        <div className="w-full sm:w-auto text-center sm:text-left">
          <div className="text-xl font-bold">AgriKunba</div>
          <p className="text-sm">a full stack agri platform</p>

          {/* Social icons */}
          <div className="flex justify-center sm:justify-start space-x-4 mt-4">
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

          <p className="mt-4">
            <a href="mailto:contact@agrikunba.com" className="underline">
              contact@agrikunba.com
            </a>
          </p>
        </div>

        {/* Middle: Company / Products / Platforms (2x2 grid on mobile) */}
        <div className="grid grid-cols-2 gap-6 mt-6 sm:mt-0 sm:flex sm:space-x-12">
          {/* Company */}
          <div>
            <div className="font-semibold mb-2">Company</div>
            <ul className="space-y-2">
              <li><Link href="/about" className="underline">About Us</Link></li>
              <li><Link href="/contact" className="underline">Contact</Link></li>
      {/*        <li><Link href="/blog" className="underline">Blog</Link></li> 
              <li><Link href="/terms" className="underline">Terms</Link></li>
       */}     </ul>
          </div>

          {/* Products */}
          <div>
            <div className="font-semibold mb-2">Products</div>
            <ul className="space-y-2">
               <li><Link href="/krishigpt/live" className="underline">KrishiGPT</Link></li>
              <li><Link href="/commatrix" className="underline">Commodity Matrix</Link></li>
           {/*   <li><Link href="/products/com-Qual-Calc" className="underline">Com-Qual-Calc</Link></li> */}
              <li><Link href="/agritrace" className="underline">AgriTrace</Link></li>
            
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <div className="font-semibold mb-2">Platforms</div>
            <ul className="space-y-2">
              <li><Link href="/platform#tech" className="underline">Technology Platform</Link></li>
              <li><Link href="/platform#dhoorvi" className="underline">Dhoorvi (D2C)</Link></li>
              <li><Link href="/platform#b2b" className="underline">Tharena (Trading)</Link></li>
              <li><Link href="/platform#consulting" className="underline">Agri Consultancy</Link></li>
            </ul>
          </div>
        </div>

{/* Right: Infographic (stable crop) */}
<div className="mt-6 sm:mt-0 w-full sm:w-[310px] flex-shrink-0">
  <div className="relative w-full md:w-[310px] aspect-[16/9] bg-white border border-gray-300 rounded overflow-hidden">
    <img
      src="/images/footer-infographic.png"
      alt="AgriTech Infographic"
      className="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
  </div>
</div>


      </div>

      {/* Bottom sticky line */}
      <div className="border-t border-gray-200 py-3">
        <p className="text-center text-sm text-gray-600">
          © 2025 AgriKunba. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
