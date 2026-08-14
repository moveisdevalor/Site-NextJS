"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import NotFound from "../404/NotFound";

export default function LegacyRedirect() {
	const pathname = (usePathname() ?? "/").toLowerCase();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [redirected, setRedirected] = useState(false);

	useEffect(() => {
		const normalized = pathname.replace(/\/+/g, "/").replace(/\/$/, "");

		const cleanPath = normalized.replace("/portal", "");

		const redirectMap: Record<string, string> = {
			"/search.php": "/noticias",
			"/feiras-e-eventos.php": "/feiras-e-eventos",
			"/ecommerce.php": "/loja",
			"/mvtv.php": "/mvtv",
			"/revista.php": "/publicacoes",
		};

		// home antiga
		if (cleanPath === "/index.php" || cleanPath === "/home.php") {
			setRedirected(true);
			router.replace("/");
			return;
		}

		// noticia antiga
		if (cleanPath === "/noticia.php") {
			const id = searchParams?.get("id");
			setRedirected(true);
			router.replace(id ? `/noticia/${id}` : "/");
			return;
		}

		// redirects simples
		if (redirectMap[cleanPath]) {
			setRedirected(true);
			router.replace(redirectMap[cleanPath]);
			return;
		}

		// qualquer php legado
		if (cleanPath.endsWith(".php")) {
			setRedirected(true);
			router.replace("/");
		}
	}, [pathname, searchParams, router]);

	if (redirected) {
		return null;
	}

	return <NotFound />;
}
