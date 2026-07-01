"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../api";
import Image from "../Image/image";
import "./hubLatest.css";

type HubPost = {
	post_id: number;
	title: string;
	slug: string | null;
	image_id: number | null;
	author_name: string | null;
	author_image_id: number | null;
};

type Props = {
	limit?: number;
	activeSlug?: string;
};

export default function HubLatest({ limit = 6, activeSlug }: Props) {

	const [posts, setPosts] = useState<HubPost[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const res = await api.get(`/hub/latest?limit=${limit}`);
				setPosts(res.data);
			} catch (err) {
				console.error("Erro ao buscar últimos artigos do hub:", err);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [limit]);

	if (loading) return <p>Carregando artigos...</p>;
	if (!posts.length) return null;

	return (
		<div className="hub-latest my-4">
			<h2>Veja mais</h2>

			<ul className="hub-latest-list">
				{posts.map(p => {
					const isActive = p.slug === activeSlug;
					return (
						<li
							key={p.post_id}
							className={`hub-latest-item ${isActive ? "active" : ""}`}
						>
							<Link href={p.slug ? `/${p.slug}` : "#"} className="hub-latest-link">
								<span className="hub-latest-thumb">
									<Image
										image_id={p.author_image_id ?? undefined}
										ratio="1/1"
										fit="cover"
									/>
								</span>
								<span className="hub-latest-info">
									<span className="hub-latest-title">{p.title}</span>
									{p.author_name && (
										<span className="hub-latest-author">{p.author_name}</span>
									)}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
