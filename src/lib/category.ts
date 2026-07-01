// =====================================================================
// Server-side helpers para CATEGORIES + listagem de posts
// =====================================================================

import { apiGet, apiGetOrNull } from "./api-server";

export type CategoryInfo = {
	name: string;
	description: string;
};

export type CategoryListItem = {
	category_id: number;
	name: string;
	slug: string;
};

export type PostListItem = {
	post_id: number;
	title: string;
	sub_title: string;
	image: string | null;
	slug: string;
	autor_id: number;
	categories: CategoryListItem[];
	date_added?: string;
	date_modified?: string;
	date_scheduled?: string;
};

export type PostsListResult = {
	posts: PostListItem[];
	totalPages: number;
};

const CATEGORY_REVALIDATE = 300;
const POSTS_REVALIDATE = 60;

export async function fetchCategoryInfo(
	categorySlug: string | undefined,
): Promise<CategoryInfo | null> {
	if (!categorySlug) return null;

	const res = await apiGetOrNull<{
		category?: { name?: string; description?: string };
	}>(`/categoria/${categorySlug}`, {
		revalidate: CATEGORY_REVALIDATE,
		tags: [`category:${categorySlug}`],
	});

	if (!res?.category) return null;

	return {
		name: res.category.name ?? categorySlug,
		description: res.category.description ?? "",
	};
}

export async function fetchPostsList(opts: {
	categorySlug?: string;
	page?: number;
	limit?: number;
	title?: string;
}): Promise<PostsListResult> {
	const page = opts.page ?? 1;
	const limit = opts.limit ?? 10;

	const qs = new URLSearchParams();
	qs.set("page", String(page));
	qs.set("limit", String(limit));
	if (opts.title?.trim()) qs.set("title", opts.title.trim());
	if (opts.categorySlug)
		qs.set("category_slug", `categoria/${opts.categorySlug}`);

	const tags = ["posts"];
	if (opts.categorySlug) tags.push(`category:${opts.categorySlug}`);

	const res = await apiGetOrNull<PostsListResult>(`/posts?${qs.toString()}`, {
		revalidate: POSTS_REVALIDATE,
		tags,
	});

	return {
		posts: res?.posts ?? [],
		totalPages: res?.totalPages ?? 1,
	};
}
