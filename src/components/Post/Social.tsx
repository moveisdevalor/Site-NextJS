import {
	LuFacebook,
	LuLinkedin,
	LuSend,
	LuLink,
} from "react-icons/lu";

import { FaWhatsapp } from "react-icons/fa";

import {
	useMemo,
	useCallback,
	useState,
	useRef,
	useEffect,
} from "react";

import "./social.css";

import { useAnalytics } from "../../hooks/trackEvent";

type Props = {
	campaign?: string;
	content?: string;
};

type CopyStatus =
	| "idle"
	| "success"
	| "error";

export default function Card({
								 campaign = "noticia",
								 content = "sidebar_card",
							 }: Props) {

	const { track } =
		useAnalytics();

	const [copyStatus, setCopyStatus] =
		useState<CopyStatus>(
			"idle"
		);

	const timeoutRef =
		useRef<number | null>(
			null
		);

	useEffect(() => {
		return () => {
			if (
				timeoutRef.current
			) {
				window.clearTimeout(
					timeoutRef.current
				);
			}
		};
	}, []);

	const getUrlWithUtm =
		useCallback(
			(
				source: string
			) => {

				if (
					typeof window ===
					"undefined"
				) {
					return "";
				}

				/*
				URL limpa sem UTMs antigos
				*/

				const url =
					new URL(
						window.location
							.origin +
						window.location
							.pathname
					);

				url.searchParams.set(
					"utm_source",
					source
				);

				url.searchParams.set(
					"utm_medium",
					"social"
				);

				url.searchParams.set(
					"utm_campaign",
					campaign
				);

				url.searchParams.set(
					"utm_content",
					content
				);

				return url.toString();
			},
			[
				campaign,
				content,
			]
		);

	const buildUrl =
		useCallback(
			(
				source: string
			) =>
				encodeURIComponent(
					getUrlWithUtm(
						source
					)
				),
			[
				getUrlWithUtm,
			]
		);

	const links = useMemo(
		() => ({
			facebook: `https://www.facebook.com/sharer/sharer.php?u=${buildUrl("facebook")}`,

			linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${buildUrl("linkedin")}`,

			whatsapp: `https://api.whatsapp.com/send?text=${buildUrl("whatsapp")}`,

			telegram: `https://t.me/share/url?url=${buildUrl("telegram")}`,
		}),
		[buildUrl]
	);

	const socialItems = useMemo(
		() => [
			{
				key: "facebook",
				url: links.facebook,
				icon:
				LuFacebook,
			},

			{
				key: "linkedin",
				url: links.linkedin,
				icon:
				LuLinkedin,
			},

			{
				key: "whatsapp",
				url: links.whatsapp,
				icon:
				FaWhatsapp,
			},

			{
				key: "telegram",
				url: links.telegram,
				icon:
				LuSend,
			},
		],
		[links]
	);

	const resetCopyStatus =
		useCallback(() => {

			if (
				timeoutRef.current
			) {
				window.clearTimeout(
					timeoutRef.current
				);
			}

			timeoutRef.current =
				window.setTimeout(
					() => {
						setCopyStatus(
							"idle"
						);
					},
					2000
				);
		}, []);

	const copyFallback =
		(
			text: string
		): boolean => {

			const textarea =
				document.createElement(
					"textarea"
				);

			textarea.value =
				text;

			textarea.style.position =
				"fixed";

			textarea.style.opacity =
				"0";

			document.body.appendChild(
				textarea
			);

			textarea.focus();

			textarea.select();

			const success =
				document.execCommand(
					"copy"
				);

			document.body.removeChild(
				textarea
			);

			return success;
		};

	const handleTracking =
		useCallback(
			(
				source: string
			) => {

				track({
					event_type:
						"share_click",

					source,

					meta: {
						campaign,
						content,
					},
				});
			},
			[
				track,
				campaign,
				content,
			]
		);

	const handleCopy =
		useCallback(
			async () => {

				const url =
					getUrlWithUtm(
						"copy_link"
					);

				try {

					if (
						navigator.clipboard &&
						window.isSecureContext
					) {

						await navigator.clipboard.writeText(
							url
						);

					} else {

						const success =
							copyFallback(
								url
							);

						if (
							!success
						) {
							throw new Error(
								"Fallback falhou"
							);
						}
					}

					setCopyStatus(
						"success"
					);

					track({
						event_type:
							"share_copy",

						source:
							"copy_link",

						meta: {
							campaign,
							content,
						},
					});

				} catch (
					error
					) {

					console.error(
						"Erro ao copiar:",
						error
					);

					setCopyStatus(
						"error"
					);
				}

				resetCopyStatus();
			},
			[
				getUrlWithUtm,
				track,
				campaign,
				content,
				resetCopyStatus,
			]
		);

	return (
		<div className="social-midia-news">
			<div className="icons-midia-news">

				{socialItems.map(
					(item) => {

						const Icon =
							item.icon;

						return (
							<a
								key={
									item.key
								}
								href={
									item.url
								}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() =>
									handleTracking(
										item.key
									)
								}
							>
								<Icon />
							</a>
						);
					}
				)}

				<button
					onClick={handleCopy}
					type="button"
					aria-label="Copiar link"
				>
					<LuLink />
				</button>

				{copyStatus === "success" && (
					<span className="copy-feedback copy-feedback-success">
						Copiado
					</span>
				)}

				{copyStatus === "error" && (
					<span className="copy-feedback copy-feedback-error">
						Erro ao copiar
					</span>
				)}
			</div>
		</div>
	);
}