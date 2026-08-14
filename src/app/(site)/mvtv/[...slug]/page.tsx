import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MVTV from "@/screens/MVTV";
import {
	buildVideoPath,
	fetchVideos,
	pickVideo,
	type Video,
} from "@/lib/videos";

export const revalidate = 30;

const SITE_URL = "https://www.moveisdevalor.com.br";
const IMAGES_URL = "https://apiv2.moveisdevalor.com.br/images";

type RouteParams = { slug: string[] };

function parseSlug(slug: string[]) {
	if (slug.length === 1) {
		return { videoId: slug[0] };
	}
	if (slug.length >= 2) {
		return { programaSlug: slug[0], videoSlug: slug[1] };
	}
	return {};
}

function metaForVideo(video: Video | null): Metadata {
	if (!video) {
		return {
			title: "MVTV",
			alternates: { canonical: `${SITE_URL}/mvtv` },
		};
	}

	const canonical = `${SITE_URL}${buildVideoPath(video)}`;
	const ogImage = video.fn_imagem_id
		? `${IMAGES_URL}/${video.fn_imagem_id}`
		: undefined;

	return {
		title: video.fc_titulo,
		description:
			"Assista aos conteúdos exclusivos do MVTV no Móveis de Valor.",
		alternates: { canonical },
		openGraph: {
			type: "video.other",
			title: video.fc_titulo,
			description:
				"Assista aos conteúdos exclusivos do MVTV no Móveis de Valor.",
			url: canonical,
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
	};
}

export async function generateMetadata({
	params,
}: {
	params: Promise<RouteParams>;
}): Promise<Metadata> {
	const { slug } = await params;
	const videos = await fetchVideos();
	const selected = pickVideo(videos, parseSlug(slug));
	return metaForVideo(selected);
}

export default async function MVTVDeepPage({
	params,
}: {
	params: Promise<RouteParams>;
}) {
	const { slug } = await params;
	const videos = await fetchVideos();
	const selected = pickVideo(videos, parseSlug(slug));

	if (!selected) {
		notFound();
	}

	return <MVTV initialVideos={videos} initialSelectedVideo={selected} />;
}
