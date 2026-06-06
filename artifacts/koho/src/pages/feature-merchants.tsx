import { useState } from "react";
import { Search, ChevronRight, Star, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const CATEGORIES = ["All", "Food & Drink", "Groceries", "Shopping", "Travel", "Health", "Gas"];

const MERCHANTS = [
  { id: "tim-hortons", name: "Tim Hortons", category: "Food & Drink", cashback: 3, color: "#C8102E", logo: "TH", desc: "Coffee, baked goods & more", locations: "5,700+ locations" },
  { id: "sobeys", name: "Sobeys", category: "Groceries", cashback: 2, color: "#E31837", logo: "S", desc: "Fresh groceries & produce", locations: "1,500+ locations" },
  { id: "indigo", name: "Indigo", category: "Shopping", cashback: 4, color: "#2D2A5E", logo: "I", desc: "Books, gifts & lifestyle", locations: "200+ locations" },
  { id: "cineplex", name: "Cineplex", category: "Shopping", cashback: 5, color: "#D62B31", logo: "CP", desc: "Movie tickets & concessions", locations: "165+ locations" },
  { id: "rexall", name: "Rexall Pharmacy", category: "Health", cashback: 3, color: "#005BAA", logo: "Rx", desc: "Pharmacy & health products", locations: "400+ locations" },
  { id: "sport-chek", name: "Sport Chek", category: "Shopping", cashback: 2.5, color: "#CC0000", logo: "SC", desc: "Sports gear & activewear", locations: "200+ locations" },
  { id: "petro-canada", name: "Petro-Canada", category: "Gas", cashback: 1.5, color: "#E2231A", logo: "PC", desc: "Fuel & car wash", locations: "1,500+ stations" },
  { id: "freshco", name: "FreshCo", category: "Groceries", cashback: 2, color: "#007A3D", logo: "FC", desc: "Discount groceries", locations: "90+ locations" },
  { id: "esso", name: "Esso", category: "Gas", cashback: 1.5, color: "#003087", logo: "E", desc: "Fuel & convenience", locations: "1,800+ stations" },
  { id: "loblaws", name: "Loblaws", category: "Groceries", cashback: 2, color: "#D7291A", logo: "L", desc: "Grocery & lifestyle", locations: "2,400+ locations" },
  { id: "subway", name: "Subway", category: "Food & Drink", cashback: 3, color: "#009B3A", logo: "SW", desc: "Fresh subs & salads", locations: "3,400+ locations" },
  { id: "air-canada", name: "Air Canada", category: "Travel", cashback: 2, color: "#CC0000", logo: "AC", desc: "Flights across Canada & beyond", locations: "Online" },
  { id: "expedia", name: "Expedia", category: "Travel", cashback: 3, color: "#003580", logo: "EX", desc: "Hotels, flights & packages", locations: "Online" },
  { id: "goodfood", name: "Goodfood", category: "Groceries", cashback: 5, color: "#3DBD7D", logo: "GF", desc: "Meal kit delivery", locations: "Online" },
];

export default function Merchants() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activated, setActivated] = useState<Set<string>>(new Set(["tim-hortons", "sobeys"]));

  const filtered = MERCHANTS.filter(m => {
    const matchCat = activeCategory === "All" || m.category === activeCategory;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggle = (id: string) =>
    setActivated(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Merchant Cashback" />

      {/* Summary banner */}
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-4 text-white">
        <p className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1">Active offers</p>
        <p className="text-3xl font-black">{activated.size}</p>
        <p className="text-sm opacity-80 mt-1">Earn cashback automatically when you pay with your KOHO card</p>
      </div>

      {/* Search */}
      <div className="px-4 mb-3 relative">
        <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search merchants"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {/* Category chips */}
      <div className="px-4 flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0"
            style={activeCategory === cat
              ? { backgroundColor: "#7B4FFF", color: "#fff" }
              : { backgroundColor: "#fff", color: "#374151", border: "1px solid #E5E7EB" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Merchant list */}
      <div className="px-4 space-y-3">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
              style={{ backgroundColor: m.color }}
            >
              {m.logo}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-gray-900 text-sm">{m.name}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FF] text-[#7B4FFF]">
                  {m.cashback}% back
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{m.desc}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-400">{m.locations}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(m.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all"
              style={activated.has(m.id)
                ? { backgroundColor: "#DCFCE7", color: "#16A34A" }
                : { backgroundColor: "#7B4FFF", color: "#fff" }}
            >
              {activated.has(m.id) ? "Active" : "Activate"}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 px-8 pb-4">
        Cashback is automatically applied when you use your KOHO card at activated merchants.
      </p>
    </div>
  );
}
