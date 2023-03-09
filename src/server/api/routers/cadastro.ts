import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const cadastroRouter = createTRPCRouter({
  store: publicProcedure
    .input(
      z.object({
        razao_social: z.string(),
        cnpj: z.string(),
        porte_empresa: z.string(),
        enquadramento_empresa: z.string(),
        cnae: z.string().optional(),
        inscricao_municipal: z.string().optional(),
        inscricao_estadual: z.string().optional(),
        produtos_servicos: z.string(),
        cep: z.string(),
        rua: z.string(),
        numero_rua: z.string(),
        bairro: z.string(),
        municipio: z.string(),
        estado: z.string(),
        email: z.string(),
        telefone: z.string(),
        responsavel: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        razao_social,
        cnpj,
        porte_empresa,
        enquadramento_empresa,
        cnae,
        inscricao_estadual,
        inscricao_municipal,
        produtos_servicos,
        cep,
        rua,
        numero_rua,
        bairro,
        municipio,
        estado,
        email,
        telefone,
        responsavel,
      } = input;

      const newCadastro = ctx.prisma.cadastro.create({
        data: {
          razao_social,
          cnpj,
          porte_empresa,
          enquadramento_empresa,
          cnae,
          inscricao_estadual,
          inscricao_municipal,
          produtos_servicos,
          cep,
          rua,
          numero_rua,
          bairro,
          municipio,
          estado,
          email,
          telefone,
          responsavel,
        },
      });

      return { message: "Cadastro criado com sucesso." };
    }),
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.cadastro.findMany();
  }),
  byId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.cadastro.findUnique({
      where: {
        id: +input,
      },
    });
  }),
});
