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
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
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
    columnHelper.accessor(
      (row) =>
        row.created_at.toLocaleDateString("pt-br", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      {
        id: "created_at",
        header: "Data",
        cell: (info) => info.getValue().split(" ")[0]?.replace(",", ""),
        sortingFn: "stringDate",
        sortDescFirst: true,
        filterFn: "includesString",
        size: 107
      },
    ),
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
        <title>Lista de Cadastros</title>
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
