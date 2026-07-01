import type { Metadata } from "next";

import Hub from "@/screens/Hub";

export const revalidate = 600;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Hub de Inteligência do Setor Moveleiro",
	description:
		"Conectando indústria, varejo e especialistas do setor moveleiro. Conteúdo estratégico para tomada de decisão.",
	alternates: { canonical: `${SITE_URL}/hub` },
	openGraph: {
		type: "website",
		title: "Hub — Móveis de Valor",
		description:
			"Plataforma que conecta especialistas, indústria e varejo do setor moveleiro.",
		url: `${SITE_URL}/hub`,
		images: [
			{
				url: "https://apiv2.moveisdevalor.com.br/upload/images/26061/Hub_horizontal.png",
			},
		],
	},
};

export default function HubPage() {
	return <Hub />;
}
