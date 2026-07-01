import type { Metadata } from "next";

import NewsletterOptIN from "@/screens/Newsletter/optin";

export const metadata: Metadata = {
	title: "Confirmação de cadastro — Newsletter",
	description: "Confirme sua inscrição na newsletter do setor moveleiro.",
	robots: { index: false, follow: false },
};

export default function NewsletterOptInPage() {
	return <NewsletterOptIN />;
}
