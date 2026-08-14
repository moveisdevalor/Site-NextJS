import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import PostArticle from "@/screens/Hub/article";
import { fetchArticleById, fetchAuthorName, fetchAuthorMeta } from "@/lib/posts";

export const revalidate = 30;

const SITE_URL = "https://www.moveisdevalor.com.br";
const IMAGES_URL = "https://apiv2.moveisdevalor.com.br/images";

type RouteParams = { id: string };
type SearchParams = { preview?: string };

const isPreview = (sp?: SearchParams) => sp?.preview === "true";

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<RouteParams>;
	searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
	const { id } = await params;
	const preview = isPreview(await searchParams);
	const result = await fetchArticleById(id, { preview });

	if (result.kind !== "post") {
		return {
			title: "Artigo não encontrado",
			robots: { index: false, follow: false },
		};
	}

	if (preview) {
		return {
			title: result.post.title,
			robots: { index: false, follow: false },
		};
	}

	const { post } = result;
	const tagList = (post.tags ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

	const url = `${SITE_URL}/${post.slug ?? `artigo/${id}`}`;

	// Artigos (opiniao) raramente tem imagem propria — usa a foto do autor.
	let ogImage = post.image_id ? `${IMAGES_URL}/${post.image_id}` : undefined;
	if (!ogImage && post.autor_id) {
		const author = await fetchAuthorMeta(post.autor_id);
		ogImage = author.image_id ? `${IMAGES_URL}/${author.image_id}` : undefined;
	}

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
	searchParams,
}: {
	params: Promise<RouteParams>;
	searchParams: Promise<SearchParams>;
}) {
	const { id } = await params;
	const preview = isPreview(await searchParams);
	const result = await fetchArticleById(id, { preview });

	if (result.kind === "redirect") redirect(preview ? `${result.to}?preview=true` : result.to);
	if (result.kind === "notfound") notFound();

	const { post } = result;
	const authorName = await fetchAuthorName(post.autor_id);
	const url = `${SITE_URL}/${post.slug ?? `artigo/${id}`}`;

	// Dados estruturados (artigos de opiniao usam Article, nao NewsArticle).
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		description: post.sub_title || undefined,
		image: post.image_id ? [`${IMAGES_URL}/${post.image_id}`] : undefined,
		datePublished: post.date_scheduled || post.date_added,
		dateModified: post.date_modified || post.date_scheduled || post.date_added,
		author: authorName
			? [{ "@type": "Person", name: authorName }]
			: [{ "@type": "Organization", name: "Móveis de Valor" }],
		publisher: {
			"@type": "Organization",
			name: "Móveis de Valor",
			logo: {
				"@type": "ImageObject",
				url: `${SITE_URL}/assets/logo-moveis-de-valor.png`,
			},
		},
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		inLanguage: "pt-BR",
	};

	return (
		<>
			{!preview && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						// escapa "<" pra evitar quebra/injecao de </script>
						__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
					}}
				/>
			)}
			<PostArticle initialPost={post} />
		</>
	);
}
