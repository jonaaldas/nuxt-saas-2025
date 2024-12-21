import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";

// Define enum types for better type safety
export const AuthType = {
  GOOGLE: "google",
  LOCAL: "local",
} as const;

export type AuthType = (typeof AuthType)[keyof typeof AuthType];

export const PlanType = {
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export type PlanType = (typeof PlanType)[keyof typeof PlanType];

// Users table
export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    password: text("password"),
    authType: text("auth_type", { enum: ["google", "local"] }).notNull(),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
  })
);

// Stripe customers table
export const stripeCustomers = sqliteTable(
  "stripe_customers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    planType: text("plan_type", { enum: ["basic", "pro", "enterprise"] }).notNull(),
    credits: integer("credits"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    userIdIdx: index("idx_stripe_customers_user_id").on(table.userId),
  })
);

// Password reset tokens table
export const passwordResetTokens = sqliteTable(
  "password_reset_tokens",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => ({
    tokenIdx: index("idx_password_reset_tokens_token").on(table.token),
  })
);

// Types for type safety when querying
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type StripeCustomer = typeof stripeCustomers.$inferSelect;
export type NewStripeCustomer = typeof stripeCustomers.$inferInsert;

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
