import { createCallerFactory, createTRPCRouter } from "@/trpc/api/trpc";
import { practiceTestRouter } from "@/trpc/api/routers/practice-test";
import { emptyRouter } from "@/trpc/api/routers/empty";
import { testAttemptsRouter } from "@/trpc/api/routers/test-attempts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  empty: emptyRouter,
  practiceTest: practiceTestRouter,
  testAttempts: testAttemptsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
