import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const CadastroByIdPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.cadastro.byId.useQuery(`${id}`);

  return (
    <div className="flex flex-col w-full text-sm rounded border bg-light-500 py-2 px-4 dark:border-zinc-500 dark:bg-dark-500">
      <h1 className="mb-4 text-xl font-bold">Detalhes do Cadastro</h1>
      <div>
        <h2 className="mb-2 border-b pb-2 text-lg dark:border-zinc-500">
          Dados da Empresa
        </h2>
        <div className="mb-6 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Razão Social</h3>
            <p>{data?.razao_social}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">CNPJ</h3>
            <p>{data?.cnpj}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Inscrição Municipal</h3>
            <p>{data?.inscricao_municipal || "Não informado."}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Inscrição Estadual</h3>
            <p>{data?.inscricao_estadual || "Não informado."}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Porte da Empresa</h3>
            <p>{data?.porte_empresa}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Enquadramento da Empresa</h3>
            <p>{data?.enquadramento_empresa}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">CNAE</h3>
            <p>{data?.cnae || "Não informado."}</p>
          </div>
          <div className="col-span-12">
            <h3 className="font-bold">Produtos e Serviços Ofertados</h3>
            <p>{data?.produtos_servicos}</p>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="mb-2 border-b pb-2 text-lg dark:border-zinc-500">
          Endereço
        </h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">CEP</h3>
            <p>{data?.cep}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Logradouro</h3>
            <p>{data?.logradouro}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">N°</h3>
            <p>{data?.numero_logradouro}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Complemento</h3>
            <p>{data?.complemento || "Não informado."}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Bairro</h3>
            <p>{data?.bairro}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Município</h3>
            <p>{data?.municipio}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Estado</h3>
            <p>{data?.estado}</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-2 border-b pb-2 text-lg dark:border-zinc-500">
          Contato
        </h2>
        <div className="grid grid-cols-12 flex-col gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Nome do Responsável</h3>
            <p>{data?.responsavel}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">E-mail</h3>
            <p>{data?.email}</p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <h3 className="font-bold">Telefone</h3>
            <p>{data?.telefone}</p>
          </div>
        </div>
      </div>
    </div>
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

CadastroByIdPage.layout = "dashboard";
export default CadastroByIdPage;
