import type { Metadata } from "next";

import Store from "@/screens/Store";
import { fetchInitialProducts, fetchProductCategories } from "@/lib/products";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Loja",
	description: "Produtos, cursos e publicações da Móveis de Valor.",
	alternates: { canonical: `${SITE_URL}/loja` },
	openGraph: {
		type: "website",
		title: "Loja — Móveis de Valor",
		description: "Produtos, cursos e publicações da Móveis de Valor.",
		url: `${SITE_URL}/loja`,
	},
};

type Props = {
	searchParams: Promise<{ category?: string }>;
};

export default async function LojaPage({ searchParams }: Props) {
	const { category } = await searchParams;
	const categoryId = category ? Number(category) : undefined;

	const [products, categories] = await Promise.all([
		fetchInitialProducts(categoryId),
		fetchProductCategories(),
	]);

	return (
		<Store
			initialProducts={products}
			initialCategories={categories}
			initialCategory={categoryId ?? null}
		/>
	);
}
