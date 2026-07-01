import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import PostView from "@/screens/Post/View";
import { fetchAuthorName, fetchPostById } from "@/lib/posts";

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
	const result = await fetchPostById(id);

	if (result.kind !== "post") {
		return {
			title: "Notícia não encontrada",
			robots: { index: false, follow: false },
		};
	}

	const { post } = result;
	const authorName = await fetchAuthorName(post.autor_id);

	const tagList = (post.tags ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

	const url = `${SITE_URL}/${post.slug ?? `noticia/${id}`}`;
	const ogImage = post.image_id ? `${IMAGES_URL}/${post.image_id}` : undefined;

	return {
		title: post.title,
		description: post.sub_title,
		keywords: tagList.length ? tagList : undefined,
		authors: authorName ? [{ name: authorName }] : undefined,
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
			authors: authorName ? [authorName] : undefined,
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

export default async function NoticiaPage({
	params,
}: {
	params: Promise<RouteParams>;
}) {
	const { id } = await params;
	const result = await fetchPostById(id);

	if (result.kind === "redirect") {
		redirect(result.to);
	}

	if (result.kind === "notfound") {
		notFound();
	}

	const authorName = await fetchAuthorName(result.post.autor_id);

	return <PostView initialPost={result.post} initialAuthorName={authorName} />;
}
