import type { Metadata } from "next";

import PrivacyPolicy from "@/screens/Newsletter/privacyPolicy";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Política de Privacidade",
	description:
		"Política de privacidade e tratamento de dados da Móveis de Valor, em conformidade com a LGPD.",
	alternates: { canonical: `${SITE_URL}/politica-de-privacidade` },
};

export default function PrivacyPolicyPage() {
	return <PrivacyPolicy />;
}
