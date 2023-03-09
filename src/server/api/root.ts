import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { cadastroRouter } from "./routers/cadastro";

export const appRouter = createTRPCRouter({
  user: userRouter,
  cadastro: cadastroRouter
});

export type AppRouter = typeof appRouter;
