import { TRPCError } from "@trpc/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";
import { practiceTests, sections, modules, questions } from "@/lib/db/schema";
import {
  practiceTestTypes,
  questionTypes,
  sectionTypes,
} from "@/lib/constants";
import { createPracticeTestSchema, type Section } from "@/lib/validations";

const questionSchema = z.object({
  questionText: z.string().describe("The main text of the question."),
  passageText: z
    .string()
    .optional()
    .describe(
      "The passage associated with the question, if any. Crucial for Reading and Writing sections.",
    ),
  options: z
    .array(z.string().min(1))
    .length(4)
    .optional()
    .describe(
      "An array of exactly 4 answer choices for multiple-choice questions. Required if questionType is 'multiple_choice'.",
    ),
  correctAnswer: z
    .string()
    .describe(
      "The correct answer. For multiple-choice, this should be one of the strings from the 'options' array. For grid-in, this should be the numerical answer as a string.",
    ),
  explanation: z
    .string()
    .describe(
      "A brief explanation of why the correct answer is correct and why other options might be incorrect.",
    ),
  domain: z
    .string()
    .optional()
    .describe(
      "The specific SAT domain or skill this question tests (e.g., Math: 'Heart of Algebra'; Reading: 'Information and Ideas'; Writing: 'Expression of Ideas').",
    ),
  questionType: z
    .enum(questionTypes)
    .describe("The type of the question: 'multiple_choice' or 'grid_in'."),
});

const moduleSchema = z.object({
  title: z
    .string()
    .describe(
      "A descriptive title for this module (e.g., 'Module 1: Algebra Focus', 'Module 1: Social Science Passage').",
    ),
  duration: z
    .number()
    .int()
    .positive()
    .describe(
      "Estimated time in minutes for this module. Sum of module durations should approximate section duration.",
    ),
  questions: z
    .array(questionSchema)
    .min(1)
    .max(30)
    .describe(
      "An array of questions for this module. Aim for a realistic number (e.g., a reading passage might have 10-11 questions).",
    ),
});

const sectionSchema = z.object({
  type: z
    .enum(sectionTypes)
    .describe("The type of this section: 'math' or 'verbal'."),
  duration: z
    .number()
    .int()
    .positive()
    .describe(
      "The total time in minutes allocated for this section (e.g., Reading: 65 min, Writing: 35 min, Math No-Calc: 25 min, Math Calc: 55 min).",
    ),
  modules: z
    .array(moduleSchema)
    .min(1)
    .max(5)
    .describe(
      "An array of modules for this section. For Reading, each module could represent a passage. For Math, modules can group topics.",
    ),
});

const practiceTestSchema = z.object({
  title: z
    .string()
    .describe(
      "A descriptive title for the practice test, e.g., 'Full SAT Practice Test Alpha', 'Math Section Challenge 1'.",
    ),
  sections: z
    .array(sectionSchema)
    .min(1)
    .describe("An array of sections for the practice test."),
});

export const practiceTestRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPracticeTestSchema)
    .mutation(async ({ ctx, input }) => {
      // Initial creation of practice test
      const [initialPracticeTest] = await ctx.db
        .insert(practiceTests)
        .values({
          title: input.type,
          type: input.type,
          userId: ctx.session.user.id,
        })
        .returning();

      if (!initialPracticeTest) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create practice test",
        });
      }

      // Define system prompt for AI generation
      let systemPrompt = [
        "You are an expert SAT tutor and test creator. Your task is to generate content for an SAT practice test, including an overall title for the test.",
        "The test is structured into sections, modules, and questions.",
        "Ensure all questions are high-quality, SAT-style questions.",
        "For multiple-choice questions, provide 4 distinct options, one of which is the correct answer. The 'options' array should contain these 4 choices. The 'correctAnswer' field should be the exact text of the correct option.",
        "For grid-in questions (math only), the 'correctAnswer' field should be the numerical answer as a string.",
        "Provide a clear and concise explanation for each question.",
        "Specify the SAT domain for each question:",
        "- For Math sections: 'Heart of Algebra', 'Problem Solving and Data Analysis', 'Passport to Advanced Math', 'Advanced Math' (includes geometry/trigonometry).",
        "- For Verbal (Reading and Writing) sections:",
        "  - Reading: 'Information and Ideas', 'Craft and Structure', 'Words in Context'.",
        "  - Writing: 'Expression of Ideas', 'Standard English Conventions'.",
        "The output must be a JSON object strictly adhering to the provided Zod schema, starting with a 'title' for the entire test.",
        `The test type requested is: ${input.type}`,
      ];

      if (input.type === "math") {
        systemPrompt.push(
          "Generate content for a Math practice test. This test should have two 'math' sections.",
          "1.  A 'math' section titled like \"Math - No Calculator\". Duration: ~25 minutes. Include 'multiple_choice' and 'grid_in' questions (e.g., 15 MCQs, 5 Grid-ins). 1-2 modules.",
          "2.  A 'math' section titled like \"Math - Calculator\". Duration: ~55 minutes. Include 'multiple_choice' and 'grid_in' questions (e.g., 30 MCQs, 8 Grid-ins). 1-2 modules.",
          "For each module, provide a suitable title and duration.",
        );
      } else if (input.type === "verbal") {
        systemPrompt.push(
          "Generate content for a Verbal (Reading and Writing) practice test. This test should have two 'verbal' sections.",
          "1.  A 'verbal' section titled \"Reading\". Duration: ~65 minutes. All 'multiple_choice'. About 5 passages (modules), each with 10-11 questions.",
          "2.  A 'verbal' section titled \"Writing and Language\". Duration: ~35 minutes. All 'multiple_choice'. About 4 passages (modules), each with 11 questions.",
          "For each module, provide a suitable title (e.g., passage topic) and duration.",
        );
      } else if (input.type === "full") {
        systemPrompt.push(
          "Generate content for a Full SAT practice test. This test should have four sections in the standard SAT order.",
          "1.  A 'verbal' section titled \"Reading\". Duration: ~65 minutes. All 'multiple_choice'. About 5 passages (modules), each with 10-11 questions.",
          "2.  A 'verbal' section titled \"Writing and Language\". Duration: ~35 minutes. All 'multiple_choice'. About 4 passages (modules), each with 11 questions.",
          "3.  A 'math' section titled \"Math - No Calculator\". Duration: ~25 minutes. 'multiple_choice' and 'grid_in' (e.g., 15 MCQs, 5 Grid-ins). 1-2 modules.",
          "4.  A 'math' section titled \"Math - Calculator\". Duration: ~55 minutes. 'multiple_choice' and 'grid_in' (e.g., 30 MCQs, 8 Grid-ins). 1-2 modules.",
          "For each module, provide a suitable title and duration.",
        );
      }

      systemPrompt.push(
        "For each section, define its 'type' ('math' or 'verbal'), 'duration' in minutes, and 'modules'.",
        "Each module must have a 'title', 'duration' in minutes, and 'questions'.",
        "Each question must have: 'questionText', 'passageText' (optional but required for Reading/Writing), 'options' (for MCQs), 'correctAnswer', 'explanation', 'domain', and 'questionType'.",
        "Ensure 'grid_in' is only for 'math' sections. Ensure 'options' has 4 items for MCQs.",
        "Sum of module durations should be close to section duration.",
      );

      const { object } = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: practiceTestSchema,
        messages: [
          {
            role: "system",
            content: systemPrompt.join("\n"),
          },
          {
            role: "user",
            content: `Generate an SAT practice test of type: ${input.type}. Follow all system instructions precisely.`,
          },
        ],
      });

      const practiceTest = await ctx.db.transaction(async (tx) => {
        const [practiceTest] = await tx
          .insert(practiceTests)
          .values({
            title: `${input.type} Practice Test`,
            userId: ctx.session.user.id,
            type: input.type,
          })
          .returning();

        if (!practiceTest) {
          tx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create practice test",
          });
        }

        await Promise.all(
          object.sections.map(async (section) => {
            const [newSection] = await tx
              .insert(sections)
              .values({
                practiceTestId: practiceTest.id,
                type: section.type,
                duration: section.duration,
              })
              .returning();

            if (!newSection) {
              tx.rollback();
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create section",
              });
            }

            await Promise.all(
              section.modules.map(async (module) => {
                const [newModule] = await tx
                  .insert(modules)
                  .values({
                    sectionId: newSection.id,
                    title: module.title,
                    duration: module.duration,
                  })
                  .returning();

                if (!newModule) {
                  tx.rollback();
                  throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create module",
                  });
                }

                await Promise.all(
                  module.questions.map(async (question) => {
                    const [newQuestion] = await tx
                      .insert(questions)
                      .values({
                        moduleId: newModule.id,
                        questionText: question.questionText,
                        passageText: question.passageText,
                        options:
                          question.questionType === "multiple_choice"
                            ? question.options
                            : undefined,
                        correctAnswer: question.correctAnswer,
                        type: question.questionType,
                        domain: question.domain,
                        explanation: question.explanation,
                      })
                      .returning();

                    if (!newQuestion) {
                      tx.rollback();
                      throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create question",
                      });
                    }
                  }),
                );
              }),
            );
          }),
        );

        return practiceTest;
      });

      return practiceTest;
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
