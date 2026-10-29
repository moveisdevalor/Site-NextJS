"use client";

import { api } from "../../api";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

import PostThumbnail from "../../components/Image/image";
import LoadingSkeleton from "../../components/Loading/LoadingSkeleton";
import Banner from "../../components/Banner";
import type { Product, ProductCategory } from "@/lib/products";
import { getPriceLabel } from "@/lib/products";
import "./store.css";

type ApiResponse = {
	data?: Product[];
	meta?: { total: number; page: number; limit: number; totalPages: number };
};

type StoreProps = {
	initialProducts?: Product[];
	initialCategories?: ProductCategory[];
	initialCategory?: number | null;
};

export default function Store({
	initialProducts,
	initialCategories,
	initialCategory = null,
}: StoreProps = {}) {
	const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
	const [categories] = useState<ProductCategory[]>(initialCategories ?? []);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategory);
	const [loading, setLoading] = useState(initialProducts === undefined);
	const initialConsumed = useRef(initialProducts !== undefined);

	const fetchProducts = useCallback(async (category: number | null) => {
		setLoading(true);
		try {
			const res = await api.get<ApiResponse>("/products", {
				params: { page: 1, limit: 24, ...(category ? { category } : {}) },
			});
			setProducts(res.data?.data ?? []);
		} catch (err) {
			console.error(err);
			setProducts([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (initialConsumed.current) {
			initialConsumed.current = false;
			return;
		}
		fetchProducts(selectedCategory);
	}, [fetchProducts, selectedCategory]);

	const handleSelectCategory = (id: number | null) => {
		setSelectedCategory(id);
		fetchProducts(id);
	};

	if (loading) return <LoadingSkeleton />;

	return (
		<>
			<div className="section">
				<Banner size="top" />
			</div>

			<div className="container store-page mt-5">
				<h1 className="store-title">Loja</h1>

				{categories.length > 0 && (
					<div className="store-filters">
						<button
							className={`store-filter ${selectedCategory === null ? "active" : ""}`}
							onClick={() => handleSelectCategory(null)}
						>
							Todos
						</button>

						{categories.map((cat) => (
							<button
								key={cat.id}
								className={`store-filter ${selectedCategory === Number(cat.id) ? "active" : ""}`}
								onClick={() => handleSelectCategory(Number(cat.id))}
							>
								{cat.name}
							</button>
						))}
					</div>
				)}

				<div className="row">
					{products.map((product) => (
						<div key={product.id} className="col-12 col-md-4 col-lg-3 mb-4">
							<Link href={`/${product.slug ?? `loja/${product.id}`}`} className="product-card">
								<div className="product-card-cover">
									<PostThumbnail
										image_id={product.cover_image_id || Number(product.image_id) || null}
										ratio="1/1"
									/>
									{product.stock <= 0 && (
										<span className="product-card-sold-out">Esgotado</span>
									)}
								</div>
								<h3 className="product-card-title">{product.name}</h3>
								<p className={`product-card-price${product.stock <= 0 ? " product-card-price-soldout" : ""}`}>
									{getPriceLabel(product.value, product.stock)}
								</p>
							</Link>
						</div>
					))}
				</div>

				{!products.length && (
					<p className="store-empty">Nenhum produto encontrado.</p>
				)}
			</div>
		</>
	);
}
