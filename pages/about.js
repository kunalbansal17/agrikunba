// File: pages/about.js
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import Image from "next/image";
import Head from "next/head";

export default function About() {
  return (

<main>{
    <div className="max-w-6xl mx-auto px-6 py-6">
      <Head>
        <title>About Us | AgriKunba</title>
      </Head>

      <div className="mb-10">
        <Image
          src="/agriworkers.png"
          alt="Agri Workers Graphic"
          width={800}
          height={350}
          className="rounded-lg w-full"
        />
      </div>

      <div className="text-lg space-y-6 leading-8">
        <p>
          <strong>AgriKunba</strong> means “agricultural family.” We are building this platform with every hand that grows, processes, transports, and sells; not just building for them. Born from the vision of agripreneurs and IIT alumni, AgriKunba is a collective committed to empowering the entire agriculture value chain. We believe agriculture is not just about the farmer in the field. it is a global ecosystem of warehouse workers, millers, processors, transporters, floriculturists, fisheries experts, and countless others. Together, we are building systems that honor their work, amplify their voices, and unlock the future of food.        </p>

        <p>
          Our platform is designed to be lightweight, rapidly deployable, and deeply integrated with offline ecosystems. With agriculture accounting for nearly 25% of the global workforce but only 4% of GDP in many regions, we see not a crisis, but an opportunity.
        </p>

        <p>
          <u><strong>India By the Numbers (2024–25): </strong></u><br />
          🥛 230 MT of milk production (World’s highest)<br />
          🐄 307 Mn cattle (largest herd globally)<br />
          🪺 138 Bn eggs (2nd largest producer)<br />
          🐟 #3 in fisheries, 🐳 #2 in aquaculture<br />
          🍎 ~11% of global fruit, 🥕 ~9% of vegetables
        </p>

        
          <strong>Our Vision:</strong>
          <div className="list-disc list-inside mt-2">
            👩‍🌾 Empower every stakeholder in Agri Value Chain <br/>
            📉 Build solutions that are fast to deploy and globally relevant <br/>
            🔗 Integrate traditional know how with Digital Innovation <br/>
            ♻️ Create a self reliant agri ecosystem driven by collaboration <br/>
          </div>
       

        <p>
          <em>“Jo mitti se juda hai, wahi kal ko rachne wala hai.”</em> <br />
          (Those rooted in the soil are the ones shaping tomorrow.)
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
}</main>
  );
}
