import type { Metadata } from "next";

import PostCategory from "@/screens/Post/Category";
import { fetchPostsList } from "@/lib/category";

export const revalidate = 30;

const SITE_URL = "https://www.moveisdevalor.com.br";

type SearchParams = { page?: string; q?: string };

function parsePage(raw: string | undefined): number {
	const n = Number.parseInt(String(raw ?? "1"), 10);
	return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
	const sp = await searchParams;
	const page = parsePage(sp.page);
	const q = (sp.q ?? "").trim();

	const title = q
		? `Busca: ${q}`
		: page > 1
			? `Notícias — página ${page}`
			: "Notícias";

	const description = q
		? `Resultados de busca por "${q}" no portal Móveis de Valor.`
		: "Acompanhe as principais notícias do setor moveleiro brasileiro.";

	const canonical = q
		? `${SITE_URL}/noticias?q=${encodeURIComponent(q)}`
		: page > 1
			? `${SITE_URL}/noticias?page=${page}`
			: `${SITE_URL}/noticias`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description,
			url: canonical,
		},
	};
}

export default async function NoticiasPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const sp = await searchParams;
	const page = parsePage(sp.page);
	const q = (sp.q ?? "").trim() || undefined;

	const list = await fetchPostsList({ page, title: q });

	return (
		<PostCategory
			initialPosts={list.posts}
			initialTotalPages={list.totalPages}
			initialPage={page}
			initialQuery={q ?? ""}
		/>
	);
}
