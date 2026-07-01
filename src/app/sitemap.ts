import type { MetadataRoute } from "next";

import { fetchPostsList } from "@/lib/category";

const SITE_URL = "https://www.moveisdevalor.com.br";

const STATIC_PATHS: Array<{
	path: string;
	changeFrequency: "daily" | "weekly" | "monthly";
	priority: number;
}> = [
	{ path: "/", changeFrequency: "daily", priority: 1.0 },
	{ path: "/noticias", changeFrequency: "daily", priority: 0.9 },
	{ path: "/publicacoes", changeFrequency: "weekly", priority: 0.8 },
	{ path: "/mvtv", changeFrequency: "weekly", priority: 0.7 },
	{ path: "/cursos", changeFrequency: "weekly", priority: 0.6 },
	{ path: "/feiras-e-eventos", changeFrequency: "weekly", priority: 0.7 },
	{ path: "/hub", changeFrequency: "weekly", priority: 0.7 },
	{ path: "/hub/sobre", changeFrequency: "monthly", priority: 0.5 },
	{ path: "/sobre", changeFrequency: "monthly", priority: 0.5 },
	{ path: "/contato", changeFrequency: "monthly", priority: 0.4 },
	{ path: "/anuncie", changeFrequency: "monthly", priority: 0.5 },
	{ path: "/assine", changeFrequency: "monthly", priority: 0.5 },
	{ path: "/faq", changeFrequency: "monthly", priority: 0.4 },
	{ path: "/politica-de-privacidade", changeFrequency: "monthly", priority: 0.3 },
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();

	const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(
		({ path, changeFrequency, priority }) => ({
			url: `${SITE_URL}${path}`,
			lastModified: now,
			changeFrequency,
			priority,
		}),
	);

	// Posts mais recentes (1 pagina x 100)
	let postEntries: MetadataRoute.Sitemap = [];
	try {
		const list = await fetchPostsList({ page: 1, limit: 100 });
		postEntries = list.posts
			.filter((p) => p.slug)
			.map((p) => ({
				url: `${SITE_URL}/${p.slug}`,
				lastModified: p.date_modified
					? new Date(p.date_modified)
					: p.date_scheduled
						? new Date(p.date_scheduled)
						: p.date_added
							? new Date(p.date_added)
							: now,
				changeFrequency: "weekly" as const,
				priority: 0.8,
			}));
	} catch (e) {
		console.error("[sitemap] falha ao buscar posts:", e);
	}

	return [...staticEntries, ...postEntries];
}
