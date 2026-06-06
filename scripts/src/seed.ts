import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  accountsTable,
  savingsTable,
  goalsTable,
  cashbackTable,
  cryptoTable,
  creditTable,
  transactionsTable,
} from "../../lib/db/src/schema/index.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

await db.insert(accountsTable).values({
  name: "Alex Johnson",
  email: "alex@koho.ca",
  spendableBalance: "1243.87",
  coverAvailable: "150.00",
  coverLimit: "150.00",
  accountNumber: "218130721705",
  transitNumber: "16001",
  institutionNumber: "621",
  institutionName: "Peoples Trust Company",
  notificationCount: 3,
}).onConflictDoNothing();

await db.insert(savingsTable).values({
  vault: "3842.50",
  roundups: "47.23",
  interestRate: "2.00",
  totalInterestEarned: "15.10",
});

await db.insert(goalsTable).values([
  { name: "Vacation Fund", targetAmount: "2000.00", currentAmount: "850.00", emoji: "✈️", deadline: "DEC 2026" },
  { name: "Emergency Fund", targetAmount: "5000.00", currentAmount: "3842.50", emoji: "🛡️" },
  { name: "New Laptop", targetAmount: "1500.00", currentAmount: "320.00", emoji: "💻", deadline: "SEP 2026" },
]);

await db.insert(cashbackTable).values({
  totalEarned: "11.49",
  earnedThisMonth: "2.35",
  earnedLastMonth: "5.13",
  rate: "0.5",
});

await db.insert(cryptoTable).values([
  { symbol: "BTC", name: "Bitcoin", amount: "0.00412000", value: "245.80", change24h: "2.34" },
  { symbol: "ETH", name: "Ethereum", amount: "0.15200000", value: "312.40", change24h: "-1.12" },
]);

await db.insert(creditTable).values({
  score: "571",
  scoreChange: "12",
  status: "Building",
  nextRange: "89",
  creditBuildingActive: true,
  creditBuildingActionRequired: true,
  securedCreditActive: false,
  rentReportingActive: false,
});

await db.insert(transactionsTable).values([
  { merchant: "Tim Hortons", amount: "4.75", category: "Food & Drink", date: "JUN 6TH, 2026", time: "8:32 AM", status: "completed", merchantIcon: "☕", merchantColor: "#c8102e", isCredit: false },
  { merchant: "Netflix", amount: "17.99", category: "Entertainment", date: "JUN 5TH, 2026", time: "12:00 AM", status: "completed", merchantIcon: "🎬", merchantColor: "#e50914", isCredit: false },
  { merchant: "Loblaws", amount: "63.42", category: "Groceries", date: "JUN 4TH, 2026", time: "5:14 PM", status: "completed", merchantIcon: "🛒", merchantColor: "#f5a623", isCredit: false },
  { merchant: "Payroll Deposit", amount: "1850.00", category: "Income", date: "JUN 1ST, 2026", time: "6:00 AM", status: "completed", merchantIcon: "💰", merchantColor: "#2ecc71", isCredit: true },
  { merchant: "Uber", amount: "12.30", category: "Transport", date: "MAY 31ST, 2026", time: "11:45 PM", status: "completed", merchantIcon: "🚗", merchantColor: "#000000", isCredit: false },
  { merchant: "Amazon", amount: "34.99", category: "Shopping", date: "MAY 30TH, 2026", time: "3:22 PM", status: "completed", merchantIcon: "📦", merchantColor: "#ff9900", isCredit: false },
  { merchant: "Spotify", amount: "11.99", category: "Entertainment", date: "MAY 28TH, 2026", time: "12:00 AM", status: "completed", merchantIcon: "🎵", merchantColor: "#1db954", isCredit: false },
  { merchant: "Shoppers Drug Mart", amount: "8.47", category: "Health", date: "MAY 27TH, 2026", time: "2:05 PM", status: "completed", merchantIcon: "💊", merchantColor: "#e30613", isCredit: false },
]);

console.log("Seed complete.");
await pool.end();
