import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
// import { exampleRouter } from "@/server/api/routers/example";

export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  user: userRouter
});

export type AppRouter = typeof appRouter;
