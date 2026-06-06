import { PageHeader } from "@/components/layout/page-header";
import { useGetSavings, useGetAccount, useGetRecentTransactions } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, Plus, Minus, TrendingUp, X, Clock, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

function DepositModal({ vault, spendable, onClose, onSuccess }: { vault: number; spendable: number; onClose: () => void; onSuccess: (newVault: number) => void }) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const max = Math.max(0, spendable);

  const handle = async () => {
    if (value <= 0) return;
    setLoading(true);
    const r = await fetch("/api/vault/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: value }),
    });
    setLoading(false);
    if (r.ok) {
      const data = await r.json();
      onSuccess(data.vault);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add to Vault</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount to add</p>
          <h3 className="text-5xl font-bold text-gray-900">{fmt(value)}</h3>
          <p className="text-xs text-gray-400 mt-2">Available: {fmt(spendable)}</p>
        </div>
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={max}
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
          {[25, 50, 100].filter(v => v <= max).map(v => (
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
          {loading ? "Processing…" : `Add ${fmt(value)} to Vault`}
        </button>
      </div>
    </div>
  );
}

function WithdrawModal({ vault, onClose, onSuccess }: { vault: number; onClose: () => void; onSuccess: (newVault: number) => void }) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (value <= 0) return;
    setLoading(true);
    const r = await fetch("/api/vault/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: value }),
    });
    setLoading(false);
    if (r.ok) {
      const data = await r.json();
      onSuccess(data.vault);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Withdraw from Vault</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Amount to withdraw</p>
          <h3 className="text-5xl font-bold text-gray-900">{fmt(value)}</h3>
          <p className="text-xs text-gray-400 mt-2">Vault balance: {fmt(vault)}</p>
        </div>
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={Math.max(0, vault)}
            step={1}
            value={value}
            onChange={e => setValue(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>{fmt(vault)}</span>
          </div>
        </div>
        <button
          onClick={handle}
          disabled={value <= 0 || loading}
          className="w-full py-4 bg-white text-gray-900 font-bold rounded-2xl border-2 border-gray-200 disabled:opacity-40"
        >
          {loading ? "Processing…" : `Withdraw ${fmt(value)} to Spendable`}
        </button>
      </div>
    </div>
  );
}

export default function VaultPage() {
  const { data: savings, isLoading: savingsLoading } = useGetSavings();
  const { data: account, isLoading: accountLoading } = useGetAccount();
  const { data: recentTx } = useGetRecentTransactions();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [localVault, setLocalVault] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  if (savingsLoading || accountLoading) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  const vaultBalance = localVault ?? (savings?.vault ?? 0);
  const spendable = account?.spendableBalance ?? 0;
  const rate = savings?.interestRate ?? 2;
  const monthlyInterest = (vaultBalance * rate) / 100 / 12;

  const vaultHistory = (recentTx ?? [])
    .filter(t => t.category === "Vault" || t.category === "Savings")
    .slice(0, 6);

  const onDepositSuccess = (newVault: number) => {
    setLocalVault(newVault);
    setShowDeposit(false);
    queryClient.invalidateQueries();
  };
  const onWithdrawSuccess = (newVault: number) => {
    setLocalVault(newVault);
    setShowWithdraw(false);
    queryClient.invalidateQueries();
  };

  return (
    <>
      {showDeposit && (
        <DepositModal
          vault={vaultBalance}
          spendable={spendable}
          onClose={() => setShowDeposit(false)}
          onSuccess={onDepositSuccess}
        />
      )}
      {showWithdraw && (
        <WithdrawModal
          vault={vaultBalance}
          onClose={() => setShowWithdraw(false)}
          onSuccess={onWithdrawSuccess}
        />
      )}

      <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
        <PageHeader title="Vault" />

        <div className="p-4 space-y-4">
          <div className="text-center pt-4 pb-2">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Vault Balance</h2>
            <h1 className="text-5xl font-bold text-gray-900 mb-2 transition-all">{fmt(vaultBalance)}</h1>
            <p className="text-xs text-gray-400 font-medium">Earning {rate}% APY</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDeposit(true)}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" /> Add
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              disabled={vaultBalance <= 0}
              className="flex-1 py-3 bg-white text-gray-900 font-bold border border-gray-200 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              <Minus className="w-5 h-5" /> Withdraw
            </button>
          </div>

          {vaultBalance > 0 && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Interest projection</h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "This month", value: monthlyInterest },
                  { label: "6 months", value: monthlyInterest * 6 },
                  { label: "1 year", value: vaultBalance * rate / 100 },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="font-bold text-green-600">+{fmt(value)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Based on current {rate}% APY rate</p>
            </div>
          )}

          {vaultHistory.length > 0 && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-gray-900">Vault activity</h3>
              </div>
              <div className="space-y-3 divide-y divide-gray-50">
                {vaultHistory.map(tx => (
                  <div key={tx.id} className="flex items-center gap-3 pt-3 first:pt-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tx.isCredit ? "bg-green-100" : "bg-purple-100"}`}>
                      {tx.isCredit
                        ? <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        : <ArrowUpRight className="w-4 h-4 text-purple-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{tx.merchant}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                    <span className={`font-bold text-sm ${tx.isCredit ? "text-green-600" : "text-gray-700"}`}>
                      {tx.isCredit ? "+" : "-"}{fmt(Number(tx.amount))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#F0EEFF] rounded-3xl p-6 text-center">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Hide it away</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Money in your Vault can't be spent with your card. It's a safe place to stash funds you want to protect from accidental spending — and it earns interest while it's there.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
