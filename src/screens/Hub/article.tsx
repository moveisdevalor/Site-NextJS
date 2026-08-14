"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useParams,
    useRouter,
    useSearchParams,
} from "next/navigation";

import { api } from "../../api";

import Html from "../../components/Post/htmlArticle.tsx";
import Tags from "../../components/Post/Tags.tsx";
import AuthorArticle from "../../components/HUB/AuthorArticle.tsx";

import {
    parseISO,
    format,
} from "date-fns";

import { ptBR } from "date-fns/locale";

import Loading from "../../components/Loading/Loading.tsx";

import Banner from "../../components/Banner";
import HubLatest from "../../components/Post/HubLatest.tsx";
import Newsletter from "../../components/Newsletter";

import "./hub.css";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type CategoryType = {
    category_id: number;
    name: string;
    slug: string;
};

type PostType = {
    post_id: number;
    title: string;
    sub_title: string;
    content: string;
    status: string;
    event: string | null;
    player: number | null;
    midia: string | null;
    date_added: string;
    date_modified: string;
    date_scheduled: string;
    image_id: number | null;
    views: string;
    tags: string;
    autor_id?: string;
    slug: string;
    account_id?: string;
    categories?: CategoryType[];
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function formatScheduled(
    scheduledStr: string
) {

    if (!scheduledStr) {

        return {
            time: "",
            data: "",
        };
    }

    try {

        const parsed =
            parseISO(
                scheduledStr
            );

        return {

            time: format(
                parsed,
                "HH:mm"
            ),

            data: format(
                parsed,
                "d 'de' MMMM 'de' yyyy",
                {
                    locale: ptBR,
                }
            ),
        };

    } catch (error) {

        console.error(
            "[Date Format Error]",
            error
        );

        return {
            time: "",
            data: "",
        };
    }
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

type HubArticleProps = {
    initialPost?: PostType | null;
};

export default function PostEdit({
    initialPost = null,
}: HubArticleProps = {}) {

    const params = useParams<{ id?: string }>();
    const id = params?.id;

    const router = useRouter();

    const searchParams = useSearchParams();

    const preview =
        searchParams?.get(
            "preview"
        ) ?? null;

    /* ---------------------------------------------------------------------- */
    /* STATES                                                                 */
    /* ---------------------------------------------------------------------- */

    const [post, setPost] =
        useState<PostType | null>(
            initialPost
        );

    const [title, setTitle] =
        useState(initialPost?.title ?? "");

    const [
        subTitle,
        setSubTitle
    ] = useState(initialPost?.sub_title ?? "");

    const [content, setContent] =
        useState(initialPost?.content ?? "");

    const [status, setStatus] =
        useState(initialPost?.status ?? "1");

    const [
        scheduled,
        setScheduled
    ] = useState(initialPost?.date_scheduled ?? "");

    const [tags, setTags] =
        useState(initialPost?.tags ?? "");

    const [author, setAuthor] =
        useState(initialPost?.autor_id ?? "");

    const [authorSlug, setAuthorSlug] =
        useState("");

    const [event, setEvent] =
        useState("");

    const [player, setPlayer] =
        useState("");

    const [
        urlVideo,
        setUrlVideo
    ] = useState("");

    const [
        accountId,
        setAccountId
    ] = useState("");

    const [
        imageId,
        setImageId
    ] = useState(initialPost?.image_id?.toString() ?? "");

    const [
        initialImageId,
        setInitialImageId
    ] = useState(initialPost?.image_id?.toString() ?? "");

    const [
        errorMessage,
        setErrorMessage
    ] = useState("");

    /*
    evita warnings
    */

    void status;
    void event;
    void player;
    void urlVideo;
    void accountId;
    void imageId;
    void initialImageId;

    /* ---------------------------------------------------------------------- */
    /* FETCH POST                                                             */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {

        if (initialPost) {
            return;
        }

        if (!id) {
            return;
        }

        const getPost =
            async () => {

                try {

                    const res =
                        await api.get(
                            `/artigo/${id}${
                                preview
                                    ? `?preview=${preview}`
                                    : ""
                            }`
                        );

                    console.log(
                        "[Hub Post Response]",
                        res.data
                    );

                    const payload =
                        res.data;

                    /*
                    REDIRECT
                    */

                    if (
                        payload?.redirect
                    ) {

                        router.replace(
                            payload.to
                        );

                        return;
                    }

                    /*
                    NOVO FORMATO
                    */

                    let postData:
                        | PostType
                        | null = null;

                    if (
                        payload?.success ===
                        true &&
                        payload?.data
                    ) {

                        postData =
                            payload.data;
                    }

                    /*
                    FORMATO ANTIGO
                    */

                    else if (
                        payload?.post_id
                    ) {

                        postData =
                            payload;
                    }

                    /*
                    PAYLOAD INVÁLIDO
                    */

                    if (!postData) {

                        console.error(
                            "[Hub Post] Payload inválido",
                            payload
                        );

                        setErrorMessage(
                            "Conteúdo inválido ou indisponível."
                        );

                        return;
                    }

                    setPost(
                        postData
                    );

                    setTitle(
                        postData.title ??
                        ""
                    );

                    setSubTitle(
                        postData.sub_title ??
                        ""
                    );

                    setScheduled(
                        postData.date_scheduled ??
                        ""
                    );

                    setStatus(
                        postData.status ??
                        "1"
                    );

                    setPlayer(
                        postData.player != null
                            ? String(postData.player)
                            : ""
                    );

                    setUrlVideo(
                        postData.midia ??
                        ""
                    );

                    setEvent(
                        postData.event ??
                        ""
                    );

                    setAccountId(
                        postData.account_id ??
                        ""
                    );

                    setTags(
                        postData.tags ??
                        ""
                    );

                    setAuthor(
                        postData.autor_id ??
                        ""
                    );

                    setContent(
                        postData.content?.replace(
                            /http:\/\/localhost:5173\/images\//g,
                            "https://apiv2.moveisdevalor.com.br/upload/images/"
                        ) ?? ""
                    );

                    const imgId =
                        postData.image_id?.toString() ??
                        "";

                    setImageId(
                        imgId
                    );

                    setInitialImageId(
                        imgId
                    );

                } catch (error) {

                    console.error(
                        "[Hub Post Error]",
                        error
                    );

                    setErrorMessage(
                        "Erro ao buscar post."
                    );
                }
            };

        getPost();

    }, [
        id,
        router,
        preview,
        initialPost,
    ]);

    // =================================================================
    // VIEW TRACKING (client-side, igual pre-migracao)
    // =================================================================
    const viewTrackedRef = useRef<number | null>(null);

    useEffect(() => {
        if (preview) return;
        if (!post?.post_id) return;
        if (!post.slug) return;
        if (viewTrackedRef.current === post.post_id) return;

        viewTrackedRef.current = post.post_id;

        // Backend espera slug limpo (sem prefixo "artigo/" ou "noticia/")
        const slug = post.slug.replace(/^(artigo|noticia)\//, "");

        api.get(`/artigo/${slug}`).catch(() => {
            /* ignora */
        });
    }, [post?.post_id, post?.slug, preview]);

    useEffect(() => {
        if (!author) {
            setAuthorSlug("");
            return;
        }

        api.get(`/author/${author}`)
            .then((res) => {
                setAuthorSlug(res.data?.slug ?? "");
            })
            .catch(() => {
                setAuthorSlug("");
            });
    }, [author]);

    /* ---------------------------------------------------------------------- */
    /* LOADING                                                                */
    /* ---------------------------------------------------------------------- */

    if (errorMessage) {

        return (
            <div className="container mt-5 text-center">
                <h3>
                    {errorMessage}
                </h3>
            </div>
        );
    }

    if (!post) {
        return <Loading />;
    }

    /* ---------------------------------------------------------------------- */
    /* DERIVED                                                                */
    /* ---------------------------------------------------------------------- */

    const { data } =
        formatScheduled(
            scheduled
        );

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsArticle",
                        headline: post.title,
                        description: post.sub_title,
                        datePublished: post.date_added,
                        dateModified: post.date_modified || post.date_added,
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `https://www.moveisdevalor.com.br/${post.slug ?? id}`,
                        },
                        author: {
                            "@type": "Person",
                            name: "Autor do artigo",
                        },
                        publisher: {
                            "@type": "Organization",
                            name: "Móveis de Valor",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://www.moveisdevalor.com.br/logo.png",
                            },
                        },
                        image: post.image_id
                            ? `https://apiv2.moveisdevalor.com.br/images/${post.image_id}`
                            : "https://www.moveisdevalor.com.br/og-default.jpg",
                    }),
                }}
            />

            <div className="section h-100 pt-50">

                <div className="container">

                    <div className="row mb-5">

                        <div className="col-10 col-md-8 text-center m-auto">

                            <div className="d-block justify-content-end align-items-center">

                                <AuthorArticle
                                    authorId={
                                        author
                                    }
                                    type={1}
                                />

                            </div>

                            <h1 className="font-outfit article-title mb-1">
                                {title}
                            </h1>

                            <h2 className="font-outfit article-subtitle mb-2">
                                {subTitle}
                            </h2>

                            <div className="article-date mb-4">
                                <p>
                                    {data}
                                </p>
                            </div>

                            <Html
                                content={
                                    content
                                }
                            />

                            <div className="d-none">

                                <Tags
                                    initialTags={
                                        tags
                                    }
                                />

                            </div>

                            {authorSlug && (
                                <a
                                    href={`/hub/${authorSlug}`}
                                    className="hub-btn"
                                >
                                    Veja mais artigos deste autor
                                </a>
                            )}

                        </div>

                        <div className="col-12 col-md-3 offset-md-1 px-3">

                            <div className="sticky">

                                <div className="d-none d-md-block">
                                    <Banner size="side" />
                                </div>

                                <div className="d-none d-md-block">
                                    <HubLatest />
                                </div>

                                <div className="mt-4 mb-5">
                                    <Newsletter />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}