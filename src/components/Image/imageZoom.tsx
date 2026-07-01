import { useEffect, useState } from "react";
import { api } from "../../api";
import "./image.css";

type ImageSize = "sm" | "md" | "lg" | "xl";

type ImageProps = {
    image_id?: number;
    url?: string;
    legend?: string;
    size?: ImageSize;     // tamanho pré-definido
    width?: string | number; // override opcional
    ratio?: string;       // ex: "16/9", "1/1"
    fit?: "cover" | "contain";
};

export default function Image({
                                  image_id,
                                  url,
                                  ratio = "16/10",
                                  fit = "cover",
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

    // const finalWidth = width ?? SIZE_PRESETS[size];

    return (
        <figure style={{ width: "100%" }}>
            <div
                className="image-wrapper image-zoom"
                style={{ aspectRatio: ratio }}
            >
                <img
                    src={preview || "https://arktus.com.br/images/image-404.png"}
                    alt={legend || "Imagem"}
                    style={{ objectFit: fit }}
                />
            </div>

            {/*{legend && <figcaption className="post-legend">{legend}</figcaption>}*/}
        </figure>
    );
}

