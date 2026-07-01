import type { Metadata } from "next";

import FAQ from "@/screens/FAQ";

export const revalidate = 3600;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Perguntas Frequentes",
	description:
		"Tire suas dúvidas sobre a Móveis de Valor: publicações, eventos, newsletter e serviços para o setor moveleiro.",
	alternates: { canonical: `${SITE_URL}/faq` },
};

export default function FaqPage() {
	return <FAQ />;
}
