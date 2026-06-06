import { useState } from "react";
import { Check, CreditCard, Copy, Eye, EyeOff, Wifi, AlertTriangle, MessageSquare, Users, BarChart3, ChevronRight, ExternalLink, Building } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

// ─── Virtual Card Info ───────────────────────────────────────────────────────
export function VirtualCardInfo() {
  const [showCvv, setShowCvv] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Virtual Card" />
      <div className="mx-4 mb-4 rounded-3xl p-5 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3B1F8C 0%, #7B4FFF 100%)", minHeight: 190 }}>
        <div className="absolute inset-0 opacity-10">
          <div className="w-48 h-48 rounded-full bg-white absolute -right-16 -top-16" />
          <div className="w-32 h-32 rounded-full bg-white absolute -left-8 -bottom-8" />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <span className="font-black text-xl tracking-widest" style={{ color: "#C8F135" }}>koho</span>
            <Wifi className="w-6 h-6 rotate-90 opacity-80" />
          </div>
          <p className="font-mono text-lg tracking-widest font-bold mb-4 opacity-90">4539 •••• •••• 2847</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase opacity-60 mb-0.5">Card holder</p>
              <p className="font-bold text-sm">AMINE HADAD</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase opacity-60 mb-0.5">Expires</p>
              <p className="font-bold text-sm">03/29</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase opacity-60 mb-0.5">CVV</p>
              <p className="font-bold text-sm">{showCvv ? "847" : "•••"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 space-y-3">
        {[
          { label: "Card number", value: "4539 2847 1928 2847", key: "num" },
          { label: "Expiry date", value: "03/29", key: "exp" },
        ].map(f => (
          <div key={f.key} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{f.label}</p>
              <p className="font-black text-gray-900 font-mono tracking-wider">{f.value}</p>
            </div>
            <button onClick={() => copy(f.value.replace(/\s/g, ""), f.key)} className="p-2 rounded-xl bg-[#EDE9FF]">
              {copied === f.key ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[#7B4FFF]" />}
            </button>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">CVV</p>
            <p className="font-black text-gray-900 font-mono tracking-widest">{showCvv ? "847" : "•••"}</p>
          </div>
          <button onClick={() => setShowCvv(v => !v)} className="p-2 rounded-xl bg-[#EDE9FF]">
            {showCvv ? <EyeOff className="w-4 h-4 text-[#7B4FFF]" /> : <Eye className="w-4 h-4 text-[#7B4FFF]" />}
          </button>
        </div>

        <button className="w-full bg-[#7B4FFF] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5" /> Add to Apple Wallet
        </button>
        <button className="w-full bg-white border-2 border-gray-200 text-gray-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5" /> Add to Google Pay
        </button>
      </div>
    </div>
  );
}

// ─── Interac e-Transfer Info ─────────────────────────────────────────────────
export function InteracETransfer() {
  const EMAIL = "amine.hadad@koho.ca";
  const [copied, setCopied] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Interac e-Transfer" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <Wifi className="w-6 h-6" />
        </div>
        <p className="font-black text-lg">Send & receive money instantly</p>
        <p className="text-sm opacity-80 mt-1">No fees on Essential plan · Powered by Interac</p>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your deposit email</p>
        <div className="flex items-center justify-between bg-[#F5F3FF] rounded-xl px-4 py-3 mb-1">
          <span className="font-bold text-gray-900 text-sm">{EMAIL}</span>
          <button onClick={() => { navigator.clipboard.writeText(EMAIL).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),1800); }} className="p-1.5 rounded-lg bg-[#EDE9FF]">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[#7B4FFF]" />}
          </button>
        </div>
        <p className="text-xs text-gray-400">Anyone can send you money to this email address via Interac e-Transfer. Auto-deposit is enabled.</p>
      </div>
      <div className="mx-4 bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
        {[
          { label: "Send money", desc: "To any Canadian bank account", href: "/send-money" },
          { label: "Request money", desc: "Generate a payment request link", href: "/request-money" },
          { label: "Auto-deposit settings", desc: "Manage auto-deposit email", href: "/feature/autodeposit" },
        ].map(item => (
          <a key={item.label} href={item.href} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-bold text-gray-900 text-sm">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Disputed Transactions ───────────────────────────────────────────────────
const DISPUTABLE_TX = [
  { id: "1", merchant: "Amazon", amount: 79.99, date: "May 30", color: "#FF9900" },
  { id: "2", merchant: "Uber Eats", amount: 34.50, date: "May 27", color: "#06C167" },
  { id: "3", merchant: "Google *Play", amount: 9.99, date: "May 22", color: "#4285F4" },
];

type DisputeReason = "not-me" | "wrong-amount" | "duplicate" | "no-service";
const REASONS: { id: DisputeReason; label: string }[] = [
  { id: "not-me", label: "I didn't make this purchase" },
  { id: "wrong-amount", label: "The amount charged is wrong" },
  { id: "duplicate", label: "This is a duplicate charge" },
  { id: "no-service", label: "I didn't receive the goods/service" },
];

export function DisputedTransactions() {
  const [selected, setSelected] = useState<string | null>(null);
  const [reason, setReason] = useState<DisputeReason | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#F5F3FF] p-6 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-[#EDE9FF] flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-[#7B4FFF]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Dispute submitted</h2>
        <p className="text-gray-500 text-sm mb-2">We've received your dispute for {DISPUTABLE_TX.find(t=>t.id===selected)?.merchant}.</p>
        <p className="text-gray-500 text-sm mb-8">Our team will review within 5–7 business days and contact you at your registered email.</p>
        <button onClick={() => { setSubmitted(false); setSelected(null); setReason(null); }} className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>Done</button>
      </div>
    );
  }

  if (selected) {
    const tx = DISPUTABLE_TX.find(t => t.id === selected)!;
    return (
      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
        <PageHeader title="Dispute Transaction" onBack={() => setSelected(null)} />
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ backgroundColor: tx.color }}>
              {tx.merchant[0]}
            </div>
            <div>
              <p className="font-black text-gray-900">{tx.merchant}</p>
              <p className="text-sm text-gray-500">${tx.amount.toFixed(2)} · {tx.date}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="font-bold text-gray-900 mb-3">What's the issue?</p>
            <div className="space-y-2">
              {REASONS.map(r => (
                <button key={r.id} onClick={() => setReason(r.id)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left" style={reason === r.id ? { backgroundColor: "#EDE9FF", border: "2px solid #7B4FFF" } : { backgroundColor: "#F9FAFB", border: "2px solid transparent" }}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${reason === r.id ? "border-[#7B4FFF] bg-[#7B4FFF]" : "border-gray-300"}`}>
                    {reason === r.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{r.label}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">Your card may be temporarily frozen while we investigate. A new card will be issued if fraud is confirmed.</p>
          </div>
          <button onClick={() => setSubmitted(true)} disabled={!reason} className="w-full py-4 rounded-2xl font-black text-white disabled:opacity-40" style={{ backgroundColor: "#7B4FFF" }}>Submit Dispute</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Dispute a Transaction" />
      <div className="p-4 space-y-4">
        <p className="text-sm text-gray-500 font-medium">Select the transaction you want to dispute</p>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
          {DISPUTABLE_TX.map(tx => (
            <button key={tx.id} onClick={() => setSelected(tx.id)} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0" style={{ backgroundColor: tx.color }}>{tx.merchant[0]}</div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{tx.merchant}</p>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>
              <span className="font-black text-gray-800">-${tx.amount.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">Don't see your transaction? Contact support for older transactions.</p>
      </div>
    </div>
  );
}

// ─── Status Page ─────────────────────────────────────────────────────────────
const STATUS_ITEMS = [
  { name: "KOHO App", status: "operational" },
  { name: "Card Processing", status: "operational" },
  { name: "Interac e-Transfer", status: "operational" },
  { name: "Direct Deposit", status: "operational" },
  { name: "Credit Score Updates", status: "degraded" },
  { name: "Push Notifications", status: "operational" },
];

export function StatusPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Service Status" />
      <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
        <div>
          <p className="font-black text-gray-900">All systems operational</p>
          <p className="text-xs text-gray-400">Last checked: Just now</p>
        </div>
      </div>
      <div className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        {STATUS_ITEMS.map(item => (
          <div key={item.name} className="flex items-center justify-between p-4">
            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.status === "operational" ? "bg-green-500" : "bg-yellow-500"}`} />
              <span className={`text-xs font-bold capitalize ${item.status === "operational" ? "text-green-600" : "text-yellow-600"}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-4">
        <a href="https://status.koho.ca" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white shadow-sm font-bold text-gray-700 text-sm">
          <ExternalLink className="w-4 h-4" /> Full status page
        </a>
      </div>
    </div>
  );
}

// ─── Feature Requests ─────────────────────────────────────────────────────────
export function FeatureRequests() {
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Feature Requests" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <MessageSquare className="w-8 h-8 mb-2 opacity-80" />
        <p className="font-black text-lg">Shape the future of KOHO</p>
        <p className="text-sm opacity-80 mt-1">Your ideas directly influence our roadmap</p>
      </div>
      {submitted ? (
        <div className="mx-4 bg-white rounded-2xl p-6 text-center shadow-sm">
          <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="font-black text-gray-900 text-lg mb-1">Thanks for your idea!</p>
          <p className="text-gray-500 text-sm">Our product team reviews every submission. You'll hear from us if your idea makes the cut.</p>
          <button onClick={() => { setIdea(""); setSubmitted(false); }} className="mt-4 text-[#7B4FFF] font-bold text-sm">Submit another</button>
        </div>
      ) : (
        <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Your idea</label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="I wish KOHO would..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
          />
          <button onClick={() => idea.trim() && setSubmitted(true)} disabled={!idea.trim()} className="w-full mt-4 py-3.5 rounded-xl font-black text-white disabled:opacity-40" style={{ backgroundColor: "#7B4FFF" }}>
            Submit idea
          </button>
        </div>
      )}
      <div className="mx-4 mt-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Top community requests</p>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
          {["Crypto staking", "Joint savings goals", "Bill split history export", "Dark mode"].map((req, i) => (
            <div key={req} className="flex items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-800">{req}</p>
              <span className="text-xs font-bold text-[#7B4FFF] bg-[#EDE9FF] px-2 py-1 rounded-full">{[234, 189, 142, 98][i]} votes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Joint Account ────────────────────────────────────────────────────────────
export function JointAccount() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Joint Account" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <Users className="w-8 h-8 mb-2 opacity-80" />
        <p className="font-black text-xl">Shared finances, simplified</p>
        <p className="text-sm opacity-80 mt-1">Manage money together with a partner or family member</p>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-black text-gray-900">How joint accounts work</h3>
        {["Both members see all transactions in real time", "Each person gets their own card linked to the account", "Separate spending limits can be set per person", "One account, two cards — perfect for couples"].map((b, i) => (
          <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-[#7B4FFF] flex-shrink-0 mt-0.5" /><p className="text-sm text-gray-700">{b}</p></div>
        ))}
      </div>
      {sent ? (
        <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm text-center">
          <Check className="w-10 h-10 text-green-600 mx-auto mb-2" />
          <p className="font-black text-gray-900 mb-1">Invite sent!</p>
          <p className="text-gray-500 text-sm">We've sent an invitation to <strong>{email}</strong>. They'll need to accept to join your account.</p>
        </div>
      ) : (
        <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Invite by email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="partner@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300" />
          <button onClick={() => email && setSent(true)} disabled={!email} className="w-full py-3.5 rounded-xl font-black text-white disabled:opacity-40" style={{ backgroundColor: "#7B4FFF" }}>Send invite</button>
        </div>
      )}
    </div>
  );
}

// ─── Credit Utilization ───────────────────────────────────────────────────────
export function CreditUtilization() {
  const used = 412;
  const limit = 500;
  const pct = Math.round((used / limit) * 100);
  const optimal = 30;

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Credit Utilization" />
      <div className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Current utilization</p>
        <div className="relative w-36 h-36 mx-auto mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" strokeWidth="12" stroke="#EDE9FF" fill="none" />
            <circle cx="50" cy="50" r="42" strokeWidth="12" stroke={pct > 30 ? "#D97706" : "#7B4FFF"} fill="none" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42 * pct / 100} 999`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-black text-gray-900">{pct}%</p>
            <p className="text-xs text-gray-500">used</p>
          </div>
        </div>
        <p className="text-sm font-bold" style={{ color: pct > 30 ? "#D97706" : "#7B4FFF" }}>
          {pct > 30 ? "High utilization — aim for under 30%" : "Good utilization!"}
        </p>
      </div>

      <div className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="font-black text-gray-900">Breakdown</h3>
        {[{ label: "Balance", value: `$${used.toFixed(2)}` }, { label: "Credit limit", value: `$${limit.toFixed(2)}` }, { label: "Available credit", value: `$${(limit - used).toFixed(2)}` }, { label: "Optimal balance (30%)", value: `$${(limit * 0.3).toFixed(2)}` }].map(r => (
          <div key={r.label} className="flex justify-between text-sm"><span className="text-gray-500">{r.label}</span><span className="font-bold text-gray-900">{r.value}</span></div>
        ))}
      </div>

      <div className="mx-4 bg-[#EDE9FF] rounded-2xl p-4">
        <p className="font-bold text-[#7B4FFF] text-sm mb-1">Tip: Pay down to ${(limit * 0.3).toFixed(0)}</p>
        <p className="text-xs text-[#7B4FFF] opacity-80">Keeping your utilization under 30% can improve your credit score by up to 20–40 points over 3–6 months.</p>
      </div>
    </div>
  );
}

// ─── Payee Number (KOHO banking details) ──────────────────────────────────────
export function PayeeNumber() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const details = [
    { label: "Institution number", value: "801", key: "inst" },
    { label: "Transit number", value: "99900", key: "transit" },
    { label: "Account number", value: "2847301928", key: "acct" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="KOHO Banking Details" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <Building className="w-7 h-7 mb-2 opacity-80" />
        <p className="font-black text-lg">Use KOHO for bill payments</p>
        <p className="text-sm opacity-80 mt-1">Provide these details to payees so they can send money directly to your KOHO account</p>
      </div>
      <div className="mx-4 space-y-3 mb-4">
        {details.map(d => (
          <div key={d.key} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{d.label}</p>
              <p className="font-black text-gray-900 text-lg font-mono">{d.value}</p>
            </div>
            <button onClick={() => copy(d.value, d.key)} className="p-2 rounded-xl bg-[#EDE9FF]">
              {copied === d.key ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[#7B4FFF]" />}
            </button>
          </div>
        ))}
      </div>
      <div className="mx-4 bg-[#EDE9FF] rounded-2xl p-4">
        <p className="text-sm font-bold text-[#7B4FFF]">Financial institution: KOHO Financial Inc.</p>
        <p className="text-xs text-[#7B4FFF] opacity-80 mt-1">These details can be used to set up direct deposits, government payments (CRA), and bill payments from external accounts.</p>
      </div>
    </div>
  );
}

// ─── Account Limit Tier pages ─────────────────────────────────────────────────
function LimitTierPage({ tier }: { tier: "unverified" | "regular" | "paid" }) {
  const configs = {
    unverified: {
      title: "Unverified Limits",
      subtitle: "Verify your identity to unlock higher limits",
      color: "#D97706",
      bg: "#FEF3C7",
      limits: [
        { label: "Daily spending", value: "$500" },
        { label: "Weekly spending", value: "$1,000" },
        { label: "Monthly spending", value: "$2,500" },
        { label: "e-Transfer send", value: "$500/day" },
        { label: "ATM withdrawal", value: "$200/day" },
      ],
    },
    regular: {
      title: "Verified Limits",
      subtitle: "Your current limits as a verified KOHO member",
      color: "#7B4FFF",
      bg: "#EDE9FF",
      limits: [
        { label: "Daily spending", value: "$3,000" },
        { label: "Weekly spending", value: "$10,000" },
        { label: "Monthly spending", value: "$30,000" },
        { label: "e-Transfer send", value: "$3,000/day" },
        { label: "ATM withdrawal", value: "$1,000/day" },
        { label: "Load from bank", value: "$25,000/mo" },
      ],
    },
    paid: {
      title: "Premium Limits",
      subtitle: "Higher limits for Extra & Everything plan members",
      color: "#D97706",
      bg: "#FEF3C7",
      limits: [
        { label: "Daily spending", value: "$10,000" },
        { label: "Weekly spending", value: "$50,000" },
        { label: "Monthly spending", value: "$100,000" },
        { label: "e-Transfer send", value: "$10,000/day" },
        { label: "ATM withdrawal", value: "$3,000/day" },
        { label: "Load from bank", value: "$100,000/mo" },
        { label: "International transfers", value: "$15,000/day" },
      ],
    },
  };
  const cfg = configs[tier];

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title={cfg.title} />
      <div className="mx-4 mb-4 rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: cfg.bg }}>
        <BarChart3 className="w-6 h-6 flex-shrink-0" style={{ color: cfg.color }} />
        <p className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.subtitle}</p>
      </div>
      <div className="mx-4 bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
        {cfg.limits.map(l => (
          <div key={l.label} className="flex justify-between items-center p-4">
            <p className="text-sm text-gray-700 font-medium">{l.label}</p>
            <p className="font-black text-gray-900">{l.value}</p>
          </div>
        ))}
      </div>
      {tier === "unverified" && (
        <div className="mx-4 mt-4">
          <button className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>Verify Identity to Unlock</button>
        </div>
      )}
    </div>
  );
}

export function LimitsUnverified() { return <LimitTierPage tier="unverified" />; }
export function LimitsRegular() { return <LimitTierPage tier="regular" />; }
export function LimitsPaid() { return <LimitTierPage tier="paid" />; }

// ─── Debit Card Deposit ───────────────────────────────────────────────────────
export function DebitCardDeposit() {
  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Debit Card Deposit" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <CreditCard className="w-7 h-7 mb-2 opacity-80" />
        <p className="font-black text-lg">Load from your debit card</p>
        <p className="text-sm opacity-80 mt-1">Instant transfer from any Canadian debit card · $0 fee</p>
      </div>
      <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Card number</label>
          <input placeholder="•••• •••• •••• ••••" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-300" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Expiry</label>
            <input placeholder="MM/YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">PIN</label>
            <input type="password" placeholder="••••" maxLength={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
            <input type="number" placeholder="0.00" className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>
        </div>
        <button className="w-full py-4 rounded-2xl font-black text-white" style={{ backgroundColor: "#7B4FFF" }}>Add Funds</button>
      </div>
    </div>
  );
}

// ─── Cash Deposit ────────────────────────────────────────────────────────────
export function CashDeposit() {
  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Cash Deposit" />
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-2xl p-5 text-white">
        <p className="font-black text-lg mb-1">Deposit cash at any Canada Post</p>
        <p className="text-sm opacity-80">Over 6,200 locations nationwide · Same-day processing</p>
      </div>
      <div className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-black text-gray-900 mb-4">How to deposit cash</h3>
        <div className="space-y-3">
          {["Go to any Canada Post location", "Tell the teller you want to load a prepaid card", "Give them your KOHO card and the cash amount", "Funds appear in your account within minutes"].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0" style={{ backgroundColor: "#7B4FFF" }}>{i + 1}</div>
              <p className="text-sm text-gray-700 font-medium pt-0.5">{s}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-4 space-y-2">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between text-sm"><span className="text-gray-500">Fee</span><span className="font-bold text-green-600">Free</span></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between text-sm"><span className="text-gray-500">Min deposit</span><span className="font-bold">$20</span></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between text-sm"><span className="text-gray-500">Max per visit</span><span className="font-bold">$999</span></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex justify-between text-sm"><span className="text-gray-500">Monthly limit</span><span className="font-bold">$9,999</span></div>
      </div>
      <div className="mx-4 mt-4">
        <a href="https://www.canadapost-postescanada.ca/cpc/en/tools/find-a-post-office.page" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#7B4FFF] text-white font-black">
          <ExternalLink className="w-5 h-5" /> Find Canada Post near me
        </a>
      </div>
    </div>
  );
}
