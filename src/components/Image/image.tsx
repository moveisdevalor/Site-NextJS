"use client";

import NextImage from "next/image";
import { useEffect, useState } from "react";
import { api } from "../../api";
import "./image.css";

type ImageSize = "sm" | "md" | "lg" | "xl";

type ImageProps = {
    image_id?: number | null;
    url?: string;
    legend?: string;
    size?: ImageSize;
    width?: string | number;
    ratio?: string;
    fit?: "cover" | "contain";
    showLegend?: boolean; // NOVO controle de exibição
    alt?: string;
    // sizes do <img> responsivo. Ajuste por uso (avatar vs capa) pra o
    // browser baixar a variante certa. Default cobre card/coluna.
    sizes?: string;
    // Imagem LCP (destaque acima da dobra): desliga lazy-load e faz preload.
    priority?: boolean;
};

const FALLBACK = "https://arktus.com.br/images/image-404.png";

export default function Image({
                                  image_id,
                                  url,
                                  legend: initialLegend,
                                  ratio = "16/10",
                                  fit = "cover",
                                  showLegend = false, // default: não mostrar
                                  alt,
                                  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px",
                                  priority = false,
                              }: ImageProps) {
    const [preview, setPreview] = useState<string>(url || "");
    const [legend, setLegend] = useState<string>(initialLegend || "");

    useEffect(() => {
        // Se a URL ja veio resolvida (server-side), nao re-fetcha;
        // apenas sincroniza quando as props mudam (ex.: galeria).
        if (url) {
            setPreview(url);
            setLegend(initialLegend || "");
            return;
        }

        const fetchImage = async () => {
            if (!image_id) return;

            try {
                const res = await api.get(`/image/${image_id}`);
                const data = res.data;

                if (data?.url) {
                    const baseURL = api.defaults.baseURL?.replace(/\/$/, "") || "";
                    const imagePath = data.url.replace(/^\//, "");

                    setPreview(`${baseURL}/${imagePath}`);
                    setLegend(data.legend || "");
                }
            } catch {
                setPreview("");
            }
        };

        fetchImage();
    }, [image_id, url, initialLegend]);

    return (
        <figure style={{ width: "100%" }}>
            <div
                className="image-wrapper"
                style={{ aspectRatio: ratio, position: "relative", width: "100%" }}
            >
                {preview ? (
                    // next/image gera srcset/WebP e faz lazy-load automatico.
                    <NextImage
                        src={preview}
                        alt={legend || alt || "Moveis de valor"}
                        fill
                        sizes={sizes}
                        priority={priority}
                        style={{ objectFit: fit }}
                    />
                ) : (
                    <img
                        src={FALLBACK}
                        alt={alt || "Moveis de valor"}
                        style={{ width: "100%", height: "100%", objectFit: fit }}
                    />
                )}
            </div>

            {showLegend && legend && (
                <figcaption className="post-legend">
                    {legend}
                </figcaption>
            )}
        </figure>
    );
}
