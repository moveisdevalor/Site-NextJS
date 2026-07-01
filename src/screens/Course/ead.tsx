"use client";

import AOS from 'aos';
import { useEffect, useState } from "react";
import { useMenuType } from "@/layout/menu-context";
import "./styles.css";


type CourseType = {
	id: string;
	name: string;
	logo: string;
	logoWidth?: number;
	description: string;
	url: string;
};

const COURSES: CourseType[] = [
	{
		id: "mestre-marceneiro",
		name: "Mestre Marceneiro",
		logo: "http://www.mestremarceneiro.com.br/theme/default/img/logo.png",
		description:
			"Para profissionais da marcenaria que precisam controlar custos, posicionar produtos no mercado com qualidade e obter o melhor custo-benefício. Capacitação é o caminho para uma marcenaria lucrativa.",
		url: "/curso/mestre-marceneiro",
	},
	{
		id: "super-gerente",
		name: "Super Gerente",
		logo: "https://www.cursosupergerente.com.br/theme/default/img/logo-supergerente.png",
		logoWidth: 200,
		description:
			"Uma função que exige agilidade, criatividade, persistência e capacitação constante. Formação dedicada ao gerente de loja de móveis e eletrodomésticos — papel fundamental e pouco endereçado pelo ensino tradicional.",
		url: "/curso/super-gerente",
	},
	{
		id: "venda-planejados",
		name: "Venda de Planejados em 6 Passos",
		logo: "https://www.vendadeplanejados.com.br/theme/default/img/logo.png",
		logoWidth: 180,
		description:
			"Como recuperar a imagem do setor de planejados e converter mais vendas. Metodologia em 6 passos para vendedores que precisam superar objeções e fechar contratos com segurança.",
		url: "/curso/venda-de-planejados",
	},
	{
		id: "trilha-esg",
		name: "Trilha de Aprendizado ESG",
		logo: "https://trilhadeaprendizadoesg.com.br/img/logo.png",
		logoWidth: 200,
		description:
			"Pauta ESG aplicada ao setor moveleiro: governança, práticas ambientais e impacto social. Formação para quem precisa transformar exigências de mercado em diferencial competitivo.",
		url: "https://trilhadeaprendizadoesg.com.br/",
	},
	{
		id: "expert-colchao",
		name: "Expert em Venda de Colchão",
		logo: "https://www.expertemvendadecolchao.com.br/theme/default/img/logo.png",
		logoWidth: 200,
		description:
			"Técnica de venda especializada para o segmento colchoeiro. Argumentos, sondagem, materiais e fechamento — para vendedores que querem se destacar em um produto de alta consideração.",
		url: "https://www.expertemvendadecolchao.com.br/",
	},
];

export default function Index() {

	const { setMenuType } = useMenuType();

	const [login, setLogin] = useState({ email: "", password: "" });
	const [loginLoading, setLoginLoading] = useState(false);
	const [loginMessage, setLoginMessage] = useState("");

	useEffect(() => {
		AOS.init({ duration: 1200 });
	}, []);

	useEffect(() => {
		setMenuType("transparent");
		return () => setMenuType("default");
	}, []);

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!login.email || !login.password) {
			setLoginMessage("Informe usuário e senha");
			return;
		}

		setLoginLoading(true);
		setLoginMessage("");

		try {
			const formData = new FormData();
			formData.append("user", login.email);
			formData.append("pass", login.password);
			formData.append("link", "https://ead.moveisdevalor.com.br");
			formData.append("op", "");

			const res = await fetch("https://ead.moveisdevalor.com.br/form/login.php", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			const text = await res.text();
			const xml = new DOMParser().parseFromString(text, "text/xml");
			const resultEl = xml.querySelector("result");
			const value = resultEl?.getAttribute("value") ?? "";
			const message = resultEl?.textContent?.trim() ?? "";

			if (value === "0") {
				setLoginMessage(message || "Dados de login incorretos.");
			} else {
				window.location.href = "https://ead.moveisdevalor.com.br";
			}
		} catch (err) {
			console.error("Erro no login EAD:", err);
			setLoginMessage("Não foi possível processar o login. Tente novamente.");
		} finally {
			setLoginLoading(false);
		}
	};

	const isExternal = (url: string) => /^https?:\/\//i.test(url);

	return (
		<>

			{/* HERO + LOGIN */}
			<div className="section course course-hero course-page">
				<div className="container p-50">
					<div className="row align-items-center">

						<div className="col-12 col-lg-7">
							<header className="header-page">
								<h1>Cursos</h1>

								<p className="mt-3">
									Profissionalizar equipes é transformar potencial em resultado.
								</p>
								<p className="mt-3">
									Em um mercado cada vez mais competitivo, conhecimento técnico
									e visão de negócio fazem a diferença no atendimento,
									na gestão e na produção.
								</p>
								<p className="mt-3">
									Vendedores, gestores e marceneiros preparados elevam a percepção
									de valor e a experiência do cliente.
								</p>
								<p className="mt-3">
									Capacitação não é custo — é o que sustenta crescimento consistente.
								</p>

								<div className="course-stats">
									<div className="course-info">
										<h2 className="number">5</h2>
										<p className="info">Cursos</p>
									</div>

									<div className="course-info">
										<h2 className="number">4.525</h2>
										<p className="info">Capacitações</p>
									</div>

									<div className="course-info">
										<h2 className="number">120</h2>
										<p className="info">Horas de conteúdo</p>
									</div>
								</div>
							</header>
						</div>

						{/* LOGIN no lugar da imagem */}
						<div className="col-12 col-lg-5">
							<div className="course-login-wrapper">

								<h2 className="course-section-title">Área do aluno</h2>
								<p className="course-login-intro">
									Acesse sua conta para continuar de onde parou.
								</p>

								<form
									className="course-login-form"
									onSubmit={handleLogin}
								>

									<div>
										<label className="course-login-label" htmlFor="course-usuario">
											Usuário
										</label>
										<input
											id="course-usuario"
											name="user"
											type="text"
											className="course-login-input"
											placeholder="Seu usuário"
											value={login.email}
											onChange={(e) => setLogin({ ...login, email: e.target.value })}
										/>
									</div>

									<div>
										<label className="course-login-label" htmlFor="course-password">
											Senha
										</label>
										<input
											id="course-password"
											name="pass"
											type="password"
											className="course-login-input"
											placeholder="••••••••"
											value={login.password}
											onChange={(e) => setLogin({ ...login, password: e.target.value })}
										/>
									</div>

									<div className="course-login-actions">
										<a href="/cursos/recuperar-senha" className="course-login-forgot">
											Esqueci minha senha
										</a>
									</div>

									<button
										type="submit"
										className="mv-btn course-login-submit"
										disabled={loginLoading}
									>
										{loginLoading ? "Entrando..." : "Entrar"}
									</button>

									{loginMessage && (
										<p className="course-login-help">{loginMessage}</p>
									)}

								</form>

								<p className="course-login-help">
									Ainda não tem conta? <a href="/cursos/cadastro">Cadastre-se</a>
								</p>

							</div>
						</div>

					</div>
				</div>
			</div>

			{/* CARDS DE CURSOS */}
			<div className="section py-5 course-page">
				<div className="container">

					<h2 className="course-section-title">Nossos cursos</h2>
					<p className="course-section-subtitle">
						Trilhas pensadas para os diferentes papéis do setor — da indústria ao
						varejo, da gestão à produção.
					</p>

					<div className="courses-grid">
						{COURSES.map((course) => {
							const external = isExternal(course.url);
							return (
								<article key={course.id} className="course-card">
									<div className="course-card-logo">
										<img
											src={course.logo}
											alt={course.name}
											style={course.logoWidth ? { width: course.logoWidth } : undefined}
										/>
									</div>
									<div className="course-card-body">
										<h3 className="course-card-title">{course.name}</h3>
										<p className="course-card-text">{course.description}</p>
										<a
											href={course.url}
											className="mv-btn-outline course-card-cta"
											target={external ? "_blank" : undefined}
											rel={external ? "noopener noreferrer" : undefined}
										>
											Saiba mais
										</a>
									</div>
								</article>
							);
						})}
					</div>

				</div>
			</div>
		</>
	);
}
