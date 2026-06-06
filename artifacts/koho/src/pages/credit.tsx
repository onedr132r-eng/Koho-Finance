import { useState } from "react";
import { useGetCreditProfile } from "@workspace/api-client-react";
import { TrendingUp, ShieldCheck, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const FAQS = [
  {
    q: "What is financial coaching?",
    a: "Financial coaching connects you with a certified advisor who helps you set goals, manage debt, and build healthy money habits — all included with eligible KOHO plans.",
  },
  {
    q: "What's the difference between Credit Building and Secured Credit Building?",
    a: "Credit Building reports your KOHO spending activity to Equifax monthly. Secured Credit Building uses a refundable deposit to open a secured line of credit, giving you a separate tradeline to build history.",
  },
  {
    q: "How long does it take to see my score improve?",
    a: "Most members see movement within 2–3 months of consistent on-time payments and responsible utilization. Results vary by individual credit history.",
  },
  {
    q: "Will checking my score affect it?",
    a: "No — KOHO uses a soft inquiry to pull your Equifax score, which never impacts your credit rating.",
  },
];

export default function Credit() {
  const { data: profile, isLoading } = useGetCreditProfile();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getScoreColor = (s: number) =>
    s >= 760 ? "text-green-500" : s >= 720 ? "text-yellow-500" : s >= 660 ? "text-orange-400" : "text-red-500";

  const getScoreBg = (s: number) =>
    s >= 760 ? "bg-green-50" : s >= 720 ? "bg-yellow-50" : s >= 660 ? "bg-orange-50" : "bg-red-50";

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
        <h1 className="text-lg font-bold text-gray-900 mx-auto">Credit</h1>
      </header>

      {isLoading ? (
        <div className="p-6 space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : profile ? (
        <div className="p-4 space-y-4">
          {/* Score card */}
          <Link
            href="/feature/credit-report"
            className="block bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden hover:bg-gray-50 transition-colors"
          >
            <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {profile.status}
            </div>

            <h2 className="text-sm font-medium text-gray-500 mb-1">Equifax Credit Score</h2>
            <div className="flex justify-center items-end gap-2 mb-2">
              <span className={`text-[4rem] leading-none font-bold tracking-tighter ${getScoreColor(profile.score)}`}>
                {profile.score}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-500 mb-6">
              <TrendingUp className={`w-4 h-4 ${profile.scoreChange >= 0 ? "text-green-500" : "text-red-500 rotate-180"}`} />
              <span className={profile.scoreChange >= 0 ? "text-green-500" : "text-red-500"}>
                {profile.scoreChange >= 0 ? "+" : ""}{profile.scoreChange} pts
              </span>
              <span>since last month</span>
            </div>

            {/* SVG chart */}
            <div className="h-24 w-full flex items-end justify-center mb-4">
              <svg viewBox="0 0 200 60" className="w-full h-full text-green-500" preserveAspectRatio="none">
                <path d="M0,60 L0,40 C50,40 100,20 200,10 L200,60 Z" fill="currentColor" fillOpacity="0.1" />
                <path d="M0,40 C50,40 100,20 200,10" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>

            <p className="text-primary font-bold text-sm">
              See detailed credit report <ChevronRight className="w-4 h-4 inline" />
            </p>
          </Link>

          {/* Ways to build faster */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 px-1">Ways to build faster</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              <Link href="/secured-credit" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Secured Credit Building</h4>
                    <p className="text-sm text-gray-500">Use your own money to build credit</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">Set up</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              <Link href="/rent-reporting" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Rent Reporting</h4>
                    <p className="text-sm text-gray-500">Get credit for paying rent</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">Set up</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            </div>
          </div>

          {/* Score Ranges */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 px-1">Score Ranges</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {profile.ranges.map(range => (
                  <div
                    key={range.label}
                    className={`flex justify-between p-4 ${profile.score >= range.min && profile.score <= range.max ? getScoreBg(range.min) : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: range.color }} />
                      <span className="font-bold text-gray-900">{range.label}</span>
                    </div>
                    <span className="text-gray-500 font-medium">
                      {range.max === 900 ? `${range.min}+` : `${range.min}–${range.max}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ accordion */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 px-1">FAQ</h3>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-sm pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
