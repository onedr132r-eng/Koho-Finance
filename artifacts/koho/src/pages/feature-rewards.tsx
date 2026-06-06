import { useState } from "react";
import { Gift, Star, Zap, Check, Trophy, ArrowRight, X } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const REWARD_HISTORY = [
  { id: "1", type: "earned", title: "Cashback — May 2026", amount: 2.35, date: "Jun 1", icon: Zap, color: "#CA8A04", bg: "#FEF9C3" },
  { id: "2", type: "earned", title: "Referral bonus — David R.", amount: 20.00, date: "May 29", icon: Gift, color: "#7B4FFF", bg: "#EDE9FF" },
  { id: "3", type: "redeemed", title: "Redeemed for account credit", amount: -15.00, date: "May 20", icon: ArrowRight, color: "#16A34A", bg: "#DCFCE7" },
  { id: "4", type: "earned", title: "Cashback — Apr 2026", amount: 3.10, date: "May 1", icon: Zap, color: "#CA8A04", bg: "#FEF9C3" },
  { id: "5", type: "earned", title: "Partner offer — Borrowell", amount: 5.00, date: "Apr 25", icon: Star, color: "#D97706", bg: "#FEF3C7" },
  { id: "6", type: "earned", title: "Referral bonus — Priya K.", amount: 20.00, date: "Apr 18", icon: Gift, color: "#7B4FFF", bg: "#EDE9FF" },
  { id: "7", type: "redeemed", title: "Redeemed for account credit", amount: -25.00, date: "Apr 1", icon: ArrowRight, color: "#16A34A", bg: "#DCFCE7" },
  { id: "8", type: "earned", title: "Cashback — Mar 2026", amount: 1.85, date: "Apr 1", icon: Zap, color: "#CA8A04", bg: "#FEF9C3" },
];

const REDEEM_OPTIONS = [
  { id: "balance", name: "Add to balance", min: 1, icon: "💳", desc: "Instantly added to your KOHO account" },
  { id: "gift-card", name: "Gift cards", min: 10, icon: "🎁", desc: "Amazon, Tim Hortons, Starbucks & more" },
  { id: "invest", name: "Invest it", min: 5, icon: "📈", desc: "Transfer to your Wealthsimple account" },
  { id: "donate", name: "Donate", min: 1, icon: "❤️", desc: "Support a Canadian charity of your choice" },
];

const BALANCE = 32.30;

export default function Rewards() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRedeem, setSelectedRedeem] = useState<string | null>(null);
  const [redeemAmount, setRedeemAmount] = useState("10.00");
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const handleRedeem = () => {
    setRedeemSuccess(true);
    setTimeout(() => {
      setRedeemSuccess(false);
      setShowModal(false);
      setSelectedRedeem(null);
      setRedeemAmount("10.00");
    }, 2200);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-24 relative">
      <PageHeader title="Rewards" />

      {/* Balance card */}
      <div className="mx-4 mb-4 bg-[#7B4FFF] rounded-3xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1">Rewards balance</p>
            <p className="text-4xl font-black">${BALANCE.toFixed(2)}</p>
            <p className="text-sm opacity-80 mt-1">Earned since joining KOHO</p>
          </div>
          <Trophy className="w-10 h-10 opacity-30" />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 bg-white text-[#7B4FFF] font-black text-sm py-2.5 rounded-xl"
          >
            Redeem
          </button>
          <button className="flex-1 bg-white/20 text-white font-black text-sm py-2.5 rounded-xl">
            Share
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4 flex gap-3">
        <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm text-center">
          <p className="text-2xl font-black text-[#7B4FFF]">$57.30</p>
          <p className="text-[10px] text-gray-500 font-bold mt-0.5">Total earned</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm text-center">
          <p className="text-2xl font-black text-[#7B4FFF]">3</p>
          <p className="text-[10px] text-gray-500 font-bold mt-0.5">Referrals</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm text-center">
          <p className="text-2xl font-black text-[#7B4FFF]">2.3%</p>
          <p className="text-[10px] text-gray-500 font-bold mt-0.5">Avg cashback</p>
        </div>
      </div>

      {/* History */}
      <div className="px-4">
        <h3 className="font-black text-gray-900 mb-3">History</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-50">
          {REWARD_HISTORY.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
                <span className={`font-black text-sm ${item.amount > 0 ? "text-green-600" : "text-gray-500"}`}>
                  {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeem Modal (bottom sheet) */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => !redeemSuccess && setShowModal(false)}
          />

          {/* Bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-hidden" style={{ maxWidth: 430, margin: "0 auto" }}>
            {redeemSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-black text-xl text-gray-900 mb-1">Redeemed!</p>
                <p className="text-3xl font-black text-[#7B4FFF] my-2">${parseFloat(redeemAmount).toFixed(2)}</p>
                <p className="text-sm text-gray-500">added to your KOHO balance</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div>
                    <p className="font-black text-gray-900 text-lg">Redeem rewards</p>
                    <p className="text-xs text-gray-500 mt-0.5">Available: <strong className="text-[#7B4FFF]">${BALANCE.toFixed(2)}</strong></p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Amount input */}
                <div className="px-5 pb-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xl">$</span>
                    <input
                      type="number"
                      value={redeemAmount}
                      onChange={e => setRedeemAmount(e.target.value)}
                      max={BALANCE}
                      className="w-full border-2 border-[#7B4FFF] rounded-xl pl-9 pr-4 py-3 font-black text-2xl focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">Max: ${BALANCE.toFixed(2)}</p>
                </div>

                {/* Options */}
                <div className="px-5 pb-3 space-y-2">
                  {REDEEM_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedRedeem(opt.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                      style={selectedRedeem === opt.id
                        ? { backgroundColor: "#EDE9FF", border: "2px solid #7B4FFF" }
                        : { backgroundColor: "#F9FAFB", border: "2px solid transparent" }}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{opt.name}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedRedeem === opt.id ? "border-[#7B4FFF] bg-[#7B4FFF]" : "border-gray-300"}`}>
                        {selectedRedeem === opt.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="px-5 pb-6">
                  <button
                    onClick={handleRedeem}
                    disabled={!selectedRedeem || parseFloat(redeemAmount) <= 0}
                    className="w-full py-4 rounded-2xl font-black text-white disabled:opacity-40"
                    style={{ backgroundColor: "#7B4FFF" }}
                  >
                    Redeem ${parseFloat(redeemAmount || "0").toFixed(2)}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
