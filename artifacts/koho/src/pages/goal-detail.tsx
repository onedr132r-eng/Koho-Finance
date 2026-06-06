import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus, X, Target, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
  deadline?: string | null;
}

function DepositModal({ goal, spendable, onClose, onSuccess }: {
  goal: Goal; spendable: number; onClose: () => void; onSuccess: (current: number) => void;
}) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const max = Math.min(spendable, goal.targetAmount - goal.currentAmount);
  const fmt = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  const handle = async () => {
    if (value <= 0) return;
    setLoading(true);
    const r = await fetch(`/api/savings/goals/${goal.id}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: value }),
    });
    setLoading(false);
    if (r.ok) {
      const data = await r.json();
      onSuccess(data.currentAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add to {goal.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount to add</p>
          <h3 className="text-5xl font-bold text-gray-900">{fmt(value)}</h3>
          <p className="text-xs text-gray-400 mt-2">Available from spendable: {fmt(spendable)}</p>
        </div>
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={Math.max(0, max)}
            step={1}
            value={value}
            onChange={e => setValue(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>{fmt(max)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[10, 25, 50].filter(v => v <= max).map(v => (
            <button key={v} onClick={() => setValue(v)} className={`py-2 rounded-xl text-sm font-bold transition-colors ${value === v ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}>
              ${v}
            </button>
          ))}
        </div>
        <button
          onClick={handle}
          disabled={value <= 0 || loading}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl disabled:opacity-40"
        >
          {loading ? "Adding…" : `Add ${fmt(value)} to Goal`}
        </button>
      </div>
    </div>
  );
}

function WithdrawModal({ goal, onClose, onSuccess }: {
  goal: Goal; onClose: () => void; onSuccess: (current: number) => void;
}) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const fmt = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  const handle = async () => {
    if (value <= 0) return;
    setLoading(true);
    const r = await fetch(`/api/savings/goals/${goal.id}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: value }),
    });
    setLoading(false);
    if (r.ok) {
      const data = await r.json();
      onSuccess(data.currentAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Withdraw from {goal.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount to withdraw</p>
          <h3 className="text-5xl font-bold text-gray-900">{fmt(value)}</h3>
          <p className="text-xs text-gray-400 mt-2">Goal balance: {fmt(goal.currentAmount)}</p>
        </div>
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={Math.max(0, goal.currentAmount)}
            step={1}
            value={value}
            onChange={e => setValue(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>{fmt(goal.currentAmount)}</span>
          </div>
        </div>
        <button
          onClick={handle}
          disabled={value <= 0 || loading}
          className="w-full py-4 bg-white text-gray-900 font-bold rounded-2xl border-2 border-gray-200 disabled:opacity-40"
        >
          {loading ? "Withdrawing…" : `Withdraw ${fmt(value)} to Spendable`}
        </button>
      </div>
    </div>
  );
}

export default function GoalDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [, navigate] = useLocation();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [spendable, setSpendable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      const [goalRes, accountRes] = await Promise.all([
        fetch(`/api/savings/goals/${id}`),
        fetch("/api/account"),
      ]);
      if (!goalRes.ok) { navigate("/goals"); return; }
      const [goalData, accountData] = await Promise.all([goalRes.json(), accountRes.json()]);
      setGoal(goalData);
      setSpendable(accountData.spendableBalance);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const fmt = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  if (loading || !goal) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;

  const projectedMonths = remaining > 0 && goal.currentAmount > 0
    ? Math.ceil(remaining / (goal.currentAmount * 0.1))
    : null;

  const onDepositSuccess = (newCurrent: number) => {
    setGoal(g => g ? { ...g, currentAmount: newCurrent } : g);
    setShowDeposit(false);
    queryClient.invalidateQueries();
  };

  const onWithdrawSuccess = (newCurrent: number) => {
    setGoal(g => g ? { ...g, currentAmount: newCurrent } : g);
    setShowWithdraw(false);
    queryClient.invalidateQueries();
  };

  return (
    <>
      {showDeposit && <DepositModal goal={goal} spendable={spendable} onClose={() => setShowDeposit(false)} onSuccess={onDepositSuccess} />}
      {showWithdraw && <WithdrawModal goal={goal} onClose={() => setShowWithdraw(false)} onSuccess={onWithdrawSuccess} />}

      <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
        <PageHeader title={goal.name} backHref="/goals" />

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-4">{goal.emoji}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-1">{fmt(goal.currentAmount)}</h1>
            <p className="text-sm text-gray-500 font-medium mb-5">of {fmt(goal.targetAmount)} goal</p>

            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 font-medium mb-1">{Math.round(percent)}% complete</p>
            {goal.deadline && <p className="text-xs text-gray-400">Target date: {goal.deadline}</p>}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDeposit(true)}
              disabled={spendable <= 0 || remaining <= 0}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Plus className="w-5 h-5" /> Add money
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              disabled={goal.currentAmount <= 0}
              className="flex-1 py-3 bg-white text-gray-900 font-bold border border-gray-200 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              <Minus className="w-5 h-5" /> Withdraw
            </button>
          </div>

          {remaining > 0 && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Progress details</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Still needed</span>
                  <span className="font-bold text-gray-900">{fmt(remaining)}</span>
                </div>
                {projectedMonths && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Projected completion</span>
                    <span className="font-bold text-gray-900">~{projectedMonths} months</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="font-bold text-primary">{Math.round(percent)}%</span>
                </div>
              </div>
            </div>
          )}

          {percent >= 100 && (
            <div className="bg-green-50 rounded-3xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-bold text-green-700 text-lg">Goal reached!</h3>
              <p className="text-green-600 text-sm mt-1">Congratulations! You hit your target.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
