import type { Metadata } from "next";

import CourseMestre from "@/screens/Course/mestre-marceneiro";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Curso Mestre Marceneiro",
	description:
		"Formação completa em marcenaria. Aprenda com profissionais referência do setor moveleiro brasileiro.",
	alternates: { canonical: `${SITE_URL}/curso/mestre-marceneiro` },
	openGraph: {
		type: "website",
		title: "Curso Mestre Marceneiro",
		description:
			"Formação completa em marcenaria. Aprenda com profissionais referência do setor moveleiro brasileiro.",
		url: `${SITE_URL}/curso/mestre-marceneiro`,
		images: [{ url: `${SITE_URL}/assets/logo-moveis-de-valor.png` }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Curso Mestre Marceneiro",
		description:
			"Formação completa em marcenaria. Aprenda com profissionais referência do setor moveleiro brasileiro.",
	},
};

export default function MestreMarceneiroPage() {
	return <CourseMestre />;
}
