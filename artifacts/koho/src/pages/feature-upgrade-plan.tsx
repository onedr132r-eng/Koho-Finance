import { useState } from "react";
import { Check, Zap, Star, Crown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const PLANS = [
  {
    id: "essential",
    name: "Essential",
    price: 0,
    period: "month",
    icon: Zap,
    color: "#6B7280",
    bg: "#F3F4F6",
    current: true,
    perks: [
      "Prepaid Mastercard",
      "Unlimited transactions",
      "0.5% cashback",
      "Interac e-Transfer (in & out)",
      "Savings Vault",
      "Credit score monitoring",
    ],
  },
  {
    id: "extra",
    name: "Extra",
    price: 9,
    period: "month",
    icon: Star,
    color: "#7B4FFF",
    bg: "#EDE9FF",
    popular: true,
    perks: [
      "Everything in Essential",
      "1.5% cashback (2% on groceries & transport)",
      "Price match guarantee",
      "Purchase protection 90 days",
      "Credit Building subscription",
      "Cover overdraft protection",
      "KOHO Card design choice",
    ],
  },
  {
    id: "everything",
    name: "Everything",
    price: 19,
    period: "month",
    icon: Crown,
    color: "#D97706",
    bg: "#FEF3C7",
    perks: [
      "Everything in Extra",
      "2% cashback on all purchases",
      "No FX fees on international",
      "Unlimited free Interac e-Transfers",
      "Metal card (optional)",
      "Priority customer support",
      "Up to $250 Cover",
      "Financial coaching sessions",
    ],
  },
];

export default function UpgradePlan() {
  const [selected, setSelected] = useState("extra");
  const [confirmed, setConfirmed] = useState(false);

  const plan = PLANS.find(p => p.id === selected)!;

  if (confirmed) {
    const Icon = plan.icon;
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F3FF] p-6 text-center pb-24">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: plan.bg }}>
          <Icon className="w-10 h-10" style={{ color: plan.color }} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome to {plan.name}!</h2>
        <p className="text-gray-500 text-sm mb-8">Your plan has been upgraded. Enjoy your new benefits immediately.</p>
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm text-left space-y-2 mb-6">
          {plan.perks.slice(0, 3).map((p, i) => (
            <div key={i} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /><p className="text-sm text-gray-700">{p}</p></div>
          ))}
        </div>
        <button onClick={() => setConfirmed(false)} className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>Done</button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Upgrade Plan" />

      <div className="px-4 pt-2 pb-2">
        <p className="text-sm text-gray-500 font-medium text-center">Choose a plan that fits your life</p>
      </div>

      <div className="px-4 space-y-3 mb-4">
        {PLANS.map(p => {
          const Icon = p.icon;
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => !p.current && setSelected(p.id)}
              className="w-full bg-white rounded-2xl p-4 text-left shadow-sm transition-all"
              style={isSelected ? { border: "2px solid #7B4FFF" } : p.current ? { border: "2px solid #E5E7EB", opacity: 0.7 } : { border: "2px solid transparent" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.bg }}>
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-gray-900">{p.name}</p>
                      {p.popular && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FF] text-[#7B4FFF]">Popular</span>}
                      {p.current && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Current</span>}
                    </div>
                    <p className="text-xl font-black" style={{ color: p.color }}>
                      {p.price === 0 ? "Free" : `$${p.price}/mo`}
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${isSelected ? "border-[#7B4FFF] bg-[#7B4FFF]" : "border-gray-300"}`}>
                  {isSelected && <Check className="w-full h-full text-white p-0.5" />}
                </div>
              </div>
              <div className="space-y-1">
                {p.perks.slice(0, 4).map((perk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: p.color }} />
                    <p className="text-xs text-gray-600">{perk}</p>
                  </div>
                ))}
                {p.perks.length > 4 && <p className="text-xs font-bold ml-5" style={{ color: p.color }}>+{p.perks.length - 4} more benefits</p>}
              </div>
            </button>
          );
        })}
      </div>

      {selected !== "essential" && (
        <div className="px-4">
          <button
            onClick={() => setConfirmed(true)}
            className="w-full py-4 rounded-2xl font-black text-white"
            style={{ backgroundColor: "#7B4FFF" }}
          >
            Upgrade to {plan.name} · ${plan.price}/mo
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">Cancel anytime · No contracts · Billed monthly to your KOHO balance</p>
        </div>
      )}
    </div>
  );
}
