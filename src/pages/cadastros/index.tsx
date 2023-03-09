import React from "react";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { Cadastro } from "@prisma/client";
import Head from "next/head";
import Table from "@/components/Table/Table";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { api } from "@/utils/api";

interface RowActionsProps {
  cadastro: Cadastro;
}
const RowActions = ({ cadastro }: RowActionsProps) => {
  return (
    <div className="flex justify-center gap-2">
      <Link
        href={`/cadastros/${cadastro.id}`}
        className="ratio-square rounded bg-sky-500 p-2 text-white transition-colors hover:bg-sky-700"
        title="Visualizar cadastro."
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z" />
          <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
        </svg>
      </Link>
    </div>
  );
};

interface CadastroIndexProps {
  cadastros: Cadastro[];
}
const CadastroIndex = () => {
  const columnHelper = createColumnHelper<Cadastro>();
  const columns = [
    columnHelper.accessor("razao_social", {
      header: "Razão Social",
      cell: (info) => info.getValue(),
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      size: 92,
    }),
    columnHelper.accessor("cnpj", {
      header: "CNPJ",
      cell: (info) => info.getValue(),
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      size: 107,
    }),
    columnHelper.accessor("enquadramento_empresa", {
      header: "Enquadramento",
      cell: (info) => info.getValue(),
      sortingFn: "alphanumeric",
      filterFn: "includesString",
    }),
    columnHelper.accessor("porte_empresa", {
      header: "Porte",
      cell: (info) => info.getValue(),
      sortingFn: "alphanumeric",
      filterFn: "includesString",
      size: 101,
    }),
    columnHelper.accessor("created_at", {
      header: "Data do Cadastro",
      cell: (info) => info.getValue(),
      sortingFn: "alphanumeric",
      filterFn: "includesString",
    }),
    columnHelper.display({
      id: "actions",
      header: "Ações",
      cell: (props) => <RowActions cadastro={props.row.original} />,
      size: 70,
    }),
  ];

  const cadastros = api.cadastro.list.useQuery(undefined, {
    placeholderData: [],
  });

  return (
    <>
      <Head>
        <title>Lista de Protocolos</title>
        <meta
          name="description"
          content="Sistema Gerenciador de Projetos — Prefeitura de Mesquita."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Table<Cadastro> data={cadastros.data ?? []} columns={columns} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  } else {
    return {
      props: {},
    };
  }
};

CadastroIndex.layout = "dashboard";
export default CadastroIndex;
