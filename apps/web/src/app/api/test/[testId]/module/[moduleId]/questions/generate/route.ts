import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

import { db } from "@/lib/db";
import { questionTypes, sectionTypes } from "@/lib/constants";
import { questions } from "@/lib/db/schema";

type Params = Promise<{ testId: string; moduleId: string }>;

export const POST = verifySignatureAppRouter(
  async (req: Request, { params }: { params: Params }) => {
    const { testId, moduleId } = await params;

    const module = await db.query.modules.findFirst({
      where: (table, { eq }) => eq(table.id, moduleId),
      with: { section: true },
    });

    if (!module) {
      return new Response(null, { status: 404 });
    }

    const questionsCount = module.section.type === "math" ? 22 : 27;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: z.object({
        questions: z
          .array(
            z.object({
              questionText: z
                .string()
                .min(10)
                .describe("The main question text"),
              passageText: z
                .string()
                .optional()
                .describe(
                  "Reading passage if applicable (mainly for verbal section)",
                ),
              type: z
                .enum(questionTypes)
                .describe("Question type: multiple_choice or grid_in"),
              options: z
                .array(z.string())
                .optional()
                .describe(
                  "Multiple choice options (only for multiple_choice type, should have 4 options A-D)",
                ),
              correctAnswer: z
                .string()
                .describe(
                  "The correct answer - for multiple choice use A/B/C/D, for grid-in use the numeric answer",
                ),
              explanation: z
                .string()
                .describe(
                  "Detailed explanation of why this is the correct answer",
                ),
            }),
          )
          .describe("Array of SAT questions for this module"),
      }),
      prompt: [
        `Generate ${questionsCount} SAT ${module.section.type} questions for a practice test module.`,
        "Return an array of question objects with the exact schema provided. Each question must include questionText, type, correctAnswer, and explanation. For multiple choice questions, include 4 options labeled A, B, C, D and provide the answer as A/B/C/D. For grid-in questions, provide numeric answer only without an options array. Include passageText only for verbal reading comprehension questions.",
        "Do not deviate from the schema structure. Ensure all required fields are populated. Questions must be at authentic SAT difficulty level and each question must be unique and non-repetitive.",
        `This is for the ${module.section.type} section requiring ${questionsCount} total questions. Use a random mix of multiple_choice and grid_in question types. For math sections, cover algebra, geometry, statistics, advanced math, and data analysis topics. For verbal sections, include reading comprehension, writing and language, and grammar questions. Multiple choice questions need exactly 4 options labeled A, B, C, D. Grid-in questions should have numeric answers only using integers, decimals, or fractions. All questions need detailed explanations showing step-by-step solutions. Use authentic SAT question formats and realistic content while covering diverse topics within the ${module.section.type} section.`,
      ].join("\n"),
    });

    await db.insert(questions).values(
      object.questions.map((question) => ({
        ...question,
        moduleId,
      })),
    );

    return new Response(null, { status: 201 });
  },
);
