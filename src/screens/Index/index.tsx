"use client";

import AOS from 'aos';
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import 'aos/dist/aos.css';
import "./home.css";
import ImageLink from "../../components/Image/imageLink.tsx";
import Author from "../../components/Post/Author.tsx";
import Loading from "../../components/Loading/Loading.tsx";
import { api } from "../../api";
import HubAuthors from "../../components/HUB/HomeArticles.tsx";
import Banner from "../../components/Banner";
import MVTV from "./mvtv.tsx";
import Publication from "./publication.tsx";

type PostType = {
    post_id: number;
    title: string;
    slug: string;
    sub_title: string;
    autor_id: string;
    image: string;
};

type HomeData = {
    cat1: { posts: PostType[] };
    cat2: { posts: PostType[] };
    cat3: { posts: PostType[] };
    cat4: { posts: PostType[] };
    cat5: { posts: PostType[] };
    cat6: { posts: PostType[] };
    cat7: { posts: PostType[] };
    cat8: { posts: PostType[] };
};

type IndexProps = {
    initialData?: HomeData | null;
};

export function Index({ initialData = null }: IndexProps = {}) {

    const [homeData, setHomeData] = useState<HomeData | null>(initialData);
    const [loading, setLoading] = useState(initialData === null);
    const initialDataConsumed = useRef(initialData !== null);

    // ==========================
    // FETCH — uma única chamada (so se nao veio do server)
    // ==========================

    useEffect(() => {
        if (initialDataConsumed.current) return;

        api.get("/home")
            .then(res => setHomeData(res.data))
            .catch(err => console.error("Erro ao buscar home:", err))
            .finally(() => setLoading(false));
    }, []);

    // ==========================
    // AOS
    // ==========================

    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);

    // ==========================
    // CAROUSEL
    // ==========================

    useEffect(() => {
        if (!homeData?.cat1?.posts?.length) return;

        let disposed = false;
        let instance: { dispose: () => void } | null = null;

        (async () => {
            // @ts-expect-error sem types
            const { Carousel } = await import("bootstrap");
            if (disposed) return;
            const el = document.getElementById("homeCarousel");
            if (!el) return;
            instance = new Carousel(el, {
                interval: 5000,
                ride: "carousel",
                touch: true,
                pause: false,
                wrap: true,
            });
        })();

        return () => {
            disposed = true;
            instance?.dispose();
        };

    }, [homeData?.cat1]);

    useEffect(() => {
        if (!homeData?.cat1?.posts?.length) return;

        const carousel = document.getElementById("homeCarousel");
        if (!carousel) return;

        const handler = (e: any) => {
            document.querySelectorAll(".thumb-indicator").forEach(el =>
                el.classList.remove("thumb-active")
            );
            const active = document.querySelectorAll(".thumb-indicator")[e.to] as HTMLElement;
            active?.classList.add("thumb-active");

            document.querySelectorAll(".carousel-dots button").forEach(el =>
                el.classList.remove("active")
            );
            const activeDot = document.querySelectorAll(".carousel-dots button")[e.to] as HTMLElement;
            activeDot?.classList.add("active");
        };

        carousel.addEventListener("slid.bs.carousel", handler);
        return () => carousel.removeEventListener("slid.bs.carousel", handler);

    }, [homeData?.cat1]);

    // ==========================
    // LOADING
    // ==========================

    if (loading) return <Loading />;

    const cat1 = homeData?.cat1?.posts ?? [];
    const cat2 = homeData?.cat2?.posts ?? [];
    const cat3 = homeData?.cat3?.posts ?? [];
    const cat4 = homeData?.cat4?.posts ?? [];
    const cat5 = homeData?.cat5?.posts ?? [];
    const cat6 = homeData?.cat6?.posts ?? [];
    const cat7 = homeData?.cat7?.posts ?? [];
    const cat8 = homeData?.cat8?.posts ?? [];

    // ==========================
    // RENDER
    // ==========================

    return (
        <>
            <div className="section">
                <Banner size="top" />
            </div>

            <div className="section emphasis pt-0 p-50">
                <div className="container">
                    <div className="carousel-dots">
                        {cat1.map((item, index) => (
                            <button
                                key={item.post_id}
                                type="button"
                                data-bs-target="#homeCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div id="homeCarousel" className="carousel">
                        <div className="carousel-inner">
                            {cat1.map((item, index) => (
                                <div
                                    key={item.post_id}
                                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                                >
                                    <div className="row p-0">
                                        <div className="col-12 col-md-7 order-0 order-md-1 mb-3 position-relative">
                                            <div className="mask"></div>
                                            <Link href={`/${item.slug}`} className="text-decoration-none">
                                                <ImageLink image={item.image} legend={item.title} />
                                            </Link>
                                        </div>
                                        <div className="col-12 col-md-5 d-block align-content-center order-1 order-md-1 text">
                                            <Link href={`/${item.slug}`} className="text-decoration-none">
                                                <h1><strong>{item.title}</strong></h1>
                                            </Link>
                                            <div className="my-2 d-none">
                                                <Author authorId={item.autor_id} />
                                            </div>
                                            <Link href={`/${item.slug}`} className="mv-btn mt-2">
                                                Leia
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-12 mt-3 thumb-row-wrapper">
                        <div className="thumb-row">
                            {cat1.map((item, index) => (
                                <div className="thumb-col" key={item.slug}>
                                    <div className="d-flex">
                                        <h2 className="number">{index + 1}</h2>
                                        <Link
                                            href={`/${item.slug}`}
                                            className={`text-decoration-none w-100 thumb-indicator ${index === 0 ? "thumb-active" : ""}`}
                                        >
                                            <h5>{item.title}</h5>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            <div className="section partners hub-highlight p-50">
                <div className="container">
                    <div className="hub-highlight-header">
                        <a href="/hub" className="hub-highlight-label">Hub</a>
                        <span className="hub-highlight-subtitle">Artigos mais recentes</span>
                    </div>
                    <div className="row">
                        <HubAuthors limit={4} />
                    </div>
                </div>
            </div>

            {/* INDÚSTRIA */}
            <PostSection title="Indústria" posts={cat3} className="section business p-50" />

            <div className="section banner">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10" data-aos="fade-right">
                            <Banner size="full" slot={0}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMÉRCIO */}
            <PostSection title="Comércio" posts={cat2} />

            <MattressSection title="Colchões" posts={cat8} />

            <PostSection title="Artigos" posts={cat6} />

            <div className="section banner">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10" data-aos="fade-right">
                            <Banner size="full" slot={1}/>
                        </div>
                    </div>
                </div>
            </div>
            <Publication />

            <div className="section partners p-50">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 d-block align-content-center text-center" data-aos="fade-right">
                            <a href="/hub"><h2 className="mb-1"><strong>Hub de Inteligência Colaborativo</strong></h2></a>
                            <p className="mb-1">O setor moveleiro e colchoeiro brasileiro amadureceu em capacidade produtiva.</p>
                        </div>
                        <HubAuthors />
                    </div>
                </div>
            </div>

            <MVTV />
            <PostSection title="Design & Decoração" posts={cat7} className="section business p-50" />
            {/* COMÉRCIO 2 */}
            <PostSection title="ESG" posts={cat4} className="section business p-50" />

            <div className="section banner">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10" data-aos="fade-right">
                            <Banner size="full" slot={2}/>
                        </div>
                    </div>
                </div>
            </div>
            <PostSection title="Economia & Mercado" posts={cat5} className="section business p-50" />

        </>
    );
}

// ==========================
// COMPONENTE AUXILIAR
// evita repetir o mesmo bloco 3x
// ==========================

function PostSection({
                         title,
                         posts,
                         className = "section industry p-50"
                     }: {
    title: string;
    posts: PostType[];
    className?: string;
}) {
    return (
        <div className={className}>
            <div className="container">
                <div className="row">
                    <div className="col-12" data-aos="fade-right">
                        <h2 className="section-title mb-4"><strong>{title}</strong></h2>
                    </div>

                    {/* post destaque */}
                    <div className="col-12 col-md-4 col-lg-3 mb-4 mb-md-0">
                        {posts[0] && (
                            <Link href={`/${posts[0].slug}`} className="text-decoration-none post-featured">
                                <div data-aos="fade-right" data-aos-delay="200">
                                    <ImageLink image={posts[0].image} legend={posts[0].title} />
                                </div>
                                <h3 data-aos="fade-right" data-aos-delay="200" className="mt-3 mb-1 post-list-title-dest">
                                    {posts[0].title}
                                </h3>
                            </Link>
                        )}
                    </div>

                    {/* demais posts */}
                    <div className="col-12 col-md-8 col-lg-9">
                        <div className="row g-3">
                            {posts.slice(1).map((item) => (
                                <div className="col-12 col-sm-6 col-lg-4" key={item.post_id}>
                                    <Link href={`/${item.slug}`} className="text-decoration-none post-mini">
                                        <div className="post-mini-grid">
                                            <div className="post-mini-image" data-aos="fade-right" data-aos-delay="200">
                                                <ImageLink image={item.image} legend={item.title} />
                                            </div>
                                            <h3 data-aos="fade-right" data-aos-delay="200" className="post-list-title post-mini-title">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================
// SEÇÃO COLCHÕES
// 1 post grande + 6 pequenos
// ==========================

function MattressSection({
                              title,
                              posts,
                              className = "section industry p-50"
                          }: {
    title: string;
    posts: PostType[];
    className?: string;
}) {
    return (
        <div className={className}>
            <div className="container">
                <div className="row">
                    <div className="col-12" data-aos="fade-right">
                        <h2 className="section-title mb-4"><strong>{title}</strong></h2>
                    </div>

                    {/* post destaque */}
                    <div className="col-12 col-md-5 mb-4 mb-md-0">
                        {posts[0] && (
                            <Link href={`/${posts[0].slug}`} className="text-decoration-none post-featured">
                                <div data-aos="fade-right" data-aos-delay="200">
                                    <ImageLink image={posts[0].image} legend={posts[0].title} />
                                </div>
                                <h3 data-aos="fade-right" data-aos-delay="200" className="mt-3 mb-1 post-list-title-dest">
                                    {posts[0].title}
                                </h3>
                            </Link>
                        )}
                    </div>

                    {/* grid de posts pequenos */}
                    <div className="col-12 col-md-7">
                        <div className="row g-3">
                            {posts.slice(1, 7).map((item) => (
                                <div className="col-6 col-lg-4" key={item.post_id}>
                                    <Link href={`/${item.slug}`} className="text-decoration-none post-mini">
                                        <div className="post-mini-stack">
                                            <div data-aos="fade-right" data-aos-delay="200">
                                                <ImageLink image={item.image} legend={item.title} />
                                            </div>
                                            <h3 data-aos="fade-right" data-aos-delay="200" className="post-list-title post-mini-title mt-2">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
