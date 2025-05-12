import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./src/lib/db/migrations",
  casing: "snake_case",
  tablesFilter: ["web_*"],
} satisfies Config;
