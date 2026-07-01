"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../api";
import Image from "../../components/Image/image.tsx";
import "./homeArticles.css";

type LatestPost = {
    post_id: number;
    title: string;
    sub_title: string;
    image_id: number | null;
    slug: string | null;
};

type AuthorType = {
    autor_id: number;
    name: string;
    position?: string;
    slug: string;
    image_id: number;
    latest_post: LatestPost | null;
};

export default function HomeArticles() {
    const [authors, setAuthors] = useState<AuthorType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await api.get("/specialist");
                setAuthors(response.data);
            } catch (err) {
                console.error("Erro ao carregar artigos do hub:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border text-info" role="status"></div>
                <p>Carregando artigos...</p>
            </div>
        );
    }

    const authorsWithPost = authors.filter((a) => a.latest_post);

    if (authorsWithPost.length === 0) {
        return (
            <div className="col-12 text-center">
                <p>Nenhum artigo encontrado.</p>
            </div>
        );
    }

    return (
        <div className="row hub-articles-list">
            {authorsWithPost.map((author) => {
                const post = author.latest_post!;

                return (
                    <div
                        className="col-6 col-md-4 col-lg-3 col-xl-2 mb-4"
                        key={author.autor_id}
                    >
                        <Link
                            href={post.slug ? `/${post.slug}` : `/hub/${author.slug}`}
                            className="text-decoration-none hub-article-card"
                        >
                            <div className="hub-article-photo">
                                <Image
                                    image_id={author.image_id}
                                    ratio="1/1"
                                />
                            </div>

                            <h3 className="post-list-title hub-article-title">
                                {post.title}
                            </h3>

                            <p className="hub-article-author">
                                {author.name}
                            </p>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
