"use client";

// =====================================================================
// Dispara page_view no GA4 a cada mudanca de rota (client-side).
// Next e SPA: sem isso, o GA4 so conta a primeira pagina do carregamento.
// O config do GA4 usa send_page_view:false, entao este componente e a
// unica fonte de page_view (inicial + navegacoes), sem duplicar.
// =====================================================================

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA4_ID = "G-6JKGP8PMLX";

declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
	}
}

function Tracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const w = window as Window & { dataLayer?: unknown[] };

		// Se o gtag ainda nao carregou, enfileira no dataLayer no mesmo
		// formato que o gtag.js processa depois (evita corrida no 1o load).
		const gtag =
			w.gtag ||
			function () {
				(w.dataLayer = w.dataLayer || []).push(arguments);
			};

		const qs = searchParams?.toString();
		const path = qs ? `${pathname}?${qs}` : pathname;

		gtag("event", "page_view", {
			page_path: path,
			page_location: w.location.href,
			page_title: document.title,
			send_to: GA4_ID, // so GA4, nao o tag de Ads
		});
	}, [pathname, searchParams]);

	return null;
}

export default function AnalyticsPageview() {
	// useSearchParams exige Suspense no App Router.
	return (
		<Suspense fallback={null}>
			<Tracker />
		</Suspense>
	);
}
