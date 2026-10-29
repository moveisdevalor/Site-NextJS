import type { MetadataRoute } from "next";

import { fetchInitialProducts, fetchProductCategories } from "@/lib/products";

const SITE_URL = "https://www.moveisdevalor.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticRoutes: MetadataRoute.Sitemap = [
		"", "loja", "sobre", "contato", "cursos", "assine", "noticias", "feiras-e-eventos",
	].map((path) => ({
		url: `${SITE_URL}/${path}`,
		lastModified: new Date(),
	}));

	const [products, categories] = await Promise.all([
		fetchInitialProducts(),
		fetchProductCategories(),
	]);

	const productRoutes: MetadataRoute.Sitemap = products
		.filter((p) => p.slug)
		.map((p) => ({
			url: `${SITE_URL}/${p.slug}`,
			lastModified: new Date(),
		}));

	const categoryRoutes: MetadataRoute.Sitemap = categories
		.filter((c) => c.slug)
		.map((c) => ({
			url: `${SITE_URL}/${c.slug}`,
			lastModified: new Date(),
		}));

	return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
