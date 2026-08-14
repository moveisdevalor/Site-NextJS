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

type HubLatestPost = {
    post_id: number;
    title: string;
    slug: string | null;
    image_id: number | null;
    author_name: string | null;
    author_image_id: number | null;
};

type Item = {
    key: number;
    href: string;
    image_id: number | null | undefined;
    title: string;
    author: string;
};

export default function HomeArticles({ limit }: { limit?: number } = {}) {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                if (limit) {
                    // últimos artigos do hub, sempre por data de postagem
                    const response = await api.get(`/hub/latest?limit=${limit}`);
                    const posts: HubLatestPost[] = response.data;
                    setItems(posts.map((p) => ({
                        key: p.post_id,
                        href: p.slug ? `/${p.slug}` : "#",
                        image_id: p.author_image_id,
                        title: p.title,
                        author: p.author_name ?? "",
                    })));
                } else {
                    const response = await api.get("/specialist");
                    const authors: AuthorType[] = response.data;
                    setItems(
                        authors
                            .filter((a) => a.latest_post)
                            .map((a) => ({
                                key: a.autor_id,
                                href: a.latest_post!.slug ? `/${a.latest_post!.slug}` : `/hub/${a.slug}`,
                                image_id: a.image_id,
                                title: a.latest_post!.title,
                                author: a.name,
                            }))
                    );
                }
            } catch (err) {
                console.error("Erro ao carregar artigos do hub:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [limit]);

    if (loading) {
        return (
            <div className="text-center mt-4">
                <div className="spinner-border text-info" role="status"></div>
                <p>Carregando artigos...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="col-12 text-center">
                <p>Nenhum artigo encontrado.</p>
            </div>
        );
    }

    return (
        <div className="row hub-articles-list">
            {items.map((item) => (
                <div className="col-6 col-md-3 mb-4" key={item.key}>
                    <Link href={item.href} className="text-decoration-none hub-article-card">
                        <div className="hub-article-photo">
                            <Image image_id={item.image_id} ratio="1/1" />
                        </div>

                        <div className="hub-article-text">
                            <h3 className="post-list-title hub-article-title">
                                {item.title}
                            </h3>

                            <p className="hub-article-author">
                                {item.author}
                            </p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
