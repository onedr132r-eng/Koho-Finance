import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const CATEGORY_FILTERS = ["All", "Cashback", "Insurance", "Investments", "Lifestyle"];

const PARTNER_OFFERS = [
  {
    id: "borrowell",
    name: "Borrowell",
    tagline: "Free credit score & report",
    cashback: "5% cashback",
    category: "Investments",
    bg: "#1A3C5E",
    accent: "#4A9FD4",
    logo: "B",
    featured: true,
    description: "Get your free credit score updated weekly and access personalized financial product recommendations.",
  },
  {
    id: "rewind",
    name: "Rewind",
    tagline: "1.5% cashback on groceries",
    cashback: "1.5%",
    category: "Cashback",
    bg: "#FF5A36",
    accent: "#FFE0D9",
    logo: "R",
    featured: false,
    description: "Earn 1.5% cashback at major grocery stores across Canada.",
  },
  {
    id: "neo",
    name: "Neo Financial",
    tagline: "Up to 4% cashback",
    cashback: "4%",
    category: "Cashback",
    bg: "#111827",
    accent: "#F9C23C",
    logo: "N",
    featured: false,
    description: "Stack your cashback with Neo's partner network for up to 4% at thousands of brands.",
  },
  {
    id: "wealthsimple",
    name: "Wealthsimple",
    tagline: "Invest spare change",
    cashback: "2%",
    category: "Investments",
    bg: "#00C49A",
    accent: "#E6FFF9",
    logo: "W",
    featured: false,
    description: "Automatically invest your spare change with Wealthsimple's robo-advisor.",
  },
  {
    id: "intact",
    name: "Intact Insurance",
    tagline: "Tenant & renters insurance",
    cashback: "$30 credit",
    category: "Insurance",
    bg: "#003DA5",
    accent: "#BDD0FF",
    logo: "I",
    featured: false,
    description: "Protect your belongings with flexible renters insurance starting at $15/month.",
  },
  {
    id: "koho-esim",
    name: "KOHO eSIM",
    tagline: "Travel data in 150+ countries",
    cashback: "10% off",
    category: "Lifestyle",
    bg: "#6B21A8",
    accent: "#E9D5FF",
    logo: "eSIM",
    featured: false,
    description: "Stay connected abroad with a travel eSIM. Get 10% off your first plan.",
  },
  {
    id: "cyberscout",
    name: "CyberScout",
    tagline: "Identity theft protection",
    cashback: "Free trial",
    category: "Insurance",
    bg: "#1E3A5F",
    accent: "#93C5FD",
    logo: "CS",
    featured: false,
    description: "Monitor the dark web for your personal information and get 24/7 fraud support.",
  },
  {
    id: "paytm",
    name: "Paytm Canada",
    tagline: "Pay bills & earn cashback",
    cashback: "2.5%",
    category: "Cashback",
    bg: "#00BAF2",
    accent: "#E0F7FD",
    logo: "P",
    featured: false,
    description: "Pay your utility, telecom, and credit card bills and earn cashback instantly.",
  },
];

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const filtered = PARTNER_OFFERS.filter(o => {
    const matchesFilter = activeFilter === "All" || o.category === activeFilter;
    const matchesSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.tagline.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const featured = filtered.find(o => o.featured);
  const grid = filtered.filter(o => !o.featured || activeFilter !== "All" || !!search);

  const claim = (id: string) => setClaimedIds(prev => new Set([...prev, id]));

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="sticky top-0 z-10 bg-white px-4 pt-6 pb-2 border-b border-gray-100">
        <h1 className="text-[2rem] font-bold text-gray-900 mb-4">Discover</h1>
        <div className="relative mb-3">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search offers"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all"
              style={activeFilter === f
                ? { backgroundColor: "#3B1F8C", color: "#fff" }
                : { backgroundColor: "#F3F4F6", color: "#374151" }}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Featured hero */}
        {featured && activeFilter === "All" && !search && (
          <div
            className="rounded-3xl overflow-hidden shadow-md p-5 text-white relative"
            style={{ background: `linear-gradient(135deg, ${featured.bg} 0%, ${featured.bg}cc 100%)` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">Featured</span>
                <h2 className="text-xl font-black mt-0.5">{featured.name}</h2>
                <p className="text-sm opacity-80 mt-1">{featured.tagline}</p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg"
                style={{ backgroundColor: featured.accent, color: featured.bg }}
              >
                {featured.logo}
              </div>
            </div>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">{featured.description}</p>
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-black px-3 py-1.5 rounded-full"
                style={{ backgroundColor: featured.accent, color: featured.bg }}
              >
                {featured.cashback}
              </span>
              <button
                onClick={() => claim(featured.id)}
                className="px-5 py-2.5 rounded-full font-bold text-sm text-white border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                {claimedIds.has(featured.id) ? "✓ Claimed" : "Get offer"}
                {!claimedIds.has(featured.id) && <ExternalLink className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Partner grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="font-bold text-gray-700">No offers found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div>
            {(activeFilter !== "All" || !!search) ? null : (
              <h3 className="text-base font-black text-gray-900 mb-3">Partner Offers</h3>
            )}
            <div className="grid grid-cols-1 gap-3">
              {(activeFilter === "All" && !search ? grid : filtered).map(offer => (
                <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: offer.bg, color: offer.accent }}
                  >
                    {offer.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-black text-gray-900 text-sm">{offer.name}</p>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#EDE9FF", color: "#3B1F8C" }}
                      >
                        {offer.cashback}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug truncate">{offer.tagline}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{offer.category}</p>
                  </div>
                  <button
                    onClick={() => claim(offer.id)}
                    className="px-4 py-2 rounded-full font-bold text-xs flex-shrink-0 transition-all"
                    style={claimedIds.has(offer.id)
                      ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                      : { backgroundColor: "#3B1F8C", color: "#fff" }}
                  >
                    {claimedIds.has(offer.id) ? "✓ Got it" : "Get offer"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KOHO features grid */}
        {activeFilter === "All" && !search && (
          <div className="mt-4">
            <h3 className="text-base font-black text-gray-900 mb-3">KOHO Features</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: "Cash Back", emoji: "⚡", href: "/cashback", bg: "#FEF3C7" },
                { name: "Cover", emoji: "🛡️", href: "/cover", bg: "#CCFBF1" },
                { name: "Credit", emoji: "📈", href: "/credit-building", bg: "#EDE9FF" },
                { name: "Goals", emoji: "🎯", href: "/goals", bg: "#FEE2E2" },
                { name: "Vault", emoji: "🔒", href: "/vault", bg: "#DBEAFE" },
                { name: "RoundUps", emoji: "🔄", href: "/roundups", bg: "#D1FAE5" },
                { name: "Crypto", emoji: "₿", href: "/crypto", bg: "#FEF9C3", isNew: true },
                { name: "Bill Split", emoji: "✂️", href: "/bill-split", bg: "#FCE7F3" },
              ].map(item => (
                <Link key={item.name} href={item.href} className="flex flex-col items-center text-center gap-2 relative group">
                  {item.isNew && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">NEW</span>
                  )}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105" style={{ backgroundColor: item.bg }}>
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 leading-tight">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
