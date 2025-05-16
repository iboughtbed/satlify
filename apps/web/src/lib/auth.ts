import { cache } from "react";
// import { redirect } from "next/navigation";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
// import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { resend } from "@/lib/resend";
import { env } from "@/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Satlify <hi@satlify.sanzhar.xyz>",
        to: user.email,
        subject: "Reset your password",
        html: `<a href="${url}">Reset your password</a>`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const response = await resend.emails.send({
        from: "Satlify <hi@satlify.sanzhar.xyz>",
        to: user.email,
        subject: "Verify your email",
        html: `<a href="${url}">Verify your email address</a>`,
      });

      console.log(response, user.email);
    },
  },
  plugins: [username()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGIN?.split(",") ?? [],
});

export const getSession = cache(auth.api.getSession);
