import type { Metadata } from "next";
import { Suspense } from "react";

import NewsletterRegister from "@/screens/Newsletter/register";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Newsletter — Receba as principais notícias do setor moveleiro",
	description:
		"Cadastre-se gratuitamente e receba semanalmente as notícias mais importantes do setor moveleiro brasileiro.",
	alternates: { canonical: `${SITE_URL}/newsletter/cadastro` },
	openGraph: {
		type: "website",
		title: "Newsletter — Receba as principais notícias do setor moveleiro",
		description:
			"Cadastre-se gratuitamente e receba semanalmente as notícias mais importantes do setor moveleiro brasileiro.",
		url: `${SITE_URL}/newsletter/cadastro`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Newsletter — Receba as principais notícias do setor moveleiro",
		description:
			"Cadastre-se gratuitamente e receba semanalmente as notícias mais importantes do setor moveleiro brasileiro.",
	},
};

export default function NewsletterRegisterPage() {
	return (
		<Suspense fallback={null}>
			<NewsletterRegister />
		</Suspense>
	);
}
