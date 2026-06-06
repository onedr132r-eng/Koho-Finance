import { useState } from "react";
import { Globe, Wifi, Check, ChevronRight, Signal } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const REGIONS = [
  { id: "canada", name: "Canada", flag: "🇨🇦", countries: 1 },
  { id: "usa", name: "United States", flag: "🇺🇸", countries: 1 },
  { id: "europe", name: "Europe", flag: "🇪🇺", countries: 36 },
  { id: "asia", name: "Asia Pacific", flag: "🌏", countries: 22 },
  { id: "latin-america", name: "Latin America", flag: "🌎", countries: 18 },
  { id: "middle-east", name: "Middle East & Africa", flag: "🌍", countries: 30 },
  { id: "global", name: "Global (150+ countries)", flag: "🌐", countries: 150 },
];

type Plan = { id: string; data: string; days: number; price: number; popular?: boolean };

const PLANS: Record<string, Plan[]> = {
  default: [
    { id: "1gb-7", data: "1 GB", days: 7, price: 9.99 },
    { id: "3gb-15", data: "3 GB", days: 15, price: 19.99, popular: true },
    { id: "5gb-30", data: "5 GB", days: 30, price: 29.99 },
    { id: "10gb-30", data: "10 GB", days: 30, price: 49.99 },
    { id: "unlimited-30", data: "Unlimited*", days: 30, price: 79.99 },
  ],
};

export default function ESim() {
  const [step, setStep] = useState<"region" | "plan" | "checkout" | "success">("region");
  const [selectedRegion, setSelectedRegion] = useState<typeof REGIONS[0] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  if (step === "success") {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F3FF] p-6 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-[#EDE9FF] flex items-center justify-center mb-4">
          <Signal className="w-10 h-10 text-[#7B4FFF]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">eSIM Activated!</h2>
        <p className="text-gray-500 text-sm mb-1">{selectedPlan?.data} data for {selectedPlan?.days} days</p>
        <p className="text-gray-500 text-sm mb-6">Your eSIM QR code has been sent to your email. Scan it in Settings → Cellular.</p>
        <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6">
          <div className="grid grid-cols-5 gap-0.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-sm" style={{ backgroundColor: Math.random() > 0.4 ? "#1a1a1a" : "#fff" }} />
            ))}
          </div>
        </div>
        <button onClick={() => setStep("region")} className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>
          Done
        </button>
      </div>
    );
  }

  if (step === "checkout" && selectedRegion && selectedPlan) {
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title="Order eSIM" onBack={() => setStep("plan")} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-black text-gray-900">Order summary</h3>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Region</span><span className="font-bold">{selectedRegion.flag} {selectedRegion.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Data</span><span className="font-bold">{selectedPlan.data}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Validity</span><span className="font-bold">{selectedPlan.days} days</span></div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between font-black text-base"><span>Total</span><span className="text-[#7B4FFF]">${selectedPlan.price.toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-gray-400"><span>Charged to</span><span>KOHO balance</span></div>
          </div>
          <div className="bg-[#EDE9FF] rounded-2xl p-4">
            <p className="text-sm font-bold text-[#7B4FFF]">10% KOHO member discount applied</p>
            <p className="text-xs text-[#7B4FFF] opacity-80 mt-0.5">Your Essential plan saves you ${(selectedPlan.price * 0.1).toFixed(2)} on this eSIM.</p>
          </div>
          <button onClick={() => setStep("success")} className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>
            Buy eSIM · ${selectedPlan.price.toFixed(2)}
          </button>
        </div>
      </div>
    );
  }

  if (step === "plan" && selectedRegion) {
    const plans = PLANS.default;
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title={`${selectedRegion.flag} ${selectedRegion.name}`} onBack={() => setStep("region")} />
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-500 font-medium">Choose a data plan</p>
          {plans.map(plan => (
            <button
              key={plan.id}
              onClick={() => { setSelectedPlan(plan); setStep("checkout"); }}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all active:scale-[0.98]"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-black text-gray-900 text-base">{plan.data}</p>
                  {plan.popular && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FF] text-[#7B4FFF]">Popular</span>}
                </div>
                <p className="text-xs text-gray-500">{plan.days} days validity · 5G/LTE</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#7B4FFF] text-lg">${plan.price.toFixed(2)}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          ))}
          <p className="text-[10px] text-gray-400 text-center px-4 pt-2">*Unlimited plans throttle to 512 kbps after 20 GB. Compatible with most unlocked devices. iPhone: Settings → Cellular → Add eSIM.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="KOHO eSIM" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-8 h-8" />
          <div>
            <p className="font-black text-lg">Travel data in 150+ countries</p>
            <p className="text-sm opacity-80">Stay connected — no roaming surprises</p>
          </div>
        </div>
        <div className="flex gap-4 mt-1">
          <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
            <p className="font-black text-xl">10%</p>
            <p className="text-[10px] opacity-80">Member discount</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
            <p className="font-black text-xl">5G</p>
            <p className="text-[10px] opacity-80">Speed ready</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
            <p className="font-black text-xl">150+</p>
            <p className="text-[10px] opacity-80">Countries</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <p className="text-sm font-black text-gray-900 mb-3">Select a region</p>
        <div className="space-y-2">
          {REGIONS.map(region => (
            <button
              key={region.id}
              onClick={() => { setSelectedRegion(region); setStep("plan"); }}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{region.flag}</span>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm">{region.name}</p>
                  <p className="text-xs text-gray-500">{region.countries} {region.countries === 1 ? "country" : "countries"} · From $9.99</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
