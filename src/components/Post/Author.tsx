import { useEffect, useState } from "react";
import { api } from "../../api";
import "./author.css";

type Author = {
    id: number;
    name: string;
    description: string;
    image_id?: string;
};

type AuthorCardProps = {
    authorId: string | number;
    type?: number; // 🔹 Novo: define se mostra como autor ou revisor
};

export default function AuthorCard({ authorId, type = 0 }: AuthorCardProps) {
    const [author, setAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState<string>("");

    // 🔹 Buscar autor/revisor
    useEffect(() => {
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
    }, [authorId]);

    // 🔹 Buscar imagem do autor/revisor
    useEffect(() => {
        const fetchImage = async () => {
            if (!author?.image_id) return;

            try {
                const res = await api.get(`/image/${author.image_id}`);
                const data = res.data;

                if (data?.url) {
                    const baseURL = api.defaults.baseURL?.replace(/\/$/, "") || "";
                    const imagePath = data.url.replace(/^\//, "");
                    const fullUrl = `${baseURL}/${imagePath}`;
                    setPreview(fullUrl);
                } else {
                    setPreview("");
                }
            } catch (err) {
                console.error("Erro ao buscar imagem:", err);
            }
        };

        fetchImage();
    }, [author?.image_id]);

    if (!author) return <div className="author"></div>;
    if (loading) return <p className='icon-text'>Carregando {type === 1 ? "revisor" : "autor"}...</p>;


    return (
        <div className="author">
            <div className="d-flex align-items-center">
                <div
                    // style={style}
                    // className="img rounded-full overflow-hidden flex-shrink-0"
                />
                <div>
                    <p className="icon-title p-0 m-0">
                        {type === 0 ? "Revisado por" : "Autor"}
                    </p>
                    <a href="/hub/especialista/teste"><p className="icon-text p-0 m-0">{author.name}</p></a>
                </div>
            </div>
            {preview}
            <div className="d-flex align-items-center">
                {/*<LuFacebook />*/}
                {/*<LuInstagram />*/}
                {/*<LuLinkedin />*/}
            </div>
            {/*<p>{author.description}</p>*/}
        </div>
    );
}
