import { Router } from "express";
import { db } from "@workspace/db";
import { accountsTable, savingsTable, goalsTable, cashbackTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/account", async (_req, res) => {
  try {
    const accounts = await db.select().from(accountsTable).limit(1);
    if (accounts.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    const acct = accounts[0];
    res.json({
      id: acct.id,
      name: acct.name,
      email: acct.email,
      spendableBalance: parseFloat(acct.spendableBalance),
      coverAvailable: parseFloat(acct.coverAvailable),
      coverLimit: parseFloat(acct.coverLimit),
      accountNumber: acct.accountNumber,
      transitNumber: acct.transitNumber,
      institutionNumber: acct.institutionNumber,
      institutionName: acct.institutionName,
      notificationCount: acct.notificationCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/account/summary", async (_req, res) => {
  try {
    const [accounts, savings, cashback, goals] = await Promise.all([
      db.select().from(accountsTable).limit(1),
      db.select().from(savingsTable).limit(1),
      db.select().from(cashbackTable).limit(1),
      db.select().from(goalsTable),
    ]);

    const acct = accounts[0];
    const sav = savings[0];
    const cb = cashback[0];

    const goalTotal = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);

    res.json({
      totalBalance: acct ? parseFloat(acct.spendableBalance) + (sav ? parseFloat(sav.vault) + parseFloat(sav.roundups) : 0) + goalTotal : 0,
      spendable: acct ? parseFloat(acct.spendableBalance) : 0,
      vault: sav ? parseFloat(sav.vault) : 0,
      roundups: sav ? parseFloat(sav.roundups) : 0,
      goals: goalTotal,
      interestRate: sav ? parseFloat(sav.interestRate) : 2,
      cashbackThisMonth: cb ? parseFloat(cb.earnedThisMonth) : 0,
      cashbackAllTime: cb ? parseFloat(cb.totalEarned) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/plan", async (_req, res) => {
  try {
    const [accounts, savings, cashback, goals] = await Promise.all([
      db.select().from(accountsTable).limit(1),
      db.select().from(savingsTable).limit(1),
      db.select().from(cashbackTable).limit(1),
      db.select().from(goalsTable),
    ]);

    const acct = accounts[0];
    const sav = savings[0];
    const cb = cashback[0];
    const goalTotal = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount), 0);

    res.json({
      name: "Essential",
      renewalDate: "June 15th, 2026",
      interestRate: sav ? parseFloat(sav.interestRate) : 2,
      totalBalance: acct ? parseFloat(acct.spendableBalance) + (sav ? parseFloat(sav.vault) + parseFloat(sav.roundups) : 0) + goalTotal : 0,
      spendable: acct ? parseFloat(acct.spendableBalance) : 0,
      vault: sav ? parseFloat(sav.vault) : 0,
      roundups: sav ? parseFloat(sav.roundups) : 0,
      goals: goalTotal,
      cashbackEarnedLastMonth: cb ? parseFloat(cb.earnedLastMonth) : 0,
      cashbackAllTime: cb ? parseFloat(cb.totalEarned) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
