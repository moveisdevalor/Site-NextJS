// =====================================================================
// Server-side helpers para PUBLICACOES (revistas).
// =====================================================================

import { apiGetOrNull } from "./api-server";

export type Publication = {
	fn_revista_id: number;
	fc_status: string;
	fn_revista?: number | string | null;
	fn_capa_id: number;
	fn_edicao: number;
	fd_cadastro: string;
	slug?: string | null;
};

export const REVISTA_IDS = [1, 3, 6] as const;

export const REVISTAS: Record<number, string> = {
	1: "Móveis de Valor",
	3: "Norte & Nordeste",
	6: "Anuário de colchões Brasil",
};

type ApiResponse = {
	data?: Publication[];
	meta?: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

const PUBLICATIONS_REVALIDATE = 60;

export async function fetchInitialPublications(): Promise<Publication[]> {
	const results = await Promise.all(
		REVISTA_IDS.map((id) =>
			apiGetOrNull<ApiResponse>(
				`/publications?fn_revista=${id}&page=1&limit=6`,
				{ revalidate: PUBLICATIONS_REVALIDATE, tags: ["publications"] },
			),
		),
	);

	return results.flatMap((r) => r?.data ?? []);
}

export async function fetchPublicationsByRevista(
	revistaId: number,
): Promise<Publication[]> {
	const res = await apiGetOrNull<ApiResponse>(
		`/publications?fn_revista=${revistaId}&page=1&limit=100`,
		{
			revalidate: PUBLICATIONS_REVALIDATE,
			tags: ["publications", `revista:${revistaId}`],
		},
	);
	return res?.data ?? [];
}

export function getPublicationUrl(p: Publication): string {
	return p.slug ? `/${p.slug}` : `/publicacao/${p.fn_revista_id}`;
}

// =====================================================================
// SINGLE PUBLICATION VIEW
// =====================================================================

export type PublicationDetail = Publication & {
	fc_link_on?: string;
};

type PublicationDetailResponse =
	| PublicationDetail
	| { redirect: true; to: string };

export type PublicationFetchResult =
	| {
			kind: "publication";
			publication: PublicationDetail;
			related: Publication[];
	  }
	| { kind: "redirect"; to: string }
	| { kind: "notfound" };

export async function fetchPublicationBySlug(
	slug: string,
): Promise<PublicationFetchResult> {
	const payload = await apiGetOrNull<PublicationDetailResponse>(
		`/publicacao/${slug}`,
		{
			revalidate: PUBLICATIONS_REVALIDATE,
			tags: ["publications", `publication:${slug}`],
		},
	);

	if (!payload) return { kind: "notfound" };

	if ("redirect" in payload && payload.redirect && payload.to) {
		return { kind: "redirect", to: payload.to };
	}

	const publication = payload as PublicationDetail;

	if (!publication.fn_revista_id) return { kind: "notfound" };

	const relatedRes = await apiGetOrNull<ApiResponse>(
		`/publications?fn_revista=${publication.fn_revista}&page=1&limit=7`,
		{ revalidate: PUBLICATIONS_REVALIDATE, tags: ["publications"] },
	);
	const relatedAll = relatedRes?.data ?? [];
	const related = relatedAll
		.filter((item) => item.fn_revista_id !== publication.fn_revista_id)
		.slice(0, 6);

	return { kind: "publication", publication, related };
}

export function getRevistaTipo(fn_revista: string | number | null | undefined): string {
	switch (String(fn_revista)) {
		case "1": return "Móveis de Valor";
		case "2": return "MVDecor";
		case "3": return "Norte & Nordeste";
		case "4": return "Planejados&Cia";
		case "5": return "100% PDV";
		case "6": return "Anuário";
		default: return "Revista não identificada";
	}
}
