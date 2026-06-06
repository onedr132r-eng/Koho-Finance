import { pgTable, serial, text, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const accountsTable = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  spendableBalance: numeric("spendable_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  coverAvailable: numeric("cover_available", { precision: 12, scale: 2 }).notNull().default("0"),
  coverLimit: numeric("cover_limit", { precision: 12, scale: 2 }).notNull().default("150"),
  accountNumber: text("account_number").notNull().default("218130721705"),
  transitNumber: text("transit_number").notNull().default("16001"),
  institutionNumber: text("institution_number").notNull().default("621"),
  institutionName: text("institution_name").notNull().default("Peoples Trust Company"),
  notificationCount: integer("notification_count").notNull().default(10),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAccountSchema = createInsertSchema(accountsTable).omit({ id: true, createdAt: true });
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accountsTable.$inferSelect;
