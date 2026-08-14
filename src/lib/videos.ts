// =====================================================================
// Server-side helpers para MVTV (videos).
// =====================================================================

import { apiGetOrNull } from "./api-server";

export type Video = {
	fn_video_id: number;
	fc_titulo: string;
	fc_link: string;
	fc_servidor?: string;
	fn_imagem_id?: number;
	fn_visitas?: number;
	fd_publicacao?: string;
	slug?: string | null;
};

const VIDEOS_REVALIDATE = 30;

export async function fetchVideos(): Promise<Video[]> {
	const res = await apiGetOrNull<{ videos?: Video[] } | Video[]>(
		"/videos?status=1&fn_programa_id=29&limit=12",
		{ revalidate: VIDEOS_REVALIDATE, tags: ["videos"] },
	);
	if (!res) return [];
	if (Array.isArray(res)) return res;
	return res.videos ?? [];
}

export function pickVideo(
	videos: Video[],
	opts: {
		videoId?: string;
		programaSlug?: string;
		videoSlug?: string;
	},
): Video | null {
	if (videos.length === 0) return null;

	const { videoId, programaSlug, videoSlug } = opts;

	if (programaSlug && videoSlug) {
		const fullSlug = `mvtv/${programaSlug}/${videoSlug}`;
		const found = videos.find((v) => v.slug === fullSlug);
		if (found) return found;
	}

	if (videoId) {
		const found = videos.find((v) => String(v.fn_video_id) === videoId);
		if (found) return found;
	}

	return videos[0];
}

export function buildVideoPath(video: Video): string {
	return video.slug ? `/${video.slug}` : `/mvtv/${video.fn_video_id}`;
}
