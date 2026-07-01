import "./home.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {LuBriefcaseBusiness, LuCodeXml, LuHeadset, LuNetwork} from "react-icons/lu";
import {useEffect} from "react";
import {IoIosArrowForward} from "react-icons/io";

export default function Index() {
    useEffect(() => {
        AOS.init({ duration: 1200 });
    }, []);
    return (
        <>
            <div className="section solutions">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-4 d-block " data-aos="fade-right">
                            <h4 className="mb-3"><strong>Soluções</strong></h4>
                            <p> Na Shartech, unimos inovação e experiência para desenvolver soluções completas em software, infraestrutura, consultoria e suporte técnico.</p>
                            <p className="mt-3">Nosso foco é simplificar processos, otimizar recursos e garantir que a tecnologia trabalhe a favor do seu negócio.</p>
                            <p className="mt-3 secundary">Tecnologia é o nosso meio. O seu crescimento é o nosso fim.</p>

                            <a
                                href="https://api.whatsapp.com/send?phone=5541996565771"
                                className="btn mt-5 mb-5"
                                data-aos="zoom-in"
                                data-aos-delay="400"
                            >
                                Entre em contato <IoIosArrowForward />
                            </a>
                        </div>
                        <div className="col-12 col-lg-8 d-flex" data-aos="fade-up">
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
            <div className="section partners bg-light">
                <div className="container">
                    <div className="row">
                        {/*<h1 data-aos="fade-right">Parceiros</h1>*/}
                        <div className="col-4 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="0">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/mikrotik.png" alt=""/>
                            </div>
                        </div>

                        <div className="col-4 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="100">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/ubiquiti.png" alt=""/>
                            </div>
                        </div>

                        <div className="col-4 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="200">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/intelbras.png" alt=""/>
                            </div>
                        </div>

                        <div className="col-4 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="300">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/dell.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="300">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/hikvision.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2" data-aos="zoom-in" data-aos-delay="300">
                            <div className="card-partner">
                                <img className="img-fluid" src="https://www.shartech.com.br/theme/shartech/images/logo/aapainel.png" alt=""/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
