// pages/platform.js
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Platform() {
  return (
    <>
      <Head>
        <title>AgriKunba Platforms</title>
        <meta
          name="description"
          content="AgriKunba operates four platforms: Technology, D2C (Dhoorvi), B2B Trading, and Agri Consultancy."
        />
      </Head>

      {/* HERO (full-bleed) */}
      <section className="full-bleed bg-white">
        <div className="px-6 pt-6 pb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black">AgriKunba Platforms</h1>
            <p className="mt-4 text-lg text-black/80 max-w-3xl mx-auto">
              One company. Four engines powering modern agri trade &mdash; Tech Powerhouse, Direct to Consumer Brand,
              B2B Trading Vertical and Agri Consultancy
            </p>
          </div>
        </div>
      </section>

{/* BENEFITS STRIP (full-bleed) */}
<section className="full-bleed bg-white hidden md:block">
  <div className="px-6 py-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div className="rounded-xl border border-gray-300 bg-white shadow-md p-5">
        <h3 className="font-semibold text-black">CONNECTED STACK</h3>
        <p className="mt-2 text-black/60">
          KrishiGPT Chat Bot, Contracts, Quality, Traceability, and Settlement -  One Stack.
        </p>
      </div>
      <div className="rounded-xl border border-gray-300 bg-white shadow-md p-5">
        <h3 className="font-semibold text-black">OUTCOME DRIVEN OPS</h3>
        <p className="mt-2 text-black/60">
          Fewer disputes, faster cash cycles, cleaner audit trails. Designed for measurable impact.
        </p>
      </div>
      <div className="rounded-xl border border-gray-300 bg-white shadow-md p-5">
        <h3 className="font-semibold text-black">ENTERPRISE GRADE. STARTUP FAST.</h3>
        <p className="mt-2 text-black/60">
          Formal workflows without friction. Simple interfaces, quick rollouts, real adoption.
        </p>
      </div>
    </div>
  </div>
</section>


{/* 1) TECHNOLOGY PLATFORM (full-bleed) */}
<section id="tech" className="full-bleed bg-gray-100">
  <div className="px-6 pb-10">
    {/* container without border */}
    <div className="rounded-xl bg-gray-100 overflow-hidden">
      {/* Top visual (unchanged) */}
<div className="relative w-full h-auto sm:h-64 md:h-72 bg-gray-100 border-b border-gray-200">
  <Image
    src="/images/tech-hero.png"
    alt="Technology Platform"
    width={1920}   // give natural width
    height={1080}  // give natural height
    className="w-full h-auto object-contain"
  />
</div>
<br/>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-black">AgriKunba Tech Stack</h2>
        {/* subtitle */}
        <div className="mt-1 text-black/60">
          The SaaS + GenAI backbone for modern agri trade
        </div>

        {/* paragraph (kept as-is) */}
        <p className="mt-3 text-black/80">
          Our technology platform powers the future of agriculture. We combine SaaS discipline with Generative AI intelligence to enable faster, more transparent, and more resilient trade. 
          From smart contracts to settlement workflows, our stack reduces friction, enforces trust and scales across markets.
        </p>

        {/* bulletless feature list, same size as paragraph */}
        <ul className="mt-4 text-black/80 text-base list-none space-y-2">
          <li>
            <span className="font-semibold">GenAI Krishi Bot —</span> Multi lingual Advisory, Insights, and Decision Support powered by generative AI.
          </li>
          <li>
            <span className="font-semibold">Smart Contracts —</span> Smart Contract creation, risk alerts, and compliance monitoring.
          </li>
          <li>
            <span className="font-semibold">Settlement &amp; Traceability —</span> Seamless execution, real-time traceability and trust at scale.
          </li>
           <li>
            <span className="font-semibold"></span> And much more..
          </li>
        </ul>

        {/* CTA row */}
        <div className="mt-6 flex flex-wrap gap-4">
        
          <Link
            href="/products"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Explore All Products
          </Link>
            
        </div>
      </div>
    </div>
  </div>
</section>


      {/* 2) D2C — DHOORVI (full-bleed, finalized) */}
      <section id="dhoorvi" className="full-bleed bg-white">
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* LEFT: CONTENT */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-black">Dhoorvi™ &mdash; D2C Brand in Beauty Space</h2>

              <p className="mt-4 text-black/80">
                Dhoorvi is our direct-to-consumer platform built around provenance. We identify sourcing gaps, partner with
                communities, and bring <strong>natural, pure, and sustainable</strong> products to market with trust and transparency.
              </p>  

              <p className="mt-4 text-black/80">
                With flower teas, herbal powders for hair and skin care, and curated beauty products, Dhoorvi offers a range that blends
                nature with trust. Operationally profitable and revenue-generating, we are on track to scale this into a ₹1 Cr per month
                brand by Year 2.
              </p>

              <div className="mt-5 space-y-2 text-black/80">
                <p className="font-medium"><strong>How Dhoorvi delivers - </strong></p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Traceable lots and transparent origin stories</li>
                  <li>Community-led partnerships and market linkages</li>
                  <li>Branding and packaging rooted in sustainability</li>
                </ul>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://dhoorvi.com/collections/all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                  Shop Now
                </a>
                <a href="https://dhoorvi.com" className="underline text-black py-2">
                  Learn More
                </a>
              </div>
              {/* Socials */}
{/* Social media icons for Dhoorvi */}
<div className="flex space-x-4 mt-6">
  {/* Instagram */}
  <a href="https://instagram.com/myDhoorvi" target="_blank" rel="noopener noreferrer">
    <img 
      src="/images/instagram.svg" 
      alt="Instagram" 
      className="w-7.5 h-7.5 hover:opacity-80 transition" 
    />
  </a>

  {/* Facebook */}
  <a href="https://facebook.com/pages/myDhoorvi" target="_blank" rel="noopener noreferrer">
    <img 
      src="/images/facebook.svg" 
      alt="Facebook" 
      className="w-7 h-7 hover:opacity-80 transition" 
    />
  </a>

  {/* X (Twitter) */}
  <a href="https://x.com/myDhoorvi" target="_blank" rel="noopener noreferrer">
    <img 
      src="/images/x.svg" 
      alt="X (Twitter)" 
      className="w-7 h-7 hover:opacity-80 transition" 
    />
  </a>
</div>
            </div>

            {/* RIGHT: CAROUSEL */}
            <div>
              <div className="relative">
                <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-3">
                  {/* Slide 1 */}
<div className="snap-center shrink-0 relative
                w-[88vw] sm:w-[80vw] md:w-[36rem] lg:w-[44rem] lg:h-[30rem]
                aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]
                rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden">              <img
          src="/images/dhoorvi1.png"
          alt="Dhoorvi 1"
          className="w-full h-full object-cover"
        />
                  </div>
                  {/* Slide 2 */}
<div className="snap-center shrink-0 relative
                w-[88vw] sm:w-[80vw] md:w-[36rem] lg:w-[44rem]
                aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]
                rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden">              <img
          src="/images/dhoorvi2.png"
          alt="Dhoorvi 1"
       className="absolute inset-0 w-full h-full
               object-contain md:object-cover"
    loading="lazy"
        />
                  </div>
                  {/* Slide 3 */}
 <div className="snap-center shrink-0 relative
                w-[88vw] sm:w-[80vw] md:w-[36rem] lg:w-[44rem]
                aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]
                rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden">             <img
          src="/images/dhoorvi3.png"
          alt="Dhoorvi 1"
 className="absolute inset-0 w-full h-full
               object-contain md:object-cover"
    loading="lazy"
        />
                  </div>

                     {/* Slide 4 */}
<div className="snap-center shrink-0 relative
                w-[88vw] sm:w-[80vw] md:w-[36rem] lg:w-[44rem]
                aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9]
                rounded-xl border border-gray-300 bg-white shadow-md overflow-hidden">              <img
          src="/images/dhoorvi4.png"
          alt="Dhoorvi 1"
    className="absolute inset-0 w-full h-full
               object-contain md:object-cover"
    loading="lazy"
        />
                  </div>
                </div>
              </div>
         
            </div>
          </div>
        </div>
      </section>

{/* 3) THARENA — B2B TRADE (full-bleed, refined) */}
<section id="b2b" className="full-bleed bg-gray-100 ">
  <p>.</p>
  <div className="px-6 pb-12">
    {/* Container with soft edge (tweak border/shadow as you like) */}
    <div className="rounded-xl bg-white overflow-hidden shadow-sm border border-gray-200">
      {/* Banner image — taller for impact */}
   <div className="relative w-full h-56 md:h-72 rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden">
  <Image
    src="/images/tharena.jpg" // save the file here
    alt="Tharena — Strategic B2B Agri Trade"
    fill
    priority
    className="object-cover"
  />
</div>
</div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 md:px-8 md:pb-8 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-black">
          Tharena — Strategic B2B Agri Trade
        </h2>

        {/* Short naming note */}
        <p className="mt-2 text-sm text-black/60">
          Thar + Arena — the grit of the desert, the discipline of a trading floor.
        </p>

        <p className="mt-4 text-black/80">
          Almost every agri-tech is, at its core, a trading play. We say it openly and we bring the experience to match.
          Having executed bulk trades across pulses, cereals, grains, and fruits, we convert opportunities into executed
          contracts and broker value where alignment wins.
        </p>

        <p className="mt-3 text-black/80">
          Trade isn’t an afterthought for us; it’s the foundation. If you can’t decode the trade, you can’t solve the ecosystem.
          Tharena is built to handle complexity -  quietly, professionally, and at scale.
        </p>

        {/* Simple, professional bullets (not boxed) */}
        <ul className="mt-6 list-disc list-inside text-black/80 space-y-1">
          <li>Selective access to counterparties and lanes</li>
          <li>Risk aware deal structuring and clean documentation</li>
          <li>Execution discipline from dispatch to settlement</li>
          <li>Discreet brokerage with market intelligence loops</li>
        </ul>

        {/* CTA */}
        <div className="mt-6">
          <Link
            href="/contact?product=b2b-trading"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Start a conversation
          </Link>
        </div>
      </div>

</section>

{/* 4) AGRI CONSULTANCY — FULL-BLEED, LEFT-ALIGNED LIKE DHOORVI */}
<section id="consulting" className="full-bleed bg-white">
    <div className="px-6 py-10">
    {/* Top row: content left, image right */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* LEFT: CONTENT */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-black">
          AgriKunba Consulting — Ideation to Scale
        </h2>

         <p className="mt-2 text-black/80"> 
          We partner with agritech founders, exporters, and food businesses to solve
          complex challenges across supply chains, finance, and markets turning ideas
          into scalable ventures. With on ground feedback and AI driven analysis, we
          craft actionable strategies that bridge agriculture, technology, and global trade.
        </p>

        <div className="mt-6">
          <Link
            href="/contact?product=consulting"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Talk to an expert
          </Link>
        </div>
      </div>

      {/* RIGHT: SINGLE IMAGE (placeholder) */}
      <div className="relative w-full h-56 md:h-80 rounded-lg border border-gray-300 bg-white shadow-sm">
         <Image src="/images/consulting-hero.png" alt="AgriKunba Consulting" fill className="object-cover rounded-lg" /> 

      </div>
    </div>

    {/* SERVICES GRID */}
    <div className="mt-12">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-gradient-to-r from-green-100 to-green-60 px-4 py-3">
            <h4 className="text-lg font-semibold text-black">Strategy &amp; Business Design</h4>
          </div>
          <div className="p-5 text-sm text-black/80">
            <p className="mb-3">Sharper theses, viable models, and clear economics.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Market Scans &amp; Competitor Mapping</li>
              <li>SWOT, Pricing &amp; Unit Economics</li>
              <li>GTM &amp; Partnership Playbooks</li>
            </ul>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl overflow-hidden bg-white  shadow-sm">
          <div className="bg-gradient-to-r from-green-100 to-green-60 px-4 py-3">
            <h4 className="text-lg font-semibold text-black">Operations &amp; Supply Chain</h4>
          </div>
          <div className="p-5 text-sm text-black/80">
            <p className="mb-3">Make processes work on the ground, not just on slides.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Procurement SOPs &amp; QC standards</li>
              <li>Lot to Shipment Traceability</li>
              <li>Transportation &amp; Route Design</li>
            </ul>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl overflow-hidden bg-white  shadow-sm">
          <div className="bg-gradient-to-r from-green-100 to-green-60 px-4 py-3">
            <h4 className="text-lg font-semibold text-black">Marketing &amp; Sales</h4>
          </div>
          <div className="p-5 text-sm text-black/80">
            <p className="mb-3">Visibility that reduces disputes and delays.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Branding & Brand Management</li>
              <li>Digital Marketing &amp; Cust Experience</li>
              <li>Sales Channel Strategy</li>
            </ul>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-xl overflow-hidden bg-white  shadow-sm">
          <div className="bg-gradient-to-r from-green-100 to-green-60 px-4 py-3">
            <h4 className="text-lg font-semibold text-black">Brand, D2C &amp; Exports</h4>
          </div>
          <div className="p-5 text-sm text-black/80">
            <p className="mb-3">From idea to label to cross-border lanes.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>D2C Storefront, Packaging &amp; Trust Signals</li>
              <li>Export Docs, Buyer Mapping</li>
              <li>Performance, Pricing &amp; Retention</li>
            </ul>
          </div>
        </div>

        {/* Card 5 */}
        <div className="rounded-xl overflow-hidden bg-white  shadow-sm">
          <div className="bg-gradient-to-r from-green-100 to-green-60 px-4 py-3">
            <h4 className="text-lg font-semibold text-black">Capital Needs &amp; Government</h4>
          </div>
          <div className="p-5 text-sm text-black/80">
            <p className="mb-3">Unlock programs and prepare investor grade data.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Financial Models &amp; Data Rooms</li>
              <li>Scheme Navigation &amp; Procurement</li>
              <li>Risk &amp; Compliance Checklists</li>
            </ul>
          </div>
        </div>

        {/* Card 6 */}
        <div className="rounded-xl overflow-hidden bg-white  shadow-sm">
          <div className="bg-gradient-to-r from-green-100 to-green-60 px-4 py-3">
            <h4 className="text-lg font-semibold text-black">Research, AI &amp; Market Insights</h4>
          </div>
          <div className="p-5 text-sm text-black/80">
            <p className="mb-3">Ground truth meets data science.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Field Surveys &amp; Customer Interviews</li>
              <li>AI-based Training &amp; Analytics</li>
              <li>Category/ Region Opportunity Sizing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<br/> <br/> 
 <br/> 

    </>
  );
}
