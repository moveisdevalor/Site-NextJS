// =====================================================================
// Server-side helpers para AUTORES (specialists do Hub).
// =====================================================================

import { apiGetOrNull } from "./api-server";

export type Author = {
	autor_id: number;
	name: string;
	specialty?: string;
	description?: string;
	he_writes?: string;
	position?: string;
	email?: string;
	phone?: string;
	image_id?: number;
	slug?: string;
};

export type AuthorPost = {
	post_id: number;
	title: string;
	slug: string;
	sub_title: string;
	autor_id: number;
	image_id: number;
};

type AutorResponse = {
	author?: Author | null;
	posts?: AuthorPost[];
};

const AUTHORS_REVALIDATE = 600;

export async function fetchAuthorWithPosts(name: string): Promise<{
	author: Author | null;
	posts: AuthorPost[];
}> {
	const res = await apiGetOrNull<AutorResponse>(`/autor/${name}`, {
		revalidate: AUTHORS_REVALIDATE,
		tags: [`autor:${name}`],
	});

	return {
		author: res?.author ?? null,
		posts: res?.posts ?? [],
	};
}
