// pages/jobs.tsx — dependency‑light version (no shadcn, no framer‑motion)
import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Wallet,
  MessageCircle,
  Languages,
  ShieldCheck,
  Clock,
  Building2,
  Handshake,
  Users,
  Flame,
  Snowflake,
  Fish,
  Package,
  Warehouse,
  Tractor,
  ClipboardList,
  Truck,
  BadgeCheck,
} from "lucide-react"; // Keep lucide if installed; see note below.

// -------------------
// Helpers
// -------------------
function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371; // km
  const dLat = (Math.PI / 180) * (b.lat - a.lat);
  const dLon = (Math.PI / 180) * (b.lon - a.lon);
  const lat1 = (Math.PI / 180) * a.lat;
  const lat2 = (Math.PI / 180) * b.lat;
  const c = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  return Math.round(R * d * 10) / 10; // to 0.1 km
}

// -------------------
// Local fallback icon (avoid CDN fetch for Cow)
// -------------------
function CowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 6 L4 3" />
      <path d="M18 6 L20 3" />
      <rect x="6" y="6" width="12" height="10" rx="4" />
      <circle cx="10" cy="11" r="1" />
      <circle cx="14" cy="11" r="1" />
      <rect x="8.5" y="13" width="7" height="4" rx="1.5" />
    </svg>
  );
}

// -------------------
// Minimal UI primitives (Tailwind‑only)
// -------------------
interface DivProps extends React.HTMLAttributes<HTMLDivElement> { children?: React.ReactNode }
const Card: React.FC<DivProps> = ({ children, className = "", ...props }) => (
  <div className={`rounded-2xl border bg-white shadow-sm ${className}`} {...props}>{children}</div>
);
const CardHeader: React.FC<DivProps> = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);
const CardTitle: React.FC<DivProps> = ({ children, className = "", ...props }) => (
  <div className={`font-semibold ${className}`} {...props}>{children}</div>
);
const CardDescription: React.FC<DivProps> = ({ children, className = "", ...props }) => (
  <div className={`text-sm text-slate-600 ${className}`} {...props}>{children}</div>
);
const CardContent: React.FC<DivProps> = ({ children, className = "", ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button" | "a";
  href?: string;
  variant?: "solid" | "outline";
  className?: string;
  children?: React.ReactNode;
}
function Button({ as = "button", href, children, variant = "solid", className = "", ...rest }: ButtonProps) {
  const base = variant === "outline"
    ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
    : "bg-emerald-600 text-white hover:bg-emerald-700";
  const cls = `inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${base} ${className}`;
  if (as === "a" && href) return (
    <a href={href} className={cls} {...(rest as any)}>{children}</a>
  );
  return (
    <button className={cls} {...rest}>{children}</button>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "solid" | "outline" | "subtle";
  className?: string;
  children?: React.ReactNode;
}
const Badge = ({ variant = "subtle", className = "", children, ...rest }: BadgeProps) => {
  const styles = variant === "outline"
    ? "border border-slate-300 text-slate-700 bg-white"
    : variant === "solid"
    ? "bg-emerald-600 text-white"
    : "bg-slate-100 text-slate-700";
  return <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs ${styles} ${className}`} {...rest}>{children}</span>;
};

// -------------------
// i18n
// -------------------
const i18n: Record<string, Record<string, string>> = {
  en: {
    title: "AgriKunba Jobs (Pilot)",
    subtitle: "Hire crews. Find work near home.",
    postAJob: "Post a Job (Free in Pilot)",
    joinPilot: "Join the Pilot",
    problemTitle: "Problem We’re Solving",
    benefitsTitle: "Pilot Benefits",
    featuresTitle: "Core Features",
    nearYouTitle: "Jobs Near You",
    howTitle: "How It Works",
    kpiTitle: "Pilot Scorecard Targets",
    faqTitle: "FAQs",
    filterWithin: "Show jobs within",
    km: "km",
    stay: "Stay provided",
    meals: "Meals provided",
    apply: "Apply",
    distance: "Distance",
    duration: "Duration",
    pay: "Pay",
  },
  hi: {
    title: "AgriKunba नौकरियाँ (पायलट)",
    subtitle: "गाँव‑क़रीब काम, भरोसेमंद भुगतान",
    postAJob: "पायलट में मुफ़्त नौकरी पोस्ट करें",
    joinPilot: "पायलट से जुड़ें",
    problemTitle: "समस्या",
    benefitsTitle: "पायलट के लाभ",
    featuresTitle: "मुख्य विशेषताएँ",
    nearYouTitle: "आपके पास की नौकरियाँ",
    howTitle: "कैसे काम करता है",
    kpiTitle: "पायलट लक्ष्य",
    faqTitle: "सवाल‑जवाब",
    filterWithin: "दूरी सीमा",
    km: "किमी",
    stay: "रहने की सुविधा",
    meals: "भोजन",
    apply: "अप्लाई करें",
    distance: "दूरी",
    duration: "अवधि",
    pay: "भुगतान",
  },
};

// -------------------
// Seed Data
// -------------------
interface Job {
  id: string;
  title: string;
  category: string;
  cluster: "Nashik" | "Ludhiana";
  location: { lat: number; lon: number; label: string };
  pay: string;
  duration: string;
  stay?: boolean;
  meals?: boolean;
  crewSize?: string;
  badges?: string[];
}

const JOBS: Job[] = [
  { id: "J101", title: "Packhouse Grader", category: "Packhouse", cluster: "Nashik", location: { lat: 19.9975, lon: 73.7898, label: "Ambad, Nashik" }, pay: "₹480/day", duration: "5 days", stay: true, meals: true, crewSize: "4-6", badges: ["Grading", "PPE"] },
  { id: "J102", title: "Cold Store Loader", category: "Cold Store", cluster: "Nashik", location: { lat: 20.012, lon: 73.78, label: "Satpur, Nashik" }, pay: "₹520/day", duration: "7 days", stay: false, meals: true, crewSize: "6-10", badges: ["Palletizing"] },
  { id: "J103", title: "Vineyard Pruning Crew", category: "Horticulture", cluster: "Nashik", location: { lat: 19.9625, lon: 73.76, label: "Dindori Road, Nashik" }, pay: "₹1,200/acre", duration: "1 week", stay: true, meals: false, crewSize: "5-8", badges: ["Secateurs", "Pruning"] },
  { id: "J201", title: "Paddy Transplanting Crew", category: "Field Crew", cluster: "Ludhiana", location: { lat: 30.901, lon: 75.8573, label: "Sahnewal, Ludhiana" }, pay: "₹1,500/acre", duration: "4 days", stay: true, meals: true, crewSize: "8-12", badges: ["Transplanting"] },
  { id: "J202", title: "Rice Mill Helper", category: "Mills & Warehousing", cluster: "Ludhiana", location: { lat: 30.89, lon: 75.84, label: "Khanna, Ludhiana" }, pay: "₹500/day", duration: "10 days", stay: false, meals: false, crewSize: "3-5", badges: ["Weighbridge"] },
  { id: "J203", title: "Dairy Shed Assistant", category: "Dairy & Cattle", cluster: "Ludhiana", location: { lat: 30.92, lon: 75.88, label: "Jagraon, Ludhiana" }, pay: "₹480/day", duration: "6 days", stay: false, meals: true, crewSize: "2-3", badges: ["Milking"] },
  { id: "J301", title: "Fisheries Pond Helper", category: "Fisheries", cluster: "Nashik", location: { lat: 19.98, lon: 73.81, label: "Gangapur Dam, Nashik" }, pay: "₹520/day", duration: "1 week", stay: true, meals: false, crewSize: "4-6", badges: ["Feeding", "Netting"] },
  { id: "J302", title: "Seed Packing Assistant", category: "Seed & Input Retail", cluster: "Nashik", location: { lat: 19.99, lon: 73.78, label: "Panchavati, Nashik" }, pay: "₹14/hr", duration: "8 hr/day · 6 days", stay: false, meals: false, crewSize: "2-4", badges: ["Labeling"] },
];

const CATEGORIES: { key: string; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "Field Crew", label: "Field Crews", icon: Tractor, desc: "Transplanting, weeding, harvesting." },
  { key: "Horticulture", label: "Horticulture", icon: Handshake, desc: "Pruning, thinning, bagging, harvest." },
  { key: "Packhouse", label: "Packhouse Ops", icon: Package, desc: "Sorting, grading, packing, QC." },
  { key: "Cold Store", label: "Cold Store & Logistics", icon: Snowflake, desc: "Loading, palletizing, stacking." },
  { key: "Mills & Warehousing", label: "Mills & Warehousing", icon: Warehouse, desc: "Rice/flour/pulse mills, inventory." },
  { key: "Dairy & Cattle", label: "Dairy & Cattle Care", icon: CowIcon, desc: "Milking assistants, shed care." },
  { key: "Fisheries", label: "Fisheries & Aquaculture", icon: Fish, desc: "Feeding, netting, harvest." },
  { key: "Seed & Input Retail", label: "Seed & Input Retail", icon: ClipboardList, desc: "Packing, labeling, store help." },
  { key: "Quality & Lab Techs", label: "Quality & Lab Techs", icon: BadgeCheck, desc: "Moisture testing, sampling." },
  { key: "Procurement & Sourcing", label: "Procurement & Sourcing", icon: Truck, desc: "Field buying, mandi runs." },
  { key: "Agri Sales & Extension", label: "Agri Sales & Extension", icon: Building2, desc: "Field officers, demos." },
];

// -------------------
// Page
// -------------------
export default function JobsPage() {
  const [lang, setLang] = useState<keyof typeof i18n>("en");
  const t = i18n[lang];

  const [userLoc, setUserLoc] = useState<{ lat: number; lon: number } | null>(null);
  const [withinKm, setWithinKm] = useState<number>(50);
  const [onlyStay, setOnlyStay] = useState<boolean>(false);
  const [onlyMeals, setOnlyMeals] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setUserLoc(null),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const jobsWithDistance = useMemo(() => JOBS.map((j) => ({ ...j, distanceKm: userLoc ? haversineKm(userLoc, j.location) : null })), [userLoc]);

  const filtered = useMemo(() => {
    return jobsWithDistance.filter((j: any) => {
      if (onlyStay && !j.stay) return false;
      if (onlyMeals && !j.meals) return false;
      if (category !== "all" && j.category !== category) return false;
      if (search && !`${j.title} ${j.category} ${j.cluster}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (userLoc && j.distanceKm !== null && j.distanceKm > withinKm) return false;
      return true;
    });
  }, [jobsWithDistance, onlyStay, onlyMeals, category, search, withinKm, userLoc]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Header lang={lang} setLang={setLang} />
      <Hero t={t} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <ProblemSection t={t} />
        <BenefitsSection t={t} />
        <FocusSection />
        <FeaturesSection t={t} />
        <CategoriesSection />
        <NearYouSection
          t={t}
          userLoc={userLoc}
          filtered={filtered}
          withinKm={withinKm}
          setWithinKm={setWithinKm}
          onlyStay={onlyStay}
          setOnlyStay={setOnlyStay}
          onlyMeals={onlyMeals}
          setOnlyMeals={setOnlyMeals}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />
        <HowItWorks t={t} />
        <KPIsSection />
        <FAQSection t={t} />
        <CTASection t={t} />
        {process.env.NODE_ENV !== "production" && <DevTests />}
      </main>
      <Footer />
    </div>
  );
}

// -------------------
// Sections
// -------------------
function Header({ lang, setLang }: { lang: keyof typeof i18n; setLang: (l: any) => void }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-emerald-600 text-white grid place-items-center font-semibold">AK</div>
          <span className="font-semibold tracking-tight">AgriKunba Jobs</span>
          <span className="ml-3 rounded-full bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 border border-emerald-200">Pilot</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border rounded-xl px-2 py-1">
            <Languages className="h-4 w-4 text-slate-600" />
            <select
              className="bg-transparent text-sm outline-none"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <Button as="a" href="#cta-employers" className="hidden sm:inline-flex">Post a Job</Button>
          <Button as="a" href="#cta-workers" variant="outline">Join Pilot</Button>
        </div>
      </div>
    </div>
  );
}

function Hero({ t }: { t: Record<string, string> }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{t.title}</h1>
        <p className="mt-3 text-slate-600 text-lg">{t.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button as="a" href="#near-you">{t.postAJob}</Button>
          <Button
            as="a"
            variant="outline"
            href="https://wa.me/918000000000?text=Hi%20AgriKunba%2C%20I%20want%20to%20join%20the%20pilot%20as%20a%20worker%20or%20crew%20lead."
            rel="noreferrer"
          >
            {t.joinPilot}
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <ValuePill icon={Wallet} title="On-time UPI" desc="Escrow → milestone payouts" />
          <ValuePill icon={MessageCircle} title="WhatsApp first" desc="Alerts, apply, attendance" />
          <ValuePill icon={ShieldCheck} title="Formalization" desc="Contracts, payslips, KYC" />
          <ValuePill icon={MapPin} title="Near home" desc="Distance-aware matching" />
        </div>
      </div>
    </section>
  );
}

function ValuePill({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm">
      <div className="h-10 w-10 grid place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-medium leading-tight">{title}</div>
        <div className="text-sm text-slate-500">{desc}</div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="uppercase tracking-wide text-xs">{subtitle}</span>
      </div>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function ProblemSection({ t }: { t: Record<string, string> }) {
  const bullets = [
    "Seasonal peaks (transplanting/harvest/packhouse) create urgent demand; discovery is informal & last‑minute.",
    "City‑bound migration by default — even when village‑near work exists.",
    '“Labour chawk” dependency → no verified skills, no reliability, zero paper trail.',
    "Slow/no payments; no digital payslips or history.",
    "Generic job boards aren’t crew/per‑acre aware.",
  ];
  return (
    <section id="problem">
      <SectionHeader icon={Flame} title={t.problemTitle} subtitle="From labour chawk to digital rozgār" />
      <div className="grid md:grid-cols-2 gap-6">
        {bullets.map((b) => (
          <Card key={b}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{b}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection({ t }: { t: Record<string, string> }) {
  const items = [
    { title: "Workers / Crew Leads", points: ["Nearby work with distance shown", "Escrowed UPI payouts + payslips", "Skill badges → better pay", "WhatsApp/IVR onboarding"] },
    { title: "Employers", points: ["Post by acre/ton/shift & crew size", "Ranked matches by reliability & proximity", "One‑click bulk UPI & invoices", "Live fill‑rate & attendance"] },
    { title: "Ecosystem/Investors", points: ["Formalization & safety", "Weekly wage & demand indices", "Replicable cluster playbook"] },
  ];
  return (
    <section>
      <SectionHeader icon={Handshake} title={t.benefitsTitle} subtitle="Benefits by stakeholder" />
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <Card key={it.title}>
            <CardHeader>
              <CardTitle>{it.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 list-disc pl-5 text-slate-600">
                {it.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FocusSection() {
  return (
    <section>
      <SectionHeader icon={MapPin} title="Initial Focus" subtitle="Two dense clusters for proof of speed & reliability" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cluster A — Nashik (Horticulture)</CardTitle>
            <CardDescription>Grapes & vegetables: pruning, harvest, grading, packhouse</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>50 Crew Leads</Badge>
            <Badge>500–1,000 Workers</Badge>
            <Badge>20 Anchor Employers</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cluster B — Ludhiana (Paddy/Wheat)</CardTitle>
            <CardDescription>Transplanting, harvest loading, rice mill ops</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>50 Crew Leads</Badge>
            <Badge>500–1,000 Workers</Badge>
            <Badge>20 Anchor Employers</Badge>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FeaturesSection({ t }: { t: Record<string, string> }) {
  const feats = [
    { icon: MapPin, title: "Distance‑aware discovery", desc: "Filter by km; stay/meals badges; commute‑friendly shifts." },
    { icon: Users, title: "Crew‑native posts", desc: "Acre/ton/shift units, required crew size, tools & badges." },
    { icon: Wallet, title: "Escrow → UPI payouts", desc: "Milestone releases, same‑day payouts, automatic payslips." },
    { icon: MessageCircle, title: "WhatsApp + IVR", desc: "Alerts, apply, attendance in your language." },
    { icon: ShieldCheck, title: "Formalization", desc: "KYC, contracts, safety brief, dispute & replacement flows." },
    { icon: Clock, title: "SLAs you can track", desc: "48‑hr fill rate, attendance, on‑time pay, repeat hires." },
  ];
  return (
    <section>
      <SectionHeader icon={ShieldCheck} title={t.featuresTitle} subtitle="What ships in the pilot" />
      <div className="grid md:grid-cols-3 gap-6">
        {feats.map((f) => (
          <Card key={f.title}>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section>
      <SectionHeader icon={ClipboardList} title="Job Categories" subtitle="Blue‑collar & white‑collar across agri & allied" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((c) => (
          <Card key={c.key} className="transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">{c.label}</CardTitle>
                <CardDescription>{c.desc}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function NearYouSection({
  t,
  userLoc,
  filtered,
  withinKm,
  setWithinKm,
  onlyStay,
  setOnlyStay,
  onlyMeals,
  setOnlyMeals,
  search,
  setSearch,
  category,
  setCategory,
}: any) {
  return (
    <section id="near-you">
      <SectionHeader icon={MapPin} title={t.nearYouTitle} subtitle="Use distance filter and quick apply" />

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, category, cluster…"
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
                <option value="all">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.filterWithin}: {withinKm} {t.km}</label>
              <input type="range" min={5} max={150} step={5} value={withinKm} onChange={(e) => setWithinKm(parseInt(e.target.value, 10))} className="w-full" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={onlyStay} onChange={(e) => setOnlyStay(e.target.checked)} /> {t.stay}
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={onlyMeals} onChange={(e) => setOnlyMeals(e.target.checked)} /> {t.meals}
            </label>
            <div className="ml-auto text-sm text-slate-500 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {userLoc ? "Location enabled" : "Enable location for distances"}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((j: any) => (
          <Card key={j.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{j.title}</CardTitle>
                <Badge variant="outline">{j.cluster}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {j.location.label}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge>{t.pay}: {j.pay}</Badge>
                <Badge>{t.duration}: {j.duration}</Badge>
                {j.distanceKm !== null && <Badge>{t.distance}: {j.distanceKm} {t.km}</Badge>}
                {j.stay && <Badge className="bg-emerald-100 text-emerald-800">{t.stay}</Badge>}
                {j.meals && <Badge className="bg-emerald-100 text-emerald-800">{t.meals}</Badge>}
                {j.crewSize && <Badge>Crew: {j.crewSize}</Badge>}
              </div>
              <div className="flex flex-wrap gap-2">
                {j.badges?.map((b: string) => (
                  <Badge key={b} variant="outline">{b}</Badge>
                ))}
              </div>
            </CardContent>
            <div className="mt-auto p-4 pt-0">
              <Button
                as="a"
                className="w-full"
                href={`https://wa.me/918000000000?text=Hi%20AgriKunba%2C%20I%20want%20to%20apply%20for%20${encodeURIComponent(j.title)}%20(${encodeURIComponent(j.id)})%20at%20${encodeURIComponent(j.location.label)}.`}
                rel="noreferrer"
              >
                {t.apply}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-slate-500 mt-6">No jobs match your filters yet. Try widening the distance or clearing filters.</p>
      )}
    </section>
  );
}

function HowItWorks({ t }: { t: Record<string, string> }) {
  return (
    <section>
      <SectionHeader icon={MessageCircle} title={t.howTitle} subtitle="Fast, familiar, formal" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workers / Crew Leads</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="list-decimal pl-5 space-y-2 text-slate-600">
              <li>Join via WhatsApp or missed call → choose language.</li>
              <li>Share village/pincode, skills, availability; (optional) e‑KYC & UPI.</li>
              <li>Get nearby alerts; apply in one tap; crew leads add members.</li>
              <li>Complete milestones; mark attendance; receive UPI payouts; download payslip.</li>
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employers</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="list-decimal pl-5 space-y-2 text-slate-600">
              <li>Post in acre/ton/shift with crew size, skills & tools.</li>
              <li>Get ranked matches by reliability, proximity & availability.</li>
              <li>Start contract; approve milestones; bulk‑pay via UPI; invoices auto‑generated.</li>
              <li>Rate crews; re‑hire faster next time.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function KPIsSection() {
  const KPIS = [
    { label: "48‑hr fill‑rate", value: "80%+" },
    { label: "On‑time payouts", value: "95%+" },
    { label: "Verified workers / taluka", value: "200+" },
    { label: "Anchor employers / cluster", value: "20" },
  ];
  return (
    <section>
      <SectionHeader icon={Clock} title="Pilot Scorecard Targets" subtitle="What we’ll report publicly every week" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIS.map((k) => (
          <Card key={k.label} className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-emerald-700">{k.value}</CardTitle>
              <CardDescription>{k.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FAQSection({ t }: { t: Record<string, string> }) {
  const faqs = [
    { q: "Is this a gig app?", a: "No. Short contracts (per‑acre/ton/shift) with payouts & payslips." },
    { q: "Any fees in pilot?", a: "No fees for workers or employers in the pilot." },
    { q: "What if no‑show?", a: "Replacement SLA under 24h; reliability affects ranking." },
    { q: "Distance & privacy?", a: "Share GPS or just pincode; used only to compute distance." },
  ];
  return (
    <section>
      <SectionHeader icon={ShieldCheck} title={t.faqTitle} subtitle="Quick answers" />
      <div className="grid md:grid-cols-2 gap-6">
        {faqs.map((f) => (
          <Card key={f.q}>
            <CardHeader>
              <CardTitle className="text-base">{f.q}</CardTitle>
              <CardDescription>{f.a}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CTASection({ t }: { t: Record<string, string> }) {
  return (
    <section className="py-8">
      <div className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold">From labour chawk to digital rozgār</h3>
          <p className="text-slate-600">Zero fees in pilot. We’re optimizing for speed to fill, reliability and on‑time payouts.</p>
        </div>
        <div className="flex gap-3">
          <Button as="a" href="#near-you">{t.postAJob}</Button>
          <Button as="a" variant="outline" href="https://wa.me/918000000000?text=Hi%20AgriKunba%2C%20I%20want%20to%20join%20the%20pilot." rel="noreferrer">
            {t.joinPilot}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} AgriKunba. Pilot experience.</div>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-900" href="#problem">Problem</a>
          <a className="hover:text-slate-900" href="#near-you">Jobs</a>
          <a className="hover:text-slate-900" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

// -------------------
// Dev Tests (added)
// -------------------
function DevTests() {
  type Test = { name: string; pass: boolean; details?: string };
  const tests: Test[] = [];
  const d0 = haversineKm({ lat: 0, lon: 0 }, { lat: 0, lon: 0 });
  tests.push({ name: "haversine: zero distance", pass: d0 === 0, details: `got ${d0}` });
  const dEq = haversineKm({ lat: 0, lon: 0 }, { lat: 0, lon: 1 });
  tests.push({ name: "haversine: 1° lon ≈ 111 km", pass: dEq > 110 && dEq < 112.5, details: `got ${dEq}` });
  const d10 = haversineKm({ lat: 10, lon: 10 }, { lat: 10, lon: 11 });
  tests.push({ name: "haversine: sanity at 10° lat", pass: d10 > 100 && d10 < 112, details: `got ${d10}` });

  return (
    <section>
      <SectionHeader icon={BadgeCheck} title="Developer Diagnostics (dev only)" subtitle="Basic runtime self‑checks" />
      <div className="grid md:grid-cols-3 gap-4">
        {tests.map((t) => (
          <Card key={t.name} className={t.pass ? "border-emerald-200" : "border-red-200"}>
            <CardHeader>
              <CardTitle className={`text-base ${t.pass ? "text-emerald-700" : "text-red-700"}`}>
                {t.pass ? "✔" : "✖"} {t.name}
              </CardTitle>
              <CardDescription>{t.details}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

// -------------------
// NOTE: If you see "Cannot find module 'lucide-react'", install it locally:
//   npm i lucide-react   (or: yarn add / pnpm add)
// You can also strip icons entirely if you prefer zero external deps.
