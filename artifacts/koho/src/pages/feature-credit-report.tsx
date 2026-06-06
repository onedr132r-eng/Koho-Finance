import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronRight, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const SCORE = 571;
const MAX_SCORE = 900;
const SCORE_HISTORY = [
  { month: "Dec", score: 542 },
  { month: "Jan", score: 549 },
  { month: "Feb", score: 555 },
  { month: "Mar", score: 558 },
  { month: "Apr", score: 566 },
  { month: "May", score: 571 },
];

const SCORE_FACTORS = [
  { label: "Payment history", impact: "high", status: "good", detail: "100% on-time payments in the last 24 months", icon: CheckCircle2, color: "#16A34A" },
  { label: "Credit utilization", impact: "high", status: "fair", detail: "42% utilization — aim for under 30%", icon: AlertCircle, color: "#D97706" },
  { label: "Credit age", impact: "medium", status: "fair", detail: "Average account age: 2 years 4 months", icon: Clock, color: "#D97706" },
  { label: "Credit mix", impact: "low", status: "poor", detail: "Only 1 type of credit account detected", icon: AlertCircle, color: "#DC2626" },
  { label: "New inquiries", impact: "low", status: "good", detail: "0 hard inquiries in the last 12 months", icon: CheckCircle2, color: "#16A34A" },
];

const ACCOUNTS = [
  { name: "KOHO Secured Credit Card", type: "Credit Card", status: "open", balance: 412, limit: 500, opened: "Nov 2022", color: "#7B4FFF" },
  { name: "TD Bank Chequing", type: "Bank Account", status: "open", balance: 0, limit: 0, opened: "Mar 2021", color: "#009B77" },
  { name: "MBNA Rewards Mastercard", type: "Credit Card", status: "closed", balance: 0, limit: 5000, opened: "Jan 2020", color: "#E31837" },
];

const INQUIRIES = [
  { lender: "KOHO Financial", date: "Nov 15, 2022", type: "Soft" },
  { lender: "Equifax Canada", date: "Mar 4, 2022", type: "Soft" },
];

const SCORE_LABEL = (s: number) =>
  s < 560 ? ["Poor", "#DC2626"] :
  s < 660 ? ["Fair", "#D97706"] :
  s < 725 ? ["Good", "#16A34A"] :
  s < 760 ? ["Very Good", "#0EA5E9"] :
  ["Excellent", "#7B4FFF"];

const [scoreLabel, scoreColor] = SCORE_LABEL(SCORE);

const pct = (SCORE / MAX_SCORE) * 100;

export default function CreditReport() {
  const [activeTab, setActiveTab] = useState<"overview" | "accounts" | "inquiries">("overview");

  const sparkH = 48;
  const scores = SCORE_HISTORY.map(h => h.score);
  const minS = Math.min(...scores) - 20;
  const maxS = Math.max(...scores) + 10;
  const pts = SCORE_HISTORY.map((h, i) => {
    const x = (i / (SCORE_HISTORY.length - 1)) * 260;
    const y = sparkH - ((h.score - minS) / (maxS - minS)) * sparkH;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Credit Report" />

      {/* Score card */}
      <div className="mx-4 mb-4 bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Equifax Score</p>
            <div className="flex items-end gap-2">
              <p className="text-5xl font-black" style={{ color: scoreColor }}>{SCORE}</p>
              <div className="flex items-center gap-1 mb-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-bold">+5</span>
              </div>
            </div>
            <p className="text-sm font-bold mt-1" style={{ color: scoreColor }}>{scoreLabel}</p>
          </div>
          <div className="w-24 h-24 relative flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="32" strokeWidth="8" stroke="#EDE9FF" fill="none" />
              <circle
                cx="40" cy="40" r="32" strokeWidth="8"
                stroke={scoreColor}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32 * pct / 100} 999`}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-500">{MAX_SCORE} max</span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="mt-2">
          <p className="text-xs font-bold text-gray-400 mb-2">6-month trend</p>
          <svg viewBox={`0 0 260 ${sparkH + 4}`} className="w-full" preserveAspectRatio="none" style={{ height: 52 }}>
            <polyline points={pts} fill="none" stroke="#7B4FFF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {SCORE_HISTORY.map((h, i) => {
              const x = (i / (SCORE_HISTORY.length - 1)) * 260;
              const y = sparkH - ((h.score - minS) / (maxS - minS)) * sparkH;
              return <circle key={i} cx={x} cy={y} r="3.5" fill="#7B4FFF" />;
            })}
          </svg>
          <div className="flex justify-between">
            {SCORE_HISTORY.map(h => (
              <span key={h.month} className="text-[10px] text-gray-400 font-medium">{h.month}</span>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-3">Updated June 1, 2026 · Provided by Equifax Canada</p>
      </div>

      {/* Tabs */}
      <div className="mx-4 mb-3 flex bg-white rounded-xl p-1 shadow-sm">
        {(["overview", "accounts", "inquiries"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all"
            style={activeTab === tab ? { backgroundColor: "#7B4FFF", color: "#fff" } : { color: "#6B7280" }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="mx-4 space-y-3">
          <h3 className="font-black text-gray-900 text-sm">Score factors</h3>
          {SCORE_FACTORS.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: f.color }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-gray-900 text-sm">{f.label}</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                      style={
                        f.status === "good" ? { backgroundColor: "#DCFCE7", color: "#16A34A" } :
                        f.status === "fair" ? { backgroundColor: "#FEF3C7", color: "#D97706" } :
                        { backgroundColor: "#FEE2E2", color: "#DC2626" }
                      }
                    >
                      {f.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{f.detail}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{f.impact} impact</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "accounts" && (
        <div className="mx-4 space-y-3">
          {ACCOUNTS.map(acc => (
            <div key={acc.name} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: acc.color }}>
                  {acc.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{acc.name}</p>
                  <p className="text-xs text-gray-500">{acc.type} · Opened {acc.opened}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${acc.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {acc.status === "open" ? "Open" : "Closed"}
                </span>
              </div>
              {acc.limit > 0 && (
                <>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Balance: ${acc.balance.toLocaleString()}</span>
                    <span>Limit: ${acc.limit.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(acc.balance / acc.limit) * 100}%`, backgroundColor: acc.balance / acc.limit > 0.3 ? "#D97706" : "#16A34A" }} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "inquiries" && (
        <div className="mx-4 space-y-3">
          <div className="bg-[#EDE9FF] rounded-2xl p-4">
            <p className="text-sm font-bold text-[#7B4FFF]">Only hard inquiries affect your score.</p>
            <p className="text-xs text-[#7B4FFF] opacity-80 mt-1">Soft inquiries (like checking your own score) have no impact.</p>
          </div>
          {INQUIRIES.map((inq, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-bold text-gray-900 text-sm">{inq.lender}</p>
                <p className="text-xs text-gray-500">{inq.date}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inq.type === "Hard" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                {inq.type}
              </span>
            </div>
          ))}
          <p className="text-xs text-center text-gray-400 py-2">No hard inquiries in the last 12 months</p>
        </div>
      )}
    </div>
  );
}
