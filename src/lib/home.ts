// =====================================================================
// Server-side: payload da home (GET /home).
// O endpoint retorna 7 buckets de categorias (cat1..cat7).
// =====================================================================

import { apiGetOrNull } from "./api-server";

export type HomePost = {
	post_id: number;
	title: string;
	slug: string;
	sub_title: string;
	autor_id: string;
	image: string;
};

export type HomeData = {
	cat1: { posts: HomePost[] };
	cat2: { posts: HomePost[] };
	cat3: { posts: HomePost[] };
	cat4: { posts: HomePost[] };
	cat5: { posts: HomePost[] };
	cat6: { posts: HomePost[] };
	cat7: { posts: HomePost[] };
};

const HOME_REVALIDATE = 60;

export async function fetchHomeData(): Promise<HomeData | null> {
	return apiGetOrNull<HomeData>("/home", {
		revalidate: HOME_REVALIDATE,
		tags: ["home"],
	});
}
