"use client";

import AOS from 'aos';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMenuType } from "@/layout/menu-context";
import { api } from "../../api";
import PostThumbnail from "../../components/Image/image";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import "./styles.css";

// id da categoria "Cursos" em ecommerce_category
const CURSOS_CATEGORY_ID = 3;

function stripHtml(html: string, maxLen = 160): string {
	let text: string;

	if (typeof window !== "undefined") {
		const div = document.createElement("div");
		div.innerHTML = html;
		text = div.textContent || "";
	} else {
		text = html.replace(/<[^>]*>/g, " ");
	}

	text = text.replace(/\s+/g, " ").trim();
	return text.length > maxLen ? `${text.slice(0, maxLen).trim()}…` : text;
}

export default function Index() {

	const { setMenuType } = useMenuType();

	const [login, setLogin] = useState({ email: "", password: "" });
	const [loginLoading, setLoginLoading] = useState(false);
	const [loginMessage, setLoginMessage] = useState("");
	const [courses, setCourses] = useState<Product[]>([]);

	useEffect(() => {
		AOS.init({ duration: 1200 });
	}, []);

	useEffect(() => {
		api.get<{ data?: Product[] }>("/products", {
			params: { category: CURSOS_CATEGORY_ID, limit: 24 },
		})
			.then((res) => setCourses(res.data?.data ?? []))
			.catch((err) => {
				console.error("Erro ao buscar cursos:", err);
				setCourses([]);
			});
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
			console.log("[login] response:", res.status, text);

			const xml = new DOMParser().parseFromString(text, "text/xml");
			const resultEl = xml.querySelector("result");
			const value = resultEl?.getAttribute("value") ?? null;
			const message = resultEl?.textContent?.trim() ?? "";

			if (value === null) {
				setLoginMessage("Resposta inesperada do servidor. Tente novamente.");
				return;
			}

			if (value === "1") {
				window.location.href = "https://ead.moveisdevalor.com.br";
			} else {
				setLoginMessage(message || "Dados de login incorretos.");
			}
		} catch (err) {
			console.error("Erro no login EAD:", err);
			setLoginMessage("Não foi possível processar o login. Tente novamente.");
		} finally {
			setLoginLoading(false);
		}
	};

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
										<h2 className="number">{courses.length}</h2>
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

									<div className="course-login-actions d-none">
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
									Ainda não tem conta? <a href="curso/cadastro">Cadastre-se</a>
								</p>

							</div>
						</div>

					</div>
				</div>
			</div>

			{/* CARDS DE CURSOS */}
			{courses.length > 0 && (
				<div className="section py-5 course-page">
					<div className="container">

						<h2 className="course-section-title">Nossos cursos</h2>
						<p className="course-section-subtitle">
							Trilhas pensadas para os diferentes papéis do setor — da indústria ao
							varejo, da gestão à produção.
						</p>

						<div className="courses-grid">
							{courses.map((course) => (
								<Link
									key={course.id}
									href={`/loja/${course.id}`}
									className="course-card"
								>
									<div className="course-card-cover">
										<PostThumbnail
											image_id={course.cover_image_id || Number(course.image_id) || null}
											ratio="16/10"
										/>
									</div>
									<div className="course-card-body">
										<h3 className="course-card-title">{course.name}</h3>
										<p className="course-card-text">{stripHtml(course.description)}</p>
										{formatPrice(course.value) && (
											<p className="course-card-price">{formatPrice(course.value)}</p>
										)}
										<span className="mv-btn-outline course-card-cta">
											Saiba mais
										</span>
									</div>
								</Link>
							))}
						</div>

					</div>
				</div>
			)}
		</>
	);
}
