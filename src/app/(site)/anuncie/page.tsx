import type { Metadata } from "next";

import Advertise from "@/screens/Advertise";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Anuncie na Móveis de Valor",
	description:
		"Conecte sua marca à decisão de compra do varejo moveleiro brasileiro. Conheça as soluções de mídia da Móveis de Valor.",
	alternates: { canonical: `${SITE_URL}/anuncie` },
	openGraph: {
		type: "website",
		title: "Anuncie na Móveis de Valor",
		description:
			"Conecte sua marca à decisão de compra do varejo moveleiro brasileiro.",
		url: `${SITE_URL}/anuncie`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Anuncie na Móveis de Valor",
		description:
			"Conecte sua marca à decisão de compra do varejo moveleiro brasileiro.",
	},
};

export default function AnunciePage() {
	return <Advertise />;
}
