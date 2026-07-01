"use client";

import { api } from '../../api';
import { useEffect, useState } from "react";
import Link from "next/link";
import "./style.css";

import PostThumbnail from "../../components/Image/image.tsx";
import AOS from "aos";

type PublicationType = {
	fn_revista_id: number;
	fc_status: string;
	fn_revista: string;
	fn_capa_id: number;
	fn_edicao: number;
	fd_cadastro: string;
	slug: string | null;
};

type ApiResponse = {
	data: PublicationType[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

export default function Publications() {

	const [publications, setPublications] = useState<PublicationType[]>([]);
	const [loading, setLoading] = useState(true);

	const getPublications = async () => {
		try {
			const response = await api.get<ApiResponse>('/publications');

			const list = Array.isArray(response.data?.data)
				? response.data.data
				: [];

			setPublications(list);

		} catch (err) {
			console.error("Erro ao buscar", err);
			setPublications([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getPublications();
		AOS.init({ duration: 1200 });
	}, []);


	if (loading) {
		// return <LoadingSkeleton />;
	}

	return (
		<>
			<div className="section h-100">
				<div className="container">
					<div className="row">
					</div>
				</div>
			</div>

			<div className="section bg-light mv-page">
				<div className="container py-5">
					<div className="row align-items-center">
						<div className="col-lg-7 col-12">
							<h1 className="mb-3">Móveis de Valor: 25 anos guiando o setor para o futuro</h1>
							<p>Em um mercado cada vez mais dinâmico e competitivo, informação de qualidade deixou de ser diferencial - é necessidade. Há <strong>25 anos</strong>, a Móveis de Valor cumpre esse papel com consistência, credibilidade e visão estratégica.</p>
							<p>Mais do que uma revista, a publicação se consolidou como um verdadeiro elo entre indústria, fornecedores e varejo, conectando quem produz, quem abastece e quem vende. Ao longo de sua trajetória, ajudou a antecipar tendências, traduzir movimentos do mercado e abrir caminhos para o crescimento sustentável do setor moveleiro.</p>
							<p>Assinar a Móveis de Valor é estar um passo à frente. É ter acesso a análises profundas, cases inspiradores e conteúdos que fazem a diferença na tomada de decisão. Em um cenário de constantes transformações, quem se informa melhor, compete melhor.</p>
							<p>Ao celebrar 25 anos, a revista reforça seu compromisso com o futuro: evoluir junto com o setor, impulsionar conexões e gerar inteligência para toda a cadeia.</p>
							<p><strong>Se você quer crescer, inovar e se destacar, este é o seu lugar.</strong></p>

							<div className="d-flex gap-2 mt-4 mb-5 flex-wrap">
								<a
									href="https://api.whatsapp.com/send?phone=5541999129877&text=Ol%C3%A1%21+Vim+pelo+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+a+assinatura+da+revista&type=phone_number&app_absent=0"
									className="mv-btn"
								>
									Assine agora
								</a>
							</div>
						</div>
						<div className="col-lg-4 offset-lg-1 col-12">
							<div className="mv-magazine-stack">
								{publications.slice(0, 5).map((publication, index) => (
									<Link
										key={publication.fn_revista_id}
										className="mv-magazine-item"
										style={{ "--i": index } as React.CSSProperties}
										href={`/${publication.slug ?? `publicacao/${publication.fn_revista_id}`}`}
									>
										<PostThumbnail
											image_id={publication.fn_capa_id}
											ratio="3/4"
										/>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
