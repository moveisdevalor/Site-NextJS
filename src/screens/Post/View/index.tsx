"use client";

import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useParams,
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    parseISO,
    format
} from "date-fns";

import { ptBR } from "date-fns/locale";

import { LuClock } from "react-icons/lu";

import { api } from "../../../api";

import Image from "../../../components/Image/image";
import Html from "../../../components/Post/html.tsx";
import Banner from "../../../components/Banner";
import Tags from "../../../components/Post/Tags.tsx";
import Categories from "../../../components/Post/Category.tsx";
import RelatedPosts from "../../../components/Post/RelatedPosts.tsx";
import Social from "../../../components/Post/Social.tsx";
import Author from "../../../components/Post/AuthorPost.tsx";
import Newsletter from "../../../components/Newsletter";
import Comments from "../../../components/Post/Comments.tsx";
import Search from "../../../components/Post/Search.tsx";
import Loading from "../../../components/Loading/Loading.tsx";
import NotFound from "../../404/NotFound.tsx";

import "./preview.css";

// =====================================================================
// TYPES
// =====================================================================

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
    slug: string;
    autor_id?: string;
    account_id?: string;
    categories?: CategoryType[];
};

// =====================================================================
// HELPERS
// =====================================================================

function extractYoutubeId(
    url: string
) {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/
    );

    return match?.[1] ?? url;
}

function extractVimeoId(
    url: string
) {
    const match =
        url.match(
            /vimeo\.com\/(\d+)/
        );

    return (
        match?.[1] ?? url
    );
}

function formatScheduledDate(
    scheduledStr: string
) {

    if (!scheduledStr) {
        return {
            time: "",
            date: "",
        };
    }

    const parsed =
        parseISO(
            scheduledStr
        );

    return {
        time: format(
            parsed,
            "HH:mm"
        ),

        date: format(
            parsed,
            "d 'de' MMMM 'de' yyyy",
            {
                locale: ptBR,
            }
        ),
    };
}

// =====================================================================
// COMPONENT
// =====================================================================

type PostViewProps = {
    initialPost?: PostType | null;
    initialAuthorName?: string;
    // URL/legenda da imagem destaque ja resolvidas no servidor,
    // pra imagem sair no HTML inicial (LCP / indexacao).
    initialImage?: { url: string; legend: string } | null;
};

export default function PostEdit({
    initialPost = null,
    initialImage = null,
}: PostViewProps = {}) {

    const params = useParams<{ id: string }>();
    const id = params?.id;

    const router = useRouter();

    const searchParams = useSearchParams();

    const preview =
        searchParams?.get(
            "preview"
        ) ?? null;

    // =================================================================
    // STATES
    // =================================================================

    const [post, setPost] =
        useState<PostType | null>(
            initialPost
        );

    const [searchInput, setSearchInput] = useState("");

    const handleSearch = () => {
        const value = searchInput.trim();
        if (!value) return;
        router.push(`/noticias?q=${encodeURIComponent(value)}`);
    };

    const [title, setTitle] =
        useState(initialPost?.title ?? "");

    const [
        subTitle,
        setSubTitle
    ] = useState(initialPost?.sub_title ?? "");

    const [content, setContent] =
        useState(initialPost?.content ?? "");

    const [
        scheduled,
        setScheduled
    ] = useState(initialPost?.date_scheduled ?? "");

    const [tags, setTags] =
        useState(initialPost?.tags ?? "");

    const [author, setAuthor] =
        useState(initialPost?.autor_id ?? "");

    const [player, setPlayer] =
        useState<
            number | null
        >(initialPost?.player ?? null);

    const [
        urlVideo,
        setUrlVideo
    ] = useState<
        string | null
    >(initialPost?.midia ?? null);

    const [
        errorMessage,
        setErrorMessage
    ] = useState("");

    const [
        selected,
        setSelected
    ] = useState<
        number | null
    >(null);

    const [gallery, setGallery] =
        useState<any[]>([]);

    // =================================================================
    // FETCH POST
    // =================================================================

    useEffect(() => {

        // Se ja recebemos o post via prop (server component), nao re-fetcha.
        if (initialPost) {
            return;
        }

        if (!id) {
            return;
        }

        async function getPost() {

            try {

                const res =
                    await api.get(
                        `/noticia/${id}${
                            preview
                                ? `?preview=${preview}`
                                : ""
                        }`
                    );

                console.log(
                    "[Post Response]",
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

                    // preserva query string (source, email, utm_*) no redirect
                    const currentSearch =
                        typeof window !== "undefined"
                            ? window.location.search
                            : "";

                    router.replace(
                        `${payload.to}${currentSearch}`
                    );

                    return;
                }

                /*
                NOVO FORMATO
                */

                if (
                    payload?.success ===
                    true
                ) {

                    const data: PostType =
                        payload.data;

                    if (!data) {

                        setErrorMessage(
                            "Post inválido."
                        );

                        return;
                    }

                    setPost(
                        data
                    );

                    setTitle(
                        data.title ??
                        ""
                    );

                    setSubTitle(
                        data.sub_title ??
                        ""
                    );

                    setScheduled(
                        data.date_scheduled ??
                        ""
                    );

                    setPlayer(
                        data.player ??
                        null
                    );

                    setUrlVideo(
                        data.midia ??
                        null
                    );

                    setTags(
                        data.tags ??
                        ""
                    );

                    setAuthor(
                        data.autor_id ??
                        ""
                    );

                    setContent(
                        data.content?.replace(
                            /http:\/\/localhost:5173\/images\//g,
                            "https://apiv2.moveisdevalor.com.br/upload/images/"
                        ) ?? ""
                    );

                    return;
                }

                /*
                FORMATO ANTIGO
                */

                if (
                    payload?.post_id
                ) {

                    const data: PostType =
                        payload;

                    setPost(
                        data
                    );

                    setTitle(
                        data.title ??
                        ""
                    );

                    setSubTitle(
                        data.sub_title ??
                        ""
                    );

                    setScheduled(
                        data.date_scheduled ??
                        ""
                    );

                    setPlayer(
                        data.player ??
                        null
                    );

                    setUrlVideo(
                        data.midia ??
                        null
                    );

                    setTags(
                        data.tags ??
                        ""
                    );

                    setAuthor(
                        data.autor_id ??
                        ""
                    );

                    setContent(
                        data.content?.replace(
                            /http:\/\/localhost:5173\/images\//g,
                            "https://apiv2.moveisdevalor.com.br/upload/images/"
                        ) ?? ""
                    );

                    return;
                }

                /*
                ERRO
                */

                console.error(
                    "[Post] Payload inválido",
                    payload
                );

                setErrorMessage(
                    payload?.message ||
                    "O conteúdo solicitado não existe ou foi removido."
                );

            } catch (error) {

                console.error(
                    "[Post Error]",
                    error
                );

                setErrorMessage(
                    "O conteúdo solicitado não existe ou foi removido."
                );
            }
        }

        getPost();

    }, [
        id,
        router,
        preview,
        initialPost,
    ]);

    // =================================================================
    // VIEW TRACKING (client-side, igual ao comportamento original
    // pre-migracao). Backend conta 1 view por chamada deste endpoint
    // a partir do browser do usuario.
    // =================================================================
    const viewTrackedRef = useRef<number | null>(null);

    useEffect(() => {
        if (preview) return;
        if (!post?.post_id) return;
        if (!post.slug) return;
        if (viewTrackedRef.current === post.post_id) return;

        viewTrackedRef.current = post.post_id;

        // Backend espera SLUG limpo (sem o prefixo "noticia/").
        const slug = post.slug.replace(/^noticia\//, "");

        // Chamada direto no backend (sem cache do Next).
        // Resposta descartada — interessa o side-effect de incremento de view.
        api.get(`/noticia/${slug}`).catch(() => {
            /* ignora */
        });
    }, [post?.post_id, post?.slug, preview]);

    // =================================================================
    // AUDIOME
    // =================================================================

    useEffect(() => {

        if (!post) {
            return;
        }

        const isSecure =
            window.location.protocol ===
            "https:" ||
            window.location.hostname ===
            "localhost";

        if (!isSecure) {

            console.warn(
                "[AudioMe] Ambiente inseguro"
            );

            return;
        }

        const scriptId =
            "audiome-script";

        if (
            document.getElementById(
                scriptId
            )
        ) {
            return;
        }

        try {

            const script =
                document.createElement(
                    "script"
                );

            script.id =
                scriptId;

            script.src =
                "https://readme.ai/files/moveisdevalor.js";

            script.async =
                true;

            script.onload =
                () => {
                    console.log(
                        "[AudioMe] carregado"
                    );
                };

            script.onerror =
                (
                    error
                ) => {
                    console.error(
                        "[AudioMe] erro",
                        error
                    );
                };

            document.body.appendChild(
                script
            );

            return () => {

                try {
                    script.remove();
                } catch (
                    error
                    ) {
                    console.error(
                        error
                    );
                }
            };

        } catch (error) {

            console.error(
                "[AudioMe]",
                error
            );
        }

    }, [post]);

    // =================================================================
    // FETCH AUTHOR NAME (para SEO)
    // =================================================================

    // Author name agora vem do server (metadata). Sem fetch no client.

    // =================================================================
    // GALLERY
    // =================================================================

    useEffect(() => {

        if (
            !post?.post_id
        ) {
            return;
        }

        api
            .get(
                `/post/${post.post_id}/gallery`
            )
            .then((res) =>
                setGallery(
                    res.data
                )
            )
            .catch(
                console.error
            );

    }, [post?.post_id]);

    // =================================================================
    // LOADING / ERROR
    // =================================================================

    if (errorMessage) {

        return (
            <NotFound
                title="Notícia não encontrada"
                message={errorMessage}
            />
        );
    }

    if (!post) {
        return <Loading />;
    }

    // =================================================================
    // DERIVED
    // =================================================================

    const featuredImageId =
        gallery.find(
            (
                img
            ) =>
                img.featured ===
                1
        )?.image
            ?.image_id ??
        post?.image_id ??
        null;

    const galleryImages =
        gallery
            .filter(
                (
                    img
                ) =>
                    img.image
                        ?.image_id !==
                    featuredImageId
            )
            .map(
                (
                    img
                ) =>
                    img.image
                        .image_id
            );

    const mainImageId =
        selected ??
        featuredImageId;

    const activeCategorySlug =
        post.categories?.[0]?.slug?.replace(
            "categoria/",
            ""
        ) ?? "";

    const {
        date,
        time
    } =
        formatScheduledDate(
            scheduled
        );

    // =================================================================
    // RENDER
    // =================================================================

    return (
        <>

            <div className="container post mt-4">

                <div className="row">

                    <div className="col-12 col-md-9">

                        <header className="post-header mt-4 mb-3">
                            <div className="post-meta">
                                <div className="time d-none">
                                    <LuClock />
                                    <p>{time}</p>
                                </div>

                                <div className="date">
                                    <p className="m-0">{date}</p>
                                </div>
                            </div>
                            {/*{post.categories?.[0]?.name && (*/}
                            {/*    <p className="post-category">*/}
                            {/*        {post.categories[0].name}*/}
                            {/*    </p>*/}
                            {/*)}*/}

                            <h1 className="post-headline">
                                {title}
                            </h1>

                            {subTitle && (
                                <h3 className="post-subhead">
                                    {subTitle}
                                </h3>
                            )}

                        </header>

                        <div className="col-12 mt-4 mb-3">

                            {urlVideo &&
                                player ===
                                1 && (
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src={`https://www.youtube-nocookie.com/embed/${extractYoutubeId(urlVideo)}`}
                                            title="YouTube player"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                            {urlVideo &&
                                player ===
                                2 && (
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src={`https://player.vimeo.com/video/${extractVimeoId(urlVideo)}`}
                                            title="Vimeo player"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                            {!urlVideo &&
                                mainImageId && (
                                    <>

                                        <Image
                                            image_id={
                                                mainImageId
                                            }
                                            // URL resolvida no servidor: so vale pra
                                            // imagem original do post (nao pra galeria).
                                            url={
                                                mainImageId === initialPost?.image_id
                                                    ? initialImage?.url
                                                    : undefined
                                            }
                                            legend={
                                                mainImageId === initialPost?.image_id
                                                    ? initialImage?.legend
                                                    : undefined
                                            }
                                            ratio="10/6"
                                            fit="cover"
                                            showLegend
                                            alt={title}
                                            priority
                                        />

                                        {galleryImages.length >
                                            0 && (
                                                <div className="post-gallery">

                                                    {galleryImages.map(
                                                        (
                                                            imageId
                                                        ) => (
                                                            <div
                                                                key={
                                                                    imageId
                                                                }
                                                                className="post-gallery-item"
                                                                onClick={() =>
                                                                    setSelected(
                                                                        imageId
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor:
                                                                        "pointer",
                                                                }}
                                                            >
                                                                <Image
                                                                    image_id={
                                                                        imageId
                                                                    }
                                                                    ratio="3/2"
                                                                    fit="cover"
                                                                    alt={title}
                                                                />
                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                    </>
                                )}

                        </div>

                        <div className="row">

                            <div className="col-12 col-md-1 mt-3">
                                <Social />
                            </div>

                            <div className="col-12 col-md-10 mt-2">

                                <div id="audiome-container"></div>

                                <Html
                                    content={
                                        content
                                    }
                                />

                                <Tags
                                    initialTags={
                                        tags
                                    }
                                />

                                <div className="d-flex justify-content-end mb-4">

                                    <Author
                                        authorId={
                                            author
                                        }
                                    />

                                </div>

                                <Comments
                                    postId={
                                        post.post_id
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    <div className="col-12 col-md-3 px-3">

                        <div className="sticky">

                            <div className="post-sidebar-search">
                                <Search
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onSubmit={handleSearch}
                                />
                            </div>

                            <div className="d-none d-md-block">
                                <Banner size="side" />
                            </div>

                            <RelatedPosts
                                postId={
                                    post.post_id
                                }
                            />

                            <div className="d-none d-md-block">

                                <Categories
                                    activeSlug={
                                        activeCategorySlug
                                    }
                                />

                            </div>

                            <div className="mt-4 mb-5">
                                <Newsletter />
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}