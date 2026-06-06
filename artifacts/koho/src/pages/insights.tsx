import { useCallback, useRef, useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, ShoppingBag, ChevronLeft, ChevronRight, Download, FileText, Sheet } from "lucide-react";
import { Link } from "wouter";
import { useGetSpendingInsights, type SpendingCategory, type TopMerchant } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#FF6B6B",
  Bills: "#4ECDC4",
  Transfer: "#45B7D1",
  Shopping: "#96CEB4",
  Transport: "#FFEAA7",
  Entertainment: "#DDA0DD",
  Health: "#98D8C8",
  Other: "#C3C3E5",
};

const FALLBACK_COLORS = [
  "#5B3FCC", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#C3C3E5", "#F7DC6F",
];

function getCategoryColor(category: string, index: number) {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

const MONTH_NAMES: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};

const FULL_MONTH_NAMES: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December",
};

function monthLabel(ym: string) {
  const [, mm] = ym.split("-");
  return MONTH_NAMES[mm] ?? ym;
}

function fullMonthLabel(ym: string) {
  const [year, mm] = ym.split("-");
  return `${FULL_MONTH_NAMES[mm] ?? ym} ${year}`;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
};

function slugMonth(ym: string) {
  const [year, mm] = ym.split("-");
  return `${FULL_MONTH_NAMES[mm]?.toLowerCase() ?? mm}-${year}`;
}

function DonutCenter({ total }: { total: number }) {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-0.4em" fontSize="18" fontWeight="700" fill="#2A1A7A">
        {fmt(total)}
      </tspan>
      <tspan x="50%" dy="1.4em" fontSize="11" fill="#9CA3AF">
        total spent
      </tspan>
    </text>
  );
}

function getAvailableMonths(count = 12): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${mm}`);
  }
  return months;
}

function exportCSV(
  selectedMonth: string,
  categories: SpendingCategory[],
  merchants: TopMerchant[],
  total: number,
) {
  const label = fullMonthLabel(selectedMonth);
  const rows: string[] = [];

  rows.push(`KOHO Spending Summary - ${label}`);
  rows.push("");
  rows.push(`Total Spent,${fmt(total)}`);
  rows.push("");
  rows.push("Category Breakdown");
  rows.push("Category,Amount (CAD),Transactions,% of Total");
  for (const cat of categories) {
    const pct = total > 0 ? ((cat.amount / total) * 100).toFixed(1) : "0.0";
    rows.push(`"${cat.category}",${cat.amount.toFixed(2)},${cat.count},${pct}%`);
  }
  rows.push("");
  rows.push("Top Merchants");
  rows.push("Merchant,Amount (CAD),Transactions");
  for (const m of merchants) {
    rows.push(`"${m.merchant}",${m.amount.toFixed(2)},${m.count}`);
  }

  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `koho-spending-${slugMonth(selectedMonth)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(
  selectedMonth: string,
  categories: SpendingCategory[],
  merchants: TopMerchant[],
  total: number,
) {
  const label = fullMonthLabel(selectedMonth);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const purple = [91, 63, 204] as [number, number, number];
  const lightPurple = [245, 243, 255] as [number, number, number];

  doc.setFillColor(...purple);
  doc.rect(0, 0, 595, 80, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("KOHO Spending Summary", 40, 38);
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text(label, 40, 60);

  doc.setFillColor(...lightPurple);
  doc.roundedRect(40, 96, 515, 52, 8, 8, "F");
  doc.setTextColor(42, 26, 122);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL SPENT", 60, 116);
  doc.setFontSize(20);
  doc.text(fmt(total), 60, 138);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Category Breakdown", 40, 178);

  autoTable(doc, {
    startY: 190,
    head: [["Category", "Amount (CAD)", "Transactions", "% of Total"]],
    body: categories.map((cat) => {
      const pct = total > 0 ? ((cat.amount / total) * 100).toFixed(1) + "%" : "0.0%";
      return [cat.category, fmt(cat.amount), cat.count.toString(), pct];
    }),
    headStyles: {
      fillColor: purple,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [249, 247, 255] },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "center" },
      3: { halign: "right" },
    },
    margin: { left: 40, right: 40 },
  });

  const afterCats = (doc as any).lastAutoTable.finalY + 24;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Top Merchants", 40, afterCats);

  autoTable(doc, {
    startY: afterCats + 12,
    head: [["Merchant", "Amount (CAD)", "Transactions"]],
    body: merchants.map((m) => [m.merchant, fmt(m.amount), m.count.toString()]),
    headStyles: {
      fillColor: purple,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: { fontSize: 10 },
    alternateRowStyles: { fillColor: [249, 247, 255] },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "center" },
    },
    margin: { left: 40, right: 40 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated by KOHO · ${new Date().toLocaleDateString("en-CA")} · Page ${i} of ${pageCount}`,
      297,
      820,
      { align: "center" },
    );
  }

  doc.save(`koho-spending-${slugMonth(selectedMonth)}.pdf`);
}

export default function Insights() {
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState<string>(currentYM);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const availableMonths = getAvailableMonths(12);
  const pickerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetSpendingInsights(selectedMonth);
  const qc = useQueryClient();

  const handleRefresh = useCallback(async () => {
    await qc.invalidateQueries();
  }, [qc]);

  const selectedIndex = availableMonths.indexOf(selectedMonth);

  const goToPrev = () => {
    if (selectedIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[selectedIndex + 1]);
    }
  };

  const goToNext = () => {
    if (selectedIndex > 0) {
      setSelectedMonth(availableMonths[selectedIndex - 1]);
    }
  };

  const thisMonthCats = data?.thisMonth.categories ?? [];
  const lastMonthCats = data?.lastMonth.categories ?? [];
  const topMerchants = data?.topMerchants ?? [];
  const thisMonthTotal = data?.thisMonth.total ?? 0;

  const allCategories = Array.from(
    new Set([...thisMonthCats.map((c: SpendingCategory) => c.category), ...lastMonthCats.map((c: SpendingCategory) => c.category)])
  );

  const barData = allCategories.map((cat: string, i: number) => ({
    name: cat,
    [monthLabel(data?.previousMonth ?? "")]:
      lastMonthCats.find((c: SpendingCategory) => c.category === cat)?.amount ?? 0,
    [monthLabel(data?.currentMonth ?? "")]:
      thisMonthCats.find((c: SpendingCategory) => c.category === cat)?.amount ?? 0,
    color: getCategoryColor(cat, i),
  }));

  const lastMonthTotal = data?.lastMonth.total ?? 0;
  const monthDiff = thisMonthTotal - lastMonthTotal;
  const monthDiffPct = lastMonthTotal > 0
    ? Math.abs(Math.round((monthDiff / lastMonthTotal) * 100))
    : 0;

  const prevLabel = data ? monthLabel(data.previousMonth) : "Last";
  const currLabel = data ? monthLabel(data.currentMonth) : "This";

  const isCurrentMonth = selectedMonth === currentYM;
  const canGoBack = selectedIndex < availableMonths.length - 1;
  const canGoForward = selectedIndex > 0;
  const hasData = thisMonthCats.length > 0 || topMerchants.length > 0;

  const handleExportCSV = () => {
    exportCSV(selectedMonth, thisMonthCats, topMerchants, thisMonthTotal);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    exportPDF(selectedMonth, thisMonthCats, topMerchants, thisMonthTotal);
    setShowExportMenu(false);
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between z-10">
        <Link href="/transactions" className="p-2 -ml-2 rounded-full tap-row">
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Spending Insights</h1>

        {/* Export button */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu((v) => !v)}
            disabled={isLoading || !hasData}
            className="p-2 -mr-2 rounded-full transition-colors disabled:opacity-30"
            style={{ color: "#5B3FCC" }}
            aria-label="Export spending summary"
          >
            <Download className="w-5 h-5" />
          </button>

          {showExportMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Export {monthLabel(selectedMonth)}
                </p>
                <button
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-purple-50 transition-colors"
                >
                  <Sheet className="w-4 h-4 flex-shrink-0" style={{ color: "#5B3FCC" }} />
                  <span className="font-medium">Export as CSV</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-800 hover:bg-purple-50 transition-colors"
                >
                  <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "#5B3FCC" }} />
                  <span className="font-medium">Export as PDF</span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Month picker */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={!canGoBack}
            className="p-1.5 rounded-full transition-colors disabled:opacity-30"
            style={{ color: canGoBack ? "#5B3FCC" : "#9CA3AF" }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div ref={pickerRef} className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 mx-2 justify-center">
            {availableMonths.slice().reverse().map((ym) => {
              const [year, mm] = ym.split("-");
              const isSelected = ym === selectedMonth;
              return (
                <button
                  key={ym}
                  onClick={() => setSelectedMonth(ym)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "text-white shadow-sm"
                      : "text-gray-500 bg-gray-100 hover:bg-gray-200"
                  }`}
                  style={isSelected ? { backgroundColor: "#5B3FCC" } : {}}
                >
                  {MONTH_NAMES[mm]} {year.slice(2)}
                </button>
              );
            })}
          </div>

          <button
            onClick={goToNext}
            disabled={!canGoForward}
            className="p-1.5 rounded-full transition-colors disabled:opacity-30"
            style={{ color: canGoForward ? "#5B3FCC" : "#9CA3AF" }}
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          {fullMonthLabel(selectedMonth)}{isCurrentMonth ? " (current)" : ""}
        </p>
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="p-4 space-y-5 pb-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[220px] w-full rounded-3xl" />
              <Skeleton className="h-[200px] w-full rounded-3xl" />
              <Skeleton className="h-[160px] w-full rounded-3xl" />
            </div>
          ) : (
            <>
              {/* Month summary banner */}
              <div
                className="rounded-3xl p-4 flex items-center justify-between"
                style={{ backgroundColor: "#F5F3FF" }}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "#4B3FA3" }}>
                    {currLabel} spending
                  </p>
                  <p className="text-3xl font-extrabold" style={{ color: "#2A1A7A" }}>
                    {fmt(thisMonthTotal)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    vs {fmt(lastMonthTotal)} in {prevLabel}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {lastMonthTotal > 0 ? (
                    <>
                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ${
                          monthDiff <= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {monthDiff <= 0 ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                        {monthDiffPct}%
                      </div>
                      <p className="text-xs text-gray-400">vs {prevLabel}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">No {prevLabel} data</p>
                  )}
                </div>
              </div>

              {/* Donut chart — category breakdown */}
              <div className="rounded-3xl border border-gray-100 p-4">
                <h2 className="font-bold text-gray-900 mb-1">By Category</h2>
                <p className="text-xs text-gray-500 mb-3">{currLabel} breakdown</p>

                {thisMonthCats.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    No spending data for {fullMonthLabel(selectedMonth)}
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={thisMonthCats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="amount"
                            nameKey="category"
                          >
                            {thisMonthCats.map((entry: SpendingCategory, index: number) => (
                              <Cell
                                key={entry.category}
                                fill={getCategoryColor(entry.category, index)}
                              />
                            ))}
                          </Pie>
                          <DonutCenter total={thisMonthTotal} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-3 space-y-2">
                      {thisMonthCats.map((cat: SpendingCategory, i: number) => {
                        const pct = thisMonthTotal > 0
                          ? Math.round((cat.amount / thisMonthTotal) * 100)
                          : 0;
                        const color = getCategoryColor(cat.category, i);
                        return (
                          <div key={cat.category} className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm text-gray-700 flex-1">{cat.category}</span>
                            <span className="text-xs text-gray-400">{cat.count} txns</span>
                            <span className="text-sm font-bold text-gray-900 w-16 text-right">
                              {fmt(cat.amount)}
                            </span>
                            <span
                              className="text-xs font-semibold w-9 text-right"
                              style={{ color: "#5B3FCC" }}
                            >
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Bar chart — month-over-month */}
              <div className="rounded-3xl border border-gray-100 p-4">
                <h2 className="font-bold text-gray-900 mb-1">Month vs Month</h2>
                <p className="text-xs text-gray-500 mb-3">
                  {prevLabel} vs {currLabel} by category
                </p>

                {barData.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                    No comparison data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={barData}
                      margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
                      barCategoryGap="30%"
                      barGap={2}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: "#9CA3AF" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={fmtShort}
                        tick={{ fontSize: 10, fill: "#9CA3AF" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [fmt(value), name]}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E5E7EB",
                          fontSize: 12,
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 11 }}
                      />
                      <Bar dataKey={prevLabel} fill="#C3C3E5" radius={[4, 4, 0, 0]} />
                      <Bar dataKey={currLabel} fill="#5B3FCC" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Top merchants */}
              <div className="rounded-3xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-4 h-4" style={{ color: "#5B3FCC" }} />
                  <h2 className="font-bold text-gray-900">Top Merchants</h2>
                </div>

                {topMerchants.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                    No merchant data for {fullMonthLabel(selectedMonth)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topMerchants.map((m: TopMerchant, i: number) => {
                      const maxAmount = topMerchants[0]?.amount ?? 1;
                      const barPct = Math.round((m.amount / maxAmount) * 100);
                      return (
                        <div key={m.merchant}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                style={{ backgroundColor: m.merchantColor || "#5B3FCC" }}
                              >
                                {m.merchant.charAt(0)}
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-gray-900">
                                  {m.merchant}
                                </span>
                                <span className="text-xs text-gray-400 ml-1.5">
                                  {m.count} {m.count === 1 ? "txn" : "txns"}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              {fmt(m.amount)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${barPct}%`,
                                backgroundColor: m.merchantColor || "#5B3FCC",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Export hint */}
              {hasData && (
                <button
                  onClick={() => setShowExportMenu(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed text-sm font-semibold transition-colors"
                  style={{ borderColor: "#C4B5FD", color: "#5B3FCC" }}
                >
                  <Download className="w-4 h-4" />
                  Export {fullMonthLabel(selectedMonth)} summary
                </button>
              )}
            </>
          )}
        </div>
      </PullToRefresh>
    </div>
  );
}
