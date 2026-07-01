import type { Metadata } from "next";

import Contact from "@/screens/Contact";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Contato — Fale com a Móveis de Valor",
	description:
		"Entre em contato com nossa equipe. Sugestões de pauta, parcerias, atendimento comercial e suporte editorial.",
	alternates: { canonical: `${SITE_URL}/contato` },
};

export default function ContatoPage() {
	return <Contact />;
}
