// =====================================================================
// API helper para SERVER COMPONENTS / generateMetadata / generateStaticParams
// Sem localStorage, sem tracking, sem axios. Usa o fetch nativo
// que o Next decora com cache/revalidate.
//
// Regras:
//  - revalidate em segundos (Number)  -> ISR
//  - revalidate: false                -> cache permanente (ate redeploy)
//  - revalidate: 0                    -> sem cache (sempre fresh)
// =====================================================================

const BASE_URL = (
	process.env.API_URL ??
	process.env.NEXT_PUBLIC_API_URL ??
	""
)
	.trim()
	.replace(/\/$/, "");

if (!BASE_URL) {
	console.warn(
		"[api-server] NEXT_PUBLIC_API_URL/API_URL nao configurado. Fetches vao falhar.",
	);
}

export type ApiGetOptions = {
	revalidate?: number | false;
	tags?: string[];
	headers?: Record<string, string>;
};

export class ApiError extends Error {
	constructor(
		public status: number,
		public path: string,
		message?: string,
	) {
		super(message ?? `API ${status} on ${path}`);
		this.name = "ApiError";
	}
}

export async function apiGet<T>(
	path: string,
	{ revalidate = 60, tags, headers }: ApiGetOptions = {},
): Promise<T> {
	const url = path.startsWith("http")
		? path
		: `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			...(headers ?? {}),
		},
		next:
			revalidate === false
				? { tags }
				: { revalidate, tags },
	});

	if (!res.ok) {
		throw new ApiError(res.status, path);
	}

	return (await res.json()) as T;
}

// Variante que devolve null em 404 (util pra generateMetadata)
export async function apiGetOrNull<T>(
	path: string,
	opts?: ApiGetOptions,
): Promise<T | null> {
	try {
		return await apiGet<T>(path, opts);
	} catch (e) {
		if (e instanceof ApiError && e.status === 404) return null;
		throw e;
	}
}
