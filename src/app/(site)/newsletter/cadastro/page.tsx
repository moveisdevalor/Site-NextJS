import type { Metadata } from "next";

import NewsletterRegister from "@/screens/Newsletter/register";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Newsletter — Receba as principais notícias do setor moveleiro",
	description:
		"Cadastre-se gratuitamente e receba semanalmente as notícias mais importantes do setor moveleiro brasileiro.",
	alternates: { canonical: `${SITE_URL}/newsletter/cadastro` },
};

export default function NewsletterRegisterPage() {
	return <NewsletterRegister />;
}
