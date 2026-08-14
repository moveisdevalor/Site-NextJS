import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import PostView from "@/screens/Post/View";
import { fetchAuthorName, fetchPostById } from "@/lib/posts";
import { apiGetOrNull } from "@/lib/api-server";

export const revalidate = 30;

const SITE_URL = "https://www.moveisdevalor.com.br";
const API_ORIGIN = "https://apiv2.moveisdevalor.com.br";

export type ImageInfo = { url: string; legend: string };

// Resolve a URL absoluta da imagem (a API do post so devolve o id).
// Usada no og:image e tambem passada ao PostView pra imagem destaque
// sair renderizada no HTML do servidor (LCP / indexacao de imagens).
async function fetchImageInfo(imageId: number | null): Promise<ImageInfo | null> {
	if (!imageId) return null;
	const img = await apiGetOrNull<{ url?: string; legend?: string }>(
		`/image/${imageId}`,
		{ revalidate: 300 },
	);
	return img?.url
		? { url: `${API_ORIGIN}${img.url}`, legend: img.legend ?? "" }
		: null;
}

async function resolveImageUrl(imageId: number | null): Promise<string | undefined> {
	const info = await fetchImageInfo(imageId);
	// ?fmt=jpg garante JPG no preview social mesmo se a imagem for .webp
	return info ? `${info.url}?fmt=jpg` : undefined;
}

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
	const result = await fetchPostById(id, { preview });

	if (result.kind !== "post") {
		return {
			title: "Notícia não encontrada",
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
	const authorName = await fetchAuthorName(post.autor_id);

	const tagList = (post.tags ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);

	const url = `${SITE_URL}/${post.slug ?? `noticia/${id}`}`;
	const ogImage = await resolveImageUrl(post.image_id);

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
	searchParams,
}: {
	params: Promise<RouteParams>;
	searchParams: Promise<SearchParams>;
}) {
	const { id } = await params;
	const preview = isPreview(await searchParams);
	const result = await fetchPostById(id, { preview });

	if (result.kind === "redirect") {
		redirect(preview ? `${result.to}?preview=true` : result.to);
	}

	if (result.kind === "notfound") {
		notFound();
	}

	const [authorName, imageInfo] = await Promise.all([
		fetchAuthorName(result.post.autor_id),
		fetchImageInfo(result.post.image_id),
	]);

	const { post } = result;
	const url = `${SITE_URL}/${post.slug ?? `noticia/${id}`}`;

	// Dados estruturados pra Google News / Top Stories / Discover.
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "NewsArticle",
		headline: post.title,
		description: post.sub_title || undefined,
		image: imageInfo ? [imageInfo.url] : undefined,
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
			<PostView
				initialPost={post}
				initialAuthorName={authorName}
				initialImage={imageInfo}
			/>
		</>
	);
}
