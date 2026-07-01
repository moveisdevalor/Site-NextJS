import type { Metadata } from "next";

import About from "@/screens/About";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Sobre a Móveis de Valor — 25 anos dando voz ao setor moveleiro",
	description:
		"Há mais de duas décadas, a Móveis de Valor integra a cadeia moveleira com conteúdo estratégico, conectando indústrias, fornecedores e varejo.",
	alternates: { canonical: `${SITE_URL}/sobre` },
	openGraph: {
		type: "website",
		title: "Sobre a Móveis de Valor",
		description:
			"25 anos integrando a cadeia moveleira brasileira.",
		url: `${SITE_URL}/sobre`,
		images: [
			{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` },
		],
	},
};

export default function SobrePage() {
	return <About />;
}
