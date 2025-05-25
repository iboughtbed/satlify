import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

type Params = Promise<{ testId: string; moduleId: string }>;

export const POST = verifySignatureAppRouter(
  async (req: Request, { params }: { params: Params }) => {
    const { testId, moduleId } = await params;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: z.object({}),
    });

    return new Response(null, { status: 201 });
  },
);
