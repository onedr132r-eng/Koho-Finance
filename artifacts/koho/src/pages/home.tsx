import { useState, useCallback } from "react";
import {
  useGetAccount, useGetCover, useGetRecentTransactions,
  useGetCashback, useGetCrypto, useGetSavings, useGetMonthlyTrend,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { TopBar } from "@/components/layout/top-bar";
import {
  Plus, CreditCard, Send, QrCode, ChevronRight,
  Info, Zap, Database, RotateCcw, Flag, Lock, BarChart2, TrendingUp,
  X, PlusCircle, Receipt, ArrowDownToLine, Scan,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function Home() {
  const { data: account, isLoading: isLoadingAccount } = useGetAccount();
  const { data: cover } = useGetCover();
  const { data: recentTx, isLoading: isLoadingTx } = useGetRecentTransactions();
  const { data: cashback } = useGetCashback();
  const { data: crypto } = useGetCrypto();
  const { data: savings } = useGetSavings();
  const { data: monthlyTrend, isLoading: isLoadingTrend } = useGetMonthlyTrend();
  const qc = useQueryClient();

  const [, navigate] = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [showMoveMoney, setShowMoveMoney] = useState(false);
  const handleScroll = useCallback((top: number) => {
    setScrollY(top);
  }, []);

  const handleRefresh = useCallback(async () => {
    await qc.invalidateQueries();
  }, [qc]);

  const fmt = (n?: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n ?? 0);

  const disputedCount = recentTx?.filter(t => t.status === "disputed").length ?? 0;

  const cardTranslate = -(scrollY * 0.42);
  const cardOpacity   = Math.max(0, 1 - scrollY / 130);
  const CARD_PEEK = 88;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PullToRefresh onRefresh={handleRefresh} onScroll={handleScroll}>
        <div style={{ backgroundColor: "#F5F3FF" }}>
          {/* ══ LAVENDER HERO ══ */}
          <div className="relative" style={{ backgroundColor: "#F5F3FF" }}>
            <TopBar notificationCount={account?.notificationCount ?? 10} />

            {/* Balance */}
            <motion.div
              className="relative z-10 pt-20 pb-5 flex flex-col items-center px-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1"
                style={{ color: "#4B3FA3" }}
              >
                Spendable
              </span>

              {isLoadingAccount ? (
                <Skeleton className="h-14 w-52 mb-3 rounded-2xl" />
              ) : (
                <button
                  onClick={() => setShowMoveMoney(true)}
                  className="tap-highlight-none active:opacity-70 transition-opacity"
                >
                  <h1
                    className="text-[3rem] font-extrabold leading-none tracking-tight mb-3"
                    style={{ color: "#2A1A7A" }}
                  >
                    {fmt(account?.spendableBalance)}
                  </h1>
                </button>
              )}

              <Link
                href="/cover"
                className="flex items-center gap-1.5 text-[15px] font-semibold hover:opacity-70 transition-opacity tap-highlight-none"
                style={{ color: "#4B3FA3" }}
              >
                <span>{fmt(cover?.available)} of Cover available</span>
                <Info className="w-[15px] h-[15px]" />
              </Link>
            </motion.div>

            {/* ── KOHO CARD — parallax wrapper + entrance ── */}
            <div
              className="relative z-0 mx-4"
              style={{
                transform: `translateY(${cardTranslate}px)`,
                opacity: cardOpacity,
                willChange: "transform, opacity",
              }}
            >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.12 }}
            >
              <Link href="/cards" className="block select-none tap-highlight-none active:scale-[0.98] transition-transform">
                <div
                  className="relative w-full rounded-3xl overflow-hidden shadow-xl"
                  style={{ aspectRatio: "1.68/1" }}
                >
                  <div className="absolute inset-y-0 left-0 w-1/2" style={{ backgroundColor: "#E8604C" }} />
                  <div className="absolute inset-y-0 right-0 w-1/2" style={{ backgroundColor: "#1B4FD8" }} />

                  <div className="absolute bottom-0 inset-x-0 flex justify-center pb-5">
                    <span
                      className="font-black italic select-none pointer-events-none"
                      style={{
                        fontSize: "clamp(3rem, 14vw, 4.5rem)",
                        lineHeight: 1,
                        letterSpacing: "-0.05em",
                        color: "#1B4FD8",
                        mixBlendMode: "multiply",
                      }}
                    >
                      koho
                    </span>
                  </div>

                  <div className="absolute top-4 left-4">
                    <div
                      className="flex items-center gap-1.5 rounded-2xl px-3 py-[9px] shadow-md"
                      style={{ backgroundColor: "#3E1F0E" }}
                    >
                      <Lock className="w-[13px] h-[13px] text-white" strokeWidth={2.5} />
                      <span className="text-white font-bold text-[13px] tracking-wide">Locked</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
            </div>
          </div>

          {/* ══ WHITE PANEL ══ */}
          <div
            className="relative bg-white"
            style={{
              zIndex: 10,
              borderRadius: "28px 28px 0 0",
              marginTop: `-${CARD_PEEK}px`,
              boxShadow: "0 -8px 32px rgba(60,40,160,0.10)",
            }}
          >
            {/* Quick Actions */}
            <div className="flex justify-around px-6 pt-7 pb-5">
              {[
                { href: "/add-money",     icon: Plus,       label: "Add"     },
                { href: "/cards",         icon: CreditCard,  label: "Cards"   },
                { href: "/send-money",    icon: Send,        label: "Send"    },
                { href: "/request-money", icon: QrCode,      label: "Request" },
              ].map(({ href, icon: Icon, label }) => (
                <Link key={label} href={href} className="flex flex-col items-center gap-2 tap-highlight-none">
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#EDE9FF" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "#5B3FCC" }} />
                  </motion.div>
                  <span className="text-xs font-semibold text-gray-800">{label}</span>
                </Link>
              ))}
            </div>

            {/* Feature rows */}
            <div className="px-4 pb-4">
              <div className="rounded-3xl border border-gray-100 overflow-hidden divide-y divide-gray-100">

                <Link href="/cover" className="flex items-center justify-between p-4 tap-row">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EDE9FF" }}>
                      <Database className="w-5 h-5" style={{ color: "#5B3FCC" }} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-[15px]">Cover</p>
                      <p className="text-[13px] text-gray-500">{fmt(cover?.available)} of {fmt(cover?.limit)} available</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link href="/credit-building" className="flex items-center justify-between p-4 tap-row">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EDE9FF" }}>
                      <Zap className="w-5 h-5" style={{ color: "#5B3FCC" }} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-[15px]">Credit Building</p>
                      <p className="text-[13px] text-gray-500">Action required</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#EDE9FF", color: "#5B3FCC" }}>
                      Set Utilization
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                <Link href="/cashback" className="flex items-center justify-between p-4 tap-row">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="font-bold text-gray-900 text-[15px]">Cash back</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{fmt(cashback?.totalEarned)}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                <Link href="/crypto" className="flex items-center justify-between p-4 tap-row">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-[15px]">Crypto</p>
                      <p className="text-[13px] text-red-500 font-medium">{crypto?.allTimeChange}% all-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{fmt(crypto?.balance)}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                <Link href="/save-interest" className="flex items-center justify-between p-4 tap-row">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                      <Database className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-gray-900 text-[15px]">Save Interest</p>
                      <span className="font-bold text-[15px]" style={{ color: "#5B3FCC" }}>· {savings?.interestRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{fmt(savings?.totalInterestEarned)}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                <Link href="/insights" className="flex items-center justify-between p-4 tap-row">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EDE9FF" }}>
                      <BarChart2 className="w-5 h-5" style={{ color: "#5B3FCC" }} />
                    </div>
                    <p className="font-bold text-gray-900 text-[15px]">Spending Insights</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Spending Trend Widget */}
            <div className="px-4 pb-4">
              <Link href="/insights" className="block tap-highlight-none">
                <div
                  className="rounded-3xl p-5"
                  style={{ backgroundColor: "#EDE9FF" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" style={{ color: "#5B3FCC" }} />
                      <span className="text-[13px] font-bold" style={{ color: "#5B3FCC" }}>
                        Spending last 6 months
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: "#5B3FCC" }} />
                  </div>

                  {isLoadingTrend ? (
                    <div className="flex items-end gap-2 h-16">
                      {[1,2,3,4,5,6].map(i => (
                        <Skeleton key={i} className="flex-1 rounded-lg" style={{ height: `${30 + i * 8}%` }} />
                      ))}
                    </div>
                  ) : monthlyTrend && monthlyTrend.length > 0 ? (() => {
                    const maxTotal = Math.max(...monthlyTrend.map(m => m.total), 1);
                    const currentMonthLabel = monthlyTrend[monthlyTrend.length - 1]?.label;
                    return (
                      <div>
                        <div className="flex items-end gap-1.5 h-16">
                          {monthlyTrend.map((m, i) => {
                            const isLast = i === monthlyTrend.length - 1;
                            const heightPct = Math.max(8, Math.round((m.total / maxTotal) * 100));
                            return (
                              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex items-end" style={{ height: "52px" }}>
                                  <div
                                    className="w-full rounded-lg transition-all"
                                    style={{
                                      height: `${heightPct}%`,
                                      backgroundColor: isLast ? "#5B3FCC" : "rgba(91,63,204,0.28)",
                                    }}
                                  />
                                </div>
                                <span
                                  className="text-[10px] font-semibold leading-none"
                                  style={{ color: isLast ? "#5B3FCC" : "#8B7FC7" }}
                                >
                                  {m.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 pt-3 border-t border-purple-200 flex items-center justify-between">
                          <span className="text-[12px] text-purple-500 font-medium">{currentMonthLabel}</span>
                          <span className="text-[14px] font-bold" style={{ color: "#2A1A7A" }}>
                            {fmt(monthlyTrend[monthlyTrend.length - 1]?.total)} spent
                          </span>
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="h-16 flex items-center justify-center text-purple-400 text-sm">
                      No spending data yet
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* Suggested */}
            <div className="px-4 pb-4">
              <h2 className="font-bold text-lg mb-3 text-gray-900">Suggested for you</h2>
              <div className="rounded-3xl p-5 min-h-[120px] tap-row" style={{ backgroundColor: "#EDE9FF" }}>
                <span className="text-xs font-bold text-gray-700 bg-white rounded-lg px-2 py-1">Explore</span>
                <p className="mt-3 font-bold text-gray-900 text-base leading-snug max-w-[55%]">
                  KOHO referrers are earning up to $3,500 in a month
                </p>
              </div>
            </div>

            {/* Latest Activity */}
            <div className="px-4 pb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg text-gray-900">Latest activity</h2>
                <Link href="/transactions" className="font-bold text-sm tap-highlight-none" style={{ color: "#5B3FCC" }}>See all</Link>
              </div>
              <div className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {disputedCount > 0 && (
                  <Link href="/transactions" className="flex items-center justify-between p-4 tap-row border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <Flag className="w-5 h-5 text-red-400" />
                      </div>
                      <p className="font-bold text-gray-900 text-sm">Active disputes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{disputedCount}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                )}

                {isLoadingTx ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                  </div>
                ) : recentTx && recentTx.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {recentTx.slice(0, 6).map(tx => (
                      <Link key={tx.id} href={`/transactions/${tx.id}`} className="flex items-center justify-between p-4 tap-row tap-highlight-none">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: tx.merchantColor || "#5B3FCC" }}
                          >
                            {tx.merchant.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{tx.merchant}</p>
                            <p className="text-xs text-gray-500">{tx.time} · {tx.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm ${tx.isCredit ? "text-green-600" : "text-gray-900"}`}>
                            {tx.isCredit ? "+" : ""}{fmt(tx.amount)}
                          </p>
                          {tx.status === "disputed" && (
                            <p className="text-[11px] font-bold text-red-500">Disputed</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400">No recent transactions</div>
                )}

                <Link
                  href="/transactions"
                  className="block w-full py-3.5 text-center font-bold text-sm border-t border-gray-100 tap-row tap-highlight-none"
                  style={{ color: "#5B3FCC", backgroundColor: "#FAFAFA" }}
                >
                  See all activity
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>

      {/* ── Move Money Bottom Sheet (portaled to body to escape page transforms) ── */}
      {createPortal(
        <AnimatePresence>
        {showMoveMoney && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              onClick={() => setShowMoveMoney(false)}
            />

            {/* Sheet — hugs its content (never full-page), slides up from bottom */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white flex flex-col"
              style={{ maxHeight: "88%", borderRadius: "24px 24px 0 0" }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
                <div className="w-9" />
                <h2 className="text-[17px] font-bold text-gray-900">Move money</h2>
                <button
                  onClick={() => setShowMoveMoney(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Options */}
              <div className="overflow-y-auto px-5 pb-[max(env(safe-area-inset-bottom),20px)]">
                {[
                  { icon: PlusCircle,      label: "Add money",      href: "/add-money"      },
                  { icon: Info,            label: "Direct deposit", href: "/direct-deposit" },
                  { icon: Receipt,         label: "Pay a bill",     href: "/pay-bill"       },
                  { icon: Send,            label: "Send money",     href: "/send-money"     },
                  { icon: QrCode,          label: "Request",        href: "/request-money"  },
                  { icon: Scan,            label: "Split a bill",   href: "/bill-split"     },
                ].map(({ icon: Icon, label, href }) => (
                  <button
                    key={label}
                    onClick={() => { setShowMoveMoney(false); navigate(href); }}
                    className="w-full flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-gray-800 flex-shrink-0" strokeWidth={1.75} />
                      <p className="font-bold text-gray-900 text-[16px]">{label}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
