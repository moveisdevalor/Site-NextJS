import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import PostThumbnail from "@/components/Image/image";
import { fetchProductCategoryBySlug, getPriceLabel } from "@/lib/products";
import { apiGetOrNull } from "@/lib/api-server";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";
const API_ORIGIN = "https://apiv2.moveisdevalor.com.br";

async function resolveOgImage(imageId: number | null): Promise<string | undefined> {
	if (!imageId) return undefined;
	const img = await apiGetOrNull<{ url?: string }>(`/image/${imageId}`, { revalidate: 300 });
	return img?.url ? `${API_ORIGIN}${img.url}?fmt=jpg` : undefined;
}

type RouteParams = { slug: string };

type Props = {
	params: Promise<RouteParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const result = await fetchProductCategoryBySlug(slug);

	if (!result) {
		return {
			title: "Categoria não encontrada",
			robots: { index: false, follow: false },
		};
	}

	const url = `${SITE_URL}/${result.category.slug ?? `loja/categoria/${slug}`}`;
	const description = result.category.description?.slice(0, 160) || result.category.name;
	const ogImage = await resolveOgImage(Number(result.category.image_id) || null);

	return {
		title: `${result.category.name} — Loja`,
		description,
		alternates: { canonical: url },
		openGraph: {
			type: "website",
			title: `${result.category.name} — Móveis de Valor`,
			description,
			url,
			siteName: "Móveis de Valor",
			locale: "pt_BR",
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: `${result.category.name} — Móveis de Valor`,
			description,
			images: ogImage ? [ogImage] : undefined,
		},
	};
}

export default async function ProductCategoryPage({ params }: Props) {
	const { slug } = await params;
	const result = await fetchProductCategoryBySlug(slug);

	if (!result) notFound();

	const { category, data: products } = result;

	return (
		<div className="container store-page mt-5">
			<h1 className="store-title">{category.name}</h1>

			<div className="row">
				{products.map((product) => (
					<div key={product.id} className="col-12 col-md-4 col-lg-3 mb-4">
						<Link href={`/${product.slug ?? `loja/${product.id}`}`} className="product-card">
							<div className="product-card-cover">
								<PostThumbnail
									image_id={product.cover_image_id || Number(product.image_id) || null}
									ratio="1/1"
								/>
								{product.stock <= 0 && (
									<span className="product-card-sold-out">Esgotado</span>
								)}
							</div>
							<h3 className="product-card-title">{product.name}</h3>
							<p className={`product-card-price${product.stock <= 0 ? " product-card-price-soldout" : ""}`}>
								{getPriceLabel(product.value, product.stock)}
							</p>
						</Link>
					</div>
				))}
			</div>

			{!products.length && <p className="store-empty">Nenhum produto encontrado.</p>}
		</div>
	);
}
