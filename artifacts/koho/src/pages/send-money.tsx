import { PageHeader } from "@/components/layout/page-header";
import { Search, Delete, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useGetAccount, useGetRecentTransactions } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const RECENT = [
  { name: "Sarah M.",  initials: "SM", color: "#7B4FFF" },
  { name: "James L.",  initials: "JL", color: "#E8604C" },
  { name: "Priya K.",  initials: "PK", color: "#1B4FD8" },
  { name: "Marcus T.", initials: "MT", color: "#09A86E" },
];

type Step = "entry" | "review" | "success";

function ConfettiBurst() {
  const colors = ["#7B4FFF","#09A86E","#FFD700","#E8604C","#1B4FD8","#FF69B4"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 32 }).map((_, i) => {
        const color = colors[i % colors.length];
        const left = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 0.6}s`;
        const duration = `${0.8 + Math.random() * 0.8}s`;
        const size = `${6 + Math.random() * 8}px`;
        return (
          <div
            key={i}
            className="absolute top-0 animate-confetti"
            style={{ left, animationDelay: delay, animationDuration: duration, width: size, height: size, backgroundColor: color, borderRadius: Math.random() > 0.5 ? "50%" : "2px" }}
          />
        );
      })}
    </div>
  );
}

export default function SendMoney() {
  const [step, setStep] = useState<Step>("entry");
  const [amount, setAmount] = useState("0");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipient, setRecipient] = useState<{ name: string; initials: string; color: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { data: account } = useGetAccount();
  const { data: recentTx } = useGetRecentTransactions();
  const queryClient = useQueryClient();

  const recentTransfers = (recentTx ?? [])
    .filter(t => t.category === "Transfer" && !t.isCredit)
    .slice(0, 5);

  const filteredContacts = recipientSearch
    ? RECENT.filter(c => c.name.toLowerCase().includes(recipientSearch.toLowerCase()))
    : RECENT;

  const handleNumber = (n: string) => {
    if (n === "." && amount.includes(".")) return;
    setAmount(prev => prev === "0" && n !== "." ? n : prev + n);
  };

  const handleBack = () =>
    setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : "0"));

  const fee = 0;
  const total = parseFloat(amount) + fee;

  const handleSend = async () => {
    if (!recipient || parseFloat(amount) <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: recipient.name,
          amount: parseFloat(amount),
          category: "Transfer",
          isCredit: false,
          merchantColor: recipient.color,
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setError(data.error ?? "Transfer failed. Please try again.");
        setLoading(false);
        return;
      }
      queryClient.invalidateQueries();
      setStep("success");
      setTimeout(() => navigate("/"), 2500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <>
        <ConfettiBurst />
        <div className="h-full bg-white flex flex-col items-center justify-center gap-5 pb-24 px-6">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
            <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              ${parseFloat(amount).toFixed(2)}
            </h2>
            <p className="text-gray-500 text-base font-medium">sent to <span className="font-bold text-gray-800">{recipient?.name}</span></p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 w-full max-w-xs text-center">
            <p className="text-xs text-gray-400 font-medium">The transfer was instant and fee-free</p>
          </div>
        </div>
      </>
    );
  }

  if (step === "review") {
    return (
      <div className="h-full bg-white flex flex-col pb-24">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
          <button onClick={() => setStep("entry")} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-1">
            <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">Review transfer</h1>
        </header>
        <div className="flex-1 p-5 space-y-4">
          <div className="bg-gray-50 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">To</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: recipient?.color }}>
                  {recipient?.initials}
                </div>
                <span className="font-bold text-gray-900">{recipient?.name}</span>
              </div>
            </div>
            <div className="w-full h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Amount</span>
              <span className="font-bold text-gray-900 text-lg">${parseFloat(amount).toFixed(2)}</span>
            </div>
            <div className="w-full h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">Fee</span>
              <span className="font-bold text-green-600">Free</span>
            </div>
            <div className="w-full h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 rounded-2xl p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-xs text-blue-700 font-medium">
              Available balance after transfer: <span className="font-bold">${((account?.spendableBalance ?? 0) - total).toFixed(2)}</span>
            </p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send money"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col pb-24 overflow-y-auto">
      <PageHeader title="Send money" backHref="/" />

      <div className="p-4 flex-1 flex flex-col">
        <div className="relative mb-4">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Name, email, phone number"
            value={recipientSearch}
            onChange={e => { setRecipientSearch(e.target.value); setRecipient(null); }}
            className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {recipient && (
          <div className="mb-4 flex items-center gap-3 bg-primary/5 rounded-2xl px-4 py-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: recipient.color }}>
              {recipient.initials}
            </div>
            <span className="font-bold text-gray-900">{recipient.name}</span>
            <button onClick={() => { setRecipient(null); setRecipientSearch(""); }} className="ml-auto text-xs text-gray-400 font-medium">Change</button>
          </div>
        )}

        {!recipient && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
              {recipientSearch ? "Contacts" : "Recent"}
            </p>
            {filteredContacts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No contacts found</p>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {filteredContacts.map(c => (
                  <button
                    key={c.name}
                    onClick={() => { setRecipient(c); setRecipientSearch(""); }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: c.color }}>
                      {c.initials}
                    </div>
                    <span className="font-bold text-gray-900">{c.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amount</span>
          <div className="text-[3.5rem] font-bold text-gray-900 leading-none tracking-tighter">
            ${amount}
          </div>
          {recipient && (
            <p className="mt-2 text-sm text-gray-500">To <span className="font-bold text-gray-800">{recipient.name}</span></p>
          )}
          {account && (
            <p className="mt-1 text-xs text-gray-400">Balance: ${account.spendableBalance.toFixed(2)}</p>
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
          <button
            onClick={handleBack}
            className="h-14 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center text-gray-600"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => setStep("review")}
          disabled={parseFloat(amount) === 0 || !recipient}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mb-6"
        >
          Review
        </button>

        {recentTransfers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent transfers</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {recentTransfers.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: tx.merchantColor ?? "#7B4FFF" }}
                  >
                    {tx.merchant.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{tx.merchant}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                  <span className="font-bold text-gray-700 text-sm flex-shrink-0">
                    -${Number(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
