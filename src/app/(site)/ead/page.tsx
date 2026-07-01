import type { Metadata } from "next";

import Course from "@/screens/Course";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "EAD Móveis de Valor",
	description:
		"Educação a distância para profissionais do setor moveleiro.",
	alternates: { canonical: `${SITE_URL}/ead` },
};

export default function EadPage() {
	return <Course />;
}
