import { useState } from "react";
import { useGetPlan, useGetAccountSummary } from "@workspace/api-client-react";
import { Settings, Zap, Target, ChevronRight, Star } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Plan() {
  const { data: plan, isLoading: isLoadingPlan } = useGetPlan();
  const { data: summary, isLoading: isLoadingSummary } = useGetAccountSummary();
  const [tab, setTab] = useState<"overview" | "benefits">("overview");

  const fmt = (n?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n ?? 0);

  const benefits = [
    { label: "1% cash back on purchases", included: true },
    { label: "Save Interest (2% APY)", included: true },
    { label: "KOHO Cover overdraft protection", included: true },
    { label: "Credit Building", included: true },
    { label: "No foreign transaction fees", included: false },
    { label: "Financial coaching", included: false },
    { label: "Priority support", included: false },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900 mx-auto">My Plan</h1>
        <Link href="/account-settings" className="absolute right-4 p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-gray-800" />
        </Link>
      </header>

      {isLoadingPlan || isLoadingSummary ? (
        <div className="p-4 space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (plan && summary) ? (
        <div className="p-4 space-y-4">
          {/* Plan card */}
          <div className="bg-gradient-to-br from-primary to-purple-800 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                  <p className="text-white/70 text-sm">Renews {plan.renewalDate}</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <p className="text-white/70 text-sm font-medium mb-1">Total Balance</p>
              <h3 className="text-3xl font-bold">{fmt(summary.totalBalance)}</h3>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-200/50 rounded-xl">
            <button
              onClick={() => setTab("overview")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${tab === "overview" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setTab("benefits")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${tab === "benefits" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Benefits
            </button>
          </div>

          {tab === "overview" ? (
            <>
              {/* Balance breakdown */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 px-1">Balance Breakdown</h3>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  <Link href="/my-balances" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Spendable</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{fmt(summary.spendable)}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/vault" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Vault</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{fmt(summary.vault)}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/roundups" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">RoundUps</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{fmt(summary.roundups)}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/goals" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Goals</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{fmt(summary.goals)}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Cashback card */}
              <Link href="/cashback" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">Cashback</h3>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                      +{summary.interestRate}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">Earned this month: {fmt(summary.cashbackThisMonth)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Target className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              {/* Upgrade prompt */}
              <Link href="/feature/upgrade-plan" className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-3xl p-5 flex items-center justify-between hover:from-purple-100 hover:to-indigo-100 transition-colors">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Unlock more</p>
                  <p className="font-bold text-gray-900">Earn for free with Extra</p>
                  <p className="text-xs text-gray-500 mt-1">No foreign transaction fees & more</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Star className="w-5 h-5" />
                </div>
              </Link>
            </>
          ) : (
            /* Benefits tab */
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {benefits.map(b => (
                <div key={b.label} className="flex items-center gap-3 px-4 py-3.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${b.included ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {b.included ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${b.included ? "text-gray-900" : "text-gray-400"}`}>{b.label}</span>
                </div>
              ))}
              <Link href="/feature/upgrade-plan" className="block px-4 py-4 text-center text-primary font-bold text-sm hover:bg-gray-50 transition-colors">
                Upgrade to unlock all benefits →
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
