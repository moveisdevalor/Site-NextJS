"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress
} from "@mui/material";
import Link from "next/link";
import { api } from "../../api";
import ImageLink from "../../components/Image/imageLink.tsx";

type RelatedPost = {
    post_id: number;
    title: string;
    sub_title?: string;
    slug: string | null;
    image?: string | null;
    views: number;
};

type Props = {
    postId: number;
    limit?: number;
};

export default function RelatedPosts({ postId, limit = 6 }: Props) {

    const [posts, setPosts] = useState<RelatedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!postId) return;

        let mounted = true;

        async function fetchRelated() {
            try {

                setLoading(true);

                const response = await api.get(
                    `/posts/${postId}/related`
                );

                if (!mounted) return;

                setPosts(response.data.slice(0, limit));

            } catch (err) {

                console.error("Erro ao carregar relacionados:", err);

            } finally {

                if (mounted) setLoading(false);

            }
        }

        fetchRelated();

        return () => {
            mounted = false;
        };

    }, [postId, limit]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={26} />
            </Box>
        );
    }

    if (!posts.length) return null;

    return (
        <Box mt={4}>

            <Typography
                variant="h6"
                fontWeight={600}
                mb={2}
            >
                Notícias relacionadas
            </Typography>

            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(260px, 1fr))"
                gap={2}
            >
                {posts.map(post => (

                    <>
                        <div className="col-12 col-md-12 mb-1" key={post.post_id}>
                            <Link href={`/${post.slug}?source=related`} className="text-decoration-none">
                                <div className="row">
                                    <div className="col-5">
                                        <ImageLink image={post.image} legend={post.title} />

                                    </div>
                                    <div className="col-7 m-0 p-0">
                                        <h4 className="post-list-title">
                                            {post.title}
                                        </h4>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </>


                ))}
            </Box>

        </Box>
    );
}
