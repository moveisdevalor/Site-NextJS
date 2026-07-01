import type { Metadata } from "next";

import Advertise from "@/screens/Advertise";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "Anuncie na Móveis de Valor",
	description:
		"Conecte sua marca à decisão de compra do varejo moveleiro brasileiro. Conheça as soluções de mídia da Móveis de Valor.",
	alternates: { canonical: `${SITE_URL}/anuncie` },
};

export default function AnunciePage() {
	return <Advertise />;
}
