import { useListTransactions, ListTransactionsParamsSort } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Search, Filter, SearchX, BarChart2, X, ChevronDown, Clock, ArrowUpRight, ArrowDownLeft, ArrowUpDown } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useCallback, useRef, useEffect } from "react";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";

type Tab = "transactions" | "insights";
type DateRange = "all" | "this_week" | "this_month";
type SortOption = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

const VALID_DATE_RANGES: DateRange[] = ["all", "this_week", "this_month"];
const VALID_SORTS: SortOption[] = ["date_desc", "date_asc", "amount_desc", "amount_asc"];

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Eating & Drinking", value: "Eating and Drinking" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Bills & Services", value: "Bills and Services" },
  { label: "Transportation", value: "Transportation" },
  { label: "Health", value: "Health and Life Maintenance" },
  { label: "Other", value: "Other" },
  { label: "Fee", value: "Fee" },
  { label: "Interest", value: "Interest" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Eating and Drinking": "🍔",
  "Entertainment": "🎬",
  "Bills and Services": "📄",
  "Transportation": "🚇",
  "Health and Life Maintenance": "💊",
  "Other": "📦",
  "Fee": "💳",
  "Interest": "💰",
  "Savings": "🔒",
  "Vault": "🔒",
  "Cashback": "💸",
  "Transfer": "↔️",
};

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: "All time", value: "all" },
  { label: "This week", value: "this_week" },
  { label: "This month", value: "this_month" },
];

const SORT_OPTIONS: { label: string; value: SortOption; shortLabel: string }[] = [
  { label: "Newest first", value: "date_desc", shortLabel: "Newest" },
  { label: "Oldest first", value: "date_asc", shortLabel: "Oldest" },
  { label: "Highest amount", value: "amount_desc", shortLabel: "Highest" },
  { label: "Lowest amount", value: "amount_asc", shortLabel: "Lowest" },
];

export default function Transactions() {
  const rawSearch = useSearch();
  const [, navigate] = useLocation();

  const params = new URLSearchParams(rawSearch);
  const initialSearch = params.get("search") ?? "";
  const initialCategory = params.get("category") ?? "";
  const rawDateRange = params.get("dateRange") ?? "all";
  const initialDateRange: DateRange = VALID_DATE_RANGES.includes(rawDateRange as DateRange)
    ? (rawDateRange as DateRange)
    : "all";
  const rawSort = params.get("sort") ?? "date_desc";
  const initialSort: SortOption = VALID_SORTS.includes(rawSort as SortOption)
    ? (rawSort as SortOption)
    : "date_desc";

  const [tab, setTab] = useState<Tab>("transactions");
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (category) p.set("category", category);
    if (dateRange !== "all") p.set("dateRange", dateRange);
    if (sort !== "date_desc") p.set("sort", sort);
    const qs = p.toString();
    navigate("/transactions" + (qs ? "?" + qs : ""), { replace: true });
  }, [search, category, dateRange, sort]);

  const apiDateRange = dateRange === "all" ? undefined : dateRange;
  const isAmountSort = sort === "amount_desc" || sort === "amount_asc";

  const { data: transactions, isLoading } = useListTransactions({
    search: search || undefined,
    category: category || undefined,
    dateRange: apiDateRange,
    sort: sort as ListTransactionsParamsSort,
  });
  const qc = useQueryClient();

  const handleRefresh = useCallback(async () => {
    await qc.invalidateQueries();
  }, [qc]);

  useEffect(() => {
    if (!showFilterPanel) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFilterPanel]);

  const formatMoney = (amount?: number) => {
    if (amount === undefined) return "$0.00";
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(amount);
  };

  const groupedTransactions = (transactions ?? []).reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, NonNullable<typeof transactions>>);

  const totalIn = (transactions ?? []).filter(t => t.isCredit).reduce((s, t) => s + (t.amount ?? 0), 0);
  const totalOut = (transactions ?? []).filter(t => !t.isCredit).reduce((s, t) => s + (t.amount ?? 0), 0);

  const hasActiveFilters = category !== "" || dateRange !== "all";
  const hasNonDefaultSort = sort !== "date_desc";
  const showSummaryBar = hasActiveFilters || hasNonDefaultSort;
  const activeFilterCount = (category ? 1 : 0) + (dateRange !== "all" ? 1 : 0) + (hasNonDefaultSort ? 1 : 0);

  const clearAllFilters = () => {
    setCategory("");
    setDateRange("all");
    setSort("date_desc");
    setSearch("");
  };

  const selectedDateLabel = DATE_RANGES.find(d => d.value === dateRange)?.label ?? "All time";
  const selectedSortShortLabel = SORT_OPTIONS.find(s => s.value === sort)?.shortLabel ?? "Newest";

  const filterButtonActive = dateRange !== "all" || hasNonDefaultSort;

  const TransactionRow = ({ tx }: { tx: NonNullable<typeof transactions>[number] }) => (
    <Link
      href={`/transactions/${tx.id}`}
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors tap-highlight-none"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 relative"
          style={{ backgroundColor: tx.merchantColor ?? "#5B3FCC" }}
        >
          <span className="text-white font-bold text-lg">{tx.merchant.charAt(0)}</span>
          {CATEGORY_ICONS[tx.category] && (
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm text-[10px]">
              {CATEGORY_ICONS[tx.category]}
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-[14px]">{tx.merchant}</p>
          <p className="text-[12px] text-gray-500">{tx.date} · {tx.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-[14px] ${tx.isCredit ? "text-green-600" : "text-gray-900"}`}>
          {tx.isCredit ? "+" : "-"}{formatMoney(tx.amount)}
        </p>
        {tx.status === "disputed" && (
          <p className="text-[10px] font-bold text-red-500 uppercase mt-0.5">Disputed</p>
        )}
        {tx.status === "pending" && (
          <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Pending</p>
        )}
      </div>
    </Link>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
        <Link href="/" className="p-2 -ml-2 rounded-full tap-row">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Transactions</h1>
        <div className="w-9" />
      </header>

      {/* Tabs */}
      <div className="flex-shrink-0 flex bg-white border-b border-gray-100">
        <button
          onClick={() => setTab("transactions")}
          className={`flex-1 py-3 text-sm font-bold transition-colors ${
            tab === "transactions" ? "border-b-2" : "text-gray-400"
          }`}
          style={tab === "transactions" ? { borderColor: "#5B3FCC", color: "#5B3FCC" } : {}}
        >
          Activity
        </button>
        <button
          onClick={() => setTab("insights")}
          className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 ${
            tab === "insights" ? "border-b-2" : "text-gray-400"
          }`}
          style={tab === "insights" ? { borderColor: "#5B3FCC", color: "#5B3FCC" } : {}}
        >
          <BarChart2 className="w-4 h-4" />
          Insights
        </button>
      </div>

      {tab === "insights" ? (
        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center">
          <Link href="/insights" className="flex flex-col items-center gap-3 p-8 text-center tap-highlight-none">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#EDE9FF]">
              <BarChart2 className="w-8 h-8 text-[#5B3FCC]" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Spending Insights</p>
              <p className="text-sm text-gray-500 mt-1">View charts, category breakdowns,<br />and top merchants</p>
            </div>
            <span className="mt-1 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ backgroundColor: "#5B3FCC" }}>
              Open Insights
            </span>
          </Link>
        </div>
      ) : (
        <>
          {/* Search + Filter button row */}
          <div className="flex-shrink-0 px-4 pt-3 pb-2 bg-white border-b border-gray-100 flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-xl pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter + Sort button */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterPanel(v => !v)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={
                  filterButtonActive
                    ? { backgroundColor: "#5B3FCC", color: "#fff" }
                    : { backgroundColor: "#f3f4f6", color: "#374151" }
                }
              >
                {hasNonDefaultSort ? <ArrowUpDown className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                {filterButtonActive
                  ? (dateRange !== "all" ? selectedDateLabel : selectedSortShortLabel)
                  : "Filter"}
                {activeFilterCount > 1 && (
                  <span className="w-4 h-4 rounded-full bg-white text-[10px] font-bold flex items-center justify-center" style={{ color: "#5B3FCC" }}>
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilterPanel ? "rotate-180" : ""}`} />
              </button>

              {showFilterPanel && (
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 z-30 min-w-[180px] overflow-hidden">
                  {/* Sort section */}
                  <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center gap-1.5">
                    <ArrowUpDown className="w-3 h-3" />
                    Sort by
                  </div>
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors"
                      style={sort === opt.value ? { color: "#5B3FCC", backgroundColor: "#F5F3FF" } : { color: "#111827" }}
                    >
                      {opt.label}
                      {sort === opt.value && (
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#5B3FCC" }} />
                      )}
                    </button>
                  ))}

                  {/* Date range section */}
                  <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-t border-b border-gray-100 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Date range
                  </div>
                  {DATE_RANGES.map(dr => (
                    <button
                      key={dr.value}
                      onClick={() => { setDateRange(dr.value); setShowFilterPanel(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors"
                      style={dateRange === dr.value ? { color: "#5B3FCC", backgroundColor: "#F5F3FF" } : { color: "#111827" }}
                    >
                      {dr.label}
                      {dateRange === dr.value && (
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#5B3FCC" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex-shrink-0 py-2 bg-white border-b border-gray-100">
            <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(cat => {
                const isActive = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(isActive && cat.value !== "" ? "" : cat.value)}
                    className="flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap"
                    style={
                      isActive
                        ? { backgroundColor: "#5B3FCC", color: "#fff" }
                        : { backgroundColor: "#f3f4f6", color: "#374151" }
                    }
                  >
                    {cat.value && CATEGORY_ICONS[cat.value] && (
                      <span className="text-[11px]">{CATEGORY_ICONS[cat.value]}</span>
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active filter summary bar */}
          {showSummaryBar && (
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-purple-50 border-b border-purple-100">
              <div className="flex items-center gap-2 text-[13px] text-purple-700 font-medium flex-wrap">
                {hasNonDefaultSort && (
                  <span className="flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-purple-500" />
                    <span className="text-purple-700">{SORT_OPTIONS.find(s => s.value === sort)?.label}</span>
                  </span>
                )}
                {hasNonDefaultSort && (hasActiveFilters || transactions !== undefined) && (
                  <span className="text-gray-400">·</span>
                )}
                {transactions !== undefined && (
                  <>
                    <span className="flex items-center gap-1">
                      <ArrowDownLeft className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700">+{formatMoney(totalIn)}</span>
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-gray-700">-{formatMoney(totalOut)}</span>
                    </span>
                    <span className="text-gray-400">·</span>
                    <span>{transactions.length} result{transactions.length !== 1 ? "s" : ""}</span>
                  </>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-[13px] font-bold text-purple-600 flex items-center gap-1 ml-2 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}

          <PullToRefresh onRefresh={handleRefresh}>
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
              </div>
            ) : (transactions ?? []).length > 0 ? (
              <div className="pb-4">
                {isAmountSort ? (
                  /* Flat list for amount sorts */
                  <div className="bg-white divide-y divide-gray-50 mt-2 mx-3 rounded-2xl shadow-sm overflow-hidden">
                    {(transactions ?? []).map(tx => (
                      <TransactionRow key={tx.id} tx={tx} />
                    ))}
                  </div>
                ) : (
                  /* Date-grouped display for date sorts */
                  Object.entries(groupedTransactions).map(([date, txs]) => (
                    <div key={date}>
                      <div className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />{date}
                      </div>
                      <div className="bg-white divide-y divide-gray-50 mb-2 mx-3 rounded-2xl shadow-sm overflow-hidden">
                        {txs.map(tx => (
                          <TransactionRow key={tx.id} tx={tx} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-64">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <SearchX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No transactions found</h3>
                <p className="text-sm text-gray-500">
                  {search || hasActiveFilters
                    ? "Try adjusting your search or filters."
                    : "Your transactions will appear here."}
                </p>
                {(hasActiveFilters || hasNonDefaultSort) && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: "#5B3FCC" }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </PullToRefresh>
        </>
      )}
    </div>
  );
}
