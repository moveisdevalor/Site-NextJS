import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PostCategory from "@/screens/Post/Category";
import {
	fetchCategoryInfo,
	fetchPostsList,
} from "@/lib/category";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";

type RouteParams = { categorySlug: string };
type SearchParams = { page?: string; q?: string };

function parsePage(raw: string | undefined): number {
	const n = Number.parseInt(String(raw ?? "1"), 10);
	return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<RouteParams>;
	searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
	const { categorySlug } = await params;
	const sp = await searchParams;
	const page = parsePage(sp.page);

	const info = await fetchCategoryInfo(categorySlug);
	if (!info) {
		return {
			title: "Categoria não encontrada",
			robots: { index: false, follow: false },
		};
	}

	const pageSuffix = page > 1 ? ` — página ${page}` : "";
	const canonical =
		page > 1
			? `${SITE_URL}/categoria/${categorySlug}?page=${page}`
			: `${SITE_URL}/categoria/${categorySlug}`;

	return {
		title: `${info.name}${pageSuffix}`,
		description:
			info.description ||
			`Notícias da categoria ${info.name} no portal Móveis de Valor.`,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title: info.name,
			description: info.description || undefined,
			url: canonical,
		},
	};
}

export default async function CategoryPage({
	params,
	searchParams,
}: {
	params: Promise<RouteParams>;
	searchParams: Promise<SearchParams>;
}) {
	const { categorySlug } = await params;
	const sp = await searchParams;
	const page = parsePage(sp.page);
	const q = (sp.q ?? "").trim() || undefined;

	const [info, list] = await Promise.all([
		fetchCategoryInfo(categorySlug),
		fetchPostsList({ categorySlug, page, title: q }),
	]);

	if (!info) {
		notFound();
	}

	return (
		<PostCategory
			initialCategoryInfo={info}
			initialPosts={list.posts}
			initialTotalPages={list.totalPages}
			initialPage={page}
			initialQuery={q ?? ""}
		/>
	);
}
