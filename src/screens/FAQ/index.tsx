"use client";

import { api } from '../../api';
import { useEffect, useState, useCallback } from "react";
import { useAnalytics } from "../../hooks/trackEvent";
import AOS from "aos";
import "aos/dist/aos.css";

/* ================= TYPES ================= */

type FAQType = {
	id: number;
	question: string;
	answer: string;
	categoryId?: number;
	isActive: boolean;
	createdAt: string;
};

type CategoryType = {
	id: number;
	name: string;
	slug: string;
	isActive: boolean;
};

type ApiResponse = {
	data: FAQType[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

/* ================= COMPONENT ================= */

export default function FAQPage() {
	const [faqs, setFaqs] = useState<FAQType[]>([]);
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const { track } = useAnalytics();

	/* ================= FETCH ================= */

	const fetchFaqs = useCallback(async (categoryId?: number | null) => {
		try {
			setLoading(true);

			const response = await api.get<ApiResponse>('/faqs', {
				params: {
					categoryId: categoryId ?? undefined,
				},
			});

			setFaqs(response.data?.data ?? []);

		} catch (err) {
			console.error("Erro ao buscar FAQ", err);
			setFaqs([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchCategories = useCallback(async () => {
		try {
			const response = await api.get('/faq/categories');

			const list = Array.isArray(response.data) ? response.data : [];

			setCategories(list.filter((c: CategoryType) => c.isActive));

		} catch (err) {
			console.error("Erro ao buscar categorias", err);
			setCategories([]);
		}
	}, []);

	/* ================= EFFECT ================= */

	useEffect(() => {
		AOS.init({ duration: 1200 });

		fetchCategories();
		fetchFaqs();
	}, [fetchCategories, fetchFaqs]);

	/* ================= HANDLERS ================= */

	const handleCategoryChange = (categoryId: number | null) => {
		setSelectedCategory(categoryId);
		setOpenIndex(null);
		fetchFaqs(categoryId);

		const categoryName = categoryId === null
			? "todas"
			: (categories.find(c => c.id === categoryId)?.name ?? String(categoryId));

		track({
			event_type: "filter",
			event_name: "/faq",
			meta: { category_id: categoryId, category_name: categoryName },
		});
	};

	const toggle = (index: number) => {
		const isOpening = openIndex !== index;
		setOpenIndex(prev => (prev === index ? null : index));

		if (isOpening) {
			const faq = faqs[index];
			track({
				event_type: "faq_open",
				event_name: "/faq",
				meta: { faq_id: faq?.id, question: faq?.question },
			});
		}
	};

	/* ================= RENDER ================= */

	if (loading) {
		return <p>Carregando...</p>;
	}

	return (
		<div>
			{/* HERO */}
			<div className="section partners bg-light p-50">
				<div className="container">
					<div className="row">
						<div className="col-lg-6 d-flex flex-column justify-content-center" data-aos="fade-right">
							<h2 className="mb-3">
								<strong>Perguntas Frequentes</strong>
							</h2>
							<p>
								Encontre respostas rápidas para dúvidas comuns sobre nossas revistas, anúncios e conteúdos.
							</p>
						</div>

						<div className="col-lg-6 d-flex align-items-center justify-content-center" data-aos="fade-left">
							<h1 style={{ fontSize: 80, opacity: 0.1 }}>FAQ</h1>
						</div>
					</div>
				</div>
			</div>

			{/* FILTRO DE CATEGORIAS */}
			<div className="container mt-4">
				<div className="d-flex flex-wrap gap-2">

					<button
						className={`btn ${selectedCategory === null ? 'btn-dark' : 'btn-outline-dark'}`}
						onClick={() => handleCategoryChange(null)}
					>
						Todas
					</button>

					{categories.map(cat => (
						<button
							key={cat.id}
							className={`btn ${selectedCategory === cat.id ? 'btn-dark' : 'btn-outline-dark'}`}
							onClick={() => handleCategoryChange(cat.id)}
						>
							{cat.name}
						</button>
					))}

				</div>
			</div>

			{/* LISTA FAQ */}
			<div className="container mt-5">
				<div className="row">

					{faqs.map((faq, index) => (
						<div className="col-12 mb-3" key={faq.id} data-aos="fade-up">
							<div
								className="card p-3"
								style={{ cursor: "pointer" }}
								onClick={() => toggle(index)}
							>
								<h5 className="mb-2">{faq.question}</h5>

								{openIndex === index && (
									<p style={{ color: "#555" }}>
										{faq.answer}
									</p>
								)}
							</div>
						</div>
					))}

				</div>

				{faqs.length === 0 && (
					<p>Nenhuma pergunta encontrada.</p>
				)}
			</div>

		</div>
	);
}
