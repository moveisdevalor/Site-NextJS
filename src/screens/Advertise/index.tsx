"use client";

import { api } from '../../api';
import { useEffect, useState } from "react";
import Link from "next/link";

import PostThumbnail from "../../components/Image/image.tsx";
import AOS from "aos";
import "./advertise.css";

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

const REVISTA_MOVEIS_DE_VALOR = 1;
const REVISTA_NORTE_NORDESTE = 3;
const REVISTA_ANUARIO = 6;

export default function Publications() {

	const [latestMoveis, setLatestMoveis] = useState<PublicationType | null>(null);
	const [latestNorteNordeste, setLatestNorteNordeste] = useState<PublicationType | null>(null);
	const [latestAnuario, setLatestAnuario] = useState<PublicationType | null>(null);
	const [loading, setLoading] = useState(true);

	const getPublications = async () => {
		try {
			const [moveisRes, norteRes, anuarioRes] = await Promise.all([
				api.get<ApiResponse>('/publications', { params: { fn_revista: REVISTA_MOVEIS_DE_VALOR, limit: 1 } }),
				api.get<ApiResponse>('/publications', { params: { fn_revista: REVISTA_NORTE_NORDESTE, limit: 1 } }),
				api.get<ApiResponse>('/publications', { params: { fn_revista: REVISTA_ANUARIO, limit: 1 } }),
			]);

			setLatestMoveis(moveisRes.data?.data?.[0] ?? null);
			setLatestNorteNordeste(norteRes.data?.data?.[0] ?? null);
			setLatestAnuario(anuarioRes.data?.data?.[0] ?? null);

		} catch (err) {
			console.error("Erro ao buscar", err);
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
			<div className="section advertise-hero advertise-page">
				<div className="container pt-5 pb-5">

					<div className="advertise-intro">
						<h1>Anuncie nas publicações do Intelligence Group</h1>
					</div>

					<div className="advertise-card">
						<div className="advertise-card-text">
							<h2 className="advertise-product-title">Revista Móveis de Valor</h2>
							<p>Em um mercado onde produtos são cada vez mais parecidos e a concorrência cresce em ritmo acelerado, não basta estar presente – é preciso ser lembrado. E é exatamente isso que sua marca conquista ao anunciar na Móveis de Valor.</p>
							<p>Há 25 anos, a publicação é referência absoluta para quem decide no setor moveleiro. Ela chega diretamente aos lojistas, compradores e líderes da indústria – ou seja, ao público que realmente gera negócios.</p>
							<p>Anunciar na Móveis de Valor não é apenas divulgar um produto. É posicionar sua marca em um ambiente de credibilidade, influência e autoridade. É estar presente nas discussões que movimentam o mercado e influenciam decisões estratégicas.</p>
							<p>Enquanto muitos competem apenas por preço, as marcas que investem em comunicação qualificada constroem valor, fortalecem reputação e aumentam sua presença no ponto de venda.</p>
							<p>Se o varejista tem várias opções semelhantes à sua frente, ele tende a escolher quem conhece, confia e reconhece. E isso se constrói com presença consistente.</p>
							<p>Nas 10 edições do ano você encontra diferentes formatos de anúncio, que vão de página simples até merchandising de capa e projetos especiais (sob consulta).</p>
						</div>
						{latestMoveis && (
							<Link
								className="advertise-card-cover"
								href={`/${latestMoveis.slug ?? `publicacao/${latestMoveis.fn_revista_id}`}`}
							>
								<PostThumbnail image_id={latestMoveis.fn_capa_id} ratio="3/4" />
							</Link>
						)}
					</div>

					<div className="advertise-card">
						<div className="advertise-card-text">
							<h2 className="advertise-product-title">Revista Móveis de Valor Norte e Nordeste</h2>
							<p>Criada há 12 anos, a Móveis de Valor Norte e Nordeste circula a cada trimestre e se posiciona como uma vitrine para as indústrias das duas regiões e para quem quer acessar esses importantes mercados consumidores de móveis.</p>
						</div>
						{latestNorteNordeste && (
							<Link
								className="advertise-card-cover"
								href={`/${latestNorteNordeste.slug ?? `publicacao/${latestNorteNordeste.fn_revista_id}`}`}
							>
								<PostThumbnail image_id={latestNorteNordeste.fn_capa_id} ratio="3/4" />
							</Link>
						)}
					</div>

					<div className="advertise-card">
						<div className="advertise-card-text">
							<h2 className="advertise-product-title">Anuário de Colchões</h2>
							<p>Esta publicação completa o portfólio de veículos impressos do IG e, como o próprio nome indica, circula uma vez por ano, em janeiro, e trata exclusivamente do universo de colchões.</p>
							<p>Em sua 12ª edição, o Anuário se consolidou como a principal referência de inteligência e dados estratégicos para fornecedores, indústrias e varejo de colchões.</p>
							<p>Adesões de anunciantes são aceitas até novembro de cada ano.</p>
						</div>
						{latestAnuario && (
							<Link
								className="advertise-card-cover"
								href={`/${latestAnuario.slug ?? `publicacao/${latestAnuario.fn_revista_id}`}`}
							>
								<PostThumbnail image_id={latestAnuario.fn_capa_id} ratio="3/4" />
							</Link>
						)}
					</div>

					<div className="advertise-contact-cta">
						<p className="advertise-closing">
							Sua marca pode ser mais uma no mercado – ou pode ser a escolhida.
							A decisão começa aqui.
						</p>
						<span>Para anunciar, envie e-mail ou fale pelo WhatsApp:</span>
						<div className="d-flex gap-2 mt-3 flex-wrap">
							<a href="mailto:comercial@moveisdevalor.com.br" className="mv-btn">
								comercial@moveisdevalor.com.br
							</a>
							<a
								href="https://wa.me/5541999129877?text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20anuncios."
								className="mv-btn-outline"
							>
								(41) 99912-9877
							</a>
						</div>
					</div>

				</div>
			</div>

			<section className="container my-5 d-none advertise-page">

				<div className="bg-danger text-white px-3 py-2 mb-4">
					<h5 className="mb-0">FORMATOS</h5>
				</div>

				<div className="row g-5">

					<div className="col-md-4 text-center">
						<div className="titulo">CAPA</div>
						<div className="modelo pagina"></div>
						<div className="medida">21 x 28 cm</div>
					</div>

					<div className="col-md-4 text-center">
						<div className="titulo">CONTRACAPA</div>
						<div className="modelo pagina"></div>
						<div className="medida">21 x 28 cm</div>
					</div>

					<div className="col-md-4 text-center">
						<div className="titulo">
							2ª CAPA + PÁGINA 3 OU<br/>PÁGINA DUPLA INDETERMINADA
						</div>
						<div className="modelo dupla">
							<div></div>
							<div></div>
						</div>
						<div className="medida">42 x 28 cm</div>
					</div>

					<div className="col-md-6 text-center">
						<div className="titulo">1 PÁGINA INDETERMINADA</div>
						<div className="modelo pagina-indeterminada">
							<div className="pagina-clara"></div>
							<div className="pagina-escura"></div>
						</div>
						<div className="medida">21 x 28 cm</div>
					</div>

					<div className="col-md-6 text-center">
						<div className="titulo">1/2 PÁGINA HORIZONTAL</div>
						<div className="modelo horizontal">
							<div className="pagina-clara"></div>
							<div className="area-anuncio"></div>
						</div>
						<div className="medida">21 x 14 cm</div>
					</div>

					<div className="col-md-6 text-center">
						<div className="titulo">1/2 PÁGINA VERTICAL</div>
						<div className="modelo vertical">
							<div className="pagina-clara"></div>
							<div className="area-anuncio"></div>
						</div>
						<div className="medida">10,5 x 28 cm</div>
					</div>

					<div className="col-md-6 text-center">
						<div className="titulo">RODAPÉ OU PATROCÍNIO DE SEÇÃO</div>
						<div className="modelo rodape">
							<div className="pagina-clara"></div>
							<div className="area-anuncio"></div>
						</div>
						<div className="medida">21 x 5 cm</div>
					</div>

				</div>

			</section>
		</>
	);
}
