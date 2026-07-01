"use client";

import { useEffect, useState } from "react";
import { api } from "../../api";
import Link from "next/link";
import Image from "../Image/image";
import "./categories.css";

type Author = {
	autor_id: number;
	name: string;
	slug: string;
	status: number;
	hub?: number;
	image_id?: number | null;
};

type Props = {
	activeSlug?: string;
};

export default function Authors({ activeSlug }: Props) {

	const [authors, setAuthors] = useState<Author[]>([]);
	const [loading, setLoading] = useState(true);

	const getAuthors = async () => {

		try {

			const response = await api.get("/specialist");

			setAuthors(response.data);

		}
		catch (error) {

			console.error("Erro ao buscar autores:", error);

		}
		finally {

			setLoading(false);

		}

	};

	useEffect(() => {

		getAuthors();

	}, []);

	if (loading) {
		return <p>Carregando autores...</p>;
	}

	return (

		<div className="categories flex flex-wrap gap-2 my-4">

			<h2>Autores</h2>

			<ul className="categories-list">

				{authors
					.filter(a => a.status === 1)
					.map(a => {

						const isActive = a.slug === activeSlug;

						return (

							<li
								key={a.autor_id}
								className={`categories-item ${
									isActive ? "active" : ""
								}`}
							>

								<Link href={`/hub/${a.slug}`} className="author-link">
									<span className="author-avatar">
										<Image
											image_id={a.image_id ?? undefined}
											ratio="1/1"
											fit="cover"
										/>
									</span>
									<span className="author-name">{a.name}</span>
								</Link>

							</li>

						);

					})
				}

			</ul>

		</div>

	);

}
