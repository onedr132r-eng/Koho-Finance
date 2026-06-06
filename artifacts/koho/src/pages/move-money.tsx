import { ArrowLeft, Building2, Banknote, FileText, Send, QrCode, Target, Vault, X, ChevronRight, Check } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAccount, useGetSavings } from "@workspace/api-client-react";

type Sheet = "vault" | "goals" | "bank" | null;
type GoalStep = "pick" | "amount";

const BANK_ACCOUNTS = [
  { id: "td", name: "TD Bank", last4: "4821", color: "#2C9E6E" },
  { id: "rbc", name: "RBC Royal Bank", last4: "3357", color: "#003168" },
  { id: "bmo", name: "BMO", last4: "9104", color: "#0079C1" },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

export default function MoveMoney() {
  const [sheet, setSheet] = useState<Sheet>(null);
  const queryClient = useQueryClient();
  const { data: account } = useGetAccount();
  const { data: savings } = useGetSavings();

  const [goals, setGoals] = useState<Array<{ id: number; name: string; targetAmount: number; currentAmount: number; emoji?: string }>>([]);
  useEffect(() => {
    fetch("/api/savings/goals").then(r => r.json()).then(setGoals).catch(() => {});
  }, []);

  const spendable = account?.spendableBalance ?? 0;
  const vaultBalance = savings?.vault ?? 0;

  const closeSheet = () => {
    setSheet(null);
  };

  return (
    <div className="h-full bg-white flex flex-col pb-24 overflow-hidden">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4 flex items-center">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 mr-2">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Move Money</h1>
      </header>

      <div className="p-4 space-y-4 overflow-y-auto">
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Transfer between accounts</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <button
              onClick={() => setSheet("vault")}
              className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mr-4 flex-shrink-0">
                <Vault className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Transfer to Vault</h4>
                <p className="text-xs text-gray-400 mt-0.5">Balance: {fmt(spendable)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

            <button
              onClick={() => setSheet("goals")}
              className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mr-4 flex-shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Transfer to Goals</h4>
                <p className="text-xs text-gray-400 mt-0.5">{goals?.length ?? 0} active {goals?.length === 1 ? "goal" : "goals"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

            <button
              onClick={() => setSheet("bank")}
              className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mr-4 flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Transfer to external bank</h4>
                <p className="text-xs text-gray-400 mt-0.5">1–3 business days</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">Other actions</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <Link href="/add-money" className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Add money</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>

            <Link href="/direct-deposit" className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mr-4">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Direct deposit</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>

            <Link href="/pay-bill" className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mr-4">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Pay a bill</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>

            <Link href="/send-money" className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mr-4">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Send money</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>

            <Link href="/request-money" className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mr-4">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[15px]">Request money</h4>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </Link>
          </div>
        </div>
      </div>

      {sheet === "vault" && (
        <VaultSheet
          spendable={spendable}
          vaultBalance={vaultBalance}
          onClose={closeSheet}
          onSuccess={() => { queryClient.invalidateQueries(); closeSheet(); }}
        />
      )}
      {sheet === "goals" && (
        <GoalsSheet
          spendable={spendable}
          goals={goals ?? []}
          onClose={closeSheet}
          onSuccess={() => { queryClient.invalidateQueries(); closeSheet(); }}
        />
      )}
      {sheet === "bank" && (
        <BankSheet
          spendable={spendable}
          onClose={closeSheet}
          onSuccess={() => { queryClient.invalidateQueries(); closeSheet(); }}
        />
      )}
    </div>
  );
}

function VaultSheet({ spendable, vaultBalance, onClose, onSuccess }: {
  spendable: number;
  vaultBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [direction, setDirection] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const max = direction === "deposit" ? spendable : vaultBalance;
  const capped = Math.min(amount, max);

  const handleTransfer = async () => {
    if (capped <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint = direction === "deposit" ? "/api/vault/deposit" : "/api/vault/withdraw";
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: capped }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setError(data.error ?? "Transfer failed. Please try again.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(onSuccess, 1500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <BottomSheet onClose={onClose} title="Transfer to Vault">
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900 text-xl">{fmt(capped)}</p>
            <p className="text-gray-500 text-sm mt-1">{direction === "deposit" ? "moved to Vault" : "moved to Spendable"}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex bg-gray-100 rounded-2xl p-1">
            {(["deposit", "withdraw"] as const).map(d => (
              <button
                key={d}
                onClick={() => { setDirection(d); setAmount(Math.min(50, direction === "deposit" ? vaultBalance : spendable)); setError(null); }}
                className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${direction === d ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                {d === "deposit" ? "To Vault" : "From Vault"}
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">{fmt(capped)}</p>
            <p className="text-xs text-gray-400 mt-1">
              Available: {fmt(max)}
            </p>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(max, 1)}
            step={1}
            value={Math.min(amount, max)}
            onChange={e => setAmount(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />

          <div className="flex gap-2">
            {[25, 50, 100, 200].map(p => (
              <button
                key={p}
                onClick={() => setAmount(Math.min(p, max))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${capped === Math.min(p, max) && amount === p ? "border-primary text-primary bg-primary/5" : "border-gray-200 text-gray-600 bg-gray-50"}`}
              >
                ${p}
              </button>
            ))}
          </div>

          {error && <div className="bg-red-50 rounded-2xl p-3"><p className="text-sm text-red-700 font-medium">{error}</p></div>}

          <button
            onClick={handleTransfer}
            disabled={loading || capped <= 0}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? "Transferring…" : `Transfer ${fmt(capped)}`}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}

function GoalsSheet({ spendable, goals, onClose, onSuccess }: {
  spendable: number;
  goals: Array<{ id: number; name: string; targetAmount: number; currentAmount: number; emoji?: string }>;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<GoalStep>("pick");
  const [selectedGoal, setSelectedGoal] = useState<typeof goals[0] | null>(null);
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const max = spendable;
  const capped = Math.min(amount, max);

  const handleDeposit = async () => {
    if (!selectedGoal || capped <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/savings/goals/${selectedGoal.id}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: capped }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setError(data.error ?? "Deposit failed. Please try again.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(onSuccess, 1500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      onClose={onClose}
      title={step === "pick" ? "Choose a goal" : `Add to ${selectedGoal?.name}`}
      onBack={step === "amount" ? () => { setStep("pick"); setError(null); } : undefined}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-center">
            <p className="text-3xl">{selectedGoal?.emoji ?? "🎯"}</p>
            <p className="font-bold text-gray-900 text-xl mt-2">{fmt(capped)} added</p>
            <p className="text-gray-500 text-sm mt-1">to {selectedGoal?.name}</p>
          </div>
        </div>
      ) : step === "pick" ? (
        <div className="space-y-2">
          {goals.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500 text-sm">No goals yet. Create one from the Goals page.</p>
            </div>
          ) : goals.map(g => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            return (
              <button
                key={g.id}
                onClick={() => { setSelectedGoal(g); setStep("amount"); }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {g.emoji ?? "🎯"}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 text-sm">{g.name}</p>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{fmt(g.currentAmount)} / {fmt(g.targetAmount)} · {pct}%</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">{fmt(capped)}</p>
            <p className="text-xs text-gray-400 mt-1">Available: {fmt(max)}</p>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(max, 1)}
            step={1}
            value={Math.min(amount, max)}
            onChange={e => setAmount(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />

          <div className="flex gap-2">
            {[25, 50, 100, 200].map(p => (
              <button
                key={p}
                onClick={() => setAmount(Math.min(p, max))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${capped === Math.min(p, max) && amount === p ? "border-primary text-primary bg-primary/5" : "border-gray-200 text-gray-600 bg-gray-50"}`}
              >
                ${p}
              </button>
            ))}
          </div>

          {error && <div className="bg-red-50 rounded-2xl p-3"><p className="text-sm text-red-700 font-medium">{error}</p></div>}

          <button
            onClick={handleDeposit}
            disabled={loading || capped <= 0}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? "Depositing…" : `Add ${fmt(capped)} to ${selectedGoal?.name}`}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}

function BankSheet({ spendable, onClose, onSuccess }: {
  spendable: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"pick" | "amount">("pick");
  const [selectedBank, setSelectedBank] = useState<typeof BANK_ACCOUNTS[0] | null>(null);
  const [amount, setAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleNumber = (n: string) => {
    if (n === "." && amount.includes(".")) return;
    setAmount(prev => prev === "0" && n !== "." ? n : prev + n);
  };
  const handleDel = () => setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");

  const parsedAmount = parseFloat(amount);
  const isOver = parsedAmount > spendable;

  const handleTransfer = async () => {
    if (!selectedBank || parsedAmount <= 0 || isOver) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: `${selectedBank.name} ••••${selectedBank.last4}`,
          amount: parsedAmount,
          category: "Transfer",
          isCredit: false,
          merchantColor: selectedBank.color,
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setError(data.error ?? "Transfer failed. Please try again.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(onSuccess, 1800);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      onClose={onClose}
      title={step === "pick" ? "Choose bank account" : `Transfer to ${selectedBank?.name}`}
      onBack={step === "amount" ? () => { setStep("pick"); setError(null); } : undefined}
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900 text-xl">{fmt(parsedAmount)}</p>
            <p className="text-gray-500 text-sm mt-1">sent to {selectedBank?.name} ••••{selectedBank?.last4}</p>
            <p className="text-xs text-gray-400 mt-1">Arrives in 1–3 business days</p>
          </div>
        </div>
      ) : step === "pick" ? (
        <div className="space-y-2">
          {BANK_ACCOUNTS.map(bank => (
            <button
              key={bank.id}
              onClick={() => { setSelectedBank(bank); setStep("amount"); }}
              className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: bank.color }}>
                {bank.name[0]}
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-gray-900 text-sm">{bank.name}</p>
                <p className="text-xs text-gray-400">••••{bank.last4}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-5xl font-bold transition-colors ${isOver ? "text-red-500" : "text-gray-900"}`}>
              ${amount}
            </div>
            <p className={`text-xs mt-2 font-medium ${isOver ? "text-red-500" : "text-gray-400"}`}>
              {isOver ? `Exceeds available balance (${fmt(spendable)})` : `Available: ${fmt(spendable)}`}
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-3 text-center">
            <p className="text-xs text-blue-700 font-medium">
              Transferring to <span className="font-bold">{selectedBank?.name} ••••{selectedBank?.last4}</span> · 1–3 business days
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map(k => (
              <button
                key={k}
                onClick={() => k === "⌫" ? handleDel() : handleNumber(k)}
                className="py-4 text-xl font-semibold text-gray-900 rounded-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                {k}
              </button>
            ))}
          </div>

          {error && <div className="bg-red-50 rounded-2xl p-3"><p className="text-sm text-red-700 font-medium">{error}</p></div>}

          <button
            onClick={handleTransfer}
            disabled={loading || parsedAmount <= 0 || isOver}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {loading ? "Sending…" : `Send ${parsedAmount > 0 ? fmt(parsedAmount) : ""}`}
          </button>
        </div>
      )}
    </BottomSheet>
  );
}

function BottomSheet({ children, title, onClose, onBack }: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl shadow-xl max-h-[85%] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          {onBack ? (
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
          ) : <div className="w-8" />}
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
