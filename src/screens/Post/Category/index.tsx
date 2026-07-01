"use client";

import "./styles.css";

import { useEffect, useRef, useState } from "react";
import { api } from "../../../api";
import Link from "next/link";
import { usePathname, useSearchParams, useParams } from "next/navigation";
import { useAnalytics } from "../../../hooks/trackEvent";

import Banner from "../../../components/Banner";
import Search from "../../../components/Post/Search";
import Categories from "../../../components/Post/Category";
import Image from "../../../components/Image/imageLink.tsx";
import Loading from "../../../components/Loading/Loading";
import Newsletter from "../../../components/Newsletter";

import AOS from "aos";
import "aos/dist/aos.css";
import Author from "../../../components/Post/Author.tsx";

// ==========================
// TYPES
// ==========================

type CategoryType = {
	category_id: number;
	name: string;
	slug: string;
};

type PostType = {
	post_id: number;
	title: string;
	sub_title: string;
	image: string | null;
	slug: string;
	autor_id: number;
	categories: CategoryType[];
};

type CategoryInfoType = {
	name: string;
	description: string;
} | null;

type CategoryProps = {
	initialPosts?: PostType[];
	initialTotalPages?: number;
	initialPage?: number;
	initialQuery?: string;
	initialCategoryInfo?: CategoryInfoType;
};

// ==========================
// COMPONENT
// ==========================


export default function Dashboard({
	initialPosts,
	initialTotalPages = 1,
	initialPage = 1,
	initialQuery = "",
	initialCategoryInfo = null,
}: CategoryProps = {}) {

	const params = useParams<{ categorySlug?: string }>();
	const categorySlug = params?.categorySlug;

	const searchParams = useSearchParams();
	const pathname = usePathname() ?? "/";
	const { track } = useAnalytics();
	const isFirstRender = useRef(true);
	// Marca se ja temos dados do server pra primeira pagina/query atual
	const hasInitialData = useRef(initialPosts !== undefined);

	const [posts, setPosts] = useState<PostType[]>(initialPosts ?? []);
	const [categoryInfo, setCategoryInfo] = useState<CategoryInfoType>(initialCategoryInfo);

	const [loading, setLoading] = useState(false);
	const [loadingCategory, setLoadingCategory] = useState(false);

	const [searchInput, setSearchInput] = useState(initialQuery);
	const [searchTitle, setSearchTitle] = useState(initialQuery);

	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(initialTotalPages);

	const postsPerPage = 10;

	// ==========================
	// FETCH CATEGORY METADATA
	// ==========================

	const fetchCategory = async () => {

		if (!categorySlug) return;

		try {

			setLoadingCategory(true);

			const res = await api.get(`/categoria/${categorySlug}`);

			setCategoryInfo({
				name: res.data.category?.name ?? categorySlug,
				description: res.data.category?.description ?? "",
			});

		} catch (error) {

			console.error("Erro ao buscar categoria:", error);
			setCategoryInfo(null);

		} finally {

			setLoadingCategory(false);

		}
	};

	// ==========================
	// FETCH POSTS
	// ==========================

	const fetchPosts = async (manualTitle?: string) => {

		try {

			setLoading(true);

			const params: Record<string, unknown> = {
				page: currentPage,
				limit: postsPerPage,
			};

			const titleToUse = manualTitle ?? searchTitle;

			if (typeof titleToUse === "string" && titleToUse.trim()) {
				params.title = titleToUse.trim();
			}

			if (categorySlug) {
				params.category_slug = `categoria/${categorySlug}`;
			}

			const res = await api.get("/posts", { params });

			setPosts(res.data.posts ?? []);
			setTotalPages(res.data.totalPages ?? 1);

		} catch (error) {

			console.error(error);
			setPosts([]);

		} finally {

			setLoading(false);

		}
	};

	// ==========================
	// SEARCH HANDLER
	// ==========================

	const handleSearch = () => {

		const value = searchInput.trim();

		setCurrentPage(1);
		setSearchTitle(value);
		fetchPosts(value);

		track({
			event_type: "search",
			event_name: pathname,
			meta: { query: value, category: categorySlug ?? null },
		});

	};

	// ==========================
	// EFFECTS
	// ==========================

	useEffect(() => {

		// Se temos initialPosts do server pra essa pagina, nao re-fetcha
		if (hasInitialData.current) {
			hasInitialData.current = false;
			return;
		}

		fetchPosts();

		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});

	}, [currentPage, categorySlug]);

	useEffect(() => {

		const q = searchParams?.get("q");

		// Se o q ja foi consumido no SSR (initialQuery), nao re-fetcha
		if (q && q !== initialQuery) {

			setSearchInput(q);
			setSearchTitle(q);
			setCurrentPage(1);

			fetchPosts(q);

		}

	}, [searchParams, initialQuery]);

	useEffect(() => {

		// initialCategoryInfo do server cobre o primeiro render
		if (initialCategoryInfo) return;

		setCategoryInfo(null);
		fetchCategory();

	}, [categorySlug, initialCategoryInfo]);

	useEffect(() => {

		// Reset state ao trocar de categoria (caso o componente seja reutilizado)
		setSearchInput(initialQuery);
		setSearchTitle(initialQuery);
		setCurrentPage(initialPage);

	}, [categorySlug, initialQuery, initialPage]);



	useEffect(() => {

		AOS.init({ duration: 800, once: true });

	}, []);

	// página 1 é rastreada pelo layout — só rastreia a partir da página 2
	useEffect(() => {

		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (currentPage <= 1) return;

		track({
			event_type: "page_view",
			event_name: pathname,
			meta: {
				path:  pathname,
				query: `?page=${currentPage}`,
				page:  currentPage,
			},
		});

	}, [currentPage]);

	// ==========================
	// PAGINATION
	// ==========================

	const renderPagination = () => {

		if (totalPages <= 1) return null;

		const maxPagesToShow = 5;

		let startPage = Math.max(
			1,
			currentPage - Math.floor(maxPagesToShow / 2)
		);

		let endPage = startPage + maxPagesToShow - 1;

		if (endPage > totalPages) {

			endPage = totalPages;

			startPage = Math.max(
				1,
				endPage - maxPagesToShow + 1
			);
		}

		const pages = Array.from(
			{ length: endPage - startPage + 1 },
			(_, i) => startPage + i
		);

		return (

			<div className="pagination-container">

				<button
					className="pagination-btn"
					disabled={currentPage === 1}
					onClick={() => setCurrentPage(prev => prev - 1)}
				>
					Anterior
				</button>

				{pages.map(page => (

					<button
						key={page}
						className={`pagination-btn ${
							currentPage === page ? "active" : ""
						}`}
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>

				))}

				<button
					className="pagination-btn"
					disabled={currentPage === totalPages}
					onClick={() => setCurrentPage(prev => prev + 1)}
				>
					Próximo
				</button>

			</div>
		);
	};

	// ==========================
	// LOADING
	// ==========================

	if (loading && currentPage === 1) {

		return <Loading />;

	}

	// ==========================
	// RENDER
	// ==========================

	return (
		<>
		<div className="container">
			<div className="section">
				<Banner size="top" />
			</div>
			<div className="row mt-5">

				{/* POSTS */}

				<div className="col-12 col-md-8">

					{categorySlug ? (

						<div className="header-page">

							<h2>Categoria</h2>

							<h1>
								{loadingCategory
									? "..."
									: (categoryInfo?.name ?? categorySlug)}
							</h1>

							{!loadingCategory &&
								categoryInfo?.description && (

									<p className="mb-3">
										{categoryInfo.description}
									</p>

								)}

						</div>

					) : (

						<div className="header-page">

							{/*<h2>Categoria</h2>*/}

							<h1>
								Notícias
							</h1>



							<p className="mb-5">
								Quem move o setor moveleiro lê as notícias mais importantes na Móveis de Valor
							</p>


						</div>

					)}

					{loading && <p>Carregando...</p>}

					{!loading && posts.length === 0 && (

						<p>Nenhuma notícia encontrada</p>

					)}

					{posts.map(post => (

						<div
							key={post.post_id}
							className="post-item"
						>

							<Link
								href={`/${post.slug}`}
								className="text-decoration-none"
							>

								<div className="row">

									<div className="col-12 col-md-4">
										<Image image={post.image} />
									</div>

									<div className="col-12 col-md-7">

										<p className="category-title">

											{
												post.categories?.find(
													cat => ![1, 25, 22].includes(cat.category_id)
												)?.name ?? ""
											}

										</p>

										<h3 className="post-title">

											{post.title}

										</h3>

										<p className="post-subtitle">

											{post.sub_title}

										</p>

										<p className="post-author d-none">

											<Author
												authorId={post.autor_id}
											/>

										</p>

									</div>

								</div>

							</Link>

						</div>

					))}

					{renderPagination()}

				</div>

				{/* SIDEBAR */}

				<div className="col-12 col-md-3 offset-md-1">
					<div className="sticky">
						<div className="mt-4">
							<Search
								value={searchInput}
								onChange={(e) =>
									setSearchInput(e.target.value)
								}
								onSubmit={handleSearch}
							/>
						</div>
						<div className="mt-4">
							<Banner size="side" />
						</div>


						<div className="mt-4">
							<Categories activeSlug={categorySlug} />
						</div>

						<div className="mt-4 mb-5">
							<Newsletter />
						</div>
					</div>

				</div>

			</div>

		</div>
		</>
	);
}
