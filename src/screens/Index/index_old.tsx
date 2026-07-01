import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoIosArrowForward } from "react-icons/io";
import "./home.css";
import {LuBriefcaseBusiness, LuCodeXml, LuHeadset, LuNetwork} from "react-icons/lu";

export function Index() {

    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);

    return (
        <>
            <div className="section banner">
                <div className="container">
                    <div className="p-0">
                        <div className="row p-0">

                            {/* TEXTO DO BANNER */}
                            <div className="col-12 col-md-7 d-block align-content-center order-2 order-md-1 slogan">
                                <h1 data-aos="fade-down"><strong>Tecnologia que impulsiona resultados.</strong></h1>
                                <h3 data-aos="fade-right" data-aos-delay="200" className="mt-3 mb-1">
                                    Soluções customizadas de tecnologia para atender sua empresa.
                                </h3>
                                <a
                                    href="solucoes"
                                    className="btn mt-4"
                                    data-aos="zoom-in"
                                    data-aos-delay="400"
                                >
                                    Conheça nossas soluções <IoIosArrowForward />
                                </a>
                            </div>

                            {/* IMAGEM DO BANNER COM AOS */}
                            <div className="col-12 col-md-5 order-1 order-md-2 mb-3">
                                <div
                                    data-aos="fade-left"
                                    data-aos-offset="100"
                                    data-aos-duration="1200"
                                >
                                    <img
                                        src="https://themewagon.github.io/venus-nextjs/images/hero/hero-image.png"
                                        alt="Mockup"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* PARTNERS */}
            <div className="section partners bg-light">
                <div className="container">
                    <div className="row">
                        {/*<h1 data-aos="fade-right">Parceiros</h1>*/}

                        <div className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay="0">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/mikrotik.png" alt=""/>
                            </div>
                        </div>

                        <div className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay="100">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/ubiquiti.png" alt=""/>
                            </div>
                        </div>

                        <div className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay="200">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/intelbras.png" alt=""/>
                            </div>
                        </div>

                        <div className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay="300">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/dell.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay="300">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/hikvision.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2" data-aos="zoom-in" data-aos-delay="300">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/aapainel.png" alt=""/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* SOLUTIONS */}
            <div className="section solutions">
                <div className="container">
                    <div className="row">
                        <div
                            className="col-lg-4 d-block align-content-center"
                            data-aos="fade-right"
                        >
                            <h2 className="mb-3">
                                Na <strong>Shartech</strong>, unimos inovação e experiência para desenvolver soluções completas em
                                <strong> software, infraestrutura, consultoria e suporte técnico</strong>.
                            </h2>
                        </div>

                        <div className="col-lg-8">

                            <div className="row" data-aos="fade-up">
                                <div className="col-12 col-md-6 d-flex" data-aos="fade-up">
                                    <div className="card-solutions mb-4 flex-fill">
                                        <div className="down-content">
                                            <div className="d-flex">
                                                <div className="icon">
                                                    <LuCodeXml className="x2"/>
                                                </div>
                                                <h4>Desenvolvimento<br/> de Software</h4>
                                            </div>

                                            <p>Soluções sob medida para o seu negócio.</p>
                                            <p>Sistemas web, aplicativos e integrações criados para otimizar rotinas e melhorar a experiência dos seus clientes.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="100">
                                    <div className="card-solutions mb-4 flex-fill">
                                        <div className="down-content">
                                            <div className="d-flex">
                                                <div className="icon">
                                                    <LuNetwork className="x2"/>
                                                </div>
                                                <h4>Infraestrutura<br/> de TI</h4>
                                            </div>
                                            <p>Planejamento, implantação e monitoramento da infraestrutura tecnológica da sua empresa.</p>
                                            <p>Do servidor à nuvem, garantimos desempenho, segurança e disponibilidade.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="200">
                                    <div className="card-solutions mb-4 flex-fill">
                                        <div className="down-content">
                                            <div className="d-flex">
                                                <div className="icon">
                                                    <LuBriefcaseBusiness className="x2"/>
                                                </div><h4>Consultoria<br/> em Tecnologia</h4>
                                            </div>
                                            <p>Orientamos empresas na adoção das melhores práticas e ferramentas de TI.</p>
                                            <p>Reduza custos, melhore processos e tome decisões baseadas em dados.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="300">
                                    <div className="card-solutions mb-4 flex-fill">
                                        <div className="down-content">
                                            <div className="d-flex">
                                                <div className="icon">
                                                    <LuHeadset className="x2"/>
                                                </div>
                                                <h4>Suporte<br/> Técnico</h4>
                                            </div>
                                            <p>Atendimento ágil e eficiente para resolver problemas e manter seus sistemas sempre em funcionamento.</p>
                                            <p>Suporte remoto ou presencial, conforme a sua necessidade.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* PARTNERS */}
            <div className="section partners bg-light">
                <div className="container">
                    <div className="row">

                    </div>
                </div>
            </div>
            {/* REQUEST */}
            <div className="section request d-none">
                <div className="container">
                    <div className="row">
                        <div
                            className="col-8 m-auto text-center"
                            data-aos="zoom-in"
                        >
                            <h1><strong>Solicite sua cotação com nosso time de especialistas em TI</strong></h1>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
