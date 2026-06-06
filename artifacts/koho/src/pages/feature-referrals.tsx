import { useState } from "react";
import { Gift, Copy, Check, ChevronRight, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const REFERRAL_CODE = "KOHO-AMINE47";
const REFERRAL_LINK = `https://koho.ca/refer?code=${REFERRAL_CODE}`;

const REFERRED = [
  { name: "David R.", joined: "May 29", status: "active", bonus: 20 },
  { name: "Priya K.", joined: "Apr 18", status: "active", bonus: 20 },
  { name: "Sophie L.", joined: "Mar 5", status: "pending", bonus: 0 },
];

export default function Referrals() {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const copy = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalEarned = REFERRED.filter(r => r.status === "active").reduce((s, r) => s + r.bonus, 0);

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24">
      <PageHeader title="Refer a Friend" />

      {/* Hero */}
      <div className="mx-4 mb-4 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #3B1F8C 0%, #7B4FFF 100%)" }}>
        <div className="p-5 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black mb-1">Give $20, Get $20</h2>
          <p className="text-sm opacity-80 leading-relaxed">
            Share KOHO with friends. When they make their first purchase, you both get $20 in your accounts.
          </p>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
              <p className="font-black text-xl">${totalEarned}</p>
              <p className="text-[10px] opacity-80 font-bold">Earned</p>
            </div>
            <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
              <p className="font-black text-xl">{REFERRED.filter(r => r.status === "active").length}</p>
              <p className="text-[10px] opacity-80 font-bold">Referrals</p>
            </div>
            <div className="flex-1 bg-white/20 rounded-xl p-3 text-center">
              <p className="font-black text-xl">{REFERRED.filter(r => r.status === "pending").length}</p>
              <p className="text-[10px] opacity-80 font-bold">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral code */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-black text-gray-900">Your referral code</h3>
        <div className="flex items-center justify-between bg-[#F5F3FF] rounded-xl px-4 py-3">
          <span className="font-black text-[#7B4FFF] text-lg tracking-wider">{REFERRAL_CODE}</span>
          <button onClick={() => copy(REFERRAL_CODE, "code")} className="flex items-center gap-1.5 text-sm font-bold text-[#7B4FFF]">
            {copied === "code" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied === "code" ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => copy(REFERRAL_LINK, "link")}
            className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-[#7B4FFF] text-[#7B4FFF] flex items-center justify-center gap-2"
          >
            {copied === "link" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === "link" ? "Link copied!" : "Copy link"}
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Join KOHO!", text: `Use my code ${REFERRAL_CODE} and we both get $20!`, url: REFERRAL_LINK });
              }
            }}
            className="flex-1 py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "#7B4FFF" }}
          >
            Share invite
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-4 mb-4 bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-black text-gray-900 mb-4">How it works</h3>
        <div className="space-y-3">
          {[
            { step: "1", text: "Share your unique code or link with a friend" },
            { step: "2", text: "They sign up for KOHO and enter your code" },
            { step: "3", text: "They make their first purchase" },
            { step: "4", text: "You both get $20 deposited instantly" },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 text-white" style={{ backgroundColor: "#7B4FFF" }}>{s.step}</div>
              <p className="text-sm text-gray-700 font-medium pt-0.5">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referred friends */}
      {REFERRED.length > 0 && (
        <div className="mx-4">
          <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" /> Your referrals
          </h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50">
            {REFERRED.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0" style={{ backgroundColor: r.status === "active" ? "#7B4FFF" : "#D1D5DB" }}>
                  {r.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">Joined {r.joined}</p>
                </div>
                {r.status === "active" ? (
                  <span className="text-sm font-black text-green-600">+${r.bonus}</span>
                ) : (
                  <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3 pb-2">Pending: friend has signed up but hasn't made a purchase yet</p>
        </div>
      )}
    </div>
  );
}
