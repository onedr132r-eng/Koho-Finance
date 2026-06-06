import { useState, useCallback } from "react";
import { ArrowLeft, Bell, ShieldCheck, Zap, ArrowDownLeft, ArrowUpRight, CreditCard, Star, Gift, AlertCircle, CheckCircle2, ChevronRight, Settings } from "lucide-react";
import { Link } from "wouter";
import { useGetRecentTransactions } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";

type Notif = {
  id: string;
  type: "transaction_in" | "transaction_out" | "etransfer_in" | "etransfer_out" | "credit" | "cover" | "cashback" | "plan" | "system" | "security";
  title: string;
  body: string;
  time: string;
  timeMs: number;
  read: boolean;
  amount?: string;
  merchant?: string;
};

const SYSTEM_NOTIFS: Notif[] = [
  { id: "sys-1", type: "credit", title: "Credit score updated", body: "Your credit score is now 571. Keep building with KOHO!", time: "Just now", timeMs: Date.now(), read: false },
  { id: "sys-2", type: "etransfer_in", title: "e-Transfer received", body: "You received $270.00 from David via Interac e-Transfer.", time: "2h ago", timeMs: Date.now() - 2 * 60 * 60 * 1000, read: false, amount: "+$270.00" },
  { id: "sys-3", type: "cover", title: "Cover is protecting you", body: "Your balance is low. Cover has $7.19 ready to protect your next purchase.", time: "3h ago", timeMs: Date.now() - 3 * 60 * 60 * 1000, read: false },
  { id: "sys-4", type: "security", title: "New sign-in detected", body: "Your account was accessed from a new device in Quebec, Canada.", time: "5h ago", timeMs: Date.now() - 5 * 60 * 60 * 1000, read: true },
  { id: "sys-5", type: "cashback", title: "Cashback earned", body: "You earned $2.35 cashback this month. It's been added to your balance.", time: "Yesterday", timeMs: Date.now() - 24 * 60 * 60 * 1000, read: true },
  { id: "sys-6", type: "etransfer_out", title: "e-Transfer sent", body: "Your e-Transfer of $450.00 to Amine hadad was delivered successfully.", time: "Yesterday", timeMs: Date.now() - 26 * 60 * 60 * 1000, read: true, amount: "-$450.00" },
  { id: "sys-7", type: "plan", title: "Your KOHO Essential plan renewed", body: "Your Essential plan has been renewed. Keep enjoying unlimited cashback and more.", time: "2 days ago", timeMs: Date.now() - 2 * 24 * 60 * 60 * 1000, read: true },
  { id: "sys-8", type: "system", title: "Direct deposit received", body: "A direct deposit of $1,000.00 from your employer has landed in your KOHO account.", time: "3 days ago", timeMs: Date.now() - 3 * 24 * 60 * 60 * 1000, read: true, amount: "+$1,000.00" },
  { id: "sys-9", type: "credit", title: "Credit Building payment processed", body: "$10.00 has been collected for your Credit Building subscription.", time: "4 days ago", timeMs: Date.now() - 4 * 24 * 60 * 60 * 1000, read: true },
  { id: "sys-10", type: "system", title: "Monthly statement ready", body: "Your April 2026 statement is now available to view or download.", time: "1 week ago", timeMs: Date.now() - 7 * 24 * 60 * 60 * 1000, read: true },
  { id: "sys-11", type: "cashback", title: "Bonus cashback weekend", body: "Earn 3× cashback at grocery stores this weekend only. Shop smart!", time: "1 week ago", timeMs: Date.now() - 8 * 24 * 60 * 60 * 1000, read: true },
  { id: "sys-12", type: "security", title: "Password changed successfully", body: "Your KOHO password was updated. If this wasn't you, contact support immediately.", time: "2 weeks ago", timeMs: Date.now() - 14 * 24 * 60 * 60 * 1000, read: true },
];

const ICON_CONFIG: Record<Notif["type"], { icon: typeof Bell; bg: string; color: string }> = {
  transaction_in:  { icon: ArrowDownLeft,  bg: "#DCFCE7", color: "#16A34A" },
  transaction_out: { icon: ArrowUpRight,   bg: "#FEE2E2", color: "#DC2626" },
  etransfer_in:    { icon: ArrowDownLeft,  bg: "#DCFCE7", color: "#16A34A" },
  etransfer_out:   { icon: ArrowUpRight,   bg: "#FEE2E2", color: "#DC2626" },
  credit:          { icon: Star,           bg: "#FEF3C7", color: "#D97706" },
  cover:           { icon: ShieldCheck,    bg: "#CCFBF1", color: "#0D9488" },
  cashback:        { icon: Zap,            bg: "#FEF9C3", color: "#CA8A04" },
  plan:            { icon: CreditCard,     bg: "#EDE9FF", color: "#7B4FFF" },
  system:          { icon: Bell,           bg: "#DBEAFE", color: "#2563EB" },
  security:        { icon: AlertCircle,    bg: "#FFE4E6", color: "#E11D48" },
};

const TODAY_CUTOFF = 20 * 60 * 60 * 1000;

export default function Notifications() {
  const { data: recentTx } = useGetRecentTransactions();
  const qc = useQueryClient();
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(SYSTEM_NOTIFS.filter(n => n.read).map(n => n.id))
  );
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleRefresh = useCallback(async () => {
    await qc.invalidateQueries();
  }, [qc]);

  const txNotifs: Notif[] = (recentTx ?? []).slice(0, 4).map((tx, i) => ({
    id: `tx-${tx.id}`,
    type: (tx.isCredit ? "transaction_in" : "transaction_out") as Notif["type"],
    title: tx.isCredit ? "Money received" : `Purchase at ${tx.merchant}`,
    body: tx.isCredit
      ? `${tx.merchant} sent $${tx.amount.toFixed(2)} to your KOHO account.`
      : `$${tx.amount.toFixed(2)} was charged to your KOHO card at ${tx.merchant}.`,
    time: i === 0 ? "Just now" : i === 1 ? "1h ago" : `${i + 1}h ago`,
    timeMs: Date.now() - i * 60 * 60 * 1000,
    read: i > 1,
    amount: tx.isCredit ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`,
    merchant: tx.merchant,
  }));

  const allNotifs = [...txNotifs, ...SYSTEM_NOTIFS]
    .filter(n => !dismissed.has(n.id))
    .sort((a, b) => b.timeMs - a.timeMs);

  const today = allNotifs.filter(n => Date.now() - n.timeMs < TODAY_CUTOFF);
  const earlier = allNotifs.filter(n => Date.now() - n.timeMs >= TODAY_CUTOFF);
  const unreadCount = allNotifs.filter(n => !readIds.has(n.id)).length;

  const markRead = (id: string) => setReadIds(prev => new Set([...prev, id]));
  const markAllRead = () => setReadIds(new Set(allNotifs.map(n => n.id)));
  const dismiss = (id: string) => setDismissed(prev => new Set([...prev, id]));

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
        <Link href="/" className="p-1 rounded-full tap-row">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[#7B4FFF] text-xs font-semibold tap-row px-2 py-1 rounded-lg">
              Mark all read
            </button>
          )}
          <Link href="/feature/notification-settings" className="p-1 rounded-full tap-row">
            <Settings className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      </header>

      {allNotifs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
          <div className="w-16 h-16 rounded-full bg-[#EDE9FF] flex items-center justify-center">
            <Bell className="w-8 h-8 text-[#7B4FFF]" />
          </div>
          <p className="font-bold text-gray-900 text-lg">All caught up!</p>
          <p className="text-gray-500 text-sm">You have no notifications right now. Check back later.</p>
        </div>
      ) : (
        <PullToRefresh onRefresh={handleRefresh} className="pb-24">
          {today.length > 0 && (
            <NotifSection title="Today">
              {today.map(n => (
                <NotifRow key={n.id} notif={n} isRead={readIds.has(n.id)} onRead={() => markRead(n.id)} onDismiss={() => dismiss(n.id)} />
              ))}
            </NotifSection>
          )}
          {earlier.length > 0 && (
            <NotifSection title="Earlier">
              {earlier.map(n => (
                <NotifRow key={n.id} notif={n} isRead={readIds.has(n.id)} onRead={() => markRead(n.id)} onDismiss={() => dismiss(n.id)} />
              ))}
            </NotifSection>
          )}
        </PullToRefresh>
      )}
    </div>
  );
}

function NotifSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <div>{children}</div>
    </div>
  );
}

function NotifRow({ notif, isRead, onRead, onDismiss }: { notif: Notif; isRead: boolean; onRead: () => void; onDismiss: () => void }) {
  const cfg = ICON_CONFIG[notif.type];
  const Icon = cfg.icon;

  return (
    <button
      onClick={onRead}
      className="w-full flex items-start gap-3 px-4 py-3.5 text-left relative tap-row"
    >
      {!isRead && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#7B4FFF]" />
      )}
      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: cfg.bg }}>
        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-[14px] leading-snug ${isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
            {notif.title}
          </p>
          {notif.amount && (
            <span className={`text-sm font-bold flex-shrink-0 ${notif.amount.startsWith("+") ? "text-green-600" : "text-gray-800"}`}>
              {notif.amount}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
        <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
    </button>
  );
}
