import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import ProductView from "@/screens/Store/view";
import { fetchProductBySlug, formatPrice, type Product } from "@/lib/products";
import { apiGetOrNull } from "@/lib/api-server";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";
const API_ORIGIN = "https://apiv2.moveisdevalor.com.br";

type RouteParams = { slug: string };

type Props = {
	params: Promise<RouteParams>;
};

// mesma resolução de imagem usada na notícia: /image/:id -> url absoluta,
// forçando JPG (?fmt=jpg) pra compatibilidade com preview social
async function resolveOgImage(product: Product): Promise<string | undefined> {
	const imageId = product.cover_image_id || Number(product.image_id) || (product.images?.[0] ?? null);
	if (!imageId) return undefined;

	const img = await apiGetOrNull<{ url?: string }>(`/image/${imageId}`, { revalidate: 300 });
	return img?.url ? `${API_ORIGIN}${img.url}?fmt=jpg` : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const result = await fetchProductBySlug(slug);

	if (result.kind !== "product") {
		return {
			title: "Produto não encontrado",
			robots: { index: false, follow: false },
		};
	}

	const { product } = result;
	const url = `${SITE_URL}/loja/${product.slug ?? slug}`;
	const description = product.description?.slice(0, 160) || product.name;
	const ogImage = await resolveOgImage(product);

	return {
		title: product.name,
		description,
		alternates: { canonical: url },
		openGraph: {
			type: "website",
			title: product.name,
			description,
			url,
			siteName: "Móveis de Valor",
			locale: "pt_BR",
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: product.name,
			description,
			images: ogImage ? [ogImage] : undefined,
		},
	};
}

export default async function ProdutoPage({ params }: Props) {
	const { slug } = await params;
	const result = await fetchProductBySlug(slug);

	if (result.kind === "redirect") {
		redirect(result.to);
	}

	if (result.kind === "notfound") {
		notFound();
	}

	const { product } = result;
	const url = `${SITE_URL}/loja/${product.slug ?? slug}`;
	const ogImage = await resolveOgImage(product);
	const price = formatPrice(product.value);

	// Dados estruturados pra Google Shopping / rich results
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description?.replace(/<[^>]+>/g, "").slice(0, 500) || product.name,
		image: ogImage ? [ogImage] : undefined,
		category: product.category_name || undefined,
		offers: price
			? {
				"@type": "Offer",
				url,
				priceCurrency: "BRL",
				price: price.replace("R$ ", "").replace(",", "."),
				availability: product.stock > 0
					? "https://schema.org/InStock"
					: "https://schema.org/OutOfStock",
			}
			: undefined,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
				}}
			/>
			<ProductView initialProduct={product} />
		</>
	);
}
