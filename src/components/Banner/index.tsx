import { useEffect, useMemo, useRef, useState } from "react";
import "./banner.css";

// ==========================
// TYPES
// ==========================

type BlockSize = "side" | "full" | "top" | "sponsor";

interface BannerProps {
    size: BlockSize;
    category?: number;
    /**
     * Slot da instância na página (0, 1, 2...).
     * Garante que dois <Banner size="full" slot={0} /> e <Banner size="full" slot={1} />
     * sempre mostrem banners diferentes.
     * Se não passado, usa um contador automático por type.
     */
    slot?: number;
}

interface BannerImage {
    image_id: number;
    name: string;
}

interface BannerData {
    banner_id: number;
    link?: string;
    new_tab?: string;
    content?: string;
    image_id?: number;
    company_id?: number | null;
    image?: BannerImage;
}

// ==========================
// CONFIG
// ==========================

const SIZE_CONFIG: Record<BlockSize, { type: number; take: number; className: string }> = {
    top:     { type: 7,  take: 10, className: "banner-top" },
    full:    { type: 1,  take: 10, className: "banner-full" },
    side:    { type: 3,  take: 10, className: "banner-lateral" },
    sponsor: { type: 8, take: 10, className: "banner-patrocinador" },
};

// ==========================
// CACHE GLOBAL — imutável após carregado
// ==========================

const bannerCache: Record<number, BannerData[]> = {};
const loadingCache: Record<number, Promise<BannerData[]>> = {};
const autoSlotCounter: Record<number, number> = {};
// empresas já exibidas na página (entre todos os tipos de banner)
const usedCompanies = new Set<number>();

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function resolveImageUrl(banner: BannerData, api: string): string | null {
    if (banner.image) {
        return `${api}/upload/images/${banner.image.image_id}/${banner.image.name}`;
    }
    if (banner.image_id) {
        return `${api}/upload/images/${banner.image_id}`;
    }
    return null;
}

async function fetchBanners(
    type: number,
    take: number,
    category: number | undefined,
    apiUrl: string
): Promise<BannerData[]> {
    if (!loadingCache[type]) {
        const params = new URLSearchParams({ take: String(take) });
        if (category) params.append("category", String(category));

        loadingCache[type] = fetch(`${apiUrl}/public/banner/type/${type}?${params}`)
            .then(res => res.json())
            .then((data: BannerData | BannerData[]) => {
                const banners = Array.isArray(data) ? data : [data];
                const unique = Array.from(
                    new Map(banners.map(b => [b.banner_id, b])).values()
                );
                return shuffle(unique);
            })
            .catch(err => {
                delete loadingCache[type];
                throw err;
            });
    }
    return loadingCache[type];
}

// ==========================
// COMPONENT
// ==========================

export default function Banner({ size, category, slot }: BannerProps) {

    const [banner, setBanner] = useState<BannerData | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
    const config = useMemo(() => SIZE_CONFIG[size], [size]);

    // define o slot desta instância UMA vez na montagem
    const mySlot = useRef<number>(-1);
    if (mySlot.current === -1) {
        if (slot !== undefined) {
            mySlot.current = slot;
        } else {
            autoSlotCounter[config.type] = (autoSlotCounter[config.type] ?? 0);
            mySlot.current = autoSlotCounter[config.type]++;
        }
    }

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        let claimed: number | null = null;
        const load = async () => {
            try {
                if (!bannerCache[config.type]?.length) {
                    const banners = await fetchBanners(config.type, config.take, category, API_URL);
                    bannerCache[config.type] = banners;
                }

                const list = bannerCache[config.type];
                if (!list.length || !mountedRef.current) return;

                // a partir do slot, pega o primeiro banner de empresa ainda não exibida na página
                for (let i = 0; i < list.length; i++) {
                    const b = list[(mySlot.current + i) % list.length];
                    if (b.company_id && usedCompanies.has(b.company_id)) continue;
                    if (b.company_id) {
                        usedCompanies.add(b.company_id);
                        claimed = b.company_id;
                    }
                    setBanner(b);
                    return;
                }

            } catch (err) {
                console.error("Erro ao carregar banner:", err);
            }
        };

        load();
        return () => { if (claimed) usedCompanies.delete(claimed); };
    }, [config.type, category, API_URL]);

    if (!banner) return null;

    const imageUrl = resolveImageUrl(banner, API_URL);
    const clickUrl = `${API_URL}/public/banner/click/${banner.banner_id}`;

    const registerView = (id: number) => {
        fetch(`${API_URL}/public/banner/view/${id}`).catch(() => {});
    };

    return (
        <div className={config.className}>
            {banner.content?.trim() ? (
                <iframe
                    srcDoc={banner.content || ""}
                    title="banner"
                    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
                    scrolling="no"
                    loading="lazy"
                    onLoad={() => registerView(banner.banner_id)}
                    style={{ border: 0, width: "100%", maxWidth: 728, height: 90, display: "block", margin: "0 auto" }}
                />
            ) : imageUrl ? (
                <a
                    href={clickUrl}
                    target={banner.new_tab === "S" ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                >
                    <img
                        src={imageUrl}
                        alt="banner"
                        loading="lazy"
                        onLoad={() => registerView(banner.banner_id)}
                    />
                </a>
            ) : null}
        </div>
    );
}
