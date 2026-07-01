"use client";

import Link from "next/link";
import { LuSearchX, LuHouse } from "react-icons/lu";

import "./notFound.css";

type Props = {
    title?: string;
    message?: string;
    hideSeo?: boolean;
};

export default function NotFound({
    title = "Conteúdo não encontrado",
    message = "A página ou notícia que você procura não existe, foi removida ou o endereço está incorreto.",
}: Props) {
    return (
        <div className="not-found">
            <div className="not-found-icon">
                <LuSearchX />
            </div>

            <h1 className="title">404</h1>
            <h2 className="subtitle">{title}</h2>
            <p className="message">{message}</p>

            <div className="not-found-actions">
                <Link href="/" className="btn-home">
                    <LuHouse />
                    <span>Voltar ao início</span>
                </Link>

                <Link href="/noticias" className="btn-news">
                    Ver notícias
                </Link>
            </div>
        </div>
    );
}
