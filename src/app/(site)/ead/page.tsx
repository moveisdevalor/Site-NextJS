import type { Metadata } from "next";

import Course from "@/screens/Course";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "EAD Móveis de Valor",
	description:
		"Educação a distância para profissionais do setor moveleiro.",
	alternates: { canonical: `${SITE_URL}/ead` },
	openGraph: {
		type: "website",
		title: "EAD Móveis de Valor",
		description:
			"Educação a distância para profissionais do setor moveleiro.",
		url: `${SITE_URL}/ead`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "EAD Móveis de Valor",
		description:
			"Educação a distância para profissionais do setor moveleiro.",
	},
};

export default function EadPage() {
	return <Course />;
}
