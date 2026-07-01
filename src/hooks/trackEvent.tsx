import { useCallback, useRef } from "react";

// =====================================================================
// CONFIG
// =====================================================================

const SESSION_KEY =
	"analytics_session_v3";

const VISITOR_KEY =
	"analytics_visitor_v3";

const ATTRIBUTION_KEY =
	"analytics_attribution_v3";

const SESSION_TIMEOUT =
	30 * 60 * 1000;

const API_BASE_URL = (
	process.env
		.NEXT_PUBLIC_API_URL ??
	""
)
	.trim()
	.replace(/\/$/, "");

/*
Compatível com:
- localhost
- vite proxy
- env relativo
- produção
*/

const TRACK_ENDPOINT =
	`${API_BASE_URL}/trackEvent`;

const DEBUG =
	process.env.NODE_ENV !== "production";

// =====================================================================
// TIPOS
// =====================================================================

type NullableString =
	| null
	| string;

type StoredSession = {
	id: string;
	lastActivity: number;
	startedAt: number;
};

type StoredAttribution = {
	session_id: string;
	utm_source: NullableString;
	utm_medium: NullableString;
	utm_campaign: NullableString;
};

type AnalyticsContext = {
	session_id: string;
	visitor_id: string;
	source: string;
	utm_source: NullableString;
	utm_medium: NullableString;
	utm_campaign: NullableString;
};

type TrackParams = {
	event_type: string;
	event_name?: NullableString;
	meta?: Record<
		string,
		unknown
	>;
	source?: NullableString;
	utm_source?: NullableString;
	utm_medium?: NullableString;
	utm_campaign?: NullableString;
	referrer?: NullableString;
};

// =====================================================================
// LOG
// =====================================================================

function debugLog(
	...args: unknown[]
): void {

	if (!DEBUG) {
		return;
	}

	console.log(
		"[Analytics]",
		...args
	);
}

function debugError(
	...args: unknown[]
): void {

	console.error(
		"[Analytics]",
		...args
	);
}

// =====================================================================
// SOURCE RULES
// =====================================================================

const REFERRER_SOURCE_RULES: Array<
	[RegExp, string]
> = [
	[
		/facebook|fb\.com/i,
		"facebook",
	],
	[
		/instagram/i,
		"instagram",
	],
	[
		/linkedin/i,
		"linkedin",
	],
	[
		/google/i,
		"google",
	],
	[
		/bing/i,
		"bing",
	],
	[
		/youtube/i,
		"youtube",
	],
	[
		/twitter|t\.co|x\.com/i,
		"twitter",
	],
	[
		/whatsapp/i,
		"whatsapp",
	],
];

const CLICK_ID_TO_SOURCE: Record<
	string,
	string
> = {
	fbclid: "facebook",
	gclid: "google",
	li_fat_id: "linkedin",
};

const SOURCE_ALIASES: Record<
	string,
	string
> = {
	adwords: "google",
	fb: "facebook",
	facebook_ads:
		"facebook",
	gads: "google",
	google_ads: "google",
	ig: "instagram",
	instagram_ads:
		"instagram",
	insta: "instagram",
	li: "linkedin",
	li_fat_id:
		"linkedin",
	ln: "linkedin",
	mail: "email",
	news: "email",
	newsletter: "email",
	wa: "whatsapp",
	wpp: "whatsapp",
	x: "twitter",
};

// =====================================================================
// HELPERS
// =====================================================================

function isBrowser(): boolean {

	return (
		typeof document !==
		"undefined" &&
		typeof window !==
		"undefined" &&
		typeof localStorage !==
		"undefined"
	);
}

function safeParseJSON<T>(
	value: null | string
): null | T {

	if (!value) {
		return null;
	}

	try {

		return JSON.parse(
			value
		) as T;

	} catch (error) {

		debugError(
			"JSON parse error",
			error
		);

		return null;
	}
}

function readStorage(
	key: string
): null | string {

	if (!isBrowser()) {
		return null;
	}

	try {

		return localStorage.getItem(
			key
		);

	} catch (error) {

		debugError(
			"readStorage error",
			key,
			error
		);

		return null;
	}
}

function writeStorage(
	key: string,
	value: string
): void {

	if (!isBrowser()) {
		return;
	}

	try {

		localStorage.setItem(
			key,
			value
		);

	} catch (error) {

		debugError(
			"writeStorage error",
			key,
			error
		);
	}
}

function generateUUID(): string {

	if (
		typeof crypto !==
		"undefined" &&
		typeof crypto.randomUUID ===
		"function"
	) {
		return crypto.randomUUID();
	}

	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
		/[xy]/g,
		(char) => {

			const random =
				(Math.random() *
					16) |
				0;

			const value =
				char === "x"
					? random
					: (random &
						0x3) |
					0x8;

			return value.toString(
				16
			);
		}
	);
}

// =====================================================================
// SOURCE
// =====================================================================

function normalizeSource(
	source?: NullableString
): string {

	if (!source) {
		return "direct";
	}

	const normalized =
		source
			.trim()
			.toLowerCase();

	if (!normalized) {
		return "direct";
	}

	return (
		SOURCE_ALIASES[
			normalized
			] ?? normalized
	);
}

function getSearchParams(
	search?: string
): URLSearchParams {

	const resolved =
		typeof search ===
		"string"
			? search
			: isBrowser()
				? window.location
					.search
				: "";

	return new URLSearchParams(
		resolved
	);
}

function hasExplicitAttribution(
	params: URLSearchParams
): boolean {

	return (
		params.has(
			"source"
		) ||
		params.has(
			"utm_source"
		) ||
		params.has(
			"utm_medium"
		) ||
		params.has(
			"utm_campaign"
		) ||
		Object.keys(
			CLICK_ID_TO_SOURCE
		).some((key) =>
			params.has(key)
		)
	);
}

function resolveSourceFromReferrer(
	referrer?: string
): string {

	if (!referrer) {
		return "direct";
	}

	for (const [
		pattern,
		source,
	] of REFERRER_SOURCE_RULES) {

		if (
			pattern.test(
				referrer
			)
		) {
			return source;
		}
	}

	return "direct";
}

// =====================================================================
// PREVIEW
// =====================================================================

export function isPreviewSearch(
	search?: string
): boolean {

	return (
		getSearchParams(
			search
		).get("preview") ===
		"true"
	);
}

export function shouldBlockPreviewTracking(
	search?: string
): boolean {

	return isPreviewSearch(
		search
	);
}

// =====================================================================
// SESSION
// =====================================================================

function persistSession(
	session: StoredSession
): void {

	writeStorage(
		SESSION_KEY,
		JSON.stringify(
			session
		)
	);
}

function getStoredSession():
	| null
	| StoredSession {

	return safeParseJSON<StoredSession>(
		readStorage(
			SESSION_KEY
		)
	);
}

export function getSessionId(): string {

	const now =
		Date.now();

	const stored =
		getStoredSession();

	if (
		stored?.id &&
		stored.lastActivity &&
		now -
		stored.lastActivity <
		SESSION_TIMEOUT
	) {

		const refreshed: StoredSession =
			{
				...stored,
				lastActivity:
				now,
			};

		persistSession(
			refreshed
		);

		return refreshed.id;
	}

	const fresh: StoredSession =
		{
			id: generateUUID(),

			lastActivity:
			now,

			startedAt:
			now,
		};

	persistSession(fresh);

	return fresh.id;
}

export function touchSession(): string {

	return getSessionId();
}

export function getVisitorId(): string {

	const stored =
		readStorage(
			VISITOR_KEY
		);

	if (stored) {
		return stored;
	}

	const visitor_id =
		generateUUID();

	writeStorage(
		VISITOR_KEY,
		visitor_id
	);

	return visitor_id;
}

// =====================================================================
// ATTRIBUTION
// =====================================================================

function readStoredAttribution():
	| null
	| StoredAttribution {

	return safeParseJSON<StoredAttribution>(
		readStorage(
			ATTRIBUTION_KEY
		)
	);
}

function writeStoredAttribution(
	attribution: StoredAttribution
): void {

	writeStorage(
		ATTRIBUTION_KEY,
		JSON.stringify(
			attribution
		)
	);
}

function buildAttributionContext(
	search?: string,
	referrer?: string
): AnalyticsContext {

	const session_id =
		getSessionId();

	const visitor_id =
		getVisitorId();

	const params =
		getSearchParams(
			search
		);

	const explicitSource =
		params.get(
			"source"
		);

	const utm_source =
		params.get(
			"utm_source"
		);

	const utm_medium =
		params.get(
			"utm_medium"
		);

	const utm_campaign =
		params.get(
			"utm_campaign"
		);

	const resolvedReferrer =
		typeof referrer ===
		"string"
			? referrer
			: isBrowser()
				? document.referrer
				: "";

	const stored =
		readStoredAttribution();

	const canReuseStored =
		stored?.session_id ===
		session_id &&
		!hasExplicitAttribution(
			params
		);

	// SOURCE: sempre recalculado, nunca lido/gravado em cache
	let detectedSource:
		| NullableString =
		explicitSource ??
		utm_source ??
		null;

	if (
		(!detectedSource ||
			detectedSource ===
			"direct")
	) {

		for (const [
			param,
			source,
		] of Object.entries(
			CLICK_ID_TO_SOURCE
		)) {

			if (
				params.has(
					param
				)
			) {

				detectedSource =
					source;

				break;
			}
		}
	}

	if (
		(!detectedSource ||
			detectedSource ===
			"direct")
	) {

		detectedSource =
			resolveSourceFromReferrer(
				resolvedReferrer
			);
	}

	const source =
		normalizeSource(
			detectedSource
		);

	// UTM continua reaproveitando o cache da sessão
	const finalUtmSource =
		canReuseStored && stored
			? stored.utm_source
			: utm_source;

	const finalUtmMedium =
		canReuseStored && stored
			? stored.utm_medium
			: utm_medium;

	const finalUtmCampaign =
		canReuseStored && stored
			? stored.utm_campaign
			: utm_campaign;

	writeStoredAttribution(
		{
			session_id,
			utm_source: finalUtmSource,
			utm_medium: finalUtmMedium,
			utm_campaign: finalUtmCampaign,
		}
	);

	return {
		session_id,
		visitor_id,
		source,
		utm_source: finalUtmSource,
		utm_medium: finalUtmMedium,
		utm_campaign: finalUtmCampaign,
	};
}

export function getAnalyticsContext(
	options?: {
		referrer?: string;
		search?: string;
	}
): AnalyticsContext {

	return buildAttributionContext(
		options?.search,
		options?.referrer
	);
}

// =====================================================================
// HEADERS
// =====================================================================

export function getTrackingHeaders(
	search?: string
): Record<
	string,
	string
> {

	const ctx =
		getAnalyticsContext({
			search,
		});

	const headers: Record<
		string,
		string
	> = {
		"x-session-id":
		ctx.session_id,

		"x-visitor-id":
		ctx.visitor_id,

		"x-source":
		ctx.source,
	};

	if (ctx.utm_source) {

		headers[
			"x-utm-source"
			] = ctx.utm_source;
	}

	if (ctx.utm_medium) {

		headers[
			"x-utm-medium"
			] = ctx.utm_medium;
	}

	if (
		ctx.utm_campaign
	) {

		headers[
			"x-utm-campaign"
			] =
			ctx.utm_campaign;
	}

	return headers;
}

// =====================================================================
// PAYLOAD
// =====================================================================

function getUserId():
	| null
	| number {

	const raw =
		readStorage(
			"userId"
		);

	if (!raw) {
		return null;
	}

	const parsed =
		Number(raw);

	return Number.isNaN(
		parsed
	)
		? null
		: parsed;
}

function buildEventPayload({
							   event_type,
							   event_name,
							   meta = {},
							   source,
							   utm_source,
							   utm_medium,
							   utm_campaign,
							   referrer,
						   }: TrackParams) {

	const search =
		isBrowser()
			? window.location
				.search
			: "";

	const ctx =
		getAnalyticsContext({
			search,
		});

	const payload = {
		event_type,

		event_name:
			event_name ??
			null,

		meta,

		session_id:
		ctx.session_id,

		visitor_id:
		ctx.visitor_id,

		source:
			normalizeSource(
				source ??
				ctx.source
			),

		utm_source:
			utm_source ??
			ctx.utm_source,

		utm_medium:
			utm_medium ??
			ctx.utm_medium,

		utm_campaign:
			utm_campaign ??
			ctx.utm_campaign,

		referrer:
			referrer ?? null,

		user_id:
			getUserId(),
	};

	debugLog(
		"Payload",
		payload
	);

	return payload;
}

// =====================================================================
// TRANSPORT
// =====================================================================

async function sendEventWithFetch(
	payload: ReturnType<
		typeof buildEventPayload
	>
): Promise<void> {

	if (!TRACK_ENDPOINT) {

		debugError(
			"TRACK_ENDPOINT vazio"
		);

		return;
	}

	try {

		debugLog(
			"Enviando request",
			{
				url:
				TRACK_ENDPOINT,

				payload,
			}
		);

		const response =
			await fetch(
				TRACK_ENDPOINT,
				{
					method:
						"POST",

					mode:
						"cors",

					keepalive:
						true,

					headers:
						{
							"Content-Type":
								"application/json",
						},

					body:
						JSON.stringify(
							payload
						),
				}
			);

		if (!response.ok) {

			debugError(
				"Analytics HTTP Error",
				response.status
			);
		}

	} catch (error) {

		debugError(
			"Fetch error",
			error
		);
	}
}

// =====================================================================
// API
// =====================================================================

export async function sendAnalyticsEvent(
	params: TrackParams
): Promise<void> {

	if (!isBrowser()) {
		return;
	}

	if (
		shouldBlockPreviewTracking()
	) {
		return;
	}

	try {

		const payload =
			buildEventPayload(
				params
			);

		await sendEventWithFetch(
			payload
		);

	} catch (error) {

		debugError(
			"Analytics error",
			error
		);
	}
}

// =====================================================================
// HOOK
// =====================================================================

export function useAnalytics() {

	const lastRef =
		useRef<{
			key: string;
			ts: number;
		} | null>(null);

	const track =
		useCallback(
			(
				params: TrackParams
			) => {

				try {

					const key = `${params.event_type}::${
						params.event_name ?? ""
					}::${
						(params.meta?.query as string) ?? ""
					}`;

					const now =
						Date.now();

					const last =
						lastRef.current;

					/*
					DEDUPLICAÇÃO
					*/

					if (
						last &&
						last.key ===
						key &&
						now -
						last.ts <
						5000
					) {

						debugLog(
							"Evento duplicado ignorado",
							key
						);

						return;
					}

					lastRef.current =
						{
							key,
							ts: now,
						};

					debugLog(
						"Track",
						params
					);

					void sendAnalyticsEvent(
						params
					);

				} catch (error) {

					debugError(
						"useAnalytics error",
						error
					);
				}
			},
			[]
		);

	return {
		track,
	};
}