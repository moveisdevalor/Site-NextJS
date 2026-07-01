"use client";

import AOS from "aos";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMenuType } from "@/layout/menu-context";
import Image from "../../components/Image/image";
import { api } from "../../api";
import Html from "../../components/Post/html.tsx";
import {LuMail, LuPhone} from "react-icons/lu";
import "./hub.css";

type AuthorType = {
	autor_id: number;
	name: string;
	specialty?: string;
	description?: string;
	he_writes?: string;
	position?: string;
	email?: string;
	phone?: string;
	image_id?: number;
	slug?: string;
};

type PostType = {
	post_id: number;
	title: string;
	slug: string;
	sub_title: string;
	autor_id: number;
	image_id: number;
};

type SpecialistProps = {
	initialAuthor?: AuthorType | null;
	initialPosts?: PostType[];
};

export default function SpecialistPage({
	initialAuthor = null,
	initialPosts = [],
}: SpecialistProps = {}) {

	const params = useParams<{ name?: string }>();
	const name = params?.name;

	const { setMenuType } = useMenuType();

	const [author, setAuthor] = useState<AuthorType | null>(initialAuthor);
	const [posts, setPosts] = useState<PostType[]>(initialPosts);
	const [loading, setLoading] = useState(initialAuthor === null);

	async function loadData() {
		if (!name) return;

		try {
			setLoading(true);

			const res = await api.get(`/autor/${name}`);

			setAuthor(res.data.author);
			setPosts(res.data.posts || []);

		} catch (error) {
			console.error("Erro ao carregar especialista:", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		// Se ja veio do server, nao re-fetcha
		if (initialAuthor) return;
		loadData();
	}, [name, initialAuthor]);

	useEffect(() => {
		AOS.init({ duration: 1200 });
	}, []);

	useEffect(() => {
		setMenuType("transparent");
		return () => setMenuType("default");
	}, []);

	const normalizePhone = (phone?: string) => {
		if (!phone) return null;

		// remove tudo que não for número
		const digits = phone.replace(/\D/g, "");

		// garante prefixo Brasil se não existir
		if (!digits.startsWith("55")) {
			return `55${digits}`;
		}

		return digits;
	};

	const whatsappLink = (phone?: string) => {
		const normalized = normalizePhone(phone);
		return normalized ? `https://wa.me/${normalized}` : null;
	};

	const emailLink = (email?: string) => {
		return email ? `mailto:${email}` : null;
	};

	if (loading) {
		return (
			<div className="container pt-100 pb-100 text-center">
				<h2>Carregando especialista...</h2>
			</div>
		);
	}

	if (!author) {
		return (
			<div className="container pt-100 pb-100 text-center">
				<h2>Especialista não encontrado</h2>
			</div>
		);
	}


	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Person",
						name: author.name,
						description: author.description,
						jobTitle: author.position,
						url: `https://www.moveisdevalor.com.br/hub/${author.slug ?? name}`,
						image: author.image_id
							? `https://apiv2.moveisdevalor.com.br/images/${author.image_id}`
							: undefined,
						worksFor: {
							"@type": "Organization",
							name: "Móveis de Valor",
						},
						sameAs: [author.email ? `mailto:${author.email}` : undefined].filter(
							Boolean,
						),
					}),
				}}
			/>
			<div className="section h-100 pt-100">
				<div className="container">
					<div className="row">
						<div className="col-12 col-md-6">
							<h1 className="font-outfit title-hub">{author.name}</h1>

							<h2 className="font-outfit subtitle-hub">{author.position}</h2>

							<div className="mt-3">
								<p>
									{author.phone && (
										<>
											<a
												href={whatsappLink(author.phone)!}
												target="_blank"
												rel="noopener noreferrer"
											>
												<LuPhone /> {author.phone}
											</a>
											<br />
										</>
									)}

									{author.email && (
										<a href={emailLink(author.email)!}>
											<LuMail /> {author.email}
										</a>
									)}
								</p>
							</div>

							<h3 className="mt-4">
								<strong>Sobre</strong>
							</h3>
							<Html content={author.description ?? ""} />

							<h3 className="mt-4">
								<strong>Sobre o que escreve</strong>
							</h3>
							<Html content={author.he_writes ?? ""} />

							<h3 className="mt-4">
								<strong>Especialidade</strong>
							</h3>
							<Html content={author.specialty ?? ""} />
						</div>

						<div className="d-none d-md-block col-md-4 offset-2 position-relative">
							<div className="person-one">
								<Image image_id={author.image_id} ratio="3/4" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="section p-50">
				<div className="container">
					<div className="row">
						<div className="col-12 mb-4">
							<h2>Artigos</h2>
						</div>

						{posts.map((item) => (
							<div className=" col-12 col-md-4 mb-3" key={item.post_id}>
								<Link
									href={`/${item.slug}`}
									className="text-decoration-none"
								>

										{/*<div className="col-5">*/}
										{/*	<Image image_id={item.image_id} />*/}
										{/*</div>*/}

										<div className="article-list">
											<h2
												// data-aos="fade-right"
												// data-aos-delay="200"
												className="article-title-list">
												{item.title}
											</h2>
											<p className="article-subtitle-list">
												{item.sub_title}
											</p>
											<div className="d-block mb-4">
												<p className="btn-leia">
													Leia
												</p>
											</div>

										</div>
								</Link>
							</div>
						))}

						{posts.length === 0 && (
							<div className="col-12">
								<p>Nenhum artigo encontrado.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
