import { PageHeader } from "@/components/layout/page-header";
import { useGetCover } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ChevronRight, X, Check, CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const AMOUNTS = [25, 50, 100, 150];
const REPAYMENT_METHODS = [
  { id: "spendable", label: "Spendable balance", icon: <Wallet className="w-5 h-5" /> },
  { id: "card", label: "Linked debit card", icon: <CreditCard className="w-5 h-5" /> },
];

type ActivationStep = "amount" | "repayment" | "terms" | "success";

function ActivationSheet({ onClose, onDone }: { onClose: () => void; onDone: (limit: number) => void }) {
  const [step, setStep] = useState<ActivationStep>("amount");
  const [coverAmount, setCoverAmount] = useState<number | null>(null);
  const [repayment, setRepayment] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!coverAmount) return;
    setLoading(true);
    const r = await fetch("/api/cover/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: coverAmount }),
    });
    setLoading(false);
    if (r.ok) {
      setStep("success");
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
        {step === "success" ? (
          <div className="p-8 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
              <Shield className="w-10 h-10 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Cover Activated!</h2>
              <p className="text-gray-500">You're covered for up to <span className="font-bold text-gray-800">{fmt(coverAmount!)}</span></p>
            </div>
            <button onClick={() => { onDone(coverAmount!); onClose(); }} className="w-full py-4 bg-primary text-white font-bold rounded-2xl">Done</button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Step {step === "amount" ? "1" : step === "repayment" ? "2" : "3"} of 3
                </p>
                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {step === "amount" ? "Choose your limit" : step === "repayment" ? "Repayment method" : "Review & agree"}
                </h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {step === "amount" && (
              <>
                <p className="text-sm text-gray-500 mb-5">Select how much coverage you want when your spendable balance runs low.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCoverAmount(amt)}
                      className={`py-5 rounded-2xl font-bold text-lg transition-all ${coverAmount === amt ? "bg-teal-500 text-white shadow-sm" : "bg-gray-50 text-gray-900 border-2 border-transparent hover:border-gray-200"}`}
                    >
                      {fmt(amt)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep("repayment")}
                  disabled={!coverAmount}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl disabled:opacity-40"
                >
                  Next
                </button>
              </>
            )}

            {step === "repayment" && (
              <>
                <p className="text-sm text-gray-500 mb-5">How should we automatically repay Cover when funds are available?</p>
                <div className="space-y-3 mb-6">
                  {REPAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setRepayment(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${repayment === m.id ? "bg-teal-50 border-2 border-teal-500" : "bg-gray-50 border-2 border-transparent"}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${repayment === m.id ? "bg-teal-100 text-teal-600" : "bg-gray-200 text-gray-500"}`}>
                        {m.icon}
                      </div>
                      <span className="font-bold text-gray-900">{m.label}</span>
                      {repayment === m.id && <Check className="w-5 h-5 text-teal-500 ml-auto" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep("terms")}
                  disabled={!repayment}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl disabled:opacity-40"
                >
                  Next
                </button>
              </>
            )}

            {step === "terms" && (
              <>
                <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-sm text-gray-600 leading-relaxed space-y-2">
                  <p>Cover is a short-term credit facility provided by KOHO Financial Inc. By activating Cover, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Cover limit of <strong>{fmt(coverAmount!)}</strong></li>
                    <li>Automatic repayment via <strong>{REPAYMENT_METHODS.find(m => m.id === repayment)?.label}</strong></li>
                    <li>No interest charged on Cover usage</li>
                    <li>Cover does not affect your credit score</li>
                  </ul>
                </div>
                <button
                  onClick={() => setAgreed(!agreed)}
                  className="flex items-center gap-3 w-full mb-6"
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${agreed ? "bg-primary border-primary" : "border-gray-300"}`}>
                    {agreed && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-left">I agree to the Cover terms & conditions</span>
                </button>
                <button
                  onClick={handleActivate}
                  disabled={!agreed || loading}
                  className="w-full py-4 bg-teal-500 text-white font-bold rounded-2xl disabled:opacity-40"
                >
                  {loading ? "Activating…" : "Activate Cover"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoverPage() {
  const { data: cover, isLoading } = useGetCover();
  const [showActivation, setShowActivation] = useState(false);
  const [localLimit, setLocalLimit] = useState<number | null>(null);
  const [localAvailable, setLocalAvailable] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  if (isLoading) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  const limit = localLimit ?? (cover?.limit || 0);
  const available = localAvailable ?? (cover?.available || 0);
  const used = limit - available;
  const percentUsed = limit ? (used / limit) * 100 : 0;
  const isActive = limit > 0;

  const COVER_HISTORY = [
    { date: "May 28, 2026", amount: 23.50, repaid: true },
    { date: "Apr 12, 2026", amount: 45.00, repaid: true },
    { date: "Mar 3, 2026",  amount: 15.75, repaid: true },
  ];

  return (
    <>
      {showActivation && (
        <ActivationSheet
          onClose={() => setShowActivation(false)}
          onDone={(newLimit) => {
            setLocalLimit(newLimit);
            setLocalAvailable(newLimit);
            queryClient.invalidateQueries();
          }}
        />
      )}

      <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
        <PageHeader title="Cover" />

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Available to use</h2>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{fmt(available)}</h1>

            {isActive ? (
              <>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${percentUsed}%` }} />
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>{fmt(used)} used</span>
                  <span>{fmt(limit)} limit</span>
                </div>
                <button
                  onClick={() => setShowActivation(true)}
                  className="mt-4 text-sm font-bold text-primary"
                >
                  Change limit
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowActivation(true)}
                className="w-full py-3.5 bg-teal-500 text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity"
              >
                Activate Cover
              </button>
            )}
          </div>

          {isActive && COVER_HISTORY.length > 0 && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Cover history</h3>
              <div className="divide-y divide-gray-50">
                {COVER_HISTORY.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{h.date}</p>
                      <p className="text-xs text-gray-400">{h.repaid ? "Repaid" : "Outstanding"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{fmt(h.amount)}</p>
                      <p className={`text-xs font-medium ${h.repaid ? "text-green-600" : "text-orange-500"}`}>
                        {h.repaid ? "✓ Repaid" : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#F0EEFF] rounded-3xl p-6 text-center">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Peace of mind</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cover gives you a buffer for unexpected expenses. If you don't have enough in your spendable balance, we've got you covered — interest free.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
