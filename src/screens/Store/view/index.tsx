"use client";

import { api } from "../../../api";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

import PostThumbnail from "../../../components/Image/image";
import LoadingSkeleton from "../../../components/Loading/LoadingSkeleton";
import PixModal from "./PixModal";
import type { Product } from "@/lib/products";
import { formatPrice, getPriceLabel } from "@/lib/products";
import { parsePriceToAmount } from "@/lib/pix";
import "./index.css";

const WHATSAPP_PHONE = "5541999129877";

function buildBoletoWhatsappLink(productName: string): string {
	const text = `Olá! Vim pelo site e gostaria de pagar via boleto o produto "${productName}".`;
	return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

type ProductViewProps = {
	initialProduct?: Product | null;
};

export default function ProductPage({
	initialProduct = null,
}: ProductViewProps = {}) {
	const params = useParams<{ slug?: string }>();
	const slug = params?.slug;

	const [current, setCurrent] = useState<Product | null>(initialProduct);
	const [loading, setLoading] = useState(initialProduct === null);
	const [activeImage, setActiveImage] = useState(0);
	const [showPixModal, setShowPixModal] = useState(false);
	const initialConsumed = useRef(initialProduct !== null);

	const fetchData = useCallback(async () => {
		if (!slug) return;

		setLoading(true);
		try {
			const { data } = await api.get<Product>(`/loja/${slug}`);
			setCurrent(data);
			setActiveImage(0);
		} catch (error) {
			console.error("Erro ao carregar produto:", error);
			setCurrent(null);
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		if (initialConsumed.current) {
			initialConsumed.current = false;
			return;
		}
		fetchData();
	}, [fetchData]);

	// ==================================================================
	// CLICK TRACKING — registra a visita em ecommerce_product.click
	// (usa o id numérico do produto carregado, não o slug da URL)
	// ==================================================================
	const clickTrackedRef = useRef<string | null>(null);

	useEffect(() => {
		if (!current?.id) return;
		if (clickTrackedRef.current === current.id) return;

		clickTrackedRef.current = current.id;

		api.post(`/product/${current.id}/click`).catch(() => {
			/* ignora */
		});
	}, [current?.id]);

	if (loading) return <LoadingSkeleton />;

	if (!current) return <div className="container mt-5">Produto não encontrado</div>;

	const priceLabel = getPriceLabel(current.value, current.stock);
	const images = current.images?.length ? current.images : [Number(current.image_id) || 0];
	const soldOut = current.stock <= 0;
	const isFree = formatPrice(current.value) === null;
	const hidePaymentActions = isFree || soldOut;
	const isCourse = current.category_name?.toLowerCase().includes("curso") ?? false;

	return (
		<div className="container product-page mt-5">
			<Link href="/loja" className="product-back">
				<LuArrowLeft /> Voltar para a loja
			</Link>

			<div className="row">
				<div className="col-lg-5 mb-4">
					<PostThumbnail image_id={images[activeImage] || null} ratio="1/1" />

					{images.length > 1 && (
						<div className="product-gallery">
							{images.map((imageId, index) => (
								<button
									key={`${imageId}-${index}`}
									type="button"
									className={`product-gallery-thumb ${index === activeImage ? "active" : ""}`}
									onClick={() => setActiveImage(index)}
								>
									<PostThumbnail image_id={imageId || null} ratio="1/1" />
								</button>
							))}
						</div>
					)}
				</div>

				<div className="col-lg-7">
					<h1 className="product-title">{current.name}</h1>

					<p className={`product-price${soldOut ? " product-price-soldout" : ""}`}>{priceLabel}</p>

					<div
						className="product-description"
						dangerouslySetInnerHTML={{ __html: current.description }}
					/>

					{soldOut && (
						<p className="product-sold-out-notice">
							Produto sem estoque no momento.
						</p>
					)}

					{hidePaymentActions && isCourse && (
						<div className="product-payment-actions">
							<a
								href="http://10.0.4.120:3000/curso/cadastro"
								className="mv-btn"
							>
								Inscrever-se no curso
							</a>
						</div>
					)}

					{!hidePaymentActions && (
						<div className="product-payment-actions">
							<button
								type="button"
								className="mv-btn"
								onClick={() => setShowPixModal(true)}
							>
								Pagar com Pix
							</button>

							<a
								href={buildBoletoWhatsappLink(current.name)}
								target="_blank"
								rel="noopener noreferrer"
								className="mv-btn-outline"
							>
								Pagar com Boleto
							</a>
						</div>
					)}

					{current.button && (
						<a
							href={current.button}
							target="_blank"
							rel="noopener noreferrer"
							className="product-external-link"
						>
							Comprar
						</a>
					)}
				</div>
			</div>

			{showPixModal && (
				<PixModal
					productId={Number(current.id)}
					productName={current.name}
					amount={parsePriceToAmount(current.value)}
					onClose={() => setShowPixModal(false)}
				/>
			)}
		</div>
	);
}
