import type { Metadata } from "next";

import PrivacyPolicy from "@/screens/Newsletter/privacyPolicy";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Política de Privacidade",
	description:
		"Política de privacidade e tratamento de dados da Móveis de Valor, em conformidade com a LGPD.",
	alternates: { canonical: `${SITE_URL}/politica-de-privacidade` },
	openGraph: {
		type: "website",
		title: "Política de Privacidade",
		description:
			"Política de privacidade e tratamento de dados da Móveis de Valor, em conformidade com a LGPD.",
		url: `${SITE_URL}/politica-de-privacidade`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Política de Privacidade",
		description:
			"Política de privacidade e tratamento de dados da Móveis de Valor, em conformidade com a LGPD.",
	},
};

export default function PrivacyPolicyPage() {
	return <PrivacyPolicy />;
}
