import type { Metadata } from "next";

import MVTV from "@/screens/MVTV";
import { fetchVideos, pickVideo } from "@/lib/videos";

export const revalidate = 30;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: "MVTV",
	description:
		"MVTV — conteúdo audiovisual exclusivo do setor moveleiro. Entrevistas, bastidores e análises com quem move o mercado.",
	alternates: { canonical: `${SITE_URL}/mvtv` },
	openGraph: {
		type: "website",
		title: "MVTV — Móveis de Valor",
		description:
			"Conteúdo audiovisual exclusivo do setor moveleiro.",
		url: `${SITE_URL}/mvtv`,
	},
};

export default async function MVTVPage() {
	const videos = await fetchVideos();
	const selected = pickVideo(videos, {});
	return <MVTV initialVideos={videos} initialSelectedVideo={selected} />;
}
