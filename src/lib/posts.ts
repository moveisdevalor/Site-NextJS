// =====================================================================
// Server-side helpers para POSTS
// Centraliza o formato volátil da API (success/data, raw post, redirect)
// numa unica resposta tipada `PostFetchResult`.
// =====================================================================

import { apiGet, apiGetOrNull, ApiError } from "./api-server";

export type CategoryType = {
	category_id: number;
	name: string;
	slug: string;
};

export type PostType = {
	post_id: number;
	title: string;
	sub_title: string;
	content: string;
	status: string;
	event: string | null;
	player: number | null;
	midia: string | null;
	date_added: string;
	date_modified: string;
	date_scheduled: string;
	image_id: number | null;
	views: string;
	tags: string;
	slug: string;
	autor_id?: string;
	account_id?: string;
	categories?: CategoryType[];
};

type RawApiResponse =
	| { redirect: true; to: string }
	| { success: true; data: PostType }
	| (PostType & { redirect?: undefined; success?: undefined })
	| { success: false; message?: string }
	| null;

export type PostFetchResult =
	| { kind: "post"; post: PostType }
	| { kind: "redirect"; to: string }
	| { kind: "notfound"; message?: string };

const POST_REVALIDATE_SECONDS = 60;

function normalizeContent(html: string | null | undefined): string {
	if (!html) return "";
	return html.replace(
		/http:\/\/localhost:5173\/images\//g,
		"https://apiv2.moveisdevalor.com.br/images/",
	);
}

export async function fetchPostById(
	id: string,
	opts: { preview?: string | null } = {},
): Promise<PostFetchResult> {
	const qs = opts.preview ? `?preview=${encodeURIComponent(opts.preview)}` : "";

	let payload: RawApiResponse;

	try {
		payload = await apiGet<RawApiResponse>(`/noticia/${id}${qs}`, {
			revalidate: POST_REVALIDATE_SECONDS,
			tags: [`post:${id}`],
		});
	} catch (e) {
		if (e instanceof ApiError && e.status === 404) {
			return { kind: "notfound" };
		}
		throw e;
	}

	if (!payload) return { kind: "notfound" };

	if ("redirect" in payload && payload.redirect === true && payload.to) {
		return { kind: "redirect", to: payload.to };
	}

	if ("success" in payload && payload.success === true && payload.data) {
		const post = { ...payload.data, content: normalizeContent(payload.data.content) };
		return { kind: "post", post };
	}

	if ("post_id" in payload && payload.post_id) {
		const post = { ...payload, content: normalizeContent(payload.content) } as PostType;
		return { kind: "post", post };
	}

	if ("success" in payload && payload.success === false) {
		return { kind: "notfound", message: payload.message };
	}

	return { kind: "notfound" };
}

export async function fetchArticleById(
	id: string,
	opts: { preview?: string | null } = {},
): Promise<PostFetchResult> {
	const qs = opts.preview ? `?preview=${encodeURIComponent(opts.preview)}` : "";

	let payload: RawApiResponse;
	try {
		payload = await apiGet<RawApiResponse>(`/artigo/${id}${qs}`, {
			revalidate: POST_REVALIDATE_SECONDS,
			tags: [`article:${id}`],
		});
	} catch (e) {
		if (e instanceof ApiError && e.status === 404) {
			return { kind: "notfound" };
		}
		throw e;
	}

	if (!payload) return { kind: "notfound" };
	if ("redirect" in payload && payload.redirect === true && payload.to) {
		return { kind: "redirect", to: payload.to };
	}
	if ("success" in payload && payload.success === true && payload.data) {
		const post = { ...payload.data, content: normalizeContent(payload.data.content) };
		return { kind: "post", post };
	}
	if ("post_id" in payload && payload.post_id) {
		const post = { ...payload, content: normalizeContent(payload.content) } as PostType;
		return { kind: "post", post };
	}
	if ("success" in payload && payload.success === false) {
		return { kind: "notfound", message: payload.message };
	}
	return { kind: "notfound" };
}

export async function fetchAuthorName(authorId: string | null | undefined): Promise<string> {
	if (!authorId) return "";
	const author = await apiGetOrNull<{ name?: string }>(`/author/${authorId}`, {
		revalidate: 3600,
		tags: [`author:${authorId}`],
	});
	return author?.name ?? "";
}
