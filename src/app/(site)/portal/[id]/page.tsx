// /portal/[id] e' alias legado de /noticia/[id]. Mesmo conteudo,
// SEO marca canonical para a URL nova.
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
	const canonical = `${SITE_URL}/${post.slug ?? `noticia/${id}`}`;
	const ogImage = post.image_id ? `${IMAGES_URL}/${post.image_id}` : undefined;

	return {
		title: post.title,
		description: post.sub_title,
		alternates: { canonical },
		openGraph: {
			type: "article",
			title: post.title,
			description: post.sub_title,
			url: canonical,
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
	};
}

export default async function PortalLegacyPostPage({
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
