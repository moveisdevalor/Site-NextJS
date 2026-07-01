import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../../api";
import { useAnalytics } from "../../hooks/trackEvent";
import Image from "../../components/Image/image.tsx";

type VideoType = {
    fn_video_id: number;
    fc_titulo: string;
    fc_link: string;
    fc_servidor?: string;
    fn_imagem_id?: number;
    fn_visitas?: number;
    fd_publicacao?: string;
};

export default function VideoSection() {
    const [videos, setVideos] = useState<VideoType[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
    const [loading, setLoading] = useState(false);
    const { track } = useAnalytics();
    const isFirstRender = useRef(true);
    const playerRef = useRef<HTMLDivElement>(null);
    const playTrackedRef = useRef<number | null>(null);

    const loadVideos = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await api.get(
                "/videos?status=1&fn_programa_id=29&limit=4"
            );

            const list = data?.videos ?? data ?? [];
            const safeList = Array.isArray(list) ? list : [];

            setVideos(safeList);

            if (safeList.length > 0) {
                setSelectedVideo(safeList[0]);
            }
        } catch (error) {
            console.error(error);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!selectedVideo) return;
        track({
            event_type: "video_view",
            event_name: `/mvtv/${selectedVideo.fn_video_id}`,
            meta: { video_id: selectedVideo.fn_video_id, title: selectedVideo.fc_titulo },
        });
    }, [selectedVideo]);

    // incrementa fn_visitas
    useEffect(() => {
        if (selectedVideo?.fn_video_id) {
            api.get(`/video/${selectedVideo.fn_video_id}`).catch(() => {});
            playTrackedRef.current = null;
        }
    }, [selectedVideo?.fn_video_id]);

    // detecta clique no player → incrementa fn_plays
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
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1`}
                    title={video.fc_titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: "0" }}
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
            <div className="section home-mvtv p-5">
                <div className="container">
                    <div className="text-center">
                        <p>Carregando vídeos...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedVideo) {
        return null;
    }

    return (
        <div className="section home-mvtv p-5">
            <div className="container">

                <header className="home-mvtv-header">
                    <h2 className="home-mvtv-title">MVTV</h2>
                </header>

                <div className="row">

                    {/* PLAYER PRINCIPAL */}
                    <div className="col-12 col-lg-9 mb-3">
                        <div className="home-mvtv-featured">
                            <div className="ratio ratio-16x9 home-mvtv-featured-player" ref={playerRef}>
                                {renderPlayer(selectedVideo)}
                            </div>
                            <h3 className="home-mvtv-featured-title">
                                {selectedVideo.fc_titulo}
                            </h3>
                        </div>
                    </div>

                    {/* SIDEBAR DE VÍDEOS */}
                    <div className="col-12 col-lg-3 mb-3">
                        <ul className="home-mvtv-list">
                            {videos.map((video) => {
                                const isActive = selectedVideo.fn_video_id === video.fn_video_id;
                                return (
                                    <li
                                        key={video.fn_video_id}
                                        className={`home-mvtv-list-item ${isActive ? "is-active" : ""}`}
                                        onClick={() => setSelectedVideo(video)}
                                    >
                                        <div className="home-mvtv-list-thumb">
                                            <Image image_id={video.fn_imagem_id} ratio="16/9" />
                                        </div>
                                        <h4 className="home-mvtv-list-title">{video.fc_titulo}</h4>
                                    </li>
                                );
                            })}
                        </ul>

                        <a href="/mvtv" className="mv-btn-outline home-mvtv-cta">
                            Ver mais vídeos
                        </a>
                    </div>

                </div>

            </div>
        </div>
    );
}
