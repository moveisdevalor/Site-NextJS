import { useEffect, useState } from "react";
import { api } from "../../api";
// import Thumbanail from "../../components/Image/image.tsx";
import Thumbanail from "../../components/Image/imageZoom.tsx";
import "./author.css";

type AuthorType = {
    autor_id: number;
    name: string;
    email: string;
    position: string;
    slug: string;
    phone: string;
    cellphone: string;
    status: number;
    image_id: number;
};

export default function Authors() {
    const [authors, setAuthors] = useState<AuthorType[]>([]);
    const [loading, setLoading] = useState(true);

    // Carrega a lista de autores
    const loadAuthors = async () => {
        try {
            setLoading(true);
            const response = await api.get("/specialist"); // GET /authors
            setAuthors(response.data);
        } catch (err) {
            console.error("Erro ao carregar autores:", err);
            alert("Erro ao carregar autores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuthors();
    }, []);


    if (loading)
        return (
            <div className="text-center mt-4">
                <div className="spinner-border text-info" role="status"></div>
                <p>Carregando autores...</p>
            </div>
        );
    return (
        <div>
            <div className="row">
                {/*<div className="col-12 mb-5">*/}
                {/*    <h2 className="text-uppercase">Time de Especialistas</h2>*/}
                {/*    <h3 className="subtitle">Teste de subtitulo</h3>*/}
                {/*</div>*/}
                {authors.map((author) => (
                    <div
                        className="col-6 col-md-4 col-lg-3 col-xl-2 col-xxl-2 mb-3"
                        key={author.autor_id}
                    >
                        <div className="hub-authors">
                            <div className="m-2">
                                <a href={`/hub/${author.slug}`}>
                                    <div className="radius">
                                        <Thumbanail
                                            image_id={author.image_id}
                                            ratio="3/4"
                                            fit="cover"
                                        />
                                    </div>

                                    <div className="mb-2 mt-2">
                                        <h5 className="card-title">{author.name}</h5>
                                        <p className="card-text">{author.position}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
