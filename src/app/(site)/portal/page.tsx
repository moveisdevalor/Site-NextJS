// /portal e' alias legado de /. Mesmo conteudo, canonical para /.
import type { Metadata } from "next";

import { Index } from "@/screens/Index";
import { fetchHomeData } from "@/lib/home";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: { absolute: "Móveis de Valor" },
	alternates: { canonical: SITE_URL },
	openGraph: {
		type: "website",
		title: "Móveis de Valor",
		description:
			"As principais notícias, tendências e análises do setor moveleiro brasileiro.",
		url: SITE_URL,
		siteName: "Móveis de Valor",
		locale: "pt_BR",
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Móveis de Valor",
		description:
			"As principais notícias, tendências e análises do setor moveleiro brasileiro.",
	},
};

export default async function PortalHomePage() {
	const homeData = await fetchHomeData();
	return <Index initialData={homeData} />;
}
