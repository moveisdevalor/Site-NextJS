import "./image.css";

type ImageProps = {
    image?: string | null;
    legend?: string;
    ratio?: string;
    fit?: "cover" | "contain";
};

export default function Image({
                                  image,
                                  legend,
                                  ratio = "16/10",
                                  fit = "cover",
                              }: ImageProps) {

    const fallback = "https://arktus.com.br/images/image-404.png";

    return (
        <figure style={{ width: "100%" }}>
            <div
                className="image-wrapper"
                style={{ aspectRatio: ratio }}
            >
                <img
                    src={image || fallback}
                    alt={legend || "Imagem"}
                    style={{ objectFit: fit }}
                />
            </div>

            {/* {legend && <figcaption className="post-legend">{legend}</figcaption>} */}
        </figure>
    );
}