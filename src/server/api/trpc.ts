import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";

type CreateContextOptions = {
  session: Session | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

// Authed Procedure
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

// Admin Procedure
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (
    ctx.session?.user.role === "ADMIN" ||
    ctx.session?.user.role === "SUPERADMIN"
  ) {
    if (ctx.session && ctx.session.user) {
      return next({
        ctx: {
          // infers the `session` as non-nullable
          session: { ...ctx.session, user: ctx.session.user },
        },
      });
    }
  }
  throw new TRPCError({ code: "UNAUTHORIZED" });
});
export const adminProcedure = t.procedure
  .use(enforceUserIsAuthed)
  .use(enforceUserIsAdmin);

// Super-Admin Procedure
const enforceUserIsSuperAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.session?.user.role === "SUPERADMIN") {
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  }
  throw new TRPCError({ code: "UNAUTHORIZED" });
});
export const superAdminProcedure = t.procedure
  .use(enforceUserIsAuthed)
  .use(enforceUserIsSuperAdmin);
