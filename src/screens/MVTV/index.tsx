"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "../../api";
import { useRouter } from "next/navigation";
import { IoEyeOutline } from "react-icons/io5";
import { BsCalendarDate, BsPlayFill } from "react-icons/bs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Banner from "../../components/Banner";
import Image from "../../components/Image/image.tsx";
import "./mvtv.css";

type VideoType = {
    fn_video_id: number;
    fc_titulo: string;
    fc_link: string;
    fc_servidor?: string;
    fn_imagem_id?: number;
    fn_visitas?: number;
    fd_publicacao?: string;
    slug?: string | null;
};

const buildVideoPath = (video: VideoType): string => {
    return video.slug
        ? `/${video.slug}`
        : `/mvtv/${video.fn_video_id}`;
};

type MVTVProps = {
    initialVideos?: VideoType[];
    initialSelectedVideo?: VideoType | null;
};

export default function VideoSection({
    initialVideos,
    initialSelectedVideo = null,
}: MVTVProps = {}) {
    const [videos, setVideos] = useState<VideoType[]>(initialVideos ?? []);
    const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(
        initialSelectedVideo,
    );
    const [loading, setLoading] = useState(initialVideos === undefined);

    const router = useRouter();

    const playerRef = useRef<HTMLDivElement>(null);
    const playTrackedRef = useRef<number | null>(null);

    const loadVideos = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await api.get(
                "/videos?status=1&fn_programa_id=29&limit=12"
            );

            const list = data?.videos ?? data ?? [];
            const safeList: VideoType[] = Array.isArray(list) ? list : [];

            setVideos(safeList);

            if (safeList.length > 0 && !selectedVideo) {
                setSelectedVideo(safeList[0]);
            }
        } catch (error) {
            console.error(error);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }, [selectedVideo]);

    useEffect(() => {
        // Se ja recebemos os videos do server, nao re-fetcha
        if (initialVideos !== undefined) return;
        loadVideos();
    }, [loadVideos, initialVideos]);

    // dispara o incremento de visitas sempre que um vídeo é selecionado
    useEffect(() => {
        if (selectedVideo?.fn_video_id) {
            api.get(`/video/${selectedVideo.fn_video_id}`).catch(() => {});
            // reseta o tracker de play pro novo vídeo
            playTrackedRef.current = null;
        }
    }, [selectedVideo?.fn_video_id]);

    // detecta clique no player (iframe rouba o foco da janela)
    useEffect(() => {
        const handleBlur = () => {
            window.setTimeout(() => {
                const videoIdSelected = selectedVideo?.fn_video_id;
                if (!videoIdSelected) return;
                if (playTrackedRef.current === videoIdSelected) return;

                const iframe = playerRef.current?.querySelector("iframe");
                if (iframe && document.activeElement === iframe) {
                    playTrackedRef.current = videoIdSelected;
                    api.post(`/video/${videoIdSelected}/play`).catch(() => {});
                }
            }, 100);
        };

        window.addEventListener("blur", handleBlur);
        return () => window.removeEventListener("blur", handleBlur);
    }, [selectedVideo?.fn_video_id]);

    const handleSelectVideo = (video: VideoType) => {
        setSelectedVideo(video);
        router.push(buildVideoPath(video));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatDate = (date?: string) => {
        if (!date) return "-";
        const parsed = new Date(date);
        return isNaN(parsed.getTime())
            ? "-"
            : format(parsed, "dd MMM yyyy", { locale: ptBR });
    };

    const extractYoutubeId = (url: string) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regex);
        return match ? match[1] : url;
    };

    const extractVimeoId = (url: string) => {
        const regex = /vimeo\.com\/(\d+)/;
        const match = url.match(regex);
        return match ? match[1] : url;
    };

    const renderPlayer = (video: VideoType) => {
        if (!video.fc_link) return null;

        if (video.fc_servidor === "Y") {
            const videoId = extractYoutubeId(video.fc_link);
            return (
                <iframe
                    key={video.fn_video_id}
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title={video.fc_titulo}
                    allowFullScreen
                />
            );
        }

        if (video.fc_servidor === "V") {
            const videoId = extractVimeoId(video.fc_link);
            return (
                <iframe
                    key={video.fn_video_id}
                    src={`https://player.vimeo.com/video/${videoId}`}
                    title={video.fc_titulo}
                    allowFullScreen
                />
            );
        }

        return null;
    };

    if (loading) {
        return (
            <section className="mvtv-page container py-5">
                <header className="mvtv-skeleton-header">
                    <div className="mvtv-skeleton-shimmer mvtv-skeleton-header-title" />
                    <div className="mvtv-skeleton-shimmer mvtv-skeleton-header-bar" />
                </header>

                <div className="row">
                    <div className="col-lg-9 mb-4">
                        <div className="mvtv-skeleton-featured">
                            <div className="mvtv-skeleton-shimmer mvtv-skeleton-featured-player" />
                            <div className="mvtv-skeleton-shimmer mvtv-skeleton-featured-title" />
                        </div>
                    </div>
                    <div className="col-lg-3 mb-4 d-none d-md-block">
                        <div className="mvtv-skeleton-shimmer mvtv-skeleton-sponsor-label" />
                        <div className="mvtv-skeleton-shimmer mvtv-skeleton-sponsor" />
                    </div>
                </div>

                <div className="mvtv-skeleton-shimmer mvtv-skeleton-section-title" />

                <div className="mvtv-skeleton-grid">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="mvtv-skeleton-card">
                            <div className="mvtv-skeleton-shimmer mvtv-skeleton-card-thumb" />
                            <div className="mvtv-skeleton-card-body">
                                <div className="mvtv-skeleton-shimmer mvtv-skeleton-card-title" />
                                <div className="mvtv-skeleton-shimmer mvtv-skeleton-card-title-sm" />
                                <div className="mvtv-skeleton-shimmer mvtv-skeleton-card-meta" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!selectedVideo) {
        return (
            <section className="mvtv-page container py-5">
                <div className="mvtv-empty">
                    <p>Nenhum vídeo disponível.</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="mvtv-page container py-5">

                <header className="mvtv-header">
                    <h1>MVTV</h1>
                    {/*<p>*/}
                    {/*    Conteúdo audiovisual exclusivo do setor moveleiro.*/}
                    {/*    Entrevistas, bastidores e análises com quem move o mercado.*/}
                    {/*</p>*/}
                </header>

                <div className="row">

                    {/* PLAYER PRINCIPAL */}
                    <div className="col-lg-9 mb-4">
                        <div className="mvtv-featured">
                            <div className="mvtv-featured-body">

                                <div className="mvtv-featured-meta d-none">
                                    <span>
                                        <IoEyeOutline />
                                        {selectedVideo.fn_visitas ?? 0}
                                    </span>
                                    <span>
                                        <BsCalendarDate />
                                        {formatDate(selectedVideo.fd_publicacao)}
                                    </span>
                                </div>
                            </div>
                            <div className="mvtv-featured-player" ref={playerRef}>
                                {renderPlayer(selectedVideo)}
                            </div>
                            <h2 className="mvtv-featured-title mt-2">{selectedVideo.fc_titulo}</h2>
                        </div>
                    </div>

                    <div className="col-lg-3 mb-4 d-none d-md-block">
                        <p><strong>Patrocinador</strong></p>
                        <div className="d-none d-md-block">
                            <div className="banner-lateral">
                                <Banner size="sponsor" />
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="mvtv-section-title">10 Minutos com Ari</h3>

                <div className="mvtv-grid">
                    {videos.map((video) => {
                        const isActive = selectedVideo.fn_video_id === video.fn_video_id;
                        return (
                            <article
                                key={video.fn_video_id}
                                className={`mvtv-card ${isActive ? "mvtv-card-active" : ""}`}
                                onClick={() => handleSelectVideo(video)}
                            >
                                <div className="mvtv-card-thumb">
                                    <Image image_id={video.fn_imagem_id} />
                                    {isActive && <span className="mvtv-card-tag">Assistindo</span>}
                                    <div className="mvtv-card-play">
                                        <span className="mvtv-card-play-icon">
                                            <BsPlayFill size={22} />
                                        </span>
                                    </div>
                                </div>

                                <div className="mvtv-card-body">
                                    <h4 className="mvtv-card-title">{video.fc_titulo}</h4>
                                    <div className="mvtv-card-meta d-none">
                                        <span>
                                            <IoEyeOutline />
                                            {video.fn_visitas ?? 0}
                                        </span>
                                        <span>
                                            <BsCalendarDate />
                                            {formatDate(video.fd_publicacao)}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

            </section>
        </>
    );
}
