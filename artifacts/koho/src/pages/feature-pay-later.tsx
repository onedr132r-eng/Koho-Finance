import { useState } from "react";
import { CreditCard, Check, ChevronRight, Zap, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const PLANS = [
  { id: "2", installments: 2, label: "Pay in 2", fee: 0, interest: 0, badge: "No fees", highlight: false },
  { id: "4", installments: 4, label: "Pay in 4", fee: 0, interest: 0, badge: "Most popular", highlight: true },
  { id: "6", installments: 6, label: "Pay in 6", fee: 1.5, interest: 0, badge: null, highlight: false },
  { id: "12", installments: 12, label: "Pay in 12", fee: 2.5, interest: 9.99, badge: null, highlight: false },
];

const RECENT_PURCHASES = [
  { id: "1", merchant: "Best Buy", amount: 649.99, logo: "BB", color: "#003B8E", date: "Jun 1", plan: 4, paid: 2 },
  { id: "2", merchant: "Canada Computers", amount: 299.00, logo: "CC", color: "#CC0000", date: "May 28", plan: 2, paid: 1 },
];

export default function PayLater() {
  const [amount, setAmount] = useState("200.00");
  const [selectedPlan, setSelectedPlan] = useState("4");
  const [view, setView] = useState<"home" | "split" | "confirm" | "success">("home");
  const [mode, setMode] = useState<"now" | "later">("later");

  const amountNum = parseFloat(amount) || 0;
  const plan = PLANS.find(p => p.id === selectedPlan)!;
  const installmentAmt = (amountNum / plan.installments).toFixed(2);
  const feeAmt = (amountNum * plan.fee / 100).toFixed(2);
  const total = (amountNum + parseFloat(feeAmt)).toFixed(2);

  if (view === "confirm") {
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title="Review Plan" onBack={() => setView("split")} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 space-y-4">
            <h3 className="font-black text-gray-900 text-lg">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Purchase total</span><span className="font-bold">${amountNum.toFixed(2)}</span></div>
              {mode === "now" ? (
                <>
                  <div className="flex justify-between"><span className="text-gray-500">Payment method</span><span className="font-bold">KOHO balance</span></div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between font-black text-base"><span>You pay today</span><span className="text-[#7B4FFF]">${amountNum.toFixed(2)}</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="font-bold">{plan.label}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Fee</span><span className="font-bold">{plan.fee === 0 ? "Free" : `$${feeAmt}`}</span></div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between font-black text-base"><span>Per installment</span><span className="text-[#7B4FFF]">${installmentAmt}</span></div>
                </>
              )}
            </div>
          </div>

          {mode === "later" && (
            <div className="bg-white rounded-2xl p-5">
              <h4 className="font-bold text-gray-900 mb-3">Payment schedule</h4>
              <div className="space-y-2">
                {Array.from({ length: plan.installments }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i * 14);
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-[#7B4FFF] text-white" : "bg-gray-100 text-gray-500"}`}>{i + 1}</div>
                        <span className="text-gray-600">{date.toLocaleDateString("en-CA", { month: "short", day: "numeric" })}{i === 0 ? " (Today)" : ""}</span>
                      </div>
                      <span className="font-bold">${installmentAmt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={() => setView("success")}
            className="w-full py-4 rounded-2xl font-black text-white text-base"
            style={{ backgroundColor: "#7B4FFF" }}
          >
            {mode === "now" ? `Pay $${amountNum.toFixed(2)} now` : "Confirm Plan"}
          </button>
        </div>
      </div>
    );
  }

  if (view === "success") {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F3FF] p-6 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          {mode === "now" ? "Payment complete!" : "You're all set!"}
        </h2>
        {mode === "now" ? (
          <p className="text-gray-500 text-sm mb-8">${amountNum.toFixed(2)} was deducted from your KOHO balance immediately.</p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-2">Your {plan.label} plan is active. ${installmentAmt} will be charged today.</p>
            <p className="text-[#7B4FFF] font-bold text-sm mb-8">Next payment in 14 days</p>
          </>
        )}
        <button
          onClick={() => setView("home")}
          className="w-full py-4 rounded-2xl font-black text-white"
          style={{ backgroundColor: "#7B4FFF" }}
        >
          Done
        </button>
      </div>
    );
  }

  if (view === "split") {
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title="Choose a Plan" onBack={() => setView("home")} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Purchase amount</p>
            <p className="text-4xl font-black text-gray-900">${amountNum.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            {PLANS.map(p => {
              const inst = (amountNum / p.installments).toFixed(2);
              const isSelected = selectedPlan === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all"
                  style={isSelected ? { border: "2px solid #7B4FFF" } : { border: "2px solid transparent" }}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-black text-gray-900">{p.label}</p>
                      {p.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE9FF] text-[#7B4FFF]">{p.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {p.fee === 0 ? "No fees" : `${p.fee}% fee`}
                      {p.interest > 0 ? ` · ${p.interest}% interest` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg text-[#7B4FFF]">${inst}</p>
                    <p className="text-xs text-gray-400">/ payment</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setView("confirm")}
            className="w-full py-4 rounded-2xl font-black text-white"
            style={{ backgroundColor: "#7B4FFF" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Pay Later" />

      {/* Hero */}
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <p className="font-black text-xl mb-1">Split any purchase</p>
        <p className="text-sm opacity-80 mb-4">No credit check. No interest on 2 or 4 payments.</p>
        <div className="bg-white/20 rounded-xl p-3 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-white" />
          <div>
            <p className="text-xs font-bold opacity-80">Your limit</p>
            <p className="font-black text-lg">$1,500.00</p>
          </div>
        </div>
      </div>

      {/* Pay Now / Pay Later toggle */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-black text-gray-900 mb-4">New purchase</h3>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setMode("now")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={mode === "now" ? { backgroundColor: "#fff", color: "#111827", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { color: "#6B7280" }}
          >
            <Zap className="w-4 h-4" />
            Pay now
          </button>
          <button
            onClick={() => setMode("later")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={mode === "later" ? { backgroundColor: "#7B4FFF", color: "#fff" } : { color: "#6B7280" }}
          >
            <Clock className="w-4 h-4" />
            Pay later
          </button>
        </div>

        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Purchase amount</label>
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 font-black text-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        {mode === "now" ? (
          <div className="bg-green-50 rounded-xl p-3 mb-4 text-sm text-green-700 font-medium">
            Full amount of <strong>${amountNum.toFixed(2)}</strong> will be deducted from your KOHO balance immediately. No fees, no installments.
          </div>
        ) : (
          <div className="bg-[#EDE9FF] rounded-xl p-3 mb-4 text-sm text-[#7B4FFF] font-medium">
            Split into 2–12 payments. First installment charged today.
          </div>
        )}

        <button
          onClick={() => mode === "now" ? setView("confirm") : setView("split")}
          disabled={amountNum <= 0}
          className="w-full py-3.5 rounded-xl font-black text-white disabled:opacity-50"
          style={{ backgroundColor: "#7B4FFF" }}
        >
          {mode === "now" ? "Pay now" : "Choose plan"}
        </button>
      </div>

      {/* Active plans */}
      {RECENT_PURCHASES.length > 0 && (
        <div className="mx-4">
          <h3 className="font-black text-gray-900 mb-3">Active plans</h3>
          <div className="space-y-3">
            {RECENT_PURCHASES.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: p.color }}>
                    {p.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{p.merchant}</p>
                    <p className="text-xs text-gray-500">${p.amount.toFixed(2)} · {p.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-[#7B4FFF]" style={{ width: `${(p.paid / p.plan) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{p.paid} of {p.plan} payments made</span>
                  <span className="font-bold text-[#7B4FFF]">${(p.amount / p.plan * (p.plan - p.paid)).toFixed(2)} left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
