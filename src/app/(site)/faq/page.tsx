import type { Metadata } from "next";

import FAQ from "@/screens/FAQ";

export const revalidate = 3600;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Perguntas Frequentes",
	description:
		"Tire suas dúvidas sobre a Móveis de Valor: publicações, eventos, newsletter e serviços para o setor moveleiro.",
	alternates: { canonical: `${SITE_URL}/faq` },
	openGraph: {
		type: "website",
		title: "Perguntas Frequentes",
		description:
			"Tire suas dúvidas sobre a Móveis de Valor: publicações, eventos, newsletter e serviços para o setor moveleiro.",
		url: `${SITE_URL}/faq`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Perguntas Frequentes",
		description:
			"Tire suas dúvidas sobre a Móveis de Valor: publicações, eventos, newsletter e serviços para o setor moveleiro.",
	},
};

export default function FaqPage() {
	return <FAQ />;
}
