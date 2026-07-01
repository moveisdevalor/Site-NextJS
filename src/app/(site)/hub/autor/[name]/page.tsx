import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HubSpecialist from "@/screens/Hub/specialist";
import { fetchAuthorWithPosts } from "@/lib/authors";

export const revalidate = 600;

const SITE_URL = "https://www.moveisdevalor.com.br";
const IMAGES_URL = "https://apiv2.moveisdevalor.com.br/images";

type RouteParams = { name: string };

export async function generateMetadata({
	params,
}: {
	params: Promise<RouteParams>;
}): Promise<Metadata> {
	const { name } = await params;
	const { author } = await fetchAuthorWithPosts(name);

	if (!author) {
		return {
			title: "Especialista não encontrado",
			robots: { index: false, follow: false },
		};
	}

	const canonical = `${SITE_URL}/hub/autor/${author.slug ?? name}`;
	const ogImage = author.image_id ? `${IMAGES_URL}/${author.image_id}` : undefined;

	return {
		title: author.name,
		description:
			author.specialty ||
			`Conheça ${author.name}, especialista do setor moveleiro.`,
		alternates: { canonical },
		openGraph: {
			type: "profile",
			title: author.name,
			description:
				author.specialty ||
				`Conheça ${author.name}, especialista do setor moveleiro.`,
			url: canonical,
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
	};
}

export default async function HubSpecialistPage({
	params,
}: {
	params: Promise<RouteParams>;
}) {
	const { name } = await params;
	const { author, posts } = await fetchAuthorWithPosts(name);

	if (!author) notFound();

	return <HubSpecialist initialAuthor={author} initialPosts={posts} />;
}
