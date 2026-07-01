import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import PostArticle from "@/screens/Hub/article";
import { fetchArticleById } from "@/lib/posts";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";
const IMAGES_URL = "https://apiv2.moveisdevalor.com.br/images";

type RouteParams = { id: string };

export async function generateMetadata({
	params,
}: {
	params: Promise<RouteParams>;
}): Promise<Metadata> {
	const { id } = await params;
	const result = await fetchArticleById(id);

	if (result.kind !== "post") {
		return {
			title: "Artigo não encontrado",
			robots: { index: false, follow: false },
		};
	}

	const { post } = result;
	const tagList = (post.tags ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

	const url = `${SITE_URL}/${post.slug ?? `artigo/${id}`}`;
	const ogImage = post.image_id ? `${IMAGES_URL}/${post.image_id}` : undefined;

	return {
		title: post.title,
		description: post.sub_title || "Leia esta notícia no Móveis de Valor",
		keywords: tagList.length ? tagList : undefined,
		alternates: { canonical: url },
		openGraph: {
			type: "article",
			title: post.title,
			description: post.sub_title,
			url,
			siteName: "Móveis de Valor",
			locale: "pt_BR",
			images: ogImage ? [{ url: ogImage }] : undefined,
			publishedTime: post.date_scheduled || post.date_added,
			modifiedTime: post.date_modified,
			tags: tagList,
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.sub_title,
			images: ogImage ? [ogImage] : undefined,
		},
	};
}

export default async function ArtigoPage({
	params,
}: {
	params: Promise<RouteParams>;
}) {
	const { id } = await params;
	const result = await fetchArticleById(id);

	if (result.kind === "redirect") redirect(result.to);
	if (result.kind === "notfound") notFound();

	return <PostArticle initialPost={result.post} />;
}
