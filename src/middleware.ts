// =====================================================================
// Normaliza URLs com maiusculas (legado) para lowercase, com 301.
// Roda antes das rotas; nao casa com _next, api, ou arquivos estaticos.
// =====================================================================

import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const lower = pathname.toLowerCase();

	if (pathname !== lower) {
		const url = req.nextUrl.clone();
		url.pathname = lower;
		// 308 = permanent redirect que preserva o metodo HTTP
		return NextResponse.redirect(url, 308);
	}

	return NextResponse.next();
}

// Aplica a todas as rotas, exceto: _next/*, api/*, e arquivos com extensao
export const config = {
	matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
