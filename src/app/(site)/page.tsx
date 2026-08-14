import type { Metadata } from "next";

import { Index } from "@/screens/Index";
import { fetchHomeData } from "@/lib/home";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: {
		absolute:
			"Móveis de Valor — o setor moveleiro ganha voz há 25 anos",
	},
	description:
		"As principais notícias, tendências e análises do setor moveleiro brasileiro. Cobertura de indústria, marcenaria, mercado, feiras e negócios há 25 anos.",
	alternates: { canonical: SITE_URL },
	openGraph: {
		type: "website",
		title: "Móveis de Valor",
		description:
			"As principais notícias, tendências e análises do setor moveleiro brasileiro. Cobertura de indústria, marcenaria, mercado, feiras e negócios há 25 anos.",
		url: SITE_URL,
		siteName: "Móveis de Valor",
		locale: "pt_BR",
		images: [
			{
				url: `${SITE_URL}/assets/logo-moveis-de-valor.png`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Móveis de Valor",
		description:
			"As principais notícias, tendências e análises do setor moveleiro brasileiro. Cobertura de indústria, marcenaria, mercado, feiras e negócios há 25 anos.",
	},
};

export default async function HomePage() {
	const homeData = await fetchHomeData();
	return <Index initialData={homeData} />;
}
