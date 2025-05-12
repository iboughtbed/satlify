import { createTRPCRouter, protectedProcedure } from "@/trpc/api/trpc";

export const emptyRouter = createTRPCRouter({
  get: protectedProcedure.query(() => {
    return "Hello, world!";
  }),
});
