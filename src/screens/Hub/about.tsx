"use client";

import { useEffect } from "react";
import { useMenuType } from "@/layout/menu-context";
import "./hub.css";

export default function HubAbout() {
    const { setMenuType } = useMenuType();

    useEffect(() => {
        setMenuType("default");
        return () => setMenuType("default");
    }, [setMenuType]);

    return (
        <>
            <div className="section pt-100 pb-50">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">

                            <img
                                src="https://apiv2.moveisdevalor.com.br/upload/images/26061/Hub_horizontal.png"
                                width={180}
                                alt="HUB"
                            />

                            <h1 className="mt-4 mb-4">
                                <strong>Sobre o HUB de Inteligência Colaborativa</strong>
                            </h1>

                            <p className="hub-about-text">
                                O HUB de Inteligência Colaborativa nasce como uma evolução do papel
                                tradicional da revista setorial, transformando-a em uma plataforma
                                ativa de geração, curadoria e compartilhamento de conhecimento para
                                o ecossistema moveleiro.
                            </p>

                            <p className="hub-about-text">
                                Na sua fase 1 o HUB tem como principal função organizar, qualificar
                                e dar sentido às informações que circulam no setor, conectando
                                dados, análises e experiências de diferentes agentes da cadeia.
                            </p>

                            <p className="hub-about-text">
                                Mais do que produzir conteúdo, o projeto propõe integrar indústria,
                                fornecedores, varejo e especialistas em um ambiente onde a
                                informação deixa de ser isolada e passa a ser construída de forma
                                coletiva, com foco em relevância prática e aplicação estratégica.
                            </p>

                            <p className="hub-about-text">
                                O HUB atua como um ponto de convergência, reunindo tendências,
                                indicadores, boas práticas e leituras de mercado que ajudam a
                                orientar decisões em um cenário cada vez mais complexo e dinâmico.
                            </p>

                            <p className="hub-about-text">
                                Entre seus principais objetivos estão: elevar o nível de informação
                                disponível no setor; reduzir assimetrias de conhecimento entre os
                                agentes; antecipar movimentos de mercado; e apoiar decisões mais
                                consistentes, tanto no nível tático quanto estratégico.
                            </p>

                            <p className="hub-about-text">
                                Nesta fase inicial, o foco está em consolidar a base informacional,
                                estimular a participação dos players e estruturar fluxos contínuos
                                de contribuição.
                            </p>

                            <p className="hub-about-text">
                                A evolução natural do projeto aponta para a construção de uma
                                inteligência mais avançada, baseada em análise preditiva, integração
                                de dados e geração de insights proprietários — consolidando o HUB
                                como referência estratégica para o setor.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
