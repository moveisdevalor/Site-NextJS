// =====================================================================
// Server-side helpers para LOJA (ecommerce_product).
// =====================================================================

import { apiGet, apiGetOrNull, ApiError } from "./api-server";

export type Product = {
	id: string;
	name: string;
	description: string;
	value: string;
	category: number;
	image_id: string;
	click: string;
	button: string;
	stock: number;
	orden: number;
	status: string;
	// presente na listagem: capa resolvida a partir de ecommerce_product_image
	cover_image_id?: number | null;
	// presente no detalhe: galeria completa (ecommerce_product_image), ordenada
	images?: number[];
	// presente no detalhe: nome da categoria já resolvido
	category_name?: string | null;
	// URL amigável (loja/nome-do-produto)
	slug?: string | null;
};

export type ProductCategory = {
	id: string;
	name: string;
	description: string;
	image_id: string;
	status: number;
	slug?: string | null;
};

type RawSlugResponse =
	| { redirect: true; to: string }
	| (Product & { redirect?: undefined })
	| null;

export type ProductFetchResult =
	| { kind: "product"; product: Product }
	| { kind: "redirect"; to: string }
	| { kind: "notfound" };

type ApiListResponse = {
	data?: Product[];
	meta?: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

const PRODUCTS_REVALIDATE = 60;

export async function fetchInitialProducts(category?: number): Promise<Product[]> {
	const query = category
		? `?category=${category}&page=1&limit=24`
		: `?page=1&limit=24`;

	const res = await apiGetOrNull<ApiListResponse>(`/products${query}`, {
		revalidate: PRODUCTS_REVALIDATE,
		tags: ["products"],
	});

	return res?.data ?? [];
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
	const res = await apiGetOrNull<ProductCategory[]>("/product-categories", {
		revalidate: PRODUCTS_REVALIDATE,
		tags: ["products"],
	});

	return res ?? [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
	return apiGetOrNull<Product>(`/product/${id}`, {
		revalidate: PRODUCTS_REVALIDATE,
		tags: ["products", `product:${id}`],
	});
}

// Busca por URL amigável (loja/<slug>), com suporte a redirect quando o
// slug mudou (produto renomeado).
export async function fetchProductBySlug(slug: string): Promise<ProductFetchResult> {
	let payload: RawSlugResponse;

	try {
		payload = await apiGet<RawSlugResponse>(`/loja/${slug}`, {
			revalidate: PRODUCTS_REVALIDATE,
			tags: ["products", `product:${slug}`],
		});
	} catch (e) {
		if (e instanceof ApiError && e.status === 404) return { kind: "notfound" };
		throw e;
	}

	if (!payload) return { kind: "notfound" };
	if ("redirect" in payload && payload.redirect === true && payload.to) {
		return { kind: "redirect", to: payload.to };
	}
	if ("id" in payload && payload.id) return { kind: "product", product: payload };

	return { kind: "notfound" };
}

export type ProductCategoryPage = {
	category: ProductCategory;
	data: Product[];
	meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function fetchProductCategoryBySlug(slug: string): Promise<ProductCategoryPage | null> {
	return apiGetOrNull<ProductCategoryPage>(`/loja/categoria/${slug}`, {
		revalidate: PRODUCTS_REVALIDATE,
		tags: ["products", `product-category:${slug}`],
	});
}

export function formatPrice(value: string): string | null {
	if (!value || value === "0") return null;
	const hasComma = value.includes(",");
	return `R$ ${hasComma ? value : Number(value).toFixed(2).replace(".", ",")}`;
}

export function getPriceLabel(value: string, stock: number): string {
	if (stock <= 0) return "Esgotado";
	return formatPrice(value) ?? "Gratuito";
}
