"use client";

import { useEffect, useState } from "react";
import { api } from "../../api";
import Link from "next/link";
import "./categories.css";

type Category = {
	category_id: number;
	name: string;
	slug: string;
	status: number;
};

type Props = {
	activeSlug?: string;
};

export default function Categories({ activeSlug }: Props) {

	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	const getCategories = async () => {

		try {

			const response = await api.get("/post/categories");

			setCategories(response.data);

		}
		catch (error) {

			console.error("Erro ao buscar categorias:", error);

		}
		finally {

			setLoading(false);

		}

	};

	useEffect(() => {

		getCategories();

	}, []);

	if (loading) {
		return <p>Carregando categorias...</p>;
	}

	return (

		<div className="categories flex flex-wrap gap-2 my-4">

			<h2>Categorias</h2>

			<ul className="categories-list">

				{categories
					.filter(cat =>
						cat.status === 1 &&
						cat.category_id !== 22 &&
						cat.category_id !== 1 &&
						cat.category_id !== 25
					)
					.map(cat => {

						const slugSemPrefixo =
							cat.slug?.replace("categoria/", "");

						const isActive =
							slugSemPrefixo === activeSlug;

						return (

							<li
								key={cat.category_id}
								className={`categories-item ${
									isActive ? "active" : ""
								}`}
							>

								<Link href={`/${cat.slug}`}>
									{cat.name}
								</Link>

							</li>

						);

					})
				}

			</ul>

		</div>

	);

}
