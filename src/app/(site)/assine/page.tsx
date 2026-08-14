import type { Metadata } from "next";

import Subscribe from "@/screens/Subscribe";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Assine a Móveis de Valor",
	description:
		"Assine a Móveis de Valor e tenha acesso à publicação de referência do setor moveleiro brasileiro há 25 anos.",
	alternates: { canonical: `${SITE_URL}/assine` },
	openGraph: {
		type: "website",
		title: "Assine a Móveis de Valor",
		description:
			"Assine a Móveis de Valor e tenha acesso à publicação de referência do setor moveleiro brasileiro há 25 anos.",
		url: `${SITE_URL}/assine`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Assine a Móveis de Valor",
		description:
			"Assine a Móveis de Valor e tenha acesso à publicação de referência do setor moveleiro brasileiro há 25 anos.",
	},
};

export default function AssinePage() {
	return <Subscribe />;
}
