"use client";

import { api } from "../../api";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useAnalytics } from "../../hooks/trackEvent";

import PostThumbnail from "../../components/Image/image";
import LoadingSkeleton from "../../components/Loading/LoadingSkeleton";
import Banner from "../../components/Banner";

import AOS from "aos";
import "aos/dist/aos.css";
import "./publications.css";

/**
 * TYPES
 */
type PublicationType = {
	fn_revista_id: number;
	fc_status: string;
	fn_revista?: number | string | null;
	fn_capa_id: number;
	fn_edicao: number;
	fd_cadastro: string;
	slug?: string | null;
};

type ApiResponse = {
	data?: PublicationType[];
	meta?: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

/**
 * CONSTANTS
 */
const REVISTA_IDS = [1, 3, 6] as const;

const REVISTAS: Record<number, string> = {
	1: "Móveis de Valor",
	3: "Norte & Nordeste",
	6: "Anuário de colchões Brasil",
};

/**
 * HELPERS
 */
const getPublicationUrl = (publication: PublicationType) => {
	return publication.slug
		? `/${publication.slug}`
		: `/publicacao/${publication.fn_revista_id}`;
};

type PublicationsProps = {
	initialPublications?: PublicationType[];
};

export default function Publications({
	initialPublications,
}: PublicationsProps = {}) {
	const [publications, setPublications] = useState<PublicationType[]>(
		initialPublications ?? [],
	);
	const [loading, setLoading] = useState(initialPublications === undefined);
	const [selectedRevista, setSelectedRevista] = useState<number | null>(null);
	const initialConsumed = useRef(initialPublications !== undefined);
	const { track } = useAnalytics();

	/**
	 * FETCH INICIAL (HOME)
	 */
	const fetchInitial = useCallback(async () => {
		setLoading(true);
		try {
			const responses = await Promise.all(
				REVISTA_IDS.map((id) =>
					api.get<ApiResponse>("/publications", {
						params: { fn_revista: id, page: 1, limit: 6 },
					})
				)
			);

			const merged = responses.flatMap(
				(res) => res.data?.data ?? []
			);

			setPublications(merged);
		} catch (err) {
			console.error(err);
			setPublications([]);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * FETCH POR REVISTA
	 */
	const fetchByRevista = useCallback(async (id: number) => {
		setLoading(true);
		try {
			const res = await api.get<ApiResponse>("/publications", {
				params: { fn_revista: id, page: 1, limit: 100 },
			});

			setPublications(res.data?.data ?? []);
			setSelectedRevista(id);

			track({
				event_type: "filter",
				event_name: "/publicacoes",
				meta: { revista_id: id, revista_name: REVISTAS[id] ?? String(id) },
			});
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, [track]);

	/**
	 * RESET
	 */
	const resetFilter = () => {
		setSelectedRevista(null);
		fetchInitial();
	};

	/**
	 * INIT
	 */
	useEffect(() => {
		AOS.init({ duration: 1200 });
		if (initialConsumed.current) {
			initialConsumed.current = false;
			return;
		}
		fetchInitial();
	}, [fetchInitial]);

	/**
	 * GROUP
	 */
	const groupedPublications = useMemo(() => {
		const grouped: Record<number, PublicationType[]> = {};

		for (const id of REVISTA_IDS) {
			grouped[id] = publications
				.filter((p) => Number(p.fn_revista ?? 0) === id)
				.sort((a, b) => b.fn_edicao - a.fn_edicao);
		}

		return grouped;
	}, [publications]);

	/**
	 * HERO CAPAS
	 */
	const topCovers = useMemo(() => {
		return REVISTA_IDS
			.map((id) => groupedPublications[id]?.[0])
			.filter(Boolean) as PublicationType[];
	}, [groupedPublications]);

	if (loading) return <LoadingSkeleton />;

	return (
		<>
			{/* BANNER */}
			<div className="section">
				<Banner size="top" />
			</div>

			{/* HERO (APENAS NA HOME) */}
			{!selectedRevista && (
				<div className="section partners publications-hero p-50">
					<div className="container">
						<div className="row">

							<div className="col-lg-5 align-content-center">
								<h2 className="mb-3">
									<strong>
										Onde o setor moveleiro ganha voz há 25 anos
									</strong>.
								</h2>

								<p>
									A Móveis de Valor é mais que uma revista – é um hub de
									inteligência que conecta indústria, varejo e estratégia.
								</p>

								<p>
									Traduz movimentos de mercado em decisão e antecipa tendências.
								</p>

								<p>
									É onde o setor se informa e identifica caminhos estratégicos.
								</p>

								<div className="publications-hero-actions">
									<a href="/loja?category=4" className="mv-btn">
										Assine
									</a>

									<a href="/anuncie" className="mv-btn-outline">
										Anuncie
									</a>
								</div>
							</div>

							<div className="col-lg-7 d-flex gap-3 publications-hero-covers">
								{topCovers.map(publication => (
									<Link
										key={publication.fn_revista_id}
										href={`/${publication.slug ?? `publicacao/${publication.fn_revista_id}`}`}
										style={{ flex: 1 }}
									>
										<PostThumbnail
											image_id={publication.fn_capa_id}
											ratio="3/4"
										/>
									</Link>
								))}
							</div>

						</div>
					</div>
				</div>
			)}

			{/* LISTAGEM */}
			<div className={`container publications-page ${selectedRevista ? "mt-3" : "mt-5"}`}>

				{/* VOLTAR */}
				{selectedRevista && (
					<button className="publications-back" onClick={resetFilter}>
						← Voltar para todas
					</button>
				)}

				{REVISTA_IDS
					.filter((id) => !selectedRevista || id === selectedRevista)
					.map((id) => {
						const lista = groupedPublications[id];
						if (!lista?.length) return null;

						return (
							<div key={id} className="mb-5">

								<div className="publications-section-header">
									<h2 className="publications-section-title">{REVISTAS[id]}</h2>

									{!selectedRevista && (
										<button
											className="publications-see-all"
											onClick={() => fetchByRevista(id)}
										>
											Ver todas
										</button>
									)}
								</div>

								<div className="row">
									{lista.map((pub) => (
										<div
											key={`${pub.fn_revista_id}-${pub.fn_edicao}`}
											className="col-6 col-md-4 col-lg-2 mb-4"
										>
											<Link href={getPublicationUrl(pub)} className="publication-card">
												<div className="publication-card-cover">
													<PostThumbnail
														image_id={pub.fn_capa_id}
														ratio="3/4"
													/>
												</div>

												<p className="publication-card-label">Edição</p>
												<h3 className="publication-card-title">
													Nº {pub.fn_edicao}
												</h3>
											</Link>
										</div>
									))}
								</div>

							</div>
						);
					})}
			</div>
		</>
	);
}
