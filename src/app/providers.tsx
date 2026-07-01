"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { useEffect, type ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
	useEffect(() => {
		// JS do Bootstrap (dropdowns, modais, collapse). Carrega so no client.
		import(
			/* @ts-expect-error sem types pro bundle JS */
			"bootstrap/dist/js/bootstrap.bundle.min.js"
		).catch(() => {
			/* ignora se ja estiver carregado */
		});
	}, []);

	return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
}
