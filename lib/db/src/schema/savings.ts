import { pgTable, serial, text, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savingsTable = pgTable("savings", {
  id: serial("id").primaryKey(),
  vault: numeric("vault", { precision: 12, scale: 2 }).notNull().default("0"),
  roundups: numeric("roundups", { precision: 12, scale: 2 }).notNull().default("0"),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).notNull().default("2"),
  totalInterestEarned: numeric("total_interest_earned", { precision: 12, scale: 2 }).notNull().default("15.10"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const goalsTable = pgTable("goals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  targetAmount: numeric("target_amount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  emoji: text("emoji").notNull().default("🎯"),
  deadline: text("deadline"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cashbackTable = pgTable("cashback", {
  id: serial("id").primaryKey(),
  totalEarned: numeric("total_earned", { precision: 12, scale: 2 }).notNull().default("11.49"),
  earnedThisMonth: numeric("earned_this_month", { precision: 12, scale: 2 }).notNull().default("2.35"),
  earnedLastMonth: numeric("earned_last_month", { precision: 12, scale: 2 }).notNull().default("5.13"),
  rate: numeric("rate", { precision: 5, scale: 2 }).notNull().default("0.5"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cryptoTable = pgTable("crypto_holdings", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull().default("0"),
  value: numeric("value", { precision: 12, scale: 2 }).notNull().default("0"),
  change24h: numeric("change_24h", { precision: 8, scale: 4 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const creditTable = pgTable("credit_profiles", {
  id: serial("id").primaryKey(),
  score: numeric("score", { precision: 5, scale: 0 }).notNull().default("571"),
  scoreChange: numeric("score_change", { precision: 5, scale: 0 }).notNull().default("0"),
  status: text("status").notNull().default("Building"),
  nextRange: numeric("next_range", { precision: 5, scale: 0 }).notNull().default("89"),
  creditBuildingActive: boolean("credit_building_active").notNull().default(true),
  creditBuildingActionRequired: boolean("credit_building_action_required").notNull().default(true),
  securedCreditActive: boolean("secured_credit_active").notNull().default(false),
  rentReportingActive: boolean("rent_reporting_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGoalSchema = createInsertSchema(goalsTable).omit({ id: true, createdAt: true });
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goalsTable.$inferSelect;
