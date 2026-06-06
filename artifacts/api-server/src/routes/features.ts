import { Router } from "express";
import { db } from "@workspace/db";
import { accountsTable, savingsTable, cashbackTable, cryptoTable, creditTable, goalsTable, transactionsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

function todayStr(): string {
  const now = new Date();
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const day = now.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "ST"
    : day === 2 || day === 22 ? "ND"
    : day === 3 || day === 23 ? "RD"
    : "TH";
  return `${months[now.getMonth()]} ${day}${suffix}, ${now.getFullYear()}`;
}

function timeStr(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

router.get("/features/cover", async (_req, res) => {
  try {
    const accounts = await db.select().from(accountsTable).limit(1);
    if (!accounts[0]) return res.status(404).json({ error: "Not found" });
    const acct = accounts[0];
    res.json({
      available: parseFloat(acct.coverAvailable),
      limit: parseFloat(acct.coverLimit),
      isActive: parseFloat(acct.coverLimit) > 0,
      fee: 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/features/cashback", async (_req, res) => {
  try {
    const rows = await db.select().from(cashbackTable).limit(1);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    const cb = rows[0];
    res.json({
      totalEarned: parseFloat(cb.totalEarned),
      earnedThisMonth: parseFloat(cb.earnedThisMonth),
      earnedLastMonth: parseFloat(cb.earnedLastMonth),
      rate: parseFloat(cb.rate),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/features/crypto", async (_req, res) => {
  try {
    const holdings = await db.select().from(cryptoTable);
    const totalBalance = holdings.reduce((sum, h) => sum + parseFloat(h.value), 0);
    res.json({
      balance: Math.round(totalBalance * 100) / 100,
      allTimeChange: -1.35,
      holdings: holdings.map(h => ({
        symbol: h.symbol,
        name: h.name,
        amount: parseFloat(h.amount),
        value: parseFloat(h.value),
        change24h: parseFloat(h.change24h),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/credit", async (_req, res) => {
  try {
    const rows = await db.select().from(creditTable).limit(1);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    const c = rows[0];
    res.json({
      score: parseInt(c.score.toString()),
      scoreChange: parseInt(c.scoreChange.toString()),
      status: c.status,
      nextRange: parseInt(c.nextRange.toString()),
      creditBuildingActive: c.creditBuildingActive,
      creditBuildingActionRequired: c.creditBuildingActionRequired,
      securedCreditActive: c.securedCreditActive,
      rentReportingActive: c.rentReportingActive,
      ranges: [
        { label: "Excellent", min: 760, max: 900, color: "#22c55e" },
        { label: "Very Good", min: 720, max: 759, color: "#4ade80" },
        { label: "Good", min: 660, max: 719, color: "#eab308" },
        { label: "Fair", min: 560, max: 659, color: "#f97316" },
        { label: "Poor", min: 300, max: 559, color: "#ef4444" },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/savings", async (_req, res) => {
  try {
    const rows = await db.select().from(savingsTable).limit(1);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    const s = rows[0];
    res.json({
      vault: parseFloat(s.vault),
      roundups: parseFloat(s.roundups),
      interestRate: parseFloat(s.interestRate),
      totalInterestEarned: parseFloat(s.totalInterestEarned),
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/savings/goals", async (_req, res) => {
  try {
    const goals = await db.select().from(goalsTable);
    res.json(goals.map(g => ({
      id: g.id,
      name: g.name,
      targetAmount: parseFloat(g.targetAmount),
      currentAmount: parseFloat(g.currentAmount),
      emoji: g.emoji,
      deadline: g.deadline,
    })));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/savings/goals/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select().from(goalsTable).where(eq(goalsTable.id, id));
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    const g = rows[0];
    res.json({
      id: g.id,
      name: g.name,
      targetAmount: parseFloat(g.targetAmount),
      currentAmount: parseFloat(g.currentAmount),
      emoji: g.emoji,
      deadline: g.deadline,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/savings/goals", async (req, res) => {
  try {
    const { name, targetAmount, emoji, deadline } = req.body;
    if (!name || !targetAmount) return res.status(400).json({ error: "name and targetAmount required" });
    const [goal] = await db.insert(goalsTable).values({
      name,
      targetAmount: String(targetAmount),
      emoji: emoji || "🎯",
      deadline: deadline || null,
      currentAmount: "0",
    }).returning();
    res.status(201).json({
      id: goal.id,
      name: goal.name,
      targetAmount: parseFloat(goal.targetAmount),
      currentAmount: parseFloat(goal.currentAmount),
      emoji: goal.emoji,
      deadline: goal.deadline,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/savings/goals/:id/deposit", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });
    const spendable = parseFloat(acct.spendableBalance);
    if (amount > spendable) return res.status(400).json({ error: "Insufficient balance" });

    const [goal] = await db.select().from(goalsTable).where(eq(goalsTable.id, id));
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    const newCurrent = parseFloat(goal.currentAmount) + amount;
    const newSpendable = spendable - amount;

    await Promise.all([
      db.update(goalsTable).set({ currentAmount: newCurrent.toFixed(2) }).where(eq(goalsTable.id, id)),
      db.update(accountsTable).set({ spendableBalance: newSpendable.toFixed(2) }).where(eq(accountsTable.id, acct.id)),
    ]);

    res.json({ success: true, currentAmount: newCurrent, spendableBalance: newSpendable });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/savings/goals/:id/withdraw", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const [goal] = await db.select().from(goalsTable).where(eq(goalsTable.id, id));
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    const current = parseFloat(goal.currentAmount);
    if (amount > current) return res.status(400).json({ error: "Insufficient goal balance" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });

    const newCurrent = current - amount;
    const newSpendable = parseFloat(acct.spendableBalance) + amount;

    await Promise.all([
      db.update(goalsTable).set({ currentAmount: newCurrent.toFixed(2) }).where(eq(goalsTable.id, id)),
      db.update(accountsTable).set({ spendableBalance: newSpendable.toFixed(2) }).where(eq(accountsTable.id, acct.id)),
    ]);

    res.json({ success: true, currentAmount: newCurrent, spendableBalance: newSpendable });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    const { merchant, amount, category, isCredit = false, merchantColor, scheduledDate } = req.body;
    if (!merchant || !amount || !category) return res.status(400).json({ error: "merchant, amount, category required" });

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: "Invalid amount" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });
    const spendable = parseFloat(acct.spendableBalance);

    if (!isCredit && amt > spendable) return res.status(400).json({ error: "Insufficient balance" });

    // Scheduled future payments are marked pending and do NOT deduct from balance yet
    const isScheduled = Boolean(scheduledDate);
    const txStatus = isScheduled ? "pending" : "completed";
    const txDate = isScheduled ? scheduledDate : todayStr();
    const newSpendable = (isScheduled || isCredit) ? spendable + (isCredit ? amt : 0) : spendable - amt;

    const [tx] = await db.insert(transactionsTable).values({
      merchant,
      amount: amt.toFixed(2),
      category,
      date: txDate,
      time: timeStr(),
      status: txStatus,
      isCredit,
      merchantColor: merchantColor || null,
    }).returning();

    if (!isScheduled) {
      await db.update(accountsTable)
        .set({ spendableBalance: newSpendable.toFixed(2) })
        .where(eq(accountsTable.id, acct.id));
    }

    res.status(201).json({
      id: tx.id,
      merchant: tx.merchant,
      amount: parseFloat(tx.amount),
      category: tx.category,
      date: tx.date,
      time: tx.time,
      status: tx.status,
      isCredit: tx.isCredit,
      scheduled: isScheduled,
      spendableBalance: isScheduled ? spendable : newSpendable,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vault/deposit", async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });
    const spendable = parseFloat(acct.spendableBalance);
    if (amount > spendable) return res.status(400).json({ error: "Insufficient balance" });

    const [sav] = await db.select().from(savingsTable).limit(1);
    if (!sav) return res.status(404).json({ error: "Savings not found" });

    const newSpendable = spendable - amount;
    const newVault = parseFloat(sav.vault) + amount;

    await Promise.all([
      db.update(accountsTable).set({ spendableBalance: newSpendable.toFixed(2) }).where(eq(accountsTable.id, acct.id)),
      db.update(savingsTable).set({ vault: newVault.toFixed(2) }).where(eq(savingsTable.id, sav.id)),
    ]);

    res.json({ success: true, vault: newVault, spendableBalance: newSpendable });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vault/withdraw", async (req, res) => {
  try {
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const [sav] = await db.select().from(savingsTable).limit(1);
    if (!sav) return res.status(404).json({ error: "Savings not found" });
    const vault = parseFloat(sav.vault);
    if (amount > vault) return res.status(400).json({ error: "Insufficient vault balance" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });

    const newVault = vault - amount;
    const newSpendable = parseFloat(acct.spendableBalance) + amount;

    await Promise.all([
      db.update(savingsTable).set({ vault: newVault.toFixed(2) }).where(eq(savingsTable.id, sav.id)),
      db.update(accountsTable).set({ spendableBalance: newSpendable.toFixed(2) }).where(eq(accountsTable.id, acct.id)),
    ]);

    res.json({ success: true, vault: newVault, spendableBalance: newSpendable });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/roundups/round-now", async (req, res) => {
  try {
    const { roundLevel = 1 } = req.body;
    const level = parseFloat(roundLevel);
    if (isNaN(level) || level <= 0) return res.status(400).json({ error: "Invalid round level" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });
    const spendable = parseFloat(acct.spendableBalance);

    // Simulate spare change from last few "purchases" using deterministic values
    const cents = (spendable * 100) % (level * 100);
    const roundUpAmt = cents === 0 ? 0 : parseFloat(((level * 100 - cents) / 100).toFixed(2));

    if (roundUpAmt <= 0 || roundUpAmt > spendable) {
      // Fallback: use a fixed small round-up to make it always interactive
      const fallback = Math.min(level * 0.63, spendable);
      if (fallback <= 0) return res.status(400).json({ error: "Nothing to round up" });

      const [sav] = await db.select().from(savingsTable).limit(1);
      if (!sav) return res.status(404).json({ error: "Savings not found" });

      const newRoundups = parseFloat(sav.roundups) + fallback;
      const newSpendable = spendable - fallback;

      await Promise.all([
        db.update(savingsTable).set({ roundups: newRoundups.toFixed(2) }).where(eq(savingsTable.id, sav.id)),
        db.update(accountsTable).set({ spendableBalance: newSpendable.toFixed(2) }).where(eq(accountsTable.id, acct.id)),
      ]);

      return res.json({ success: true, roundedUp: parseFloat(fallback.toFixed(2)), roundups: newRoundups, spendableBalance: newSpendable });
    }

    const [sav] = await db.select().from(savingsTable).limit(1);
    if (!sav) return res.status(404).json({ error: "Savings not found" });

    const newRoundups = parseFloat(sav.roundups) + roundUpAmt;
    const newSpendable = spendable - roundUpAmt;

    await Promise.all([
      db.update(savingsTable).set({ roundups: newRoundups.toFixed(2) }).where(eq(savingsTable.id, sav.id)),
      db.update(accountsTable).set({ spendableBalance: newSpendable.toFixed(2) }).where(eq(accountsTable.id, acct.id)),
    ]);

    res.json({ success: true, roundedUp: roundUpAmt, roundups: newRoundups, spendableBalance: newSpendable });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/roundups/cashout", async (req, res) => {
  try {
    const [sav] = await db.select().from(savingsTable).limit(1);
    if (!sav) return res.status(404).json({ error: "Savings not found" });
    const roundups = parseFloat(sav.roundups);
    if (roundups <= 0) return res.status(400).json({ error: "No roundups balance" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });

    const newSpendable = parseFloat(acct.spendableBalance) + roundups;

    await Promise.all([
      db.update(savingsTable).set({ roundups: "0" }).where(eq(savingsTable.id, sav.id)),
      db.update(accountsTable).set({ spendableBalance: newSpendable.toFixed(2) }).where(eq(accountsTable.id, acct.id)),
    ]);

    res.json({ success: true, cashedOut: roundups, spendableBalance: newSpendable });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cover/activate", async (req, res) => {
  try {
    const limit = parseFloat(req.body.limit);
    if (isNaN(limit) || limit <= 0) return res.status(400).json({ error: "Invalid limit" });

    const [acct] = await db.select().from(accountsTable).limit(1);
    if (!acct) return res.status(404).json({ error: "Account not found" });

    await db.update(accountsTable)
      .set({ coverLimit: limit.toFixed(2), coverAvailable: limit.toFixed(2) })
      .where(eq(accountsTable.id, acct.id));

    res.json({ success: true, limit, available: limit, isActive: true });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
