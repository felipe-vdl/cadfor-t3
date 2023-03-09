import Head from "next/head";
import { AppNotification } from "@/types/interfaces";
import React, { useState } from "react";
import InputMask from "react-input-mask";
import { api } from "@/utils/api";
import { z } from "zod";

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
    rua: "",
    numero_rua: "",
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
    rua: z.string(),
    numero_rua: z.string(),
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

  const newCadastroMutation = api.cadastro.store.useMutation({
    onMutate: () => {
      setNotification(notificationInitialState);
    },
    onSuccess: (data) => {
      utils.cadastro.list.invalidate();
      setNotification({ type: "success", message: data.message });
      setForm(formInitialState);
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

  return (
    <>
      <Head>
        <title>Novo Cadastro</title>
      </Head>
      <div className="m-auto flex w-full flex-col items-center rounded-[12px] bg-light-500 text-light-50 shadow shadow-black/20 dark:bg-dark-500 dark:text-dark-50 sm:w-[25rem] md:w-[30rem] lg:w-[38rem]">
        <div className="w-full rounded-t-[12px] bg-dourado py-1 text-center">
          <h2 className="text-2xl font-light text-white">Novo Cadastro</h2>
        </div>
        <form
          className="flex w-full flex-col gap-8 p-4 pt-8"
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
            <div className="flex flex-col gap-6 px-1">
              {/* Dados da Empresa */}
              <input
                type="text"
                onChange={handleChange}
                name="razao_social"
                value={form.razao_social}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Razão Social *"
                required
              />
              <InputMask
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                mask="99.999.999/9999-99"
                placeholder="CNPJ *"
                value={form.cnpj}
                name="cnpj"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                onChange={handleChange}
                name="inscricao_municipal"
                value={form.inscricao_municipal}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Inscrição Municipal (Opcional)"
                required={false}
              />
              <input
                type="text"
                onChange={handleChange}
                name="inscricao_estadual"
                value={form.inscricao_estadual}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Inscrição Estadual (Opcional)"
                required={false}
              />
              <input
                type="text"
                onChange={handleChange}
                name="cnae"
                value={form.cnae}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="CNAE (Código ou Atividade)"
                required={false}
              />
              <input
                type="text"
                onChange={handleChange}
                name="responsavel"
                value={form.produtos_servicos}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Produtos e Serviços Ofertados pelo Fornecedor."
                required
              />
              {/* Porte */}
              <select
                /* onChange={handleChangeSelect} */
                name="role"
                value={form.porte_empresa}
                className="rounded border-b border-zinc-500 bg-light-500 bg-transparent py-1 px-2 pb-1 text-light-50 outline-none dark:bg-dark-500 dark:text-dark-50"
              >
                <option value="">Selecione</option>
                <option value="EPP">EPP</option>
                <option value="ME">EPP</option>
                <option value="N/A">Não se aplica.</option>
              </select>
              {/* Enquadramento */}
              <select
                /* onChange={handleChangeSelect} */
                name="role"
                value={form.enquadramento_empresa}
                className="rounded border-b border-zinc-500 bg-light-500 bg-transparent py-1 px-2 pb-1 text-light-50 outline-none dark:bg-dark-500 dark:text-dark-50"
              >
                <option value="">Selecione</option>
              </select>
              {/* Endereço */}
              <InputMask
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="CEP *"
                mask="99999-999"
                value={form.cep}
                name="cep"
                onChange={handleChange}
                maskChar=""
              />
              <input
                type="text"
                onChange={handleChange}
                name="logradouro"
                value={form.logradouro}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Rua/Avenida"
                required
              />
              <input
                type="text"
                onChange={handleChange}
                name="numero_logradouro"
                value={form.numero_logradouro}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder=""
                required
              />
              <input
                type="text"
                onChange={handleChange}
                name="bairro"
                value={form.bairro}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Bairro"
                required
              />
              <input
                type="text"
                onChange={handleChange}
                name=""
                value={form.municipio}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Município"
                required
              />
              {/* UFs */}
              <select
                /* onChange={handleChangeSelect} */
                name="role"
                value={form.estado}
                className="rounded border-b border-zinc-500 bg-light-500 bg-transparent py-1 px-2 pb-1 text-light-50 outline-none dark:bg-dark-500 dark:text-dark-50"
              >
                <option value="">Selecione</option>
              </select>
              {/* Contato */}
              <input
                type="text"
                onChange={handleChange}
                name="responsavel"
                value={form.responsavel}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Nome do Responsável *"
                required
              />
              <input
                type="email"
                onChange={handleChange}
                name="email"
                value={form.email}
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="E-mail *"
                required
              />
              <InputMask
                className="border-b border-zinc-500 bg-transparent px-2 pb-1 outline-none"
                placeholder="Telefone *"
                mask="(99)9999-99999"
                value={form.telefone}
                name="telefone"
                onChange={handleChange}
                maskChar=""
              />
            </div>
          </div>
          <button
            disabled={newCadastroMutation.isLoading}
            className="rounded-[10px] bg-roxo p-1 text-xl font-light text-white hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {newCadastroMutation.isLoading ? "Criando protocolo..." : "Criar"}
          </button>
        </form>
      </div>
    </>
  );
};

CadastroCreate.layout = "regular";
export default CadastroCreate;
