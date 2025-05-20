import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";
import { testAttempts } from "@/lib/db/schema";

export const testAttemptsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        practiceTestId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newTestAttempt] = await ctx.db
        .insert(testAttempts)
        .values({
          userId: ctx.session.user.id,
          practiceTestId: input.practiceTestId,
        })
        .returning();

      return newTestAttempt;
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.testAttempts.findMany({
      where: (table, { eq }) => eq(table.userId, ctx.session.user.id),
    });
  }),
  
});
