import type { Metadata } from "next";

import CourseRegister from "@/screens/Course/register";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Inscrição em Cursos",
	description:
		"Cadastre-se nos cursos do setor moveleiro oferecidos pela Móveis de Valor.",
	alternates: { canonical: `${SITE_URL}/curso/cadastro` },
	robots: { index: false, follow: true },
};

export default function CursoCadastroPage() {
	return <CourseRegister />;
}
