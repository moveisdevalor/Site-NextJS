import type { Metadata } from "next";

import CourseMestre from "@/screens/Course/mestre-marceneiro";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Curso Mestre Marceneiro",
	description:
		"Formação completa em marcenaria. Aprenda com profissionais referência do setor moveleiro brasileiro.",
	alternates: { canonical: `${SITE_URL}/curso/mestre-marceneiro` },
};

export default function MestreMarceneiroPage() {
	return <CourseMestre />;
}
