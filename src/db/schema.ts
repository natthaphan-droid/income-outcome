import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  image: text("image"), // Added for profile picture (can store base64)
  passwordHash: text("password_hash"),
  pinHash: text("pin_hash"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  icon: text("icon"), // identifier for custom svg
  type: text("type").notNull(), // 'income' or 'expense'
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  categoryId: text("category_id").notNull().references(() => categories.id),
  amount: real("amount").notNull(), // monthly limit
  month: integer("month").notNull(), // e.g. 1-12
  year: integer("year").notNull(), // e.g. 2026
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const savingsGoals = sqliteTable("savings_goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  targetAmount: real("target_amount"),
  currentAmount: real("current_amount").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  categoryId: text("category_id").references(() => categories.id),
  savingGoalId: text("saving_goal_id").references(() => savingsGoals.id), // If this is a saving transaction
  type: text("type").notNull(), // 'income', 'expense', 'saving'
  amount: real("amount").notNull(),
  note: text("note"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const recurringTransactions = sqliteTable("recurring_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  categoryId: text("category_id").references(() => categories.id),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  note: text("note"),
  frequency: text("frequency").notNull(), // 'daily', 'weekly', 'monthly'
  nextRunDate: integer("next_run_date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const changelog = sqliteTable("changelog", {
  id: text("id").primaryKey(),
  version: text("version").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }).notNull(),
  changes: text("changes").notNull(), // JSON or Markdown string
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});
