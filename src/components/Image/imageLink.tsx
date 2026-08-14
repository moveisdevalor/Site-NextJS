import NextImage from "next/image";
import "./image.css";

type ImageProps = {
    image?: string | null;
    legend?: string;
    ratio?: string;
    fit?: "cover" | "contain";
    // sizes do card. Cards da home ocupam ~1/3 no desktop e 100% no mobile.
    sizes?: string;
};

const FALLBACK = "https://arktus.com.br/images/image-404.png";

export default function Image({
                                  image,
                                  legend,
                                  ratio = "16/10",
                                  fit = "cover",
                                  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px",
                              }: ImageProps) {

    return (
        <figure style={{ width: "100%" }}>
            <div
                className="image-wrapper"
                style={{ aspectRatio: ratio, position: "relative", width: "100%" }}
            >
                {image ? (
                    // next/image gera srcset/WebP e faz lazy-load automatico.
                    <NextImage
                        src={image}
                        alt={legend || "Imagem"}
                        fill
                        sizes={sizes}
                        style={{ objectFit: fit }}
                    />
                ) : (
                    <img
                        src={FALLBACK}
                        alt={legend || "Imagem"}
                        style={{ width: "100%", height: "100%", objectFit: fit }}
                    />
                )}
            </div>

            {/* {legend && <figcaption className="post-legend">{legend}</figcaption>} */}
        </figure>
    );
}
