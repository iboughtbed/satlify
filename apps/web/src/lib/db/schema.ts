import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

import {
  practiceTestTypes,
  questionTypes,
  sectionTypes,
  testAttemptStatuses,
} from "@/lib/constants";
import type { ModuleAttempt } from "@/types";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `web_${name}`);

export const practiceTestTypeEnum = pgEnum(
  "practice_test_type_enum",
  practiceTestTypes,
);
export const sectionTypeEnum = pgEnum("section_type_enum", sectionTypes);
export const questionTypeEnum = pgEnum("question_type_enum", questionTypes);
export const testAttemptStatusEnum = pgEnum(
  "test_attempt_status_enum",
  testAttemptStatuses,
);

export const practiceTests = createTable(
  "practice_test",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    title: d.text().notNull(),
    type: practiceTestTypeEnum().notNull(),
    userId: d.text().references(() => users.id, { onDelete: "cascade" }),
    isPublic: d.boolean().notNull().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("practice_test_type_idx").on(t.type)],
);

export const practiceTestsRelations = relations(
  practiceTests,
  ({ one, many }) => ({
    sections: many(sections),
    user: one(users, {
      fields: [practiceTests.userId],
      references: [users.id],
    }),
  }),
);

export const sections = createTable(
  "section",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    practiceTestId: d
      .uuid()
      .references(() => practiceTests.id, { onDelete: "cascade" }),
    type: sectionTypeEnum().notNull(),
    duration: d.integer().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("section_practice_test_id_idx").on(t.practiceTestId)],
);

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  practiceTest: one(practiceTests, {
    fields: [sections.practiceTestId],
    references: [practiceTests.id],
  }),
  modules: many(modules),
}));

export const modules = createTable(
  "module",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey(),
    sectionId: d.uuid().references(() => sections.id, { onDelete: "cascade" }),
    title: d.text().notNull(),
    duration: d.integer().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("module_section_id_idx").on(t.sectionId)],
);

export const modulesRelations = relations(modules, ({ one, many }) => ({
  section: one(sections, {
    fields: [modules.sectionId],
    references: [sections.id],
  }),
  questions: many(questions),
}));

export const questions = createTable("question", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  moduleId: d.uuid().references(() => modules.id, { onDelete: "cascade" }),
  questionText: d.text("question_text").notNull(),
  passageText: d.text("passage_text"),
  options: d.jsonb(),
  correctAnswer: d.text().notNull(),
  explanation: d.text(),
  domain: d.text(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  module: one(modules, {
    fields: [questions.moduleId],
    references: [modules.id],
  }),
}));

export const testAttempts = createTable("test_attempt", (d) => ({
  id: d.uuid().defaultRandom().primaryKey(),
  userId: d.text().references(() => users.id, { onDelete: "cascade" }),
  practiceTestId: d
    .uuid()
    .references(() => practiceTests.id, { onDelete: "cascade" }),
  status: testAttemptStatusEnum().notNull().default("pending"),
  results: d.jsonb().$type<ModuleAttempt[]>(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const testAttemptsRelations = relations(
  testAttempts,
  ({ one, many }) => ({
    practiceTest: one(practiceTests, {
      fields: [testAttempts.practiceTestId],
      references: [practiceTests.id],
    }),
    results: many(modules),
  }),
);

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

export const usersRelations = relations(users, ({ many }) => ({
  testAttempts: many(testAttempts),
}));

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
