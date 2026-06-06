import { PageHeader } from "@/components/layout/page-header";
import { Search, ChevronRight, Calendar, Delete, Clock } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useGetRecentTransactions } from "@workspace/api-client-react";

const ALL_PAYEES = [
  { name: "Rogers",        color: "#E31837", initial: "R" },
  { name: "Bell Canada",   color: "#0066CC", initial: "B" },
  { name: "Fido",          color: "#FF5733", initial: "F" },
  { name: "Telus",         color: "#4B286D", initial: "T" },
  { name: "Hydro One",     color: "#009A44", initial: "H" },
  { name: "Toronto Hydro", color: "#005A9C", initial: "T" },
  { name: "Enbridge Gas",  color: "#FF6900", initial: "E" },
  { name: "Videotron",     color: "#E2001A", initial: "V" },
  { name: "Shaw",          color: "#003087", initial: "S" },
  { name: "Cogeco",        color: "#0033A0", initial: "C" },
];

type Payee = typeof ALL_PAYEES[0];
type Step = "list" | "amount" | "review" | "success";

export default function PayBill() {
  const [step, setStep] = useState<Step>("list");
  const [query, setQuery] = useState("");
  const [payee, setPayee] = useState<Payee | null>(null);
  const [amount, setAmount] = useState("0");
  const [scheduleNow, setScheduleNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { data: recentTx } = useGetRecentTransactions();

  const recentBills = (recentTx ?? [])
    .filter(t => t.category === "Bills" && !t.isCredit)
    .slice(0, 5);

  const filtered = ALL_PAYEES.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleNumber = (n: string) => {
    if (n === "." && amount.includes(".")) return;
    setAmount(prev => prev === "0" && n !== "." ? n : prev + n);
  };
  const handleBack = () =>
    setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));

  const handlePay = async () => {
    if (!payee || parseFloat(amount) <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: payee.name,
          amount: parseFloat(amount),
          category: "Bills",
          isCredit: false,
          merchantColor: payee.color,
          scheduledDate: !scheduleNow && scheduledDate ? scheduledDate : undefined,
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setError(data.error ?? "Payment failed. Please try again.");
        setLoading(false);
        return;
      }
      queryClient.invalidateQueries();
      setStep("success");
      if (scheduleNow) setTimeout(() => navigate("/"), 2500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center gap-5 pb-24 px-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">${parseFloat(amount).toFixed(2)}</h2>
          <p className="text-gray-500 text-base font-medium">paid to <span className="font-bold text-gray-800">{payee?.name}</span></p>
          {!scheduleNow && scheduledDate && (
            <p className="text-gray-400 text-sm mt-1">Scheduled for {scheduledDate}</p>
          )}
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="h-full bg-white flex flex-col pb-24">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
          <button onClick={() => setStep("amount")} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-1">
            <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">Review payment</h1>
        </header>
        <div className="flex-1 p-5 space-y-4">
          <div className="bg-gray-50 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Payee</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: payee?.color }}>
                  {payee?.initial}
                </div>
                <span className="font-bold text-gray-900">{payee?.name}</span>
              </div>
            </div>
            <div className="w-full h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Amount</span>
              <span className="font-bold text-gray-900 text-lg">${parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="w-full h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Payment date</span>
              <span className="font-bold text-gray-900">{scheduleNow ? "Today" : scheduledDate}</span>
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 space-y-3">
          {error && (
            <div className="bg-red-50 rounded-2xl p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Processing…" : scheduleNow ? "Confirm payment" : "Schedule payment"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "amount" && payee) {
    return (
      <div className="h-full bg-white flex flex-col pb-24">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
          <button onClick={() => setStep("list")} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-1">
            <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">{payee.name}</h1>
        </header>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6 bg-gray-50 rounded-2xl p-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: payee.color }}>
              {payee.initial}
            </div>
            <span className="font-bold text-gray-900">{payee.name}</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Amount</span>
            <div className="text-[3.5rem] font-bold text-gray-900 leading-none tracking-tighter mb-4">
              ${amount}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-bold text-gray-700">Schedule</span>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setScheduleNow(true)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${scheduleNow ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              >
                Pay now
              </button>
              <button
                onClick={() => setScheduleNow(false)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${!scheduleNow ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              >
                Schedule
              </button>
            </div>
            {!scheduleNow && (
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 mb-4 max-w-xs mx-auto w-full">
            {["1","2","3","4","5","6","7","8","9",".","0"].map(n => (
              <button
                key={n}
                onClick={() => handleNumber(n)}
                className="h-14 text-2xl font-semibold text-gray-900 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                {n}
              </button>
            ))}
            <button onClick={handleBack} className="h-14 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center text-gray-600">
              <Delete className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => setStep("review")}
            disabled={parseFloat(amount) === 0 || (!scheduleNow && !scheduledDate)}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col pb-24">
      <PageHeader title="Pay a bill" backHref="/" />
      <div className="p-4">
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a payee"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
          {query ? "Results" : "Common payees"}
        </h2>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50 mb-6">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-gray-400 text-sm">No payees found</p>
          ) : filtered.map(p => (
            <button
              key={p.name}
              onClick={() => { setPayee(p); setStep("amount"); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: p.color }}>
                  {p.initial}
                </div>
                <span className="font-bold text-gray-900">{p.name}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {recentBills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Recent payments</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {recentBills.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: tx.merchantColor ?? "#6B7280" }}
                  >
                    {tx.merchant[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{tx.merchant}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-700 text-sm">-${Number(tx.amount).toFixed(2)}</p>
                    {tx.status === "pending" && (
                      <span className="text-[10px] font-bold text-amber-500">Scheduled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
