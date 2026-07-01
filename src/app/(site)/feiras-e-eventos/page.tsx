import type { Metadata } from "next";

import Event from "@/screens/Event";

export const revalidate = 600;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Feiras e Eventos do Setor Moveleiro",
	description:
		"Calendário das principais feiras, eventos e oportunidades do setor moveleiro brasileiro. Datas, locais e informações reunidas em um só lugar.",
	alternates: { canonical: `${SITE_URL}/feiras-e-eventos` },
	openGraph: {
		type: "website",
		title: "Feiras e Eventos — Móveis de Valor",
		description:
			"Calendário do setor moveleiro brasileiro.",
		url: `${SITE_URL}/feiras-e-eventos`,
	},
};

export default function FeirasEventosPage() {
	return <Event />;
}
