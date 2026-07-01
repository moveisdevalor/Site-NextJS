import { useEffect, useState } from "react";
import { api } from "../../api"; // sua instância axios
import Thumbanail from "../../components/Image/thumbnail.tsx";
import "./author.css";

type AuthorType = {
    autor_id: number;
    name: string;
    email: string;
    description: string;
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
            const response = await api.get("/authors"); // GET /authors
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
            <div className="row mt-3 justify-content-center">
                {authors.map((author) => (

                    <div className="col-6 col-md-4 col-lg-3 col-xl-2 col-xxl-2 mb-3" key={author.autor_id}>
                        <div className="card h-100 rounded-4">
                            <div className="m-2">
                                <div className="image-author overflow-hidden position-relative">
                                    <Thumbanail	image_id={author.image_id} height={180}/>
                                </div>

                                <div className="mb-2 mt-2">
                                    <h5 className="card-title">{author.name}</h5>
                                    {/*<p className="card-text">{author.email}</p>*/}
                                    <p className="card-text">{author.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
