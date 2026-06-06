import { useState } from "react";
import { ShieldCheck, Check, ChevronRight, Home, Plane } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

type InsuranceType = "tenant" | "travel";

const TENANT_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 15,
    period: "month",
    coverage: 25000,
    highlights: ["Personal belongings up to $25,000", "Additional living expenses", "Personal liability $1M", "No deductible on electronics"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 25,
    period: "month",
    coverage: 50000,
    popular: true,
    highlights: ["Personal belongings up to $50,000", "Additional living expenses", "Personal liability $2M", "Identity theft protection", "Water damage included"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 40,
    period: "month",
    coverage: 100000,
    highlights: ["Personal belongings up to $100,000", "Additional living expenses", "Personal liability $5M", "Identity theft protection", "Jewelry & valuables rider", "Earthquake coverage"],
  },
];

const TRAVEL_PLANS = [
  {
    id: "single",
    name: "Single Trip",
    price: 29,
    period: "trip",
    coverage: 5000000,
    highlights: ["Emergency medical $5M", "Trip cancellation $1,500", "Baggage loss $1,000", "Flight delay over 4h covered"],
  },
  {
    id: "annual",
    name: "Annual Multi-Trip",
    price: 149,
    period: "year",
    coverage: 10000000,
    popular: true,
    highlights: ["Emergency medical $10M", "Unlimited trips up to 17 days each", "Trip cancellation $2,500", "Baggage loss $2,000", "Cancel for any reason option"],
  },
  {
    id: "snowbird",
    name: "Snowbird",
    price: 199,
    period: "season",
    coverage: 10000000,
    highlights: ["Emergency medical $10M", "Extended stays up to 183 days", "Pre-existing condition coverage", "Evacuation & repatriation", "Dental emergency included"],
  },
];

export default function Insurance({ type }: { type?: InsuranceType }) {
  const [insType, setInsType] = useState<InsuranceType>(type ?? "tenant");
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"plans" | "quote" | "success">("plans");

  const plans = insType === "tenant" ? TENANT_PLANS : TRAVEL_PLANS;
  const selectedPlan = plans.find(p => p.id === selected);

  if (step === "success" && selectedPlan) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F3FF] p-6 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-[#EDE9FF] flex items-center justify-center mb-4">
          <ShieldCheck className="w-10 h-10 text-[#7B4FFF]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">You're protected!</h2>
        <p className="text-gray-500 text-sm mb-1">{selectedPlan.name} plan activated</p>
        <p className="text-2xl font-black text-[#7B4FFF] my-3">${selectedPlan.price}/{selectedPlan.period}</p>
        <p className="text-gray-500 text-sm mb-8">Your policy documents have been sent to your email. Coverage starts immediately.</p>
        <button onClick={() => setStep("plans")} className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>
          View Policy
        </button>
      </div>
    );
  }

  if (step === "quote" && selectedPlan) {
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title="Your Quote" onBack={() => setStep("plans")} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-black text-xl text-gray-900">{selectedPlan.name}</p>
                <p className="text-xs text-gray-500 capitalize">{insType} Insurance</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#7B4FFF]">${selectedPlan.price}</p>
                <p className="text-xs text-gray-500">/{selectedPlan.period}</p>
              </div>
            </div>
            <div className="space-y-2">
              {selectedPlan.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{h}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#EDE9FF] rounded-2xl p-4">
            <p className="text-sm font-bold text-[#7B4FFF]">Charged to your KOHO balance monthly</p>
            <p className="text-xs text-[#7B4FFF] opacity-80 mt-1">Cancel anytime with no penalties. Coverage ends at month's end.</p>
          </div>

          <button
            onClick={() => setStep("success")}
            className="w-full py-4 rounded-2xl font-black text-white"
            style={{ backgroundColor: "#7B4FFF" }}
          >
            Get Coverage · ${selectedPlan.price}/{selectedPlan.period}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="KOHO Insurance" />

      {/* Toggle */}
      <div className="mx-4 mb-4 bg-white rounded-xl p-1 shadow-sm flex">
        <button
          onClick={() => setInsType("tenant")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={insType === "tenant" ? { backgroundColor: "#7B4FFF", color: "#fff" } : { color: "#6B7280" }}
        >
          <Home className="w-4 h-4" /> Tenant
        </button>
        <button
          onClick={() => setInsType("travel")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={insType === "travel" ? { backgroundColor: "#7B4FFF", color: "#fff" } : { color: "#6B7280" }}
        >
          <Plane className="w-4 h-4" /> Travel
        </button>
      </div>

      {/* Hero */}
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-4 text-white">
        <ShieldCheck className="w-8 h-8 mb-2 opacity-80" />
        <p className="font-black text-lg">
          {insType === "tenant" ? "Protect your belongings" : "Travel worry-free"}
        </p>
        <p className="text-sm opacity-80 mt-1">
          {insType === "tenant"
            ? "Starting at $15/month. Powered by Intact Insurance."
            : "Single trip or annual coverage. Powered by Manulife."}
        </p>
      </div>

      {/* Plans */}
      <div className="px-4 space-y-3">
        {plans.map(plan => (
          <button
            key={plan.id}
            onClick={() => { setSelected(plan.id); setStep("quote"); }}
            className="w-full bg-white rounded-2xl p-4 shadow-sm text-left transition-all active:scale-[0.98]"
            style={"popular" in plan && plan.popular ? { border: "2px solid #7B4FFF" } : { border: "2px solid transparent" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                {"popular" in plan && plan.popular && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FF] text-[#7B4FFF] mb-1 inline-block">Most popular</span>
                )}
                <p className="font-black text-gray-900">{plan.name}</p>
                <p className="text-xs text-gray-500">Up to ${(plan.coverage / 1000000).toFixed(0)}M coverage</p>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl text-[#7B4FFF]">${plan.price}</p>
                <p className="text-xs text-gray-500">/{plan.period}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {plan.highlights.slice(0, 3).map((h, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-gray-600">{h}</p>
                </div>
              ))}
              {plan.highlights.length > 3 && (
                <p className="text-xs text-[#7B4FFF] font-bold">+{plan.highlights.length - 3} more benefits</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 px-8 pb-2">
        Insurance products are underwritten by licensed Canadian insurers. KOHO acts as a distributor only.
      </p>
    </div>
  );
}

export function TenantInsurance() { return <Insurance type="tenant" />; }
export function TravelInsurance() { return <Insurance type="travel" />; }
