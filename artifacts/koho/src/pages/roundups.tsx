import { PageHeader } from "@/components/layout/page-header";
import { useGetSavings } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw, Zap } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const ROUND_LEVELS = [
  { label: "Nearest $1", value: 1 },
  { label: "Nearest $2", value: 2 },
  { label: "Nearest $5", value: 5 },
];

export default function RoundUpsPage() {
  const { data: savings, isLoading } = useGetSavings();
  const [enabled, setEnabled] = useState(true);
  const [roundLevel, setRoundLevel] = useState(1);
  const [cashing, setCashing] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [rounding, setRounding] = useState(false);
  const [roundedMsg, setRoundedMsg] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  const handleRoundNow = async () => {
    if (!enabled) return;
    setRounding(true);
    setRoundedMsg(null);
    try {
      const r = await fetch("/api/roundups/round-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundLevel }),
      });
      if (r.ok) {
        const data = await r.json();
        const rounded = parseFloat(data.roundedUp ?? 0).toFixed(2);
        setRoundedMsg(`+$${rounded} added to RoundUps!`);
        queryClient.invalidateQueries();
        setTimeout(() => setRoundedMsg(null), 3000);
      }
    } finally {
      setRounding(false);
    }
  };

  const handleCashOut = async () => {
    if (!savings?.roundups || savings.roundups <= 0) return;
    setCashing(true);
    try {
      const r = await fetch("/api/roundups/cashout", { method: "POST" });
      if (r.ok) {
        setCashedOut(true);
        queryClient.invalidateQueries();
        setTimeout(() => setCashedOut(false), 3000);
      }
    } finally {
      setCashing(false);
    }
  };

  if (isLoading) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  const balance = savings?.roundups ?? 0;

  return (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
      <PageHeader title="RoundUps" />

      <div className="p-4 space-y-4">
        <div className="text-center pt-4 pb-2">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h2 className="text-sm font-medium text-gray-500 mb-1">RoundUps Balance</h2>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">{fmt(balance)}</h1>
          {balance > 0 && (
            <button
              onClick={handleCashOut}
              disabled={cashing}
              className="text-primary font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {cashedOut ? "✓ Moved to Spendable!" : cashing ? "Processing…" : "Cash out to Spendable"}
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-[15px] mb-1">Enable RoundUps</h3>
            <p className="text-[13px] text-gray-500">Automatically save spare change</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? "bg-primary" : "bg-gray-200"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${enabled ? "left-6" : "left-1"}`} />
          </button>
        </div>

        {enabled && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-[15px] mb-3">Round up to the</h3>
            <div className="space-y-2">
              {ROUND_LEVELS.map(level => (
                <button
                  key={level.value}
                  onClick={() => setRoundLevel(level.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors ${roundLevel === level.value ? "bg-primary/5 border-2 border-primary" : "bg-gray-50 border-2 border-transparent"}`}
                >
                  <span className={`font-bold text-sm ${roundLevel === level.value ? "text-primary" : "text-gray-700"}`}>
                    {level.label}
                  </span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${roundLevel === level.value ? "border-primary bg-primary" : "border-gray-300"}`}>
                    {roundLevel === level.value && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Each purchase rounds up to the nearest ${roundLevel}, adding the difference to your RoundUps balance.
            </p>
          </div>
        )}

        {enabled && (
          <div className="space-y-2">
            {roundedMsg && (
              <div className="bg-green-50 rounded-2xl px-4 py-3 text-center">
                <p className="text-sm text-green-700 font-bold">{roundedMsg}</p>
              </div>
            )}
            <button
              onClick={handleRoundNow}
              disabled={rounding}
              className="w-full py-3.5 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-primary" />
              {rounding ? "Rounding up…" : "Round up now"}
            </button>
          </div>
        )}

        <div className="bg-[#F0EEFF] rounded-3xl p-6 text-center">
          <h3 className="font-bold text-lg text-gray-900 mb-2">How it works</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Every time you make a purchase, we round up the amount to the nearest ${roundLevel} and stash the spare change here. It adds up faster than you think!
          </p>
        </div>
      </div>
    </div>
  );
}
