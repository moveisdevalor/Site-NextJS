// /portal e' alias legado de /. Mesmo conteudo, canonical para /.
import type { Metadata } from "next";

import { Index } from "@/screens/Index";
import { fetchHomeData } from "@/lib/home";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	title: { absolute: "Móveis de Valor" },
	alternates: { canonical: SITE_URL },
};

export default async function PortalHomePage() {
	const homeData = await fetchHomeData();
	return <Index initialData={homeData} />;
}
