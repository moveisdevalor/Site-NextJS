import type { Metadata } from "next";

import Publications from "@/screens/Publication";
import { fetchInitialPublications } from "@/lib/publications";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Publicações",
	description:
		"Revistas Móveis de Valor, Norte & Nordeste e Anuário de Colchões Brasil — referência editorial do setor moveleiro.",
	alternates: { canonical: `${SITE_URL}/publicacoes` },
	openGraph: {
		type: "website",
		title: "Revistas — Móveis de Valor",
		description:
			"Hub editorial do setor moveleiro: edições atuais e históricas.",
		url: `${SITE_URL}/publicacoes`,
	},
};

export default async function PublicacoesPage() {
	const publications = await fetchInitialPublications();
	return <Publications initialPublications={publications} />;
}
