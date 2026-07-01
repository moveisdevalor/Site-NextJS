import { useEffect, useState } from "react";
import { api } from "../../api";
import "../Post/authorPost.css";
import Image from "../Image/image.tsx";
import Html from "../Post/html.tsx";

type Author = {
    id: number;
    name: string;
    description: string;
    image_id?: number;
};

type AuthorCardProps = {
    authorId: string | number;
    type?: number; // 1 = autor | 0 = revisor
};

export default function AuthorCard({ authorId, type = 0 }: AuthorCardProps) {

    const [author, setAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (type !== 1) return;

        const fetchAuthor = async () => {
            if (!authorId) return;

            try {
                setLoading(true);
                const res = await api.get<Author>(`/author/${authorId}`);
                setAuthor(res.data);
            } catch (error) {
                console.error("Erro ao buscar autor:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [authorId, type]);

    useEffect(() => {
        if (type !== 1) return;
        if (!author?.image_id) return;
    }, [author?.image_id, type]);

    // agora sim: condição segura após hooks
    if (type !== 1) return null;

    if (!author) {
        return (
            <div className="author">
                <p className="icon-text">Autor não informado</p>
            </div>
        );
    }

    if (loading) {
        return <p className="icon-text">Carregando autor...</p>;
    }

    return (
        <div className="authorPost">
            <div className="">

                <div className="align-items-center d-none">
                        <div className="person-one-article">
                            <Image image_id={author.image_id} ratio="3/4" />
                        </div>
                </div>

                <div>
                    {/*<p className="icon-title p-0 m-0">Autor</p>*/}

                    <a href="/hub/especialista/teste">
                        <p className="icon-text p-0 m-0 mb-1">
                            {/*{author.name}*/}
                        </p>
                    </a>

                    <Html content={author.description} />
                </div>
            </div>
        </div>
    );
}
