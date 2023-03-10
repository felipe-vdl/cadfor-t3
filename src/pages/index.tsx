import Head from "next/head";
import { AppNotification } from "@/types/interfaces";
import React, { useState } from "react";
import InputMask from "react-input-mask";
import { api } from "@/utils/api";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface CEP {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

const CadastroCreate = () => {
  const notificationInitialState: AppNotification = { message: "", type: "" };
  const [notification, setNotification] = useState<AppNotification>(
    notificationInitialState
  );

  const formInitialState = {
    razao_social: "",
    cnpj: "",
    porte_empresa: "",
    enquadramento_empresa: "",
    cnae: "",
    inscricao_municipal: "",
    inscricao_estadual: "",
    produtos_servicos: "",
    cep: "",
    logradouro: "",
    numero_logradouro: "",
    complemento: "",
    bairro: "",
    municipio: "",
    estado: "",
    email: "",
    telefone: "",
    responsavel: "",
  };
  const formSchema = z.object({
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
    complemento: z.string().optional(),
    bairro: z.string(),
    municipio: z.string(),
    estado: z.string(),
    email: z.string(),
    telefone: z.string(),
    responsavel: z.string(),
  });
  const [form, setForm] =
    useState<z.infer<typeof formSchema>>(formInitialState);

  const utils = api.useContext();
  const router = useRouter();

  const newCadastroMutation = api.cadastro.store.useMutation({
    onMutate: () => {
      setNotification(notificationInitialState);
    },
    onSuccess: (data) => {
      router.push("/sucesso");
      // utils.cadastro.list.invalidate();
      // setNotification({ type: "success", message: data.message });
      // setForm(formInitialState);
    },
    onError: (error) => {
      if (error?.message) {
        setNotification({
          message: error?.message,
          type: "error",
        });
      }
    },
  });

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formParse = formSchema.safeParse(form);
    if (formParse.success) {
      newCadastroMutation.mutate(formParse.data);
    } else {
      setNotification({
        type: "error",
        message: "Preencha as informações.",
      });
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setForm((st) => ({ ...st, [evt.target.name]: evt.target.value }));
  };

  const handleChangeSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((st) => ({ ...st, [evt.target.name]: evt.target.value }));
  };

  const cepQuery = useQuery<CEP>({
    enabled: false,
    queryKey: ["viaCep"],
    queryFn: async () => {
      const res = await fetch(
        `https://viacep.com.br/ws/${form.cep.replace("-", "")}/json/`
      );
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      const { logradouro, bairro, localidade: municipio, uf: estado } = data;
      setForm((st) => ({
        ...st,
        logradouro,
        bairro,
        municipio,
        estado,
      }));
    },
    onError: (err: any) => {
      console.error(err?.message);
    },
  });

  const handleViaCep = async (evt: React.FocusEvent<HTMLInputElement>) => {
    if (form.cep.length >= 9) {
      cepQuery.refetch();
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro de Fornecedores</title>
      </Head>
      <div className="m-auto my-4 flex w-[29rem] flex-col items-center rounded-[12px] bg-light-500 text-light-50 shadow shadow-black/20 dark:bg-dark-500 dark:text-dark-50 sm:w-[37rem] md:w-[45rem] lg:w-[66rem]">
        <div className="w-full rounded-t-[12px] bg-dourado py-1 text-center">
          <h2 className="text-2xl font-light text-white">Cadastro de Fornecedores</h2>
        </div>
        <form
          className="flex w-full flex-col gap-8 p-4"
          onSubmit={handleSubmit}
        >
          {notification.message && (
            <div
              className={`flex w-full items-center rounded-[8px] px-3 py-1 text-center ${
                notification.type === "error"
                  ? "bg-red-300 text-red-800"
                  : "bg-green-300 text-green-800"
              }`}
            >
              <p className="mx-auto">{notification.message}</p>
              <span
                className="cursor-pointer hover:text-white"
                onClick={() => setNotification(notificationInitialState)}
              >
                X
              </span>
            </div>
          )}
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-12 gap-5 px-1 text-sm">
            <div className="col-span-12 text-center">
                <h1 className="mb-[-0.5rem] inline-block border-b border-zinc-400 px-8 pb-[0.5rem] text-lg">
                  Dados da Empresa
                </h1>
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-6">
                <label htmlFor="razao_social">Razão Social: *</label>
                <input
                  id="razao_social"
                  type="text"
                  onChange={handleChange}
                  name="razao_social"
                  value={form.razao_social}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Nome Comercial, Firma Empresarial ou Denominação Social"
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-6">
                <label htmlFor="cnpj">CNPJ: *</label>
                <InputMask
                  id="cnpj"
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  mask="99.999.999/9999-99"
                  placeholder="11.111.111/1111-11"
                  value={form.cnpj}
                  name="cnpj"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-6">
                <label htmlFor="inscricao_municipal">
                  Inscrição Municipal (Opcional):
                </label>
                <input
                  id="inscricao_municipal"
                  type="text"
                  onChange={handleChange}
                  name="inscricao_municipal"
                  value={form.inscricao_municipal}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="N° da Inscrição Municipal"
                  required={false}
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-6">
                <label htmlFor="inscricao_estadual">
                  Inscrição Estadual (Opcional):
                </label>
                <input
                  id="inscricao_estadual"
                  type="text"
                  onChange={handleChange}
                  name="inscricao_estadual"
                  value={form.inscricao_estadual}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="N° da Inscrição Estadual"
                  required={false}
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="porte_empresa">Porte da Empresa: *</label>
                <select
                  required
                  id="porte_empresa"
                  onChange={handleChangeSelect}
                  name="porte_empresa"
                  value={form.porte_empresa}
                  className="rounded border border-zinc-500 bg-light-500 bg-transparent py-1 px-2 pb-1 text-light-50 outline-none dark:bg-dark-500 dark:text-dark-50"
                >
                  <option value="">Selecione</option>
                  <option value="EPP">EPP</option>
                  <option value="ME">ME</option>
                  <option value="N/A">Não se aplica.</option>
                </select>
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="enquadramento_empresa">
                  Enquadramento da Empresa: *
                </label>
                <select
                  required
                  id="enquadramento_empresa"
                  onChange={handleChangeSelect}
                  name="enquadramento_empresa"
                  value={form.enquadramento_empresa}
                  className="rounded border border-zinc-500 bg-light-500 bg-transparent py-1 px-2 pb-1 text-light-50 outline-none dark:bg-dark-500 dark:text-dark-50"
                >
                  <option value="">Selecione</option>
                  <option value="EI">EI</option>
                  <option value="EIRELLI">EIRELLI</option>
                  <option value="LTDA">LTDA</option>
                  <option value="MEI">MEI</option>
                  <option value="SA">SA</option>
                  <option value="SLU">SLU</option>
                </select>
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="cnae">CNAE (Opcional):</label>
                <input
                  id="cnae"
                  type="text"
                  onChange={handleChange}
                  name="cnae"
                  value={form.cnae}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Código ou Atividade"
                  required={false}
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3">
                <label htmlFor="produtos_servicos">
                  Produtos e Serviços Ofertados: *
                </label>
                <input
                  id="produtos_servicos"
                  type="text"
                  onChange={handleChange}
                  name="produtos_servicos"
                  value={form.produtos_servicos}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Produtos e Serviços Ofertados pelo Fornecedor."
                  required
                />
              </div>
              <div className="col-span-12 text-center">
                <h1 className="mb-[-0.5rem] inline-block border-b border-zinc-400 px-8 pb-[0.5rem] text-lg">
                  Endereço
                </h1>
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="cep">CEP: *</label>
                <InputMask
                  required
                  id="cep"
                  disabled={cepQuery.isLoading && cepQuery.fetchStatus === "fetching"}
                  onBlur={handleViaCep}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="CEP *"
                  mask="99999-999"
                  value={form.cep}
                  name="cep"
                  onChange={handleChange}
                  maskChar=""
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="logradouro">Logradouro: *</label>
                <input
                  id="logradouro"
                  disabled={cepQuery.isLoading && cepQuery.fetchStatus === "fetching"}
                  type="text"
                  onChange={handleChange}
                  name="logradouro"
                  value={form.logradouro}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Rua/Avenida"
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label>N°: *</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="numero_logradouro"
                  value={form.numero_logradouro}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Número"
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="complemento">Complemento (Opcional):</label>
                <input
                  id="complemento"
                  type="text"
                  onChange={handleChange}
                  name="complemento"
                  value={form.complemento}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Apartamento, Bloco, Casa, etc."
                  required={false}
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="bairro">Bairro: *</label>
                <input
                  id="bairro"
                  disabled={cepQuery.isLoading && cepQuery.fetchStatus === "fetching"}
                  type="text"
                  onChange={handleChange}
                  name="bairro"
                  value={form.bairro}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Bairro"
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="municipio">Município: *</label>
                <input
                  id="municipio"
                  disabled={cepQuery.isLoading && cepQuery.fetchStatus === "fetching"}
                  type="text"
                  onChange={handleChange}
                  name="municipio"
                  value={form.municipio}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Município"
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="estado">Estado: *</label>
                <select
                  required
                  id="estado"
                  disabled={cepQuery.isLoading && cepQuery.fetchStatus === "fetching"}
                  onChange={handleChangeSelect}
                  name="estado"
                  value={form.estado}
                  className="rounded border border-zinc-500 bg-light-500 bg-transparent py-1 px-2 pb-1 text-light-50 outline-none dark:bg-dark-500 dark:text-dark-50"
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
              <div className="col-span-12 text-center">
                <h1 className="mb-[-0.5rem] inline-block border-b border-zinc-400 px-8 pb-[0.5rem] text-lg">
                  Contato
                </h1>
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="responsavel">Nome do Responsável: *</label>
                <input
                  id="responsavel"
                  type="text"
                  onChange={handleChange}
                  name="responsavel"
                  value={form.responsavel}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Responsável"
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="email">E-mail: *</label>
                <input
                  id="email"
                  type="email"
                  onChange={handleChange}
                  name="email"
                  value={form.email}
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="E-mail *"
                  required
                />
              </div>
              <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
                <label htmlFor="telefone">Telefone</label>
                <InputMask
                  required
                  id="telefone"
                  className="border border-zinc-500 bg-transparent p-1 px-2 outline-none"
                  placeholder="Telefone *"
                  mask="(99)9999-99999"
                  value={form.telefone}
                  name="telefone"
                  onChange={handleChange}
                  maskChar=""
                />
              </div>
            </div>
          </div>
          <button
            disabled={newCadastroMutation.isLoading}
            className="rounded-[10px] bg-roxo p-1 text-base font-light text-white hover:bg-indigo-600 disabled:bg-indigo-400"
          >
            {newCadastroMutation.isLoading ? "Enviando..." : "Enviar Cadastro"}
          </button>
        </form>
      </div>
    </>
  );
};

CadastroCreate.layout = "regular";
export default CadastroCreate;
