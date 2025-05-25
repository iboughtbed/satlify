import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { practiceTests, sections, modules } from "@/lib/db/schema";
import { qstash } from "@/lib/qstash";
import { createPracticeTestSchema } from "@/lib/validations";
import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";

export const practiceTestRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPracticeTestSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const [practiceTest] = await tx
          .insert(practiceTests)
          .values({
            type: input.type,
            userId: ctx.session.user.id,
          })
          .returning();

        if (!practiceTest) {
          tx.rollback();

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create practice test",
          });
        }

        const _sections: { type: "verbal" | "math"; duration: number }[] = [];
        if (input.type === "full") {
          _sections.push(
            { type: "verbal", duration: 64 },
            { type: "math", duration: 70 },
          );
        } else if (input.type === "verbal") {
          _sections.push({ type: "verbal", duration: 64 });
        } else {
          _sections.push({ type: "math", duration: 70 });
        }

        for (const sectionData of _sections) {
          const [section] = await tx
            .insert(sections)
            .values({
              practiceTestId: practiceTest.id,
              type: sectionData.type,
              duration: sectionData.duration,
            })
            .returning();

          if (!section) {
            tx.rollback();

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create section",
            });
          }

          const moduleDuration = Math.floor(sectionData.duration / 2);

          const [module1] = await tx
            .insert(modules)
            .values({
              sectionId: section.id,
              order: "1",
              duration: moduleDuration,
            })
            .returning();

          if (!module1) {
            tx.rollback();

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create first module",
            });
          }

          const [module2] = await tx
            .insert(modules)
            .values({
              sectionId: section.id,
              order: "2",
              duration: moduleDuration,
            })
            .returning();

          if (!module2) {
            tx.rollback();

            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create second module",
            });
          }
        }

        return practiceTest;
      });
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.practiceTests.findMany({
      where: (table, { eq }) => eq(table.userId, ctx.session.user.id),
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.practiceTests.findFirst({
        where: (table, { eq }) => eq(table.id, input.id),
      });
    }),
});
