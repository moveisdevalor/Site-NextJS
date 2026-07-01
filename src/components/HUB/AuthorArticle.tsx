import { useEffect, useState } from "react";
import { api } from "../../api";
import "../Post/authorPost.css";
import "./author.css";
import Image from "../Image/image.tsx";
import {LuMail, LuPhone} from "react-icons/lu";

type Author = {
    id: number;
    name: string;
    description: string;
    phone: string;
    email: string;
    slug: string;
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

    const normalizePhone = (phone?: string) => {
        if (!phone) return null;

        // remove tudo que não for número
        const digits = phone.replace(/\D/g, "");

        // garante prefixo Brasil se não existir
        if (!digits.startsWith("55")) {
            return `55${digits}`;
        }

        return digits;
    };

    const whatsappLink = (phone?: string) => {
        const normalized = normalizePhone(phone);
        return normalized ? `https://wa.me/${normalized}` : null;
    };

    const emailLink = (email?: string) => {
        return email ? `mailto:${email}` : null;
    };

    // agora sim: condição segura após hooks
    if (type !== 1) return null;

    if (!author) {
        return (
            <div className="author">
                <p className="icon-text">...</p>
            </div>
        );
    }

    if (loading) {
        return <p className="icon-text">Carregando autor...</p>;
    }

    return (
        <div className="authorPost">
            <div className="">

                <div className="align-items-center m-auto w-25">
                        <div className="person-article">
                            <a href={`/hub/${author.slug}`}> <Image image_id={author.image_id} ratio="1/1" /></a>
                        </div>
                </div>

                <div>
                    {/*<p className="icon-title p-0 m-0">Autor</p>*/}

                    <a href={`/hub/${author.slug}`}>
                        <p className="icon-text p-0 m-0 mb-1">
                            {author.name}
                        </p>
                        <div className="mt-1">
                            <p>
                                {author.email && (
                                    <>
                                    <a href={emailLink(author.email)!}>
                                        <LuMail /> {author.email}
                                    </a>
                                    <br />
                                    </>
                                )}
                                {author.phone && (
                                    <>
                                        <a
                                            href={whatsappLink(author.phone)!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <LuPhone /> {author.phone}
                                        </a>
                                    </>
                                )}


                            </p>
                        </div>
                    </a>

                    {/*<p>{author.description}</p>*/}
                </div>
            </div>
        </div>
    );
}
