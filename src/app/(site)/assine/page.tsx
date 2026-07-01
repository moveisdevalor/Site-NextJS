import type { Metadata } from "next";

import Subscribe from "@/screens/Subscribe";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Assine a Móveis de Valor",
	description:
		"Assine a Móveis de Valor e tenha acesso à publicação de referência do setor moveleiro brasileiro há 25 anos.",
	alternates: { canonical: `${SITE_URL}/assine` },
};

export default function AssinePage() {
	return <Subscribe />;
}
