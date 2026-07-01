"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "../../api"; // sua instância axios
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import "./events.css";

type EventType = {
	fn_feira_id: number;
	fc_titulo: string;
	fc_link?: string | null;
	fn_image_id: number;
	fc_endereco: string;
	fn_destaque: number;
	fd_date_ini: string;
	fd_date_fim: string;
	fc_status: string;
	fc_tipo?: string | null;
};

export default function Events() {
	const [events,  setEvents]  = useState<EventType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error,   setError]   = useState<string | null>(null);
	const [filtroTipo, setFiltroTipo] = useState<"todos" | "N" | "I">("todos");

	const loadEvents = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await api.get("/events");
			setEvents(Array.isArray(response.data) ? response.data : []);
		} catch (err) {
			console.error("Erro ao carregar:", err);
			setError("Não foi possível carregar a lista de eventos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadEvents();
	}, []);

	// ordenado puramente por data de início (ascendente)
	const orderedEvents = useMemo(() => {
		return [...events].sort((a, b) => {
			const tA = new Date(a.fd_date_ini).getTime();
			const tB = new Date(b.fd_date_ini).getTime();
			const safeA = isNaN(tA) ? Infinity : tA;
			const safeB = isNaN(tB) ? Infinity : tB;
			return safeA - safeB;
		});
	}, [events]);

	const filteredEvents = useMemo(() => {
		if (filtroTipo === "todos") return orderedEvents;
		return orderedEvents.filter((e) => (e.fc_tipo || "N") === filtroTipo);
	}, [orderedEvents, filtroTipo]);

	const totalNacional = useMemo(
		() => orderedEvents.filter((e) => (e.fc_tipo || "N") === "N").length,
		[orderedEvents],
	);
	const totalInternacional = useMemo(
		() => orderedEvents.filter((e) => e.fc_tipo === "I").length,
		[orderedEvents],
	);

	function parseEventDate(dateString: string | null | undefined): Date | null {
		if (!dateString) return null;
		const d = new Date(dateString);
		if (isNaN(d.getTime())) return null;
		// compensação para timezone Brasil (mesmo padrão da implementação anterior)
		return new Date(d.getTime() + 3 * 60 * 60 * 1000);
	}

	// O banco grava links sem o prefixo de protocolo (ex: "www.feira.com.br"
	// ou "feira.com.br"). Sem o protocolo, o browser interpreta como path
	// relativo e tenta abrir dentro do próprio domínio.
	function ensureHttpsUrl(url: string | null | undefined): string | null {
		if (!url) return null;

		const trimmed = url.trim();
		if (!trimmed) return null;

		// já tem protocolo absoluto
		if (/^https?:\/\//i.test(trimmed)) return trimmed;

		// "//exemplo.com" → vira "https://exemplo.com"
		if (trimmed.startsWith("//")) return `https:${trimmed}`;

		// "mailto:" ou "tel:" não devem ser alterados
		if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;

		return `https://${trimmed}`;
	}

	function renderDateBox(start: Date | null, end: Date | null) {
		if (!start) {
			return (
				<div className="event-date event-date-empty">
					<span className="event-date-day">—</span>
				</div>
			);
		}

		const now = new Date();
		const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const endOfToday   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
		const happeningNow =
			isToday(start) ||
			(start <= endOfToday && (end ? end >= startOfToday : false));

		const sameDay =
			!end ||
			(format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd"));

		if (happeningNow) {
			return (
				<div className="event-date event-date-today">
					{/*<span className="event-date-tag">AGORA</span>*/}
					<span className="event-date-day">Hoje</span>
					{!sameDay && end && (
						<span className="event-date-range">
						até {format(end, "dd/MM", { locale: ptBR })}
					</span>
					)}
				</div>
			);
		}



		return (
			<div className="event-date">
				<span className="event-date-day">{format(start, "dd", { locale: ptBR })}</span>
				<span className="event-date-month">{format(start, "MMM", { locale: ptBR })}</span>
				{!sameDay && end && (
					<span className="event-date-range">
						até {format(end, "dd/MM", { locale: ptBR })}
					</span>
				)}
			</div>
		);
	}

	// function renderStatusPill(start: Date | null, end: Date | null) {
	// 	if (!start) return null;
	//
	// 	if (isToday(start) || (start <= new Date() && end && end >= new Date())) {
	// 		return <span className="event-pill event-pill-live">Acontecendo agora</span>;
	// 	}
	//
	// 	if (isPast(end ?? start)) {
	// 		return <span className="event-pill event-pill-past">Encerrada</span>;
	// 	}
	//
	// 	return <span className="event-pill event-pill-upcoming">Em breve</span>;
	// }

	// ────────────────────────────────────────────────────────────────
	// STATES (loading / error / empty / list)
	// ────────────────────────────────────────────────────────────────

	if (loading) {
		return (
			<div className="events-page container py-5">
				<div className="events-skeleton-grid">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="events-skeleton-card" />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="events-page container py-5">
				<div className="events-error">
					<p>{error}</p>
					<button
						type="button"
						className="event-news-link"
						onClick={loadEvents}
					>
						Tentar novamente
					</button>
				</div>
			</div>
		);
	}

	return (
		<>
			<section className="events-page container py-5">

				<header className="events-header">
					<h1>Feiras e Eventos</h1>
					<p>
						Fique por dentro das principais feiras do setor moveleiro.
						Datas, locais e oportunidades reunidas em um só lugar.
						Planeje sua agenda e não perca os eventos que movem o mercado.
					</p>
				</header>

				<div className="events-filter" role="tablist" aria-label="Filtrar por tipo">
					<button
						type="button"
						role="tab"
						aria-selected={filtroTipo === "todos"}
						className={`events-filter-card ${filtroTipo === "todos" ? "is-active" : ""}`}
						onClick={() => setFiltroTipo("todos")}
					>
						<span className="events-filter-label">Todas</span>
						<span className="events-filter-count">{orderedEvents.length}</span>
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={filtroTipo === "N"}
						className={`events-filter-card ${filtroTipo === "N" ? "is-active" : ""}`}
						onClick={() => setFiltroTipo("N")}
					>
						<span className="events-filter-label">Nacional</span>
						<span className="events-filter-count">{totalNacional}</span>
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={filtroTipo === "I"}
						className={`events-filter-card ${filtroTipo === "I" ? "is-active" : ""}`}
						onClick={() => setFiltroTipo("I")}
					>
						<span className="events-filter-label">Internacional</span>
						<span className="events-filter-count">{totalInternacional}</span>
					</button>
				</div>

				{filteredEvents.length === 0 ? (
					<div className="events-empty">
						<p>Nenhuma feira cadastrada no momento.</p>
					</div>
				) : (
					<div className="events-grid">
						{filteredEvents.map((event) => {
							const start = parseEventDate(event.fd_date_ini);
							const end   = parseEventDate(event.fd_date_fim);

							return (
								<article
									key={event.fn_feira_id}
									className={`event-card ${event.fn_destaque ? "event-card-featured" : ""}`}
								>
									{/*{event.fn_destaque ? (*/}
									{/*	<span className="event-featured-badge">*/}
									{/*		<span className="event-featured-badge-icon" aria-hidden="true">★</span>*/}
									{/*		/!*Estaremos lá*!/*/}
									{/*	</span>*/}
									{/*) : null}*/}

									<div className="event-card-body">
										<div className="event-date-wrapper">
											{renderDateBox(start, end)}
										</div>

										<div className="event-info">
											{/*{renderStatusPill(start, end)}*/}

											{(() => {
												const safeLink = ensureHttpsUrl(event.fc_link);

												return (
													<>
														{safeLink ? (
															<a
																href={safeLink}
																target="_blank"
																rel="noopener noreferrer"
																className="event-title-link"
															>
																<h2 className="event-title">{event.fc_titulo}</h2>
															</a>
														) : (
															<h2 className="event-title">{event.fc_titulo}</h2>
														)}

														{event.fc_endereco && (
															<p className="event-address">
																<svg
																	className="event-address-icon"
																	viewBox="0 0 24 24"
																	aria-hidden="true"
																>
																	<path
																		fill="currentColor"
																		d="M12 2a8 8 0 0 0-8 8c0 5.4 7 11.5 7.3 11.7a1 1 0 0 0 1.4 0C13 21.5 20 15.4 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
																	/>
																</svg>
																<span>{event.fc_endereco}</span>
															</p>
														)}

														{safeLink && (
															<a
																href={safeLink}
																target="_blank"
																rel="noopener noreferrer"
																className="event-site-link"
															>
																<svg
																	className="event-site-icon"
																	viewBox="0 0 24 24"
																	aria-hidden="true"
																>
																	<path
																		fill="currentColor"
																		d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm6.93 8h-3.05a15.94 15.94 0 0 0-1.32-4.62A8.03 8.03 0 0 1 18.93 10ZM12 4.05c.86 1.28 1.55 2.83 1.95 4.95H10.05c.4-2.12 1.09-3.67 1.95-4.95ZM4.26 14a7.98 7.98 0 0 1 0-4h3.42a16.5 16.5 0 0 0 0 4H4.26Zm.81 2h3.05c.31 1.68.77 3.22 1.32 4.62A8.03 8.03 0 0 1 5.07 16Zm3.05-8H5.07a8.03 8.03 0 0 1 4.37-4.62A15.94 15.94 0 0 0 8.12 8ZM12 19.95c-.86-1.28-1.55-2.83-1.95-4.95h3.9c-.4 2.12-1.09 3.67-1.95 4.95ZM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4Zm.23 6.62c.55-1.4 1.01-2.94 1.32-4.62h3.05a8.03 8.03 0 0 1-4.37 4.62ZM16.32 14a16.5 16.5 0 0 0 0-4h3.42a7.98 7.98 0 0 1 0 4h-3.42Z"
																	/>
																</svg>
																<span>{event.fc_link}</span>
															</a>
														)}
													</>
												);
											})()}

											<Link
												href={`/noticias?q=${encodeURIComponent(event.fc_titulo)}`}
												className="event-news-link"
											>
												Ler notícias sobre a feira
											</Link>
										</div>
									</div>
								</article>
							);
						})}
					</div>
				)}

			</section>
		</>
	);
}
