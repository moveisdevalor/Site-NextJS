"use client";

import { useState } from "react";
import "./register.css";

const UF_LIST = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

type FormState = {
    name: string;
    email: string;
    cpf: string;
    sexo: string;
    phone: string;
    cell: string;
    username: string;
    password: string;
    confPassword: string;
    address: string;
    number: string;
    district: string;
    city: string;
    cep: string;
    stateId: string;
    complement: string;
    loja: string;
    find: string;
    course: string;
};

export default function CourseRegister() {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        cpf: "",
        sexo: "",
        phone: "",
        cell: "",
        username: "",
        password: "",
        confPassword: "",
        address: "",
        number: "",
        district: "",
        city: "",
        cep: "",
        stateId: "AC",
        complement: "",
        loja: "",
        find: "",
        course: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // limpa erro do campo ao digitar
        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.password !== form.confPassword) {
            setMessage({ type: "error", text: "As senhas não conferem." });
            return;
        }

        setLoading(true);
        setMessage(null);
        setFieldErrors({});

        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => data.append(k, v));
            data.append("typeId", "3");
            data.append("status", "1");
            data.append("id", "");
            data.append("op", "I");

            const res = await fetch(
                "https://ead.moveisdevalor.com.br/form/register.php",
                {
                    method: "POST",
                    body: data,
                    credentials: "include",
                }
            );

            const text = await res.text();
            console.log("[register] response:", res.status, text);

            const xml = new DOMParser().parseFromString(text, "text/xml");

            // Formato 1: <xml><valid><field name="...">erro</field>...</valid></xml>
            const validEl = xml.querySelector("valid");
            const fields = validEl ? Array.from(validEl.querySelectorAll("field")) : [];

            if (fields.length > 0) {
                const errors: Record<string, string> = {};
                fields.forEach((f) => {
                    const name = f.getAttribute("name") || "";
                    const errMsg = f.textContent?.trim() || "";
                    if (name) errors[name] = errMsg;
                });

                setFieldErrors(errors);
                setMessage({
                    type: "error",
                    text: "Existem erros de preenchimento. Verifique os campos abaixo.",
                });
                return;
            }

            // Formato 2: <xml><result value="0|1">mensagem</result></xml>
            const resultEl = xml.querySelector("result");
            if (resultEl) {
                const value = resultEl.getAttribute("value");
                const msg = resultEl.textContent?.trim() ?? "";

                if (value === "1") {
                    setMessage({
                        type: "success",
                        text: msg || "Cadastro realizado com sucesso! Redirecionando...",
                    });
                    setTimeout(() => {
                        window.location.href = "https://ead.moveisdevalor.com.br";
                    }, 1500);
                } else {
                    setMessage({
                        type: "error",
                        text: msg || "Não foi possível concluir o cadastro.",
                    });
                }
                return;
            }

            // Estrutura desconhecida
            setMessage({
                type: "error",
                text: "Resposta inesperada do servidor. Tente novamente.",
            });
        } catch (err) {
            console.error("Erro no cadastro EAD:", err);
            setMessage({ type: "error", text: "Não foi possível processar o cadastro. Tente novamente." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="register-page">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">

                            <div className="register-card">

                                <header className="register-header">
                                    <h1 className="register-title">Crie sua conta</h1>
                                    <p className="register-subtitle">
                                        Acesse os cursos da Móveis de Valor. Preencha os dados abaixo
                                        para iniciar sua inscrição.
                                    </p>
                                </header>

                                <form onSubmit={handleSubmit} className="register-form" noValidate>

                                    {/* DADOS PESSOAIS */}
                                    <h3 className="register-section">Dados pessoais</h3>

                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label className="register-label">Nome completo *</label>
                                            <input type="text" name="name" className={`register-input ${fieldErrors.name ? "register-input-error" : ""}`} value={form.name} onChange={handleChange} />
                                            {fieldErrors.name && <p className="register-field-error">{fieldErrors.name}</p>}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="register-label">Sexo</label>
                                            <select name="sexo" className={`register-input ${fieldErrors.sexo ? "register-input-error" : ""}`} value={form.sexo} onChange={handleChange}>
                                                <option value="">Sexo</option>
                                                <option value="1">Feminino</option>
                                                <option value="2">Masculino</option>
                                            </select>
                                            {fieldErrors.sexo && <p className="register-field-error">{fieldErrors.sexo}</p>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">CPF</label>
                                            <input type="text" name="cpf" className={`register-input ${fieldErrors.cpf ? "register-input-error" : ""}`} value={form.cpf} onChange={handleChange} />
                                            {fieldErrors.cpf && <p className="register-field-error">{fieldErrors.cpf}</p>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Email *</label>
                                            <input type="email" name="email" className={`register-input ${fieldErrors.email ? "register-input-error" : ""}`} value={form.email} onChange={handleChange} />
                                            {fieldErrors.email && <p className="register-field-error">{fieldErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Telefone</label>
                                            <input type="text" name="phone" className={`register-input ${fieldErrors.phone ? "register-input-error" : ""}`} value={form.phone} onChange={handleChange} />
                                            {fieldErrors.phone && <p className="register-field-error">{fieldErrors.phone}</p>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Celular</label>
                                            <input type="text" name="cell" className={`register-input ${fieldErrors.cell ? "register-input-error" : ""}`} value={form.cell} onChange={handleChange} />
                                            {fieldErrors.cell && <p className="register-field-error">{fieldErrors.cell}</p>}
                                        </div>
                                    </div>

                                    {/* ACESSO */}
                                    <h3 className="register-section">Dados de acesso</h3>

                                    <div className="mb-3">
                                        <label className="register-label">Usuário *</label>
                                        <input type="text" name="username" className={`register-input ${fieldErrors.username ? "register-input-error" : ""}`} value={form.username} onChange={handleChange} />
                                        {fieldErrors.username && <p className="register-field-error">{fieldErrors.username}</p>}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Senha *</label>
                                            <input type="password" name="password" className={`register-input ${fieldErrors.password ? "register-input-error" : ""}`} value={form.password} onChange={handleChange} />
                                            {fieldErrors.password && <p className="register-field-error">{fieldErrors.password}</p>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Confirmar senha *</label>
                                            <input type="password" name="confPassword" className={`register-input ${fieldErrors.confPassword ? "register-input-error" : ""}`} value={form.confPassword} onChange={handleChange} />
                                            {fieldErrors.confPassword && <p className="register-field-error">{fieldErrors.confPassword}</p>}
                                        </div>
                                    </div>

                                    {/* ENDEREÇO */}
                                    <h3 className="register-section">Endereço</h3>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="register-label">CEP *</label>
                                            <input type="text" name="cep" className={`register-input ${fieldErrors.cep ? "register-input-error" : ""}`} value={form.cep} onChange={handleChange} />
                                            {fieldErrors.cep && <p className="register-field-error">{fieldErrors.cep}</p>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Endereço *</label>
                                            <input type="text" name="address" className={`register-input ${fieldErrors.address ? "register-input-error" : ""}`} value={form.address} onChange={handleChange} />
                                            {fieldErrors.address && <p className="register-field-error">{fieldErrors.address}</p>}
                                        </div>

                                        <div className="col-md-2 mb-3">
                                            <label className="register-label">Nº</label>
                                            <input type="text" name="number" className={`register-input ${fieldErrors.number ? "register-input-error" : ""}`} value={form.number} onChange={handleChange} />
                                            {fieldErrors.number && <p className="register-field-error">{fieldErrors.number}</p>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Bairro *</label>
                                            <input type="text" name="district" className={`register-input ${fieldErrors.district ? "register-input-error" : ""}`} value={form.district} onChange={handleChange} />
                                            {fieldErrors.district && <p className="register-field-error">{fieldErrors.district}</p>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Complemento</label>
                                            <input type="text" name="complement" className={`register-input ${fieldErrors.complement ? "register-input-error" : ""}`} value={form.complement} onChange={handleChange} />
                                            {fieldErrors.complement && <p className="register-field-error">{fieldErrors.complement}</p>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label className="register-label">Cidade *</label>
                                            <input type="text" name="city" className={`register-input ${fieldErrors.city ? "register-input-error" : ""}`} value={form.city} onChange={handleChange} />
                                            {fieldErrors.city && <p className="register-field-error">{fieldErrors.city}</p>}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="register-label">UF</label>
                                            <select name="stateId" className={`register-input ${fieldErrors.stateId ? "register-input-error" : ""}`} value={form.stateId} onChange={handleChange}>
                                                {UF_LIST.map((uf) => (
                                                    <option key={uf} value={uf}>{uf}</option>
                                                ))}
                                            </select>
                                            {fieldErrors.stateId && <p className="register-field-error">{fieldErrors.stateId}</p>}
                                        </div>
                                    </div>

                                    {/* CURSO */}
                                    <h3 className="register-section">Curso</h3>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Voucher/Empresa</label>
                                            <input type="text" name="loja" className={`register-input ${fieldErrors.loja ? "register-input-error" : ""}`} placeholder="ex: 001-Empresa" value={form.loja} onChange={handleChange} />
                                            {fieldErrors.loja && <p className="register-field-error">{fieldErrors.loja}</p>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="register-label">Como nos conheceu? *</label>
                                            <select name="find" className={`register-input ${fieldErrors.find ? "register-input-error" : ""}`} value={form.find} onChange={handleChange}>
                                                <option value="">Como nos conheceu?</option>
                                                <option value="S">Site</option>
                                                <option value="E">Email</option>
                                                <option value="T">Telefone</option>
                                                <option value="A">Amigo</option>
                                            </select>
                                            {fieldErrors.find && <p className="register-field-error">{fieldErrors.find}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="register-label">Selecione o Curso *</label>
                                        <select name="course" className={`register-input ${fieldErrors.course ? "register-input-error" : ""}`} value={form.course} onChange={handleChange}>
                                            <option value="">Selecione o Curso</option>
                                            <option value="4">Expert em Venda de Colchão</option>
                                            <option value="5">Expert em Venda de Colchão (aulas abertas)</option>
                                            <option value="1">Mestre Marceneiro</option>
                                            <option value="3">SuperGerente</option>
                                            <option value="6">Trilha de Aprendizado ESG</option>
                                            <option value="2">Venda de Planejados em 6 Passos</option>
                                        </select>
                                        {fieldErrors.course && <p className="register-field-error">{fieldErrors.course}</p>}
                                    </div>

                                    {message && (
                                        <div className={`register-alert register-alert-${message.type}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="register-submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Processando..." : "Continuar inscrição"}
                                    </button>

                                    <p className="register-footer">
                                        Já tem cadastro? <a href="/cursos">Acesse sua conta</a>
                                    </p>

                                </form>

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
