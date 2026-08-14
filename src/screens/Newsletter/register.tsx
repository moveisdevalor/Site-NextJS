"use client";

import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
    LuCircleAlert,
    LuMail,
    LuPhone,
    LuSave,
} from "react-icons/lu";

import { api } from "../../api";

import "./register.css";

const ATIVIDADES = [
    ["O", "Outros"],
    ["L", "Lojas"],
    ["I", "Industrias"],
    ["F", "Fornecedores"],
    ["P", "Profissionais"],
];

const RAMOS: Record<string, [string, string][]> = {
    L: [
        ["P", "Planejados"],
        ["MM", "Multimarcas"],
        ["DC", "Decoracao"],
    ],
    I: [
        ["S", "Seriados"],
        ["M", "Marcenaria"],
    ],
    F: [
        ["S", "Seriados"],
        ["M", "Marcenaria"],
    ],
    P: [
        ["AD", "Arquitetos"],
        ["RT", "Representante"],
    ],
};

const BASES = [
    ["Todos", "Todos"],
    ["News MV", "News MV"],
    ["HUB", "Hub"],
    ["Revista", "Revista Digital"],
    ["Cursos", "Cursos"],
];

const UFS = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const INITIAL_FORM = {
    email: "",
    name: "",
    departamento: "",
    empresa: "",
    phone: "",
    base: "",
    atividade: "",
    ramo: "",
    state_id: "",
    authorized: 0,
};

export default function Register() {

    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState(() => ({
        ...INITIAL_FORM,
        email: searchParams.get("email") || "",
        authorized: searchParams.get("authorized") === "1" ? 1 : 0,
    }));

    /*
    |--------------------------------------------------------------------------
    | INIT
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);

    /*
    |--------------------------------------------------------------------------
    | HANDLERS
    |--------------------------------------------------------------------------
    */
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
            ...(name === "atividade" && { ramo: "" }),
        }));
    }

    function getRamos() {
        return RAMOS[form.atividade] || [];
    }

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!form.name) {
            setMessage("Informe seu nome");
            return;
        }

        if (!form.email) {
            setMessage("Informe um email valido");
            return;
        }

        if (!form.authorized) {
            setMessage("E necessario autorizar o recebimento de comunicacoes");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await api.post("/email", form);

            setMessage("Cadastro realizado com sucesso!");

            setForm(INITIAL_FORM);

        } catch (err: any) {

            console.error(err);

            const status = err?.response?.status;
            const apiMessage = err?.response?.data?.message;

            if (status === 409) {
                setMessage(apiMessage || "Este email ja esta cadastrado");
                return;
            }

            setMessage("Erro ao cadastrar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-page">
            <div className="register-container">

                {/* HERO */}
                <div className="register-hero" data-aos="fade-right">

                    <h1>
                        Fique por dentro das novidades do setor antes de todo mundo
                    </h1>

                    <p>
                        Receba conteúdos exclusivos, tendências, oportunidades e
                        novidades relevantes para o mercado moveleiro.
                    </p>

                </div>

                {/* FORM */}
                <div
                    className="register-form-card"
                    data-aos="fade-left"
                >

                    <form onSubmit={handleSubmit} className="email-form">

                        {/* CONTATO */}
                        <section className="email-form-section">

                            <div className="email-base-panel-header">
                                <div>
                                    <h5>Contato</h5>
                                    <p>
                                        Preencha seus dados principais.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">

                                <div className="col-12">
                                    <label className="email-base-label">
                                        Nome
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Seu nome"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="email-base-label">
                                        Email
                                    </label>

                                    <div className="email-base-input-wrap">
                                        <LuMail size={15} />

                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="nome@empresa.com"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="email-base-label">
                                        Interesse
                                    </label>

                                    <select
                                        name="base"
                                        value={form.base}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Selecione
                                        </option>

                                        {BASES.map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="email-base-label">
                                        Telefone
                                    </label>

                                    <div className="email-base-input-wrap">
                                        <LuPhone size={15} />

                                        <input
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="email-base-label">
                                        Departamento
                                    </label>

                                    <input
                                        name="departamento"
                                        value={form.departamento}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Ex.: Comercial"
                                    />
                                </div>

                            </div>

                        </section>

                        {/* EMPRESA */}
                        <section className="email-form-section">

                            <div className="email-base-panel-header">
                                <div>
                                    <h5>Empresa</h5>
                                    <p>
                                        Ajuda a personalizar os conteúdos recebidos.
                                    </p>
                                </div>
                            </div>

                            <div className="row g-3">

                                <div className="col-12">
                                    <label className="email-base-label">
                                        Empresa
                                    </label>

                                    <input
                                        name="empresa"
                                        value={form.empresa}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Nome da empresa"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="email-base-label">
                                        UF
                                    </label>

                                    <select
                                        name="state_id"
                                        value={form.state_id}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Selecione
                                        </option>

                                        {UFS.map(uf => (
                                            <option key={uf} value={uf}>
                                                {uf}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="email-base-label">
                                        Atividade
                                    </label>

                                    <select
                                        name="atividade"
                                        value={form.atividade}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Selecione
                                        </option>

                                        {ATIVIDADES.map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="email-base-label">
                                        Ramo
                                    </label>

                                    <select
                                        name="ramo"
                                        value={form.ramo}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Selecione
                                        </option>

                                        {getRamos().map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                        </section>

                        {/* AUTORIZACAO */}
                        <div className="email-form-consent">
                            <label className="consent">
                                <input
                                    type="checkbox"
                                    name="authorized"
                                    checked={form.authorized === 1}
                                    onChange={handleChange}
                                />
                                <span>
                                    Autorizo o recebimento de comunicacoes por email e declaro estar
                                    de acordo com a{" "}
                                    <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">
                                        Politica de Privacidade
                                    </a>.
                                </span>
                            </label>
                        </div>

                        {/* FOOTER */}
                        <div className="email-form-footer">

                            <div className="msg-alert email-form-tip">
                                <LuCircleAlert />
                                Seus dados sao utilizados apenas para envio de conteudo relevante.
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !form.authorized}
                            >
                                <LuSave size={15} />

                                {loading
                                    ? "Enviando..."
                                    : "Quero receber novidades"}
                            </button>

                        </div>

                    </form>

                    {message && (
                        <div className="message mt-3">
                            {message}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}
