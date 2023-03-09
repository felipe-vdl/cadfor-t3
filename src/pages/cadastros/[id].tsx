import { GetServerSideProps } from "next";
import { getServerAuthSession } from "@/server/auth";

const CadastroByIdPage = () => {
  return <div></div>
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerAuthSession({req, res});

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
}