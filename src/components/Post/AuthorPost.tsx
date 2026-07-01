import { useEffect, useState } from "react";
import { api } from "../../api";
import "./authorPost.css";

type Author = {
    id: number;
    name: string;
    description: string;
    image_id?: string;
};

type AuthorCardProps = {
    authorId: string | number;
    type?: number; // 1 = autor | 0 = revisor
};

export default function AuthorCard({ authorId, type = 0 }: AuthorCardProps) {

    const [author, setAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState<string>("");

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

        const fetchImage = async () => {
            try {
                const res = await api.get(`/image/${author.image_id}`);
                const data = res.data;

                if (data?.url) {
                    const baseURL = api.defaults.baseURL?.replace(/\/$/, "") || "";
                    const imagePath = data.url.replace(/^\//, "");
                    setPreview(`${baseURL}/${imagePath}`);
                } else {
                    setPreview("");
                }
            } catch (err) {
                console.error("Erro ao buscar imagem:", err);
            }
        };

        fetchImage();
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

    const style = {
        backgroundImage: preview ? `url(${preview})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        aspectRatio: "1 / 1",
    };

    return (
        <div className="authorPost">
            <div className="d-flex align-items-center">
                <div className="align-items-center">
                    <div
                        style={style}
                        className="img rounded-full overflow-hidden flex-shrink-0"
                    />
                </div>

                <div>
                    <p className="icon-title p-0 m-0">Autor</p>

                    <a href="/hub/especialista/teste">
                        <p className="icon-text p-0 m-0 mb-1">
                            {author.name}
                        </p>
                    </a>

                    <p>{author.description}</p>
                </div>
            </div>
        </div>
    );
}
