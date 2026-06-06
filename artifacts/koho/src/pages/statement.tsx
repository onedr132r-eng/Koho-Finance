import { useEffect, useState } from "react";
import { ArrowLeft, Share2, FileText } from "lucide-react";
import { Link, useParams } from "wouter";
import { useGetAccount } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const MONTH_MAP: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
};
const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function slugToYYYYMM(slug: string): string {
  const parts = slug.split("-");
  const year = parts.find(p => /^\d{4}$/.test(p)) ?? "2026";
  const monthName = parts[0] ?? "january";
  const m = MONTH_MAP[monthName.toLowerCase()] ?? "01";
  return `${year}-${m}`;
}

function formatLabel(slug: string) {
  const parts = slug.split("-");
  const year = parts.find(p => /^\d{4}$/.test(p)) ?? "2026";
  const monthName = parts[0] ?? "january";
  const m = MONTH_MAP[monthName.toLowerCase()] ?? "01";
  const mNum = parseInt(m);
  const yNum = parseInt(year);
  const lastDay = new Date(yNum, mNum, 0).getDate();
  return {
    long: `${MONTH_NAMES[mNum]} ${year}`,
    start: `${MONTH_NAMES[mNum]} 1, ${year}`,
    end: `${MONTH_NAMES[mNum]} ${lastDay}, ${year}`,
    startShort: `${MONTH_NAMES[mNum]} 1`,
    endShort: `${MONTH_NAMES[mNum]} ${lastDay}`,
    mNum, year: yNum,
  };
}

function dateShort(d: string) {
  if (!d) return "";
  const match = d.match(/^([A-Z]{3})\s+(\d+)/i);
  if (match) return `${match[1].toUpperCase()} ${match[2]}`;
  if (d.includes("-") && d.indexOf("-") === 4) {
    const [, m, day] = d.split("-");
    return `${MONTH_NAMES[parseInt(m)]?.slice(0, 3).toUpperCase()} ${parseInt(day)}`;
  }
  return d;
}

function fmtAmt(n: number) {
  return new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}
function fmtDollar(n: number) { return `$${fmtAmt(n)}`; }

/* ─── types ──────────────────────────────────────────────────────────────── */

type StatementRow = {
  id: number; date: string; merchant: string;
  amount: number; isCredit: boolean; balance: number;
};
type StatementData = {
  month: string; openingBalance: number; totalLoads: number;
  totalWithdrawals: number; pendingFunds: number;
  totalReimbursed: number; closingBalance: number;
  transactions: StatementRow[];
};

/* ─── constants ──────────────────────────────────────────────────────────── */

const PAGE_SIZE = 25;
const KOHO_ADDR = "Suite 400-601 West Broadway, Vancouver, BC V5Z 4C2";
const USER_NAME = "AHMED REYENE REBAIAIA";
const USER_ADDR = "209-385 RUE LOCKWELL, QUEBEC, QUEBEC G1R 5J6";

/* ─── sub-components ─────────────────────────────────────────────────────── */

/** Letterhead: pages 2+ show the KOHO wordmark left + address right */
function PageHeader({ showLogo }: { showLogo: boolean }) {
  return (
    <div className="flex items-start justify-between px-6 pt-5 pb-2">
      {showLogo ? (
        <span
          className="font-black text-gray-900 select-none"
          style={{ fontSize: "28px", letterSpacing: "-0.04em" }}
        >
          KOHO
        </span>
      ) : (
        <div />
      )}
      <div className="text-right">
        <p className="text-[10px] font-bold text-gray-800 tracking-wide">KOHO Financial Inc.</p>
        <p className="text-[9px] text-gray-500 leading-snug">{KOHO_ADDR}</p>
      </div>
    </div>
  );
}

/** Statement title + name + address block */
function StatementTitle({ label }: { label: ReturnType<typeof formatLabel> }) {
  return (
    <div className="px-6 pt-3 pb-3 border-b border-gray-200">
      <p className="text-[12px] font-bold text-gray-900 leading-snug">
        KOHO Statement ({label.start} to {label.end})
      </p>
      <p className="text-[10.5px] font-bold text-gray-800 mt-1">{USER_NAME}</p>
      <p className="text-[9.5px] text-gray-500">{USER_ADDR}</p>
    </div>
  );
}

/** Prepaid card summary block — page 1 only */
function SummaryBlock({
  label, accountNumber, data,
}: {
  label: ReturnType<typeof formatLabel>;
  accountNumber: string;
  data: StatementData;
}) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <p className="text-[11px] font-bold text-gray-900 mb-3">Your Prepaid Card Summary</p>
      <p className="text-[9.5px] text-gray-700 mb-2">
        Account number: <span className="font-semibold">{accountNumber}</span>
      </p>

      {/* Summary rows */}
      <div className="space-y-0.5 text-[9.5px]">
        <SumRow label={`Balance on ${label.startShort}, ${label.year}`} value={fmtDollar(data.openingBalance)} bold />
        <SumRow label="         Minus total withdrawals"  value={fmtDollar(data.totalWithdrawals)} />
        <SumRow label="         Minus total funds pending" value={fmtDollar(data.pendingFunds)} />
        <SumRow label="         Plus total reimbursed"    value={fmtDollar(data.totalReimbursed)} />
        <SumRow label="         Plus total loads"         value={fmtDollar(data.totalLoads)} />
      </div>

      <div className="h-3" />

      {/* Closing balance — double underline */}
      <div className="border-t-2 border-b-2 border-gray-800 py-1 flex justify-between">
        <p className="text-[9.5px] font-bold text-gray-900">
          Closing balance on {label.endShort}, {label.year}
        </p>
        <p className="text-[9.5px] font-bold text-gray-900">{fmtDollar(data.closingBalance)}</p>
      </div>
    </div>
  );
}

function SumRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <p className={`whitespace-pre ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>{label}</p>
      <p className={`tabular-nums ml-2 shrink-0 ${bold ? "font-semibold text-gray-900" : "text-gray-700"}`}>{value}</p>
    </div>
  );
}

/** Transaction table */
function TxTable({ rows, showSectionHeader }: { rows: StatementRow[]; showSectionHeader: boolean }) {
  return (
    <div>
      {showSectionHeader && (
        <div className="px-6 pt-4 pb-1">
          <p className="text-[11px] font-bold text-gray-900">What Happened This Period</p>
        </div>
      )}
      <table className="w-full" style={{ fontSize: "9px", fontFamily: "inherit" }}>
        <thead>
          <tr>
            <th className="text-left px-3 py-1.5 text-gray-700 font-bold border-b border-t border-gray-300 w-[50px]">Date</th>
            <th className="text-left px-2 py-1.5 text-gray-700 font-bold border-b border-t border-gray-300">Transaction</th>
            <th className="text-right px-2 py-1.5 text-gray-700 font-bold border-b border-t border-gray-300 w-[56px] whitespace-nowrap">Loads ($)</th>
            <th className="text-right px-2 py-1.5 text-gray-700 font-bold border-b border-t border-gray-300 w-[70px] whitespace-nowrap">Withdrawal ($)</th>
            <th className="text-right px-3 py-1.5 text-gray-700 font-bold border-b border-t border-gray-300 w-[58px] whitespace-nowrap">Balance ($)</th>
          </tr>
          {showSectionHeader && (
            <tr style={{ backgroundColor: "#EDE9FF" }}>
              <td colSpan={5} className="text-center py-1 font-semibold text-gray-600" style={{ fontSize: "8.5px" }}>
                Posted Transactions
              </td>
            </tr>
          )}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-400" style={{ fontSize: "10px" }}>
                No transactions this month
              </td>
            </tr>
          ) : rows.map(tx => (
            <tr
              key={tx.id}
              className="border-b border-gray-100"
              style={{ backgroundColor: tx.isCredit ? "#F3F0FF" : "white" }}
            >
              <td className="px-3 py-[3.5px] text-gray-600 tabular-nums whitespace-nowrap align-top">{dateShort(tx.date)}</td>
              <td className="px-2 py-[3.5px] text-gray-800">{tx.merchant}</td>
              <td className="px-2 py-[3.5px] text-right text-gray-700 tabular-nums">{tx.isCredit ? fmtAmt(tx.amount) : ""}</td>
              <td className="px-2 py-[3.5px] text-right text-gray-700 tabular-nums">{!tx.isCredit ? fmtAmt(tx.amount) : ""}</td>
              <td className="px-3 py-[3.5px] text-right text-gray-800 font-medium tabular-nums">{fmtAmt(tx.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Page footer */
function PageFooter({ createdDate, page, total }: { createdDate: string; page: number; total: number }) {
  return (
    <div className="px-6 pt-3 pb-4 flex items-end justify-between border-t border-gray-200 mt-2">
      <div>
        <p className="text-[8px] text-gray-400 leading-snug">This report was created on {createdDate}</p>
        <p className="text-[8px] text-gray-400 leading-snug">
          Dates and times in this document are in Mountain Standard Time (MST)
        </p>
      </div>
      <p className="text-[8px] text-gray-400 ml-2 shrink-0">Page {page} of {total}</p>
    </div>
  );
}

/** Please Note block — last page only */
function PleaseNote() {
  return (
    <div className="px-6 pt-5 pb-4 border-t border-gray-200">
      <p className="text-[10px] font-bold text-gray-900 mb-1.5">Please Note</p>
      <p className="text-[8.5px] text-gray-500 leading-relaxed">
        To simplify your statement, transactions appear as a single settled amount rather than multiple entries for
        authorizations, reversals, and settlements. Only finalized transactions will be displayed, meaning pending
        authorizations won't appear until they are fully processed. For example, if you authorize $500 at a gas station
        but the actual charge is $50, your statement will only show the final $50 in the month it is settled. This
        update makes your statement clearer and easier to track!
      </p>
    </div>
  );
}

/* ─── main ───────────────────────────────────────────────────────────────── */

export default function Statement() {
  const params = useParams<{ month: string }>();
  const slug = params.month ?? "";
  const yyyymm = slugToYYYYMM(slug);
  const label = formatLabel(slug);

  const { data: account } = useGetAccount();
  const [data, setData] = useState<StatementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetch(`${BASE}/api/statements/${yyyymm}`)
      .then(r => r.json())
      .then((d: StatementData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [yyyymm]);

  const accountNumber = account?.accountNumber ?? "218130721705";
  const createdDate = new Date().toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.transactions.length / PAGE_SIZE)) : 1;
  const visibleTx = data
    ? data.transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : [];

  const handleShare = () => {
    const text = data
      ? `KOHO Statement ${label.start}–${label.end}\nOpening: ${fmtDollar(data.openingBalance)}\nWithdrawals: ${fmtDollar(data.totalWithdrawals)}\nLoads: ${fmtDollar(data.totalLoads)}\nClosing: ${fmtDollar(data.closingBalance)}`
      : `KOHO Statement ${label.long}`;
    if (navigator.share) navigator.share({ title: `KOHO Statement ${label.long}`, text });
    else navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div
      className="h-full overflow-y-auto flex flex-col"
      style={{ backgroundColor: "#D1D5DB" }}
    >
      {/* App navigation bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <Link
          href="/monthly-statements"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="font-bold text-sm text-gray-900">{label.long}</span>
        </div>
        <button
          onClick={handleShare}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <Share2 className="w-4 h-4 text-gray-700" />
        </button>
      </header>

      {/* Page counter pill — matches iOS PDF viewer style */}
      {!loading && data && totalPages > 1 && (
        <div className="flex justify-center pt-3 pb-0">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-xl px-3 py-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-[11px] font-bold text-gray-500 disabled:opacity-30 px-1"
            >
              ‹
            </button>
            <span className="text-[11px] font-semibold text-gray-700">{page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-[11px] font-bold text-gray-500 disabled:opacity-30 px-1"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-4 space-y-3 max-w-xl mx-auto w-full">
          <Skeleton className="h-12 w-full rounded-none" />
          <Skeleton className="h-40 w-full rounded-none" />
          <Skeleton className="h-64 w-full rounded-none" />
        </div>
      ) : !data ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300" />
          <p className="font-bold text-gray-700">No statement available</p>
          <p className="text-sm text-gray-400">No transactions found for {label.long}</p>
        </div>
      ) : (
        <div className="py-3 px-3 max-w-xl mx-auto w-full">

          {/* ── White document page ── */}
          <div
            className="bg-white shadow-lg"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {/* Letterhead: page 1 shows no KOHO wordmark, pages 2+ show it */}
            <PageHeader showLogo={page > 1} />

            {/* Page 1: statement title + prepaid summary */}
            {page === 1 && (
              <>
                <StatementTitle label={label} />
                <SummaryBlock label={label} accountNumber={accountNumber} data={data} />
              </>
            )}

            {/* Pages 2+: minimal statement title repeats */}
            {page > 1 && (
              <StatementTitle label={label} />
            )}

            {/* Transaction table */}
            <TxTable rows={visibleTx} showSectionHeader={page === 1} />

            {/* Please Note — last page only */}
            {page === totalPages && <PleaseNote />}

            {/* Footer */}
            <PageFooter createdDate={createdDate} page={page} total={totalPages} />
          </div>

          {/* ── Page navigation ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white mt-2 px-4 py-3 shadow-sm">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-30"
                style={{ color: "#7B4FFF" }}
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-full text-xs font-bold transition-all"
                    style={p === page
                      ? { backgroundColor: "#7B4FFF", color: "white" }
                      : { color: "#9CA3AF" }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-30"
                style={{ color: "#7B4FFF" }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
