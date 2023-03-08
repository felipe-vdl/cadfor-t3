import { z } from "zod";
import bcrypt from "bcrypt";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getUserInfo: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.id) {
      return ctx.prisma.user.findFirst({
        where: {
          id: +ctx.session.user.id,
        },
      });
    }
    throw new TRPCError({ code: "BAD_REQUEST" });
  }),
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
        confirmNewPassword: z.string(),
      })
    )
    .mutation(async (req) => {
      const { currentPassword, newPassword, confirmNewPassword } = req.input;
      if (newPassword !== confirmNewPassword) {
        throw new Error("Confirme a nova senha corretamente.");
      }

      const { prisma, session } = req.ctx;

      if (!session.user?.email) throw new Error("Usuário não está autenticado.");

      const user = await req.ctx.prisma.user.findFirst({
        where: {
          email: session.user?.email,
        },
      });

      if (!user) throw new Error("Usuário não existe.");

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        throw new Error("Senha atual incorreta.");
      }

      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          password: await bcrypt.hash(newPassword, 10),
        },
      });

      return { message: "Senha alterada com sucesso." };
    }),
});
