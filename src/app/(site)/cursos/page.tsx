import type { Metadata } from "next";

import Course from "@/screens/Course";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Cursos Móveis de Valor",
	description:
		"Cursos especializados para profissionais do setor moveleiro: formação técnica, gestão e atualização de mercado.",
	alternates: { canonical: `${SITE_URL}/cursos` },
};

export default function CursosPage() {
	return <Course />;
}
