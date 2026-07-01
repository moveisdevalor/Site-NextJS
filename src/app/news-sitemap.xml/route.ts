// Google News sitemap — schema proprio (xmlns:news).
// Inclui apenas posts publicados nas ultimas 48h.
// Documentacao: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap

import { fetchPostsList } from "@/lib/category";

const SITE_URL = "https://www.moveisdevalor.com.br";
const PUBLICATION_NAME = "Móveis de Valor";
const PUBLICATION_LANG = "pt";

export const revalidate = 600; // 10 min

function escapeXml(unsafe: string): string {
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case '"': return "&quot;";
			default: return c;
		}
	});
}

export async function GET() {
	const list = await fetchPostsList({ page: 1, limit: 100 });

	const cutoff = Date.now() - 48 * 60 * 60 * 1000;

	const items = list.posts
		.filter((p) => p.slug)
		.map((p) => {
			const published = p.date_scheduled
				? new Date(p.date_scheduled)
				: p.date_added
					? new Date(p.date_added)
					: null;
			return { post: p, published };
		})
		.filter((x) => x.published && x.published.getTime() >= cutoff);

	const xmlItems = items
		.map(({ post, published }) => `
	<url>
		<loc>${SITE_URL}/${escapeXml(post.slug)}</loc>
		<news:news>
			<news:publication>
				<news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
				<news:language>${PUBLICATION_LANG}</news:language>
			</news:publication>
			<news:publication_date>${published!.toISOString()}</news:publication_date>
			<news:title>${escapeXml(post.title)}</news:title>
		</news:news>
	</url>`)
		.join("");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
	xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${xmlItems}
</urlset>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
		},
	});
}
