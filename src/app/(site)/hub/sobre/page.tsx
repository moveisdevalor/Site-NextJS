import type { Metadata } from "next";

import HubAbout from "@/screens/Hub/about";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Sobre o HUB de Inteligência Colaborativa",
	description:
		"Conheça o HUB de Inteligência Colaborativa: plataforma de conhecimento que conecta indústria, varejo e especialistas do setor moveleiro.",
	alternates: { canonical: `${SITE_URL}/hub/sobre` },
	openGraph: {
		type: "website",
		title: "Sobre o HUB — Móveis de Valor",
		description:
			"Conheça o HUB de Inteligência Colaborativa do setor moveleiro.",
		url: `${SITE_URL}/hub/sobre`,
		images: [
			{
				url: "https://apiv2.moveisdevalor.com.br/upload/images/26061/Hub_horizontal.png",
			},
		],
	},
};

export default function HubSobrePage() {
	return <HubAbout />;
}
