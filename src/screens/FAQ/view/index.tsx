"use client";

import { api } from '../../../api';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from "next/navigation";
import Link from "next/link";
import './index.css';

import PostThumbnail from "../../../components/Image/image.tsx";
import LoadingSkeleton from "../../../components/Loading/LoadingSkeleton";

type PublicationType = {
	fn_revista_id: number;
	fc_status: string;
	fn_revista: string;
	fn_capa_id: number;
	fc_link_on: string;
	fn_edicao: number;
	fd_cadastro: string;
};

type ApiResponse = {
	data: PublicationType[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

export default function PublicationPage() {
	const { id } = useParams<{ id: string }>();

	const [current, setCurrent] = useState<PublicationType | null>(null);
	const [related, setRelated] = useState<PublicationType[]>([]);
	const [loading, setLoading] = useState(true);

	// 🔹 helper puro (não precisa de useCallback)
	function getRevistaTipo(fn_revista: string): string {
		switch (fn_revista) {
			case "1": return "Móveis de Valor";
			case "2": return "MVDecor";
			case "3": return "Norte & Nordeste";
			case "4": return "Planejados&Cia";
			case "5": return "100% PDV";
			case "6": return "Anuário";
			default: return "Revista não identificada";
		}
	}

	// 🔹 fetch principal
	const fetchData = useCallback(async () => {
		if (!id) return;

		setLoading(true);

		try {
			// 1. revista atual
			const { data: currentData } = await api.get<PublicationType>(`/publication/${id}`);

			if (!currentData) {
				setCurrent(null);
				setRelated([]);
				return;
			}

			setCurrent(currentData);

			// 2. relacionadas
			const { data: relatedRes } = await api.get<ApiResponse>('/publications', {
				params: {
					fn_revista: currentData.fn_revista,
					page: 1,
					limit: 7
				}
			});

			const list = Array.isArray(relatedRes?.data) ? relatedRes.data : [];

			// remove atual
			const filtered = list.filter(
				item => item.fn_revista_id !== currentData.fn_revista_id
			);

			setRelated(filtered);

		} catch (error) {
			console.error("Erro ao carregar publicação:", error);
			setCurrent(null);
			setRelated([]);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// 🔹 loading / fallback
	if (loading) {
		return <LoadingSkeleton />;
	}

	if (!current) {
		return <div className="container mt-5">Publicação não encontrada</div>;
	}

	return (
		<div className="container mt-5">

			{/* HEADER */}
			<div className="d-flex justify-content-between align-items-center">
				<h1>
					{getRevistaTipo(current.fn_revista)} - Edição {current.fn_edicao}
				</h1>

				<div className="d-flex gap-2">
					<a href="#" className="btn">Assine</a>
					<a href="/anuncie" className="btn">Anuncie</a>
				</div>
			</div>

			{/* IFRAME */}
			{current.fc_link_on && (
				<div className="row publication mt-4">
					<iframe
						src={current.fc_link_on}
						id="iframe"
						width="100%"
						height="600"
						style={{ border: "none" }}
						loading="lazy"
						referrerPolicy="no-referrer"
					/>
				</div>
			)}

			{/* RELACIONADAS */}
			<div className="row publication mt-5">
				<h2> Ultimas Edições</h2>
				{related.length > 0 ? (
					related.map((publication) => (
						<div className="col-2 mb-3" key={publication.fn_revista_id}>
							<Link href={`/publicacao/${publication.fn_revista_id}`}>
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
	);
}
