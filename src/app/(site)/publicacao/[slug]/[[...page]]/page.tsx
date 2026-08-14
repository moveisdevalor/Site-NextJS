import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import PublicationView from "@/screens/Publication/view";
import {
	fetchPublicationBySlug,
	getRevistaTipo,
} from "@/lib/publications";

export const revalidate = 60;

const SITE_URL = "https://www.moveisdevalor.com.br";
const IMAGES_URL = "https://apiv2.moveisdevalor.com.br/images";

type RouteParams = { slug: string; page?: string[] };

export async function generateMetadata({
	params,
}: {
	params: Promise<RouteParams>;
}): Promise<Metadata> {
	const { slug } = await params;
	const result = await fetchPublicationBySlug(slug);

	if (result.kind !== "publication") {
		return {
			title: "Publicação não encontrada",
			robots: { index: false, follow: false },
		};
	}

	const pub = result.publication;
	const revista = getRevistaTipo(pub.fn_revista);
	const title = `${revista} - Edição ${pub.fn_edicao}`;
	const canonical = `${SITE_URL}/${pub.slug ?? `publicacao/${pub.fn_revista_id}`}`;
	const ogImage = `${IMAGES_URL}/${pub.fn_capa_id}`;

	return {
		title,
		description: `Leia a edição ${pub.fn_edicao} da ${revista} no Móveis de Valor.`,
		alternates: { canonical },
		openGraph: {
			type: "article",
			title,
			description: `Edição ${pub.fn_edicao} da ${revista}.`,
			url: canonical,
			images: [{ url: ogImage }],
			publishedTime: pub.fd_cadastro,
		},
	};
}

export default async function PublicacaoPage({
	params,
}: {
	params: Promise<RouteParams>;
}) {
	const { slug, page } = await params;
	const pageNum = page?.[0];

	const result = await fetchPublicationBySlug(slug);

	if (result.kind === "redirect") redirect(result.to);
	if (result.kind === "notfound") notFound();

	return (
		<PublicationView
			initialPublication={result.publication}
			initialRelated={result.related}
			initialPage={pageNum}
		/>
	);
}
