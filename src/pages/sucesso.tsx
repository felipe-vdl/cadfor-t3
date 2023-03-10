import Head from 'next/head';
import Link from "next/link";

function FourOhFour() {
  return (
    <>
    <Head>
      <title>Cadastro Enviado</title>
    </Head>
    <div className="m-auto flex flex-col items-center dark:bg-dark-500 p-8 gap-4 rounded-lg shadow shadow-black/30 w-[25rem] sm:w-[35rem] md:w-[40rem] lg:w-[45rem]">
      <h1>O seu cadastro foi enviado com sucesso. Os dados de sua empresa agora constam na base de dados da prefeitura de Mesquita.</h1>
      <Link
        href="/"
        className="bg-roxo py-1 px-2 text-white hover:bg-indigo-600 rounded shadow shadow-black/40"
      >
        Página Inicial
      </Link>
    </div>
    </>
  );
}

FourOhFour.layout = "regular";
export default FourOhFour;
