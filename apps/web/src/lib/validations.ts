import { z } from "zod";

import { practiceTestTypes, sectionTypes } from "./constants";

export type Section = {
  type: (typeof sectionTypes)[number];
  duration: number;
};

export const createPracticeTestSchema = z.object({
  type: z.enum(practiceTestTypes),
});

export const sectionGenerationSchema = z.object({
  sections: z.array(
    z.object({
      type: z.enum(sectionTypes),
      duration: z.number().int().positive(),
    }),
  ),
});
