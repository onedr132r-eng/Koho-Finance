import { PageHeader } from "@/components/layout/page-header";
import { useListGoals } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Plus, ChevronRight, X, Check } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const ICONS = ["🎯","✈️","🏠","🚗","💻","🎓","💍","🏖️","🎸","🐾"];

function CreateGoalSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    if (!name || !targetAmount) return;
    setLoading(true);
    const r = await fetch("/api/savings/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, targetAmount: parseFloat(targetAmount), emoji, deadline: deadline || null }),
    });
    setLoading(false);
    if (r.ok) {
      queryClient.invalidateQueries();
      setSuccess(true);
      setTimeout(onClose, 1200);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
        <div className="w-full bg-white rounded-t-3xl p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Goal created!</h2>
          <p className="text-gray-500 text-sm">"{name}" has been added to your goals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create a goal</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Goal name</label>
              <input
                type="text"
                placeholder="e.g., Dream vacation"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Target amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={e => setTargetAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Target date (optional)</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Pick an icon</label>
              <div className="grid grid-cols-5 gap-2">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setEmoji(icon)}
                    className={`h-12 text-2xl rounded-2xl flex items-center justify-center transition-colors ${emoji === icon ? "bg-primary/10 border-2 border-primary" : "bg-gray-50 border-2 border-transparent"}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!name || !targetAmount || loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl mt-6 disabled:opacity-40"
          >
            {loading ? "Creating…" : "Create goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { data: goals, isLoading } = useListGoals();
  const [showCreate, setShowCreate] = useState(false);

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  if (isLoading) return <div className="h-full bg-gray-50"><Skeleton className="w-full h-full" /></div>;

  return (
    <>
      {showCreate && <CreateGoalSheet onClose={() => setShowCreate(false)} />}

      <div className="h-full overflow-y-auto bg-gray-50 flex flex-col pb-24">
        <PageHeader title="Goals" rightContent={
          <button
            onClick={() => setShowCreate(true)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <Plus className="w-5 h-5 text-gray-800" />
          </button>
        } />

        <div className="p-4 space-y-4">
          {goals && goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map(goal => {
                const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                return (
                  <Link key={goal.id} href={`/goals/${goal.id}`} className="block bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-xl">
                          {goal.emoji}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">{goal.name}</h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2 flex justify-between items-end">
                      <span className="font-bold text-gray-900 text-xl">{fmt(goal.currentAmount)}</span>
                      <span className="text-sm font-medium text-gray-500">of {fmt(goal.targetAmount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{Math.round(percent)}% complete{goal.deadline ? ` · Due ${goal.deadline}` : ""}</p>
                  </Link>
                );
              })}
              <button
                onClick={() => setShowCreate(true)}
                className="w-full py-3.5 bg-white border-2 border-dashed border-gray-200 text-gray-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add another goal
              </button>
            </div>
          ) : (
            <div className="text-center pt-12 pb-6 px-4">
              <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                🎯
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set a goal</h2>
              <p className="text-gray-500 mb-8 max-w-[250px] mx-auto">Save up for a vacation, a new gadget, or an emergency fund.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity"
              >
                Create a goal
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
