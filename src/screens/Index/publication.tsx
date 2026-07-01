"use client";

import { api } from "../../api";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PostThumbnail from "../../components/Image/image.tsx";
import LoadingSkeleton from "../../components/Loading/LoadingSkeleton";
// import Banner from "../../components/Banner";
import { IoIosArrowForward } from "react-icons/io";
import AOS from "aos";

type PublicationType = {
    fn_revista_id: number;
    fc_status: string;
    fn_revista: number | string;
    fn_capa_id: number;
    fn_edicao: number;
    fd_cadastro: string;
    slug: string | null;
};

type ApiResponse = {
    data: PublicationType[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

const REVISTA_IDS = [1, 3, 6];


export default function Publications() {

    const [publications, setPublications] = useState<PublicationType[]>([]);
    const [loading, setLoading] = useState(true);

    // FETCH
    const getPublications = async () => {

        try {

            const responses = await Promise.all(

                REVISTA_IDS.map(id =>
                    api.get<ApiResponse>("/publications", {
                        params: {
                            fn_revista: id,
                            page: 1,
                            limit: 1
                        }
                    })
                )

            );

            const merged = responses.flatMap(res =>
                Array.isArray(res.data?.data)
                    ? res.data.data
                    : []
            );

            setPublications(merged);

        } catch (error) {

            console.error("Erro ao buscar publicações", error);
            setPublications([]);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getPublications();
        AOS.init({ duration: 1200 });

    }, []);

    // GROUP
    const groupedPublications = useMemo(() => {

        return REVISTA_IDS.reduce((acc, id) => {

            acc[id] = publications
                .filter(pub => Number(pub.fn_revista) === id)
                .sort((a, b) => b.fn_edicao - a.fn_edicao);

            return acc;

        }, {} as Record<number, PublicationType[]>);

    }, [publications]);

    // TOP CAPAS
    const topCovers = useMemo(() => {

        return REVISTA_IDS
            .map(id => groupedPublications[id]?.[0])
            .filter(Boolean);

    }, [groupedPublications]);

    // LOADING
    if (loading) return <LoadingSkeleton />;

    return (

        <div>

            {/* HERO */}
            <div className="section partners bg-light p-50">

                <div className="container">

                    <div className="row">

                        <div
                            className="col-lg-5 d-block align-content-center"
                            data-aos="fade-right"
                        >

                            <h2 className="mb-3">
                                <strong>Onde o setor moveleiro ganha voz há 25 anos</strong>.
                            </h2>
                            <p>A Móveis de Valor é mais que uma revista – é um hub de inteligência que conecta indústria, varejo e estratégia no setor moveleiro.</p>
                            <p>Traduz movimentos de mercado em decisão, antecipa tendências e dá voz a quem move a cadeia produtiva.</p>
                            <p>É onde o setor se informa, se posiciona e identifica caminhos para onde ir.</p>
                            <a href="/assine" className="btn m-3" data-aos="zoom-in" data-aos-delay="400">
                                Assine <IoIosArrowForward />
                            </a>
                            <a href="/anuncie" className="btn m-3" data-aos="zoom-in" data-aos-delay="400">
                                Anuncie <IoIosArrowForward />
                            </a>

                        </div>

                        {/* CAPAS TOPO */}
                        <div
                            className="col-lg-7 d-flex align-items-stretch justify-content-center magazine"
                            style={{ gap: 20 }}
                            data-aos="fade-right"
                        >
                            {topCovers.map(publication => (
                                <Link
                                    key={publication.fn_revista_id}
                                    href={`/${publication.slug ?? `publicacao/${publication.fn_revista_id}`}`}
                                    style={{ flex: 1 }}
                                >
                                    <PostThumbnail
                                        image_id={publication.fn_capa_id}
                                        ratio="3/4"
                                    />
                                </Link>
                            ))}
                        </div>

                    </div>

                </div>

            </div>
        </div>

    );

}
