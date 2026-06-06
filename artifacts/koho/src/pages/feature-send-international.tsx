import { useState } from "react";
import { Search, ChevronRight, Globe, Clock, Check, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 0.735, fee: 1.5, time: "Minutes" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 0.681, fee: 1.5, time: "Minutes" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 0.582, fee: 1.5, time: "Minutes" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", rate: 61.2, fee: 2.0, time: "1–2 hours" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", rate: 12.4, fee: 2.0, time: "Minutes" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭", rate: 40.8, fee: 2.0, time: "1–2 hours" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰", rate: 204.5, fee: 2.5, time: "2–4 hours" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", rate: 1147, fee: 2.5, time: "1–3 hours" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", rate: 1.12, fee: 1.5, time: "Minutes" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", rate: 111.3, fee: 1.5, time: "Minutes" },
];

export default function SendInternational() {
  const [step, setStep] = useState<"currency" | "amount" | "recipient" | "review" | "success">("currency");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof CURRENCIES[0] | null>(null);
  const [cadAmount, setCadAmount] = useState("200.00");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const filtered = CURRENCIES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  const amtNum = parseFloat(cadAmount) || 0;
  const converted = selected ? (amtNum * selected.rate).toFixed(2) : "0.00";
  const fee = selected ? (amtNum * selected.fee / 100).toFixed(2) : "0.00";
  const total = (amtNum + parseFloat(fee)).toFixed(2);

  if (step === "success" && selected) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F3FF] p-6 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-[#EDE9FF] flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-[#7B4FFF]" />
        </div>
        <p className="text-4xl font-black text-gray-900 mb-1">{selected.flag} {converted} {selected.code}</p>
        <p className="text-gray-500 text-sm mb-1">sent to {recipientName || "recipient"}</p>
        <p className="text-xs text-gray-400 mb-8">Estimated arrival: {selected.time}</p>
        <div className="bg-white rounded-2xl p-4 w-full text-left shadow-sm mb-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Amount sent</span><span className="font-bold">CAD ${amtNum.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Exchange rate</span><span className="font-bold">1 CAD = {selected.rate} {selected.code}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Transfer fee</span><span className="font-bold">CAD ${fee}</span></div>
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between font-black"><span>Recipient gets</span><span className="text-[#7B4FFF]">{selected.flag} {converted} {selected.code}</span></div>
        </div>
        <button onClick={() => { setStep("currency"); setSelected(null); }} className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>
          Send Another
        </button>
      </div>
    );
  }

  if (step === "review" && selected) {
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title="Review Transfer" onBack={() => setStep("recipient")} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Sending</span><span className="font-bold">CAD ${amtNum.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Exchange rate</span><span className="font-bold">1 CAD = {selected.rate} {selected.code}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Transfer fee ({selected.fee}%)</span><span className="font-bold">CAD ${fee}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Total deducted</span><span className="font-bold">CAD ${total}</span></div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between font-black text-base">
              <span>Recipient gets</span>
              <span className="text-[#7B4FFF]">{selected.flag} {converted} {selected.code}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-sm space-y-2">
            <p className="font-bold text-gray-900">Recipient</p>
            <p className="text-gray-700">{recipientName || "—"}</p>
            <p className="text-gray-500">{recipientEmail || "—"}</p>
            <p className="text-gray-500">Bank account: {bankAccount || "—"}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#EDE9FF] rounded-xl p-3">
            <Clock className="w-4 h-4 text-[#7B4FFF] flex-shrink-0" />
            <p>Estimated arrival: <strong className="text-gray-900">{selected.time}</strong></p>
          </div>
          <button onClick={() => setStep("success")} className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>
            Send {selected.flag} {converted} {selected.code}
          </button>
        </div>
      </div>
    );
  }

  if (step === "recipient" && selected) {
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title="Recipient Details" onBack={() => setStep("amount")} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Full name</label>
              <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="As on their bank account" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Email address</label>
              <input value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="recipient@email.com" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Bank account / IBAN</label>
              <input value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="Account number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
          </div>
          <button
            onClick={() => setStep("review")}
            disabled={!recipientName}
            className="w-full py-4 rounded-2xl font-black text-white disabled:opacity-50"
            style={{ backgroundColor: "#7B4FFF" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "amount" && selected) {
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title={`Send to ${selected.flag} ${selected.name.split(" ")[0]}`} onBack={() => setStep("currency")} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">You send (CAD)</label>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">$</span>
              <input
                type="number"
                value={cadAmount}
                onChange={e => setCadAmount(e.target.value)}
                className="w-full border-2 border-[#7B4FFF] rounded-xl pl-10 pr-4 py-4 text-2xl font-black focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3 mb-1">
              <Globe className="w-4 h-4 text-gray-400" />
              <span>1 CAD = <strong>{selected.rate}</strong> {selected.code}</span>
            </div>
            <div className="flex justify-between items-center px-1 mt-3">
              <span className="text-sm text-gray-500">Recipient gets</span>
              <span className="font-black text-xl text-[#7B4FFF]">{selected.flag} {converted} {selected.code}</span>
            </div>
            <div className="flex justify-between items-center px-1 mt-1">
              <span className="text-xs text-gray-400">Fee ({selected.fee}%)</span>
              <span className="text-xs text-gray-500">CAD ${fee}</span>
            </div>
          </div>
          <button
            onClick={() => setStep("recipient")}
            disabled={amtNum <= 0}
            className="w-full py-4 rounded-2xl font-black text-white disabled:opacity-50"
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
      <PageHeader title="Send International" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-4 text-white">
        <Globe className="w-7 h-7 mb-2 opacity-80" />
        <p className="font-black text-lg">Send money worldwide</p>
        <p className="text-sm opacity-80 mt-1">Competitive rates · Low fees · Powered by Wise</p>
      </div>
      <div className="px-4 mb-3 relative">
        <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search currency or country"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>
      <div className="px-4 space-y-2">
        {filtered.map(c => (
          <button
            key={c.code}
            onClick={() => { setSelected(c); setStep("amount"); }}
            className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.flag}</span>
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                <p className="text-xs text-gray-500">1 CAD = {c.rate} {c.code}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{c.time}</p>
                <p className="text-xs font-bold text-[#7B4FFF]">{c.fee}% fee</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
