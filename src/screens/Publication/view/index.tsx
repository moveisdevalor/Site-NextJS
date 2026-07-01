"use client";

import { api } from '../../../api';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import './index.css';

import PostThumbnail from "../../../components/Image/image.tsx";
import LoadingSkeleton from "../../../components/Loading/LoadingSkeleton";
import type { PublicationDetail as PublicationType } from "@/lib/publications";

type ApiResponse = {
	data: PublicationType[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

type PublicationViewProps = {
	initialPublication?: PublicationType | null;
	initialRelated?: PublicationType[];
	initialPage?: string;
};

function getRevistaTipo(fn_revista: string | number | null | undefined): string {
	switch (String(fn_revista)) {
		case "1": return "Móveis de Valor";
		case "2": return "MVDecor";
		case "3": return "Norte & Nordeste";
		case "4": return "Planejados&Cia";
		case "5": return "100% PDV";
		case "6": return "Anuário";
		default: return "Revista não identificada";
	}
}

export default function PublicationPage({
	initialPublication = null,
	initialRelated = [],
	initialPage,
}: PublicationViewProps = {}) {

	const params = useParams<{ slug?: string; page?: string[] }>();
	const slug = params?.slug;
	const pageParam = initialPage ?? params?.page?.[0];
	const router = useRouter();

	const [current, setCurrent] = useState<PublicationType | null>(initialPublication);
	const [related, setRelated] = useState<PublicationType[]>(initialRelated);
	const [loading, setLoading] = useState(initialPublication === null);
	const initialConsumed = useRef(initialPublication !== null);

	const fetchData = useCallback(async () => {
		if (!slug) return;

		setLoading(true);

		try {
			const { data: currentData } = await api.get<PublicationType | { redirect: boolean; to: string }>(
				`/publicacao/${slug}`
			);

			if ('redirect' in currentData && currentData.redirect) {
				router.replace(currentData.to);
				return;
			}

			const publication = currentData as PublicationType;

			if (!publication) {
				setCurrent(null);
				setRelated([]);
				return;
			}

			setCurrent(publication);

			const { data: relatedRes } = await api.get<ApiResponse>('/publications', {
				params: {
					fn_revista: publication.fn_revista,
					page: 1,
					limit: 7
				}
			});

			const list = Array.isArray(relatedRes?.data) ? relatedRes.data : [];

			setRelated(list.filter(item => item.fn_revista_id !== publication.fn_revista_id));

		} catch (error) {
			console.error("Erro ao carregar publicação:", error);
			setCurrent(null);
			setRelated([]);
		} finally {
			setLoading(false);
		}
	}, [slug, router]);

	function buildIframeSrc(baseUrl: string): string {
		if (!baseUrl) return baseUrl;

		if (pageParam && !isNaN(Number(pageParam))) {
			const normalized = baseUrl.endsWith("/")
				? baseUrl
				: `${baseUrl}/`;
			return `${normalized}${pageParam}/`;
		}

		return baseUrl;
	}

	useEffect(() => {
		if (initialConsumed.current) {
			initialConsumed.current = false;
			return;
		}
		fetchData();
	}, [fetchData]);

	// =================================================================
	// VIEW TRACKING (client-side, igual pre-migracao)
	// Usa o slug que vem da URL (igual o codigo antigo fazia).
	// =================================================================
	const viewTrackedRef = useRef<string | null>(null);

	useEffect(() => {
		if (!slug) return;
		if (viewTrackedRef.current === slug) return;

		viewTrackedRef.current = slug;

		api.get(`/publicacao/${slug}`).catch(() => {
			/* ignora */
		});
	}, [slug]);

	if (loading) return <LoadingSkeleton />;

	if (!current) return <div className="container mt-5">Publicação não encontrada</div>;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "CreativeWork",
						name: `${getRevistaTipo(current.fn_revista)} - Edição ${current.fn_edicao}`,
						description: `Edição ${current.fn_edicao} da ${getRevistaTipo(current.fn_revista)}.`,
						datePublished: current.fd_cadastro,
						url: `https://www.moveisdevalor.com.br/${current.slug ?? `publicacao/${current.fn_revista_id}`}`,
						image: `https://apiv2.moveisdevalor.com.br/images/${current.fn_capa_id}`,
						publisher: {
							"@type": "Organization",
							name: "Móveis de Valor",
							logo: {
								"@type": "ImageObject",
								url: "https://www.moveisdevalor.com.br/logo.png"
							}
						}
					}),
				}}
			/>

			<div className="container mt-5">

				<div className="d-md-flex justify-content-between align-items-center">
					<h1 className="title-magazine">
						{getRevistaTipo(current.fn_revista)} - Edição {current.fn_edicao}
					</h1>
					<div className="d-flex gap-2">
						<a href="/assine" className="btn">Assine</a>
						<a href="/anuncie" className="btn">Anuncie</a>
					</div>
				</div>

				{current.fc_link_on && (
					<div className="row publication mt-4">
						<iframe
							src={buildIframeSrc(current.fc_link_on)}
							id="iframe"
							width="100%"
							height="600"
							style={{ border: "none" }}
							loading="lazy"
							referrerPolicy="no-referrer"
						/>
					</div>
				)}

				<div className="row publication mt-5">
					<h2>Últimas Edições</h2>
					{related.length > 0 ? (
						related.map((publication) => (
							<div className="col-2 mb-3" key={publication.fn_revista_id}>
								<Link href={`/${publication.slug ?? `publicacao/${publication.fn_revista_id}`}`}>
									<PostThumbnail
										image_id={publication.fn_capa_id}
										ratio="3/4"
									/>
									<h5 className="subtitle">
										{getRevistaTipo(publication.fn_revista)} Ed.{publication.fn_edicao}
									</h5>
								</Link>
							</div>
						))
					) : (
						<p>Nenhuma revista relacionada encontrada.</p>
					)}
				</div>

			</div>
		</>
	);
}
