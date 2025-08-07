// File: pages/about.js

import Image from "next/image";
import Head from "next/head";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Head>
        <title>About Us | AgriKunba</title>
      </Head>

      <h1 className="text-4xl font-bold mb-6 text-center">About AgriKunba</h1>

      <div className="mb-10">
        <Image
          src="/agriworkers.png"
          alt="Agri Workers Graphic"
          width={768}
          height={512}
          className="rounded-lg w-full"
        />
      </div>

      <div className="text-lg space-y-6 leading-8">
        <p>
          <strong>AgriKunba</strong> is a collective of agripreneurs and IIT alumni committed to empowering the entire agriculture value chain. We believe agriculture is not just about the farmer in the field. its a global family of warehouse workers, millers, processors, transporters, floriculturists, fisheries experts, and more.
        </p>

        <p>
          Our platforms are designed to be lightweight, rapidly deployable, and deeply integrated with offline ecosystems. With agriculture accounting for nearly 25% of the global workforce but only 4% of GDP in many regions, we see not a crisis, but an opportunity.
        </p>

        <p>
          <strong>By the Numbers (2023–24):</strong><br />
          • 230 Mt of milk (world’s highest)<br />
          • 307M cattle (largest herd globally)<br />
          • 138B eggs (2nd largest producer)<br />
          • 9.8 Mt meat output<br />
          • #3 in fisheries, #2 in aquaculture<br />
          • ~11% of global fruit, ~9% of vegetables<br />
          • 142,000 MT honey produced, 50% exported
        </p>

        <p>
          <strong>Our Vision:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>Empower every stakeholder, not just a select few</li>
            <li>Build solutions that are fast to deploy and globally relevant</li>
            <li>Integrate traditional know-how with digital innovation</li>
            <li>Create a self-reliant agri ecosystem driven by collaboration</li>
          </ul>
        </p>

        <p>
          <em>“Jahaan roti ugti hai, wahaan se samriddhi ka raasta nikalta hai.”</em> <br />
          (Where food grows, prosperity follows.)
        </p>
      </div>

      <div className="mt-12">
        <Image
          src="/collage.png"
          alt="AgriKunba Activities"
          width={954}
          height={618}
          className="rounded-lg w-full"
        />
      </div>
    </div>
  );
}
