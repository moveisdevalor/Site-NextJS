"use client";

import AOS from "aos";
import { useEffect} from "react";
import { useMenuType } from "@/layout/menu-context";
import "./styles.css" ;

export default function Index() {
	const { setMenuType } = useMenuType();

	// const [tab, setTab] = useState("sobre");

	useEffect(() => {
		AOS.init({ duration: 1200 });

		setMenuType("transparent");

		return () => setMenuType("default");
	}, []);

	return (
		<>
			{/* HERO */}
			<section className="section course">
				<div className="container p-50">
					<div className="row">

						{/* LEFT */}
						<div className="col-lg-7">
							<h2>Curso Profissional</h2>
							<h1>Mestre Marceneiro</h1>

							<p>Esse curso é voltado para os profissionais da marcenaria que estão preocupados em
								controlar os seus custos, colocar os produtos e serviços no mercado, com a máxima
								qualidade e com o melhor custo/benefício.<br/>
								<br/>
								Quanto maior a capacitação do profissional, maiores as chances da marcenaria ser
								lucrativa e obter sucesso. Portanto, saber administrar é imprescindível.</p>

							<div className="d-flex gap-5">

								<div className="mt-5 course-info text-center">
									<h2 className="number">6</h2>
									<p className="info">Modulos</p>
								</div>

								<div className="mt-5 course-info text-center">
									<h2 className="number">40</h2>
									<p className="info">Carga horária</p>
								</div>

								<div className="mt-5 course-info text-center">
									<h2 className="number">+120</h2>
									<p className="info">Alunos</p>
								</div>


							</div>

						</div>

						{/* SIDEBAR COMPRA */}
						<div className="col-lg-5">
							<img
									className="img-fluid mt-4"
									src="https://www.calcme.com.br/wp-content/uploads/2023/08/curso-de-moveis-planejados.png"
								/>
						</div>

					</div>
				</div>
			</section>

			{/* TABS */}
			<section className="container mt-5">
				<p><strong><span >Aula 01 -</span></strong> Avaliação das necessidades
								do Cliente<br/>
								<strong><span >Aula 02 -</span></strong> Medições, identificação e
								restrições do local<br/>
								<strong><span >Aula 03 -</span></strong> Interpretação de Projetos<br/>
								<strong><span >Aula 04 -</span></strong> Tecnologia dos
								Materiais<br/>
								<strong><span>Aula 05 -</span></strong> Elaboração da
								Documentação para Fabricação<br/>
								<strong><span >Aula 06 -</span></strong> Layout da Marcenaria<br/>
								<strong><span >Aula 07 -</span></strong> Estocagem de
								Material<br/>
								<strong><span >Aula 08 -</span></strong> Segurança e a Saúde no
								Trabalho<br/>
								<strong><span >Aula 09 -</span></strong> Controle de Máquinas<br/>
								<strong><span>Aula 10 -</span></strong> Conceitos Básicos para a
								Formação de Preços na Marcenaria<br/>
								<strong><span >Aula 11 -</span></strong> Secagem da Madeira<br/>
								<strong><span >Aula 12 -</span></strong> A importância da
								colagem<br/>
								<strong><span>Aula 13 -</span></strong> Sistemas de Exaustão<br/>
								<strong><span >Aula 14 -</span></strong> Ferramentas
								Pneumáticas<br/>
								<strong><span >Aula 15 -</span></strong> Usinagem e Geometria de
								Corte<br/>
								<strong><span >Aula 16 -</span></strong> Serras Circulares<br/>
								<strong><span>Aula 17 -</span></strong> Administração da Produção<br/>
								<strong><span>Aula 18 -</span></strong> Programa 5S e Layout de
								Fábrica<br/>
								<strong><span>Aula 19 -</span></strong> Custeio da Produção<br/>
								<strong><span>Aula 20 -</span></strong> Controle e Redução de
								Custos na Marcenaria<br/>
								<strong><span>Aula 21 -</span></strong> Produtos que Agilizam a
								Produção<br/>
								<strong><span>Aula 22 -</span></strong> Dicas Especiais de
								Produtividade<br/>
								<strong><span>Aula 23 -</span></strong> Matérias-primas e
								Processos - Parte I<br/>
								<strong><span>Aula 24 -</span></strong> Matérias-primas e
								Processos - Parte II<br/>
								<strong><span>Aula 25 -</span></strong> Manutenção e Compra de
								Máquinas<br/>
								<strong><span>Aula 26 -</span></strong> Sustentabilidade na
								Marcenaria<br/>
								<strong><span>Aula 27 -</span></strong> Materiais que Valorizam o
								Móvel<br/>
								<strong><span>Aula 28 -</span></strong> Softwares para Projetos
								de Marcenaria<br/>
								<strong><span>Aula 29 -</span></strong> Acessibilidade e Projeto
								Universal<br/>
								<strong><span>Aula 30 -</span></strong> Técnicas de
								Customização<br/>
								<strong><span>Aula 31 -</span></strong> Estilos de Mobiliário</p>
			</section>


		</>
	);
}
