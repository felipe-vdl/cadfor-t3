import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
        logradouro: z.string(),
        numero_logradouro: z.string(),
        bairro: z.string(),
        complemento: z.string().optional(),
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
        logradouro,
        numero_logradouro,
        complemento,
        bairro,
        municipio,
        estado,
        email,
        telefone,
        responsavel,
      } = input;

      const newCadastro = await ctx.prisma.cadastro.create({
        data: {
          razao_social: razao_social.toUpperCase(),
          cnpj: cnpj.toUpperCase(),
          porte_empresa: porte_empresa.toUpperCase(),
          enquadramento_empresa: enquadramento_empresa.toUpperCase(),
          cnae: cnae?.toUpperCase() ?? null,
          inscricao_estadual: inscricao_estadual?.toUpperCase() ?? null,
          inscricao_municipal: inscricao_municipal?.toUpperCase() ?? null,
          produtos_servicos: produtos_servicos.toUpperCase(),
          cep: cep.toUpperCase(),
          logradouro: logradouro.toUpperCase(),
          numero_logradouro: numero_logradouro.toUpperCase(),
          complemento: complemento?.toUpperCase() ?? null,
          bairro: bairro.toUpperCase(),
          municipio: municipio.toUpperCase(),
          estado: estado.toUpperCase(),
          email: email.toUpperCase(),
          telefone: telefone.toUpperCase(),
          responsavel: responsavel.toUpperCase(),
          updated_at: null
        },
      });

      return { message: "Cadastro criado com sucesso." };
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cadastro.findMany();
  }),
  byId: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) throw new TRPCError({ code: "BAD_REQUEST" });
      const cadastro = await ctx.prisma.cadastro.findUnique({
        where: {
          id: +input,
        },
      });
      if (!cadastro) throw new TRPCError({ code: "NOT_FOUND" });
      return cadastro;
    }),
});
