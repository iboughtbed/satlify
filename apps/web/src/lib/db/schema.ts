// import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `web_${name}`);

// better-auth

export const users = createTable(
  "user",
  (d) => ({
    id: d.text().primaryKey(),
    name: d.text().notNull(),
    email: d.text().notNull().unique(),
    emailVerified: d.boolean().notNull(),
    username: d.text().unique(),
    displayUsername: d.text(),
    image: d.text(),
    createdAt: d.timestamp().notNull(),
    updatedAt: d.timestamp().notNull(),
  }),
  (t) => [index("user_email_idx").on(t.email)],
);

// export const usersRelations = relations(users, ({ many }) => ({
//   projects: many(projects),
// }));

export const sessions = createTable(
  "session",
  (d) => ({
    id: d.text().primaryKey(),
    expiresAt: d.timestamp().notNull(),
    token: d.text().notNull().unique(),
    createdAt: d.timestamp().notNull(),
    updatedAt: d.timestamp().notNull(),
    ipAddress: d.text(),
    userAgent: d.text(),
    userId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  }),
  (t) => [
    index("session_user_id_idx").on(t.userId),
    index("session_token_idx").on(t.token),
  ],
);

export const accounts = createTable(
  "account",
  (d) => ({
    id: d.text().primaryKey(),
    accountId: d.text().notNull(),
    providerId: d.text().notNull(),
    userId: d
      .text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: d.text(),
    refreshToken: d.text(),
    idToken: d.text(),
    accessTokenExpiresAt: d.timestamp(),
    refreshTokenExpiresAt: d.timestamp(),
    scope: d.text(),
    password: d.text(),
    createdAt: d.timestamp().notNull(),
    updatedAt: d.timestamp().notNull(),
  }),
  (t) => [index("account_user_id_idx").on(t.userId)],
);

export const verifications = createTable(
  "verification",
  (d) => ({
    id: d.text().primaryKey(),
    identifier: d.text().notNull(),
    value: d.text().notNull(),
    expiresAt: d.timestamp().notNull(),
    createdAt: d.timestamp(),
    updatedAt: d.timestamp(),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)],
);
