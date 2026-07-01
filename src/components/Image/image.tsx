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
};

export default function Image({
                                  image_id,
                                  url,
                                  ratio = "16/10",
                                  fit = "cover",
                                  showLegend = false, // default: não mostrar
                                  alt,
                              }: ImageProps) {
    const [preview, setPreview] = useState<string>(url || "");
    const [legend, setLegend] = useState<string>("");

    useEffect(() => {
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
    }, [image_id]);

    return (
        <figure style={{ width: "100%" }}>
            <div
                className="image-wrapper"
                style={{ aspectRatio: ratio }}
            >
                <img
                    src={preview || "https://arktus.com.br/images/image-404.png"}
                    alt={legend || alt || "Moveis de valor"}
                    style={{ objectFit: fit }}
                />
            </div>

            {showLegend && legend && (
                <figcaption className="post-legend">
                    {legend}
                </figcaption>
            )}
        </figure>
    );
}
