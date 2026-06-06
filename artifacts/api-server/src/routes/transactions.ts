import { Router } from "express";
import { db } from "@workspace/db";
import { transactionsTable } from "@workspace/db";
import { ilike, eq, desc } from "drizzle-orm";

const router = Router();

router.get("/transactions", async (req, res) => {
  try {
    const { search, category, month, dateRange, sort = "date_desc", limit = "50", offset = "0" } = req.query as Record<string, string>;

    const rows = await db.select().from(transactionsTable).orderBy(desc(transactionsTable.date), desc(transactionsTable.id));

    let filtered = rows;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(t => t.merchant.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    if (category) {
      filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }
    if (month) {
      // month format: "2026-04"
      filtered = filtered.filter(t => t.date && t.date.startsWith(month));
    }
    if (dateRange === "this_week" || dateRange === "this_month") {
      const now = new Date();
      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth() + 1;
      const todayDay = now.getDate();
      if (dateRange === "this_month") {
        filtered = filtered.filter(t => {
          const p = parseDbDate(t.date ?? "");
          return p ? (p.year === todayYear && p.month === todayMonth) : false;
        });
      } else {
        // this_week: last 7 days inclusive
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 6);
        const cutoffYear = cutoff.getFullYear();
        const cutoffMonth = cutoff.getMonth() + 1;
        const cutoffDay = cutoff.getDate();
        filtered = filtered.filter(t => {
          const p = parseDbDate(t.date ?? "");
          if (!p) return false;
          if (p.year < cutoffYear) return false;
          if (p.year > todayYear) return false;
          if (p.year === cutoffYear && p.month < cutoffMonth) return false;
          if (p.year === cutoffYear && p.month === cutoffMonth && p.day < cutoffDay) return false;
          if (p.year === todayYear && p.month > todayMonth) return false;
          if (p.year === todayYear && p.month === todayMonth && p.day > todayDay) return false;
          return true;
        });
      }
    }

    // Apply sort
    const compareDates = (a: typeof rows[number], b: typeof rows[number], dir: 1 | -1) => {
      const pa = parseDbDate(a.date ?? "");
      const pb = parseDbDate(b.date ?? "");
      if (!pa || !pb) return 0;
      if (pa.year !== pb.year) return (pa.year - pb.year) * dir;
      if (pa.month !== pb.month) return (pa.month - pb.month) * dir;
      if (pa.day !== pb.day) return (pa.day - pb.day) * dir;
      return (a.id - b.id) * dir;
    };

    if (sort === "date_asc") {
      filtered = [...filtered].sort((a, b) => compareDates(a, b, 1));
    } else if (sort === "amount_desc") {
      filtered = [...filtered].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (sort === "amount_asc") {
      filtered = [...filtered].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    } else {
      // date_desc: newest first using proper date parsing
      filtered = [...filtered].sort((a, b) => compareDates(a, b, -1));
    }

    const sliced = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json(sliced.map(t => ({
      id: t.id,
      merchant: t.merchant,
      amount: parseFloat(t.amount),
      category: t.category,
      date: t.date,
      time: t.time,
      status: t.status,
      merchantIcon: t.merchantIcon,
      merchantColor: t.merchantColor,
      isCredit: t.isCredit,
    })));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const MONTH_ABBR: Record<string, string> = {
  "01": "JAN", "02": "FEB", "03": "MAR", "04": "APR",
  "05": "MAY", "06": "JUN", "07": "JUL", "08": "AUG",
  "09": "SEP", "10": "OCT", "11": "NOV", "12": "DEC",
};
const MONTH_NUM: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

// Parse "MAY 5TH, 2026" → { year: 2026, month: 5, day: 5 }
function parseDbDate(d: string): { year: number; month: number; day: number } | null {
  const m = d.match(/^([A-Z]{3})\s+(\d+)[A-Z]{0,2},\s*(\d{4})$/i);
  if (!m) return null;
  return { year: parseInt(m[3]), month: MONTH_NUM[m[1].toUpperCase()] ?? 0, day: parseInt(m[2]) };
}

router.get("/statements/:month", async (req, res) => {
  try {
    const { month } = req.params; // format: "2026-04"
    const [yearStr, mmStr] = month.split("-");
    const targetYear  = parseInt(yearStr);
    const targetMonth = parseInt(mmStr);
    const abbr = MONTH_ABBR[mmStr] ?? "";

    const allRows = await db.select().from(transactionsTable);

    // Sort by parsed date then id
    allRows.sort((a, b) => {
      const pa = parseDbDate(a.date ?? "");
      const pb = parseDbDate(b.date ?? "");
      if (!pa || !pb) return 0;
      if (pa.year !== pb.year) return pa.year - pb.year;
      if (pa.month !== pb.month) return pa.month - pb.month;
      if (pa.day !== pb.day) return pa.day - pb.day;
      return a.id - b.id;
    });

    // Split into "before month" and "this month"
    const beforeMonth = allRows.filter(t => {
      const p = parseDbDate(t.date ?? "");
      if (!p) return false;
      return p.year < targetYear || (p.year === targetYear && p.month < targetMonth);
    });
    const thisMonth = allRows.filter(t => {
      const p = parseDbDate(t.date ?? "");
      if (!p) return false;
      return p.year === targetYear && p.month === targetMonth;
    });

    // Genesis balance so account looks realistic
    const GENESIS = 5235.51;
    const priorDelta = beforeMonth.reduce((sum, t) => {
      const amt = parseFloat(t.amount);
      return sum + (t.isCredit ? amt : -amt);
    }, 0);
    const openingBalance = Math.max(0, GENESIS + priorDelta);

    let running = openingBalance;
    const txRows = thisMonth.map(t => {
      const amt = parseFloat(t.amount);
      if (t.isCredit) running += amt; else running -= amt;
      return {
        id: t.id,
        date: t.date,
        merchant: t.merchant,
        amount: amt,
        isCredit: t.isCredit,
        balance: Math.max(0, parseFloat(running.toFixed(2))),
      };
    });

    const totalLoads       = thisMonth.filter(t => t.isCredit).reduce((s, t) => s + parseFloat(t.amount), 0);
    const totalWithdrawals = thisMonth.filter(t => !t.isCredit).reduce((s, t) => s + parseFloat(t.amount), 0);
    const closingBalance   = Math.max(0, parseFloat(running.toFixed(2)));

    res.json({
      month,
      openingBalance: parseFloat(openingBalance.toFixed(2)),
      totalLoads:     parseFloat(totalLoads.toFixed(2)),
      totalWithdrawals: parseFloat(totalWithdrawals.toFixed(2)),
      pendingFunds: 0,
      totalReimbursed: 0,
      closingBalance,
      transactions: txRows,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions/recent", async (_req, res) => {
  try {
    const rows = await db.select().from(transactionsTable)
      .orderBy(desc(transactionsTable.date), desc(transactionsTable.id))
      .limit(8);

    res.json(rows.map(t => ({
      id: t.id,
      merchant: t.merchant,
      amount: parseFloat(t.amount),
      category: t.category,
      date: t.date,
      time: t.time,
      status: t.status,
      merchantIcon: t.merchantIcon,
      merchantColor: t.merchantColor,
      isCredit: t.isCredit,
    })));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions/spending-summary", async (_req, res) => {
  try {
    const rows = await db.select().from(transactionsTable);
    const map: Record<string, { amount: number; count: number }> = {};
    for (const t of rows) {
      if (!t.isCredit) {
        const cat = t.category;
        if (!map[cat]) map[cat] = { amount: 0, count: 0 };
        map[cat].amount += parseFloat(t.amount);
        map[cat].count += 1;
      }
    }
    const result = Object.entries(map)
      .map(([category, { amount, count }]) => ({ category, amount: Math.round(amount * 100) / 100, count }))
      .sort((a, b) => b.amount - a.amount);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/spending/insights", async (req, res) => {
  try {
    const rows = await db.select().from(transactionsTable);

    // Support optional ?month=YYYY-MM to browse historical months
    const monthParam = (req.query as Record<string, string>).month;
    let thisYear: number;
    let thisMonth: number;
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [y, m] = monthParam.split("-").map(Number);
      thisYear = y;
      thisMonth = m;
    } else {
      const now = new Date();
      thisYear = now.getFullYear();
      thisMonth = now.getMonth() + 1;
    }
    const prevYear = thisMonth === 1 ? thisYear - 1 : thisYear;
    const prevMonth = thisMonth === 1 ? 12 : thisMonth - 1;

    const inMonth = (date: string | null, year: number, month: number) => {
      if (!date) return false;
      const p = parseDbDate(date);
      return p ? (p.year === year && p.month === month) : false;
    };

    const thisMonthRows = rows.filter(t => !t.isCredit && inMonth(t.date, thisYear, thisMonth));
    const lastMonthRows = rows.filter(t => !t.isCredit && inMonth(t.date, prevYear, prevMonth));

    const summarize = (txs: typeof rows) => {
      const map: Record<string, { amount: number; count: number }> = {};
      for (const t of txs) {
        const cat = t.category;
        if (!map[cat]) map[cat] = { amount: 0, count: 0 };
        map[cat].amount += parseFloat(t.amount);
        map[cat].count += 1;
      }
      const categories = Object.entries(map)
        .map(([category, { amount, count }]) => ({ category, amount: Math.round(amount * 100) / 100, count }))
        .sort((a, b) => b.amount - a.amount);
      const total = Math.round(txs.reduce((s, t) => s + parseFloat(t.amount), 0) * 100) / 100;
      return { total, categories };
    };

    const merchantMap: Record<string, { amount: number; count: number; merchantColor: string | null }> = {};
    for (const t of thisMonthRows) {
      if (!merchantMap[t.merchant]) merchantMap[t.merchant] = { amount: 0, count: 0, merchantColor: t.merchantColor };
      merchantMap[t.merchant].amount += parseFloat(t.amount);
      merchantMap[t.merchant].count += 1;
    }
    const topMerchants = Object.entries(merchantMap)
      .map(([merchant, { amount, count, merchantColor }]) => ({
        merchant,
        amount: Math.round(amount * 100) / 100,
        count,
        merchantColor,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    const pad = (n: number) => String(n).padStart(2, "0");
    res.json({
      currentMonth: `${thisYear}-${pad(thisMonth)}`,
      previousMonth: `${prevYear}-${pad(prevMonth)}`,
      thisMonth: summarize(thisMonthRows),
      lastMonth: summarize(lastMonthRows),
      topMerchants,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/spending/monthly-trend", async (_req, res) => {
  try {
    const rows = await db.select().from(transactionsTable);

    const now = new Date();
    const months: { year: number; month: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }

    const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const pad = (n: number) => String(n).padStart(2, "0");

    const result = months.map(({ year, month }) => {
      const total = rows
        .filter(t => {
          if (t.isCredit) return false;
          const p = parseDbDate(t.date ?? "");
          return p ? (p.year === year && p.month === month) : false;
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      return {
        month: `${year}-${pad(month)}`,
        label: MONTH_LABELS[month - 1],
        total: Math.round(total * 100) / 100,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select().from(transactionsTable).where(eq(transactionsTable.id, id));
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    const t = rows[0];
    res.json({
      id: t.id,
      merchant: t.merchant,
      amount: parseFloat(t.amount),
      category: t.category,
      date: t.date,
      time: t.time,
      status: t.status,
      merchantIcon: t.merchantIcon,
      merchantColor: t.merchantColor,
      isCredit: t.isCredit,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
