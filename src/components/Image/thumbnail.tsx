import { useEffect, useState } from "react";
import { api } from "../../api";
import "./image.css";

type ImageProps = {
    image_id?: number;
    url?: string;
    legend?: string;
    width?: string | number;
    height?: string | number;
    fit?: "cover" | "contain"; // controla o object-fit
};

export default function Image({
                                  image_id,
                                  url,
                                  width = "100%",
                                  height = "auto",
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
                    const fullUrl = `${baseURL}/${imagePath}`;
                    setLegend(data.legend || "");

                    setPreview(fullUrl);
                } else {
                    setPreview("");
                }
            } catch (err) {
                console.error("Erro ao buscar imagem:", err);
                setPreview("");
            }
        };

        fetchImage();
    }, [image_id]);

    if (!preview) {
        return (
            <img
                src="https://arktus.com.br/images/image-404.png"
                alt="Imagem não encontrada"
                style={{ width, height, objectFit: fit }}
            />
        );
    }

    return (
        <figure className="image-zoom" style={{ maxWidth: width }}>
            <img
                src={preview}
                alt={legend || "Imagem"}
                className="image-zoom-img"
                style={{
                    width,
                    height,
                    objectFit: fit,
                }}
            />
        </figure>
    );
}
