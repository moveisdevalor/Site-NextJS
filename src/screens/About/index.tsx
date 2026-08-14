"use client";

import AOS from 'aos';
import {useEffect} from "react";
import Publication from "../Index/publication.tsx";

export default function Index() {
	useEffect(() => {
		AOS.init({ duration: 1200 });
	}, []);
	return (
		<>
			<div className="section h-100 mt-5 mb-5 mv-page">
				<div className="container">
					<div className="row">
						<div className="col-12 col-md-12 d-block" data-aos="fade-up">
							<h2 className="mv-section-title mb-4">Sobre</h2>
							<p>
								Em 2026, a Móveis de Valor completa 25 anos de atuação consolidada no mercado. Com circulação nacional e periodicidade mensal, a revista nasceu com um propósito claro: integrar a cadeia moveleira por meio de conteúdo estratégico, voltado à tomada de decisão dos empresários.
							</p>
							<p>
								Hoje, além da versão impressa, a publicação também está presente no ambiente digital e é reconhecida pela qualidade editorial e pela capacidade de conectar os principais agentes do setor – fornecedores, indústrias e varejo.
							</p>
							<p>
								A liderança se reflete em números: maior volume de anunciantes, maior circulação auditada e o mais robusto número de páginas do segmento.
							</p>
							<p>
								O ecossistema se amplia com a MV Norte e Nordeste, publicação regional trimestral voltada à integração do “Brasil de Cima”. Ao longo dos últimos anos, a revista tem fortalecido a conexão entre fornecedores, indústrias e varejistas dessas regiões, ampliando oportunidades de negócio.
							</p>
							<p>
								Outro pilar é o Anuário de Colchões, que é referência no segmento colchoeiro, com conteúdo analítico sobre tendências, tecnologia e comportamento de consumo, além de promover a conexão entre indústria, fornecedores e varejo especializado. Em circulação há mais de uma década, esta publicação é única no mundo e tem ajudado a projetar o setor colchoeiro globalmente.
							</p>
							<p>
								A Móveis de Valor também acompanha a evolução da comunicação, com presença ativa no digital e nas redes sociais. Desde 2008, mantém a MVTV – a única WebTV dedicada ao setor moveleiro no mundo.
							</p>
							<p>
								Esse conjunto de iniciativas consolida a Móveis de Valor como a principal plataforma de comunicação do setor, com atuação estratégica e protagonismo na defesa e no desenvolvimento da indústria moveleira nacional.
							</p>

						</div>
					</div>
				</div>
			</div>
			<Publication />
		</>
	);
}
