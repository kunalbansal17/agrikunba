// pages/about.js
import Image from "next/image";
import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | AgriKunba</title>
      </Head>

      <div className="px-6 pt-2 pb-6">
        {/* Top image with tight spacing */}
        <div className="mb-3">
          <div className="relative w-full h-48 sm:h-100 overflow-hidden rounded-lg">
            <Image
              src="/agriworkers.png"
              alt="Agri Workers Graphic"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-lg space-y-5 leading-8">
          <p>
            <strong>AgriKunba</strong> means “agricultural family”; and that is what we are building.
            Agriculture isn’t just farmers in fields, it’s a complex web of processors, traders, 
            warehouse operators, transporters, and exporters. Fisheries, poultry and cattle farming are also integral parts of 
            agriculture industry, often neglected as allied services. Today this ecosystem runs on broken contracts,
            disputes, and manual calls. 
          </p>

          <p>
            We’re changing that. AgriKunba is the full stack agri platform powering contracts & settlements, D2C marketplace, trading, and consulting.
            By combining AI driven trust systems with practical trade expertise, we bring the entire ecosystem onto one layer, making agriculture faster, transparent, and scalable.
          </p>

          <p>
            Born from agripreneurs and IIT alumni, AgriKunba is the agri family’s AI backbone for
            trade and settlement - practical, scalable, and built for the next decade of global
            agriculture.
          </p>

          <p>
            <u><strong>Indian agriculture at a glance (2024–25):</strong></u><br />
            🥛 230 MT of milk production (World’s highest)<br />
            🐄 307 Mn cattle (largest herd globally)<br />
            🪺 138 Bn eggs (2nd largest producer)<br />
            🐟 #3 in fisheries, 🐳 #2 in aquaculture<br />
            🍎 ~11% of global fruit, 🥕 ~9% of vegetables
          </p>
<br/>
          <div className="mt-2">
            <strong>Our Vision:</strong>
          </div>

          {/* Vision Images Section (tighter gap) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex justify-center">
              <Image src="/images/vision1.png" alt="Vision 1" width={250} height={250} className="w-full h-auto max-w-[220px] sm:max-w-none rounded-lg shadow-md" />
            </div>
            <div className="flex justify-center">
              <Image src="/images/vision2.png" alt="Vision 2" width={250} height={250} className="w-full h-auto max-w-[220px] sm:max-w-none rounded-lg shadow-md" />
            </div>
            <div className="flex justify-center">
              <Image src="/images/vision3.png" alt="Vision 3" width={250} height={250} className="w-full h-auto max-w-[220px] sm:max-w-none rounded-lg shadow-md" />
            </div>
            <div className="flex justify-center">
              <Image src="/images/vision4.png" alt="Vision 4" width={250} height={250} className="w-full h-auto max-w-[220px] sm:max-w-none rounded-lg shadow-md" />
            </div>
          </div>
<br/>
          <p>
            <em>“Jo mitti se juda hai, wahi kal ko rachne wala hai.”</em><br />
            (Those rooted in the soil are the ones shaping tomorrow.)
          </p>
        </div>
      </div>
    </>
  );
}
