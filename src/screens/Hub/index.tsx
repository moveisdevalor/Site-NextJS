"use client";

import AOS from "aos";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../api";
import Thumbanail from "../../components/Image/imageZoom.tsx";
import HubAuthors from "../../components/HUB/Author.tsx";
import { useMenuType } from "@/layout/menu-context";
import "./hub.css";

type AuthorType = {
	autor_id: number;
	name: string;
	image_id: number;
};

export default function Index() {

	const { setMenuType } = useMenuType();

	const [authors, setAuthors] = useState<AuthorType[]>([]);
	const [pairA, setPairA] = useState<number[]>([]);
	const [pairB, setPairB] = useState<number[]>([]);
	const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");

	useEffect(() => {
		AOS.init({ duration: 1200 });
	}, []);

	useEffect(() => {
		setMenuType("transparent");
		return () => setMenuType("default");
	}, [setMenuType]);

	// FETCH
	useEffect(() => {

		const loadAuthors = async () => {

			try {

				const response = await api.get("/specialist");

				const list =
					Array.isArray(response.data)
						? response.data
						: response.data?.data ?? [];

				setAuthors(list);

			} catch (err) {

				console.error("Erro ao carregar especialistas:", err);

			}

		};

		loadAuthors();

	}, []);

	function getRandomPair(length: number, exclude: number[] = []) {

		const available =
			Array.from({ length }, (_, i) => i)
				.filter(i => !exclude.includes(i));

		if (available.length < 2) return exclude;

		const first =
			available[Math.floor(Math.random() * available.length)];

		let second =
			available[Math.floor(Math.random() * available.length)];

		while (second === first) {

			second =
				available[Math.floor(Math.random() * available.length)];

		}

		return [first, second];

	}

	// INIT
	useEffect(() => {

		if (authors.length < 2) return;

		setPairA(getRandomPair(authors.length));

	}, [authors]);

	// ROTATION
	useEffect(() => {

		if (authors.length < 4) return;

		const interval = setInterval(() => {

			if (activeLayer === "A") {

				setPairB(getRandomPair(authors.length, pairA));
				setActiveLayer("B");

			} else {

				setPairA(getRandomPair(authors.length, pairB));
				setActiveLayer("A");

			}

		}, 4000);

		return () => clearInterval(interval);

	}, [authors, activeLayer, pairA, pairB]);

	return (

		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "CollectionPage",
						name: "Hub de Inteligência do Setor Moveleiro",
						description:
							"Plataforma que conecta especialistas, indústria e varejo do setor moveleiro com conteúdo estratégico.",
						url: "https://www.moveisdevalor.com.br/hub",
					}),
				}}
			/>
			<div className="hub">

				<div className="container py-30">

					<div className="row">

						<div className="col-12 col-md-5 mt-5 order-md-1">

							<div className="header-page">

								<img
									src="https://apiv2.moveisdevalor.com.br/upload/images/26061/Hub_horizontal.png"
									width={150}
									alt="HUB"
								/>

								<h1 className="hub-title mt-4">Hub de Inteligência</h1>
								<p className="hub-subtitle">Conectando indústria, varejo e especialistas</p>

								<p className="hub-lead mt-3">
									O Hub nasce para conectar inteligência, mercado e pessoas.
								</p>

								<p className="hub-lead">
									Mais do que conteúdo, entrega direção estratégica para a cadeia moveleira.
								</p>

								<p className="hub-lead">
									Integra indústria, varejo e fornecedores em um único ecossistema vivo.
								</p>

								<p className="hub-lead">
									Transforma informação em decisão — e decisão em resultado.
								</p>

								<p className="hub-lead">
									É onde tendências deixam de ser discurso e viram ação.
								</p>

								<p className="hub-lead">
									Um novo centro de gravidade para quem quer liderar, não apenas acompanhar.
								</p>

								<Link href="/hub/sobre" className="hub-btn mt-3">
									Ver mais
								</Link>

							</div>

						</div>

						{/* IMAGENS */}
						<div className="col-12 col-md-6 offset-md-1 order-md-2 d-none d-md-flex gap-2">

							<div className="person-one crossfade-wrapper">
								<div className={`fade-layer ${activeLayer === "A" ? "visible" : ""}`}>
									{pairA[0] !== undefined && (
										<Thumbanail image_id={authors[pairA[0]].image_id} ratio="3/4" fit="cover" />
									)}
								</div>
								<div className={`fade-layer ${activeLayer === "B" ? "visible" : ""}`}>
									{pairB[0] !== undefined && (
										<Thumbanail image_id={authors[pairB[0]].image_id} ratio="3/4" fit="cover" />
									)}
								</div>
							</div>

							<div className="person-two crossfade-wrapper">
								<div className={`fade-layer ${activeLayer === "A" ? "visible" : ""}`}>
									{pairA[1] !== undefined && (
										<Thumbanail image_id={authors[pairA[1]].image_id} ratio="3/4" fit="cover" />
									)}
								</div>

								<div className={`fade-layer ${activeLayer === "B" ? "visible" : ""}`}>
									{pairB[1] !== undefined && (
										<Thumbanail image_id={authors[pairB[1]].image_id} ratio="3/4" fit="cover" />
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="hub hub-section hub-section--tinted">
				<div className="container">
					<div className="text-center">
						<HubAuthors />
					</div>
				</div>
			</div>

		</>
	);

}
