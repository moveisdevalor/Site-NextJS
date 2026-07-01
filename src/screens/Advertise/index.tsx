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
			<div className="section advertise-hero advertise-page">
				<div className="container py-5">
					<div className="row align-items-center">
						<div className="col-lg-7 col-12">
							<h1>Anuncie na Móveis de Valor e lidere a decisão de compra no varejo</h1>
							<p>Em um mercado onde produtos são cada vez mais parecidos e a concorrência cresce em ritmo acelerado, não basta estar presente - é preciso ser lembrado. E é exatamente isso que sua marca conquista ao anunciar na Móveis de Valor.</p>
								<p>Há 25 anos, a publicação é referência absoluta para quem decide no setor moveleiro. Ela chega diretamente aos lojistas, compradores e líderes da indústria - ou seja, ao público que realmente gera negócios.</p>
								<p>Anunciar na Móveis de Valor não é apenas divulgar um produto. É posicionar sua marca em um ambiente de credibilidade, influência e autoridade. É estar presente nas discussões que movimentam o mercado e influenciam decisões estratégicas.</p>
								<p>Enquanto muitos competem apenas por preço, as marcas que investem em comunicação qualificada constroem valor, fortalecem reputação e aumentam sua presença no ponto de venda.</p>
								<p>Se o varejista tem várias opções semelhantes à sua frente, ele tende a escolher quem conhece, confia e reconhece. E isso se constrói com presença consistente.</p>
									<p>Sua marca pode ser mais uma no mercado - ou pode ser a escolhida. A decisão começa aqui.</p>


							<div className="d-flex gap-2 mt-4 mb-3 flex-wrap">
								<a
									href="https://wa.me/5541999129877?text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20anuncios."
									className="mv-btn"
								>
									Anuncie agora
								</a>
							</div>

							<span className="advertise-hero-caption">
								Veja abaixo o calendário de edições de 2026
							</span>
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

			<div className="section advertise-calendar-section advertise-page">
				<div className="container">
					<div className="advertise-calendar-header">
						<h2 className="advertise-calendar-title">Calendário Editorial 2026</h2>
						<p className="advertise-calendar-subtitle">
							Confira as edições do ano, eventos cobertos, cadernos especiais
							e as datas de envio de material e de circulação.
						</p>
					</div>

					<div className="advertise-calendar-table-wrapper">
						<table className="advertise-calendar-table">
							<thead>
								<tr>
									<th>Edição</th>
									<th>Mês</th>
									<th>Capa</th>
									<th>Eventos</th>
									<th>Caderno Especial</th>
									<th>Envio de Material</th>
									<th>Circulação</th>
								</tr>
							</thead>
							<tbody>
							<tr>
								<th scope="row">253</th>
								<td>Jan/Fev</td>
								<td>Yes Móvel Show SP</td>
								<td>FEMUR, ABIMAD 41, Movelpar Home Show</td>
								<td>--</td>
								<td>09/fev</td>
								<td>19/fev</td>
							</tr>

							<tr>
								<th scope="row">254</th>
								<td>Março</td>
								<td>--</td>
								<td>--</td>
								<td>--</td>
								<td>16/mar</td>
								<td>23/mar</td>
							</tr>

							<tr>
								<th scope="row">255</th>
								<td>Abril</td>
								<td>Móvel Brasil</td>
								<td>Yes Móvel Show SP, Interzum Guangzhou, ISPA Expo</td>
								<td>Salas (Estar – Jantar)</td>
								<td>20/abr</td>
								<td>27/abr</td>
							</tr>

							<tr>
								<th scope="row">256</th>
								<td>Maio</td>
								<td>--</td>
								<td>iSaloni</td>
								<td>Colchões</td>
								<td>11/mai</td>
								<td>18/mai</td>
							</tr>

							<tr>
								<th scope="row">257</th>
								<td>Junho</td>
								<td>Formóbile</td>
								<td>Móvel Brasil</td>
								<td>Indústria 4.0</td>
								<td>15/jun</td>
								<td>22/jun</td>
							</tr>

							<tr>
								<th scope="row">258</th>
								<td>Julho</td>
								<td>Movelsul</td>
								<td>Formóbile</td>
								<td>--</td>
								<td>20/jul</td>
								<td>27/jul</td>
							</tr>

							<tr>
								<th scope="row">259</th>
								<td>Agosto</td>
								<td>--</td>
								<td>Salão de Gramado</td>
								<td>Cozinhas</td>
								<td>17/ago</td>
								<td>24/ago</td>
							</tr>

							<tr>
								<th scope="row">260</th>
								<td>Setembro</td>
								<td>--</td>
								<td>Movelsul, Fielpar & Fiep, ABIMAD 42</td>
								<td>Móveis Infantis</td>
								<td>18/set</td>
								<td>25/set</td>
							</tr>

							<tr>
								<th scope="row">261</th>
								<td>Outubro</td>
								<td>--</td>
								<td>Ibiá Expo</td>
								<td>Quartos</td>
								<td>19/out</td>
								<td>26/out</td>
							</tr>

							<tr>
								<th scope="row">262</th>
								<td>Nov/Dez</td>
								<td>--</td>
								<td>--</td>
								<td>Top 20</td>
								<td>21/nov</td>
								<td>30/nov</td>
							</tr>
							</tbody>
						</table>
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
