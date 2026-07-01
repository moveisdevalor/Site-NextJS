"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "../components/Header/index4";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";
import VersionChecker from "../components/VersionChecker";

import {
	getAnalyticsContext,
	shouldBlockPreviewTracking,
	touchSession,
	useAnalytics,
} from "../hooks/trackEvent";

import useAccessLevelStore from "../stores/accessLevelStore";
import { api } from "../api";

import { MenuTypeProvider, useMenuType } from "./menu-context";

import "./index.css";
import "./form.css";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<MenuTypeProvider>
			<LayoutInner>{children}</LayoutInner>
		</MenuTypeProvider>
	);
}

function LayoutInner({ children }: { children: ReactNode }) {
	const {
		handleAccessLevel,
		handleUserId,
		handleUserName,
	} = useAccessLevelStore();

	const { track } = useAnalytics();

	const pathname = usePathname() ?? "/";

	// Lemos `search` so no client (sem useSearchParams pra nao forcar
	// bailout do SSR via Suspense). O efeito de tracking depende disso.
	const [search, setSearch] = useState<string>("");
	useEffect(() => {
		setSearch(typeof window !== "undefined" ? window.location.search : "");
	}, [pathname]);

	const { menuType } = useMenuType();

	// =================================================================
	// USUÁRIO LOCAL — só roda 1x
	// =================================================================
	const initializeUser = useCallback(() => {
		try {
			const accessLevelRaw = localStorage.getItem("accessLevel");
			const userId         = localStorage.getItem("userId");
			const userName       = localStorage.getItem("userName");

			const accessLevel = accessLevelRaw ? Number(accessLevelRaw) : 0;

			handleAccessLevel(Number.isNaN(accessLevel) ? 0 : accessLevel);
			handleUserName(userName ?? "");
			handleUserId(userId ?? "");
		} catch {
			handleAccessLevel(0);
			handleUserName("");
			handleUserId("");
		}
	}, [handleAccessLevel, handleUserId, handleUserName]);

	const userInitRef = useRef(false);

	useEffect(() => {
		if (userInitRef.current) return;
		userInitRef.current = true;
		initializeUser();
	}, [initializeUser]);

	useEffect(() => {
		if ("scrollRestoration" in window.history) {
			window.history.scrollRestoration = "manual";
		}
	}, []);

	// =================================================================
	// TRACK EMAIL CLICK
	// =================================================================
	const lastTrackedClickRef = useRef<string | null>(null);

	useEffect(() => {
		try {
			const params = new URLSearchParams(search);
			const email = (params.get("email") || "").trim();

			if (!email || !email.includes("@")) return;

			const slug = pathname.replace(/^\/+/, "");

			localStorage.setItem("mv_reader_email", email);

			const key = `${email}|${slug}|${search}`;
			if (lastTrackedClickRef.current === key) return;
			lastTrackedClickRef.current = key;

			api.post("/email/track", { email, slug }).catch(() => {
				/* ignora */
			});
		} catch {
			/* ignora */
		}
	}, [pathname, search]);

	useEffect(() => {
		document.documentElement.scrollTop = 0;
		document.body.scrollTop = 0;
	}, [pathname]);

	// =================================================================
	// TRACKING — page_view por rota
	// =================================================================
	const lastTrackedRef = useRef<string | null>(null);

	useEffect(() => {
		touchSession();

		if (shouldBlockPreviewTracking(search)) return;

		const key = `${pathname}${search}`;
		if (lastTrackedRef.current === key) return;

		const internalReferrer = lastTrackedRef.current
			? `${window.location.origin}${lastTrackedRef.current}`
			: (typeof document !== "undefined" ? document.referrer : "");

		lastTrackedRef.current = key;

		const ctx = getAnalyticsContext({
			search,
			referrer: typeof document !== "undefined" ? document.referrer : "",
		});

		track({
			event_type: "page_view",
			event_name: pathname + search,
			referrer:   internalReferrer || null,
			meta: {
				path:     pathname + search,
				query:    search,
				referrer: internalReferrer || "",
				title:    typeof document !== "undefined" ? document.title : "",
				preview:  false,
			},
			source:       ctx.source,
			utm_source:   ctx.utm_source,
			utm_medium:   ctx.utm_medium,
			utm_campaign: ctx.utm_campaign,
		});
	}, [pathname, search, track]);

	return (
		<div className="layout-wrapper d-flex flex-column min-vh-100">
			<Navbar menuType={menuType} />

			<main className="flex-fill">
				{children}
			</main>

			<Footer />

			<CookieConsent />
			<VersionChecker />
		</div>
	);
}
