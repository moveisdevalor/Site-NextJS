import type { Metadata } from "next";

import Contact from "@/screens/Contact";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Contato — Fale com a Móveis de Valor",
	description:
		"Entre em contato com nossa equipe. Sugestões de pauta, parcerias, atendimento comercial e suporte editorial.",
	alternates: { canonical: `${SITE_URL}/contato` },
	openGraph: {
		type: "website",
		title: "Contato — Fale com a Móveis de Valor",
		description:
			"Entre em contato com nossa equipe. Sugestões de pauta, parcerias, atendimento comercial e suporte editorial.",
		url: `${SITE_URL}/contato`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contato — Fale com a Móveis de Valor",
		description:
			"Entre em contato com nossa equipe. Sugestões de pauta, parcerias, atendimento comercial e suporte editorial.",
	},
};

export default function ContatoPage() {
	return <Contact />;
}
