import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "@/trpc/api/trpc";

export const emptyRouter = createTRPCRouter({
  procedure: publicProcedure.query(() => {
    return "Hello World";
  }),
});
