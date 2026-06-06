import { useGetTransaction } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Clock, Tag, Hash, CheckCircle2, AlertCircle, Timer,
  Share2, RefreshCw, MessageSquare, ShieldAlert, Copy, Check,
  ChevronRight, Receipt, Download, ArrowUpRight, ArrowDownLeft,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const CATEGORY_ICONS: Record<string, string> = {
  "Food & Drink": "🍔",
  "Groceries": "🛒",
  "Shopping": "🛍️",
  "Transport": "🚇",
  "Bills": "📄",
  "Transfer": "↔️",
  "Entertainment": "🎬",
  "Health": "💊",
  "Travel": "✈️",
  "Savings": "🔒",
  "Vault": "🔒",
  "Cashback": "💸",
  "Roundup": "🔄",
};

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wide">Completed</span>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full">
        <Timer className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wide">Scheduled</span>
      </div>
    );
  }
  if (status === "disputed") {
    return (
      <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-xs font-bold uppercase tracking-wide">Disputed</span>
      </div>
    );
  }
  return null;
}

export default function TransactionDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { data: tx, isLoading } = useGetTransaction(Number(id));
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const fmt = (amount?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount ?? 0);

  const copyRef = () => {
    if (!tx) return;
    const ref = `TX-${tx.id.toString().padStart(8, "0")}`;
    navigator.clipboard.writeText(ref).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (isLoading) {
    return (
      <div className="h-full bg-[#F5F3FF] flex flex-col">
        <div className="flex items-center px-4 py-4 bg-transparent">
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-20 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="h-full bg-[#F5F3FF] flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
        <p className="font-bold text-gray-900 text-lg">Transaction not found</p>
        <Link href="/transactions" className="mt-4 text-[#7B4FFF] font-bold text-sm">Back to Activity</Link>
      </div>
    );
  }

  const ref = `TX-${tx.id.toString().padStart(8, "0")}`;
  const catIcon = CATEGORY_ICONS[tx.category] ?? "💳";
  const isCredit = tx.isCredit ?? false;

  return (
    <>
      {showShareSheet && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setShowShareSheet(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
            <h3 className="font-black text-gray-900 text-lg">Share receipt</h3>
            <div className="bg-[#F5F3FF] rounded-2xl p-4 font-mono text-sm space-y-1 text-gray-700">
              <p className="font-bold text-gray-900">{tx.merchant}</p>
              <p>{isCredit ? "+" : "-"}{fmt(tx.amount)}</p>
              <p className="text-gray-500">{tx.date} at {tx.time}</p>
              <p className="text-gray-500">Ref: {ref}</p>
            </div>
            {[
              { label: "Copy receipt text", icon: Copy },
              { label: "Share via…", icon: Share2 },
              { label: "Download PDF", icon: Download },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "Share via…" && navigator.share) {
                    navigator.share({ title: `${tx.merchant} receipt`, text: `${tx.merchant}\n${isCredit ? "+" : "-"}${fmt(tx.amount)}\n${tx.date}\nRef: ${ref}` });
                  } else {
                    navigator.clipboard.writeText(`${tx.merchant}\n${isCredit ? "+" : "-"}${fmt(tx.amount)}\n${tx.date}\nRef: ${ref}`).catch(() => {});
                  }
                  setShowShareSheet(false);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-bold text-gray-900">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-full overflow-y-auto bg-[#F5F3FF] flex flex-col pb-8">
        {/* Header */}
        <div className="flex items-center px-4 py-4">
          <button
            onClick={() => navigate("/transactions")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">Transaction</h1>
          <button
            onClick={() => setShowShareSheet(true)}
            className="ml-auto w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-800" />
          </button>
        </div>

        {/* Hero amount card */}
        <div className="mx-4 mb-4 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md mb-4 relative"
              style={{ backgroundColor: tx.merchantColor ?? "#7B4FFF" }}
            >
              <span className="text-white font-black text-3xl">{tx.merchant.charAt(0)}</span>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm text-base">
                {catIcon}
              </div>
            </div>
            <p className="text-gray-500 font-bold text-sm mb-1">{tx.merchant}</p>
            <p className={`text-5xl font-black tracking-tight mb-3 ${isCredit ? "text-green-600" : "text-gray-900"}`}>
              {isCredit ? "+" : "-"}{fmt(tx.amount)}
            </p>
            <StatusBadge status={tx.status} />
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-3">
              <Clock className="w-3.5 h-3.5" />
              {tx.date} at {tx.time}
            </div>
          </div>
        </div>

        {/* Dispute alert */}
        {tx.status === "disputed" && (
          <div className="mx-4 mb-4 bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Dispute in progress</p>
              <p className="text-xs mt-0.5 opacity-80">Our team is reviewing this. You'll be notified at your registered email when there's an update.</p>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="mx-4 mb-4 grid grid-cols-4 gap-2">
          {[
            { icon: Share2, label: "Share", action: () => setShowShareSheet(true) },
            {
              icon: RefreshCw, label: "Repeat", action: () => {
                if (!isCredit) navigate("/pay-bill");
              }
            },
            { icon: MessageSquare, label: "Note", action: () => setShowNoteInput(v => !v) },
            {
              icon: Receipt, label: "Receipt", action: () => {
                navigator.clipboard.writeText(`${tx.merchant}\n${isCredit ? "+" : "-"}${fmt(tx.amount)}\n${tx.date} at ${tx.time}\nRef: ${ref}`).catch(() => {});
              }
            },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FF] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#7B4FFF]" />
              </div>
              <span className="text-[11px] font-bold text-gray-600">{label}</span>
            </button>
          ))}
        </div>

        {/* Note input */}
        {showNoteInput && (
          <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Personal note</p>
            {savedNote ? (
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-800 font-medium flex-1">{savedNote}</p>
                <button onClick={() => { setSavedNote(""); setNote(""); }} className="text-xs text-gray-400 font-bold">Edit</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Dinner with family…"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  onClick={() => { if (note.trim()) { setSavedNote(note.trim()); setShowNoteInput(false); } }}
                  disabled={!note.trim()}
                  className="px-3 py-2 rounded-xl font-bold text-sm text-white disabled:opacity-40"
                  style={{ backgroundColor: "#7B4FFF" }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transaction details */}
        <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FF] flex items-center justify-center flex-shrink-0 text-base">{catIcon}</div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">Category</p>
              <p className="font-bold text-gray-900">{tx.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FF] flex items-center justify-center flex-shrink-0">
              {isCredit
                ? <ArrowDownLeft className="w-4 h-4 text-[#7B4FFF]" />
                : <ArrowUpRight className="w-4 h-4 text-[#7B4FFF]" />
              }
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">Type</p>
              <p className="font-bold text-gray-900">{isCredit ? "Credit (incoming)" : "Debit (outgoing)"}</p>
            </div>
          </div>

          <button
            onClick={copyRef}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FF] flex items-center justify-center flex-shrink-0">
              <Hash className="w-4 h-4 text-[#7B4FFF]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-gray-400 font-medium">Reference number</p>
              <p className="font-mono text-sm font-bold text-gray-900">{ref}</p>
            </div>
            {copied
              ? <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              : <Copy className="w-4 h-4 text-gray-400 flex-shrink-0" />
            }
          </button>

          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FF] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-[#7B4FFF]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 font-medium">Date & time</p>
              <p className="font-bold text-gray-900">{tx.date} at {tx.time}</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          <Link
            href="/feature/disputed-transactions"
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span className="font-bold text-red-600">
                {tx.status === "disputed" ? "View dispute status" : "Dispute this transaction"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <button
            onClick={() => setShowShareSheet(true)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-500" />
              <span className="font-bold text-gray-900">Download receipt</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {!isCredit && (
            <Link
              href="/pay-bill"
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-gray-500" />
                <span className="font-bold text-gray-900">Repeat this payment</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-2">
          Need help? <Link href="/feature/support" className="text-[#7B4FFF] font-bold">Contact support</Link>
        </p>
      </div>
    </>
  );
}
