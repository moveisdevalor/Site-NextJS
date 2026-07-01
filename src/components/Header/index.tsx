
import './styles.css';

import {LuFacebook, LuInstagram, LuLinkedin, LuMail, LuSearch, LuShoppingBag, LuTwitter} from "react-icons/lu";
import { FaInstagram} from "react-icons/fa6";


import Banner from "../Banner";

type NavbarProps = {
	menuType: 'default' | 'simple';
};

export default function Sidebar({ menuType }: NavbarProps) {

	// const toggleMenu = () => {
	// 	const r = document.documentElement;
	// 	r.style.cssText = '--menu-position: -100vw;';
	// };

	return (
		<>
			{menuType === 'simple' ? (
				<div>Menu simples</div>
			) : (
				<>
					<header className="header">
						<div className="header-top d-none">
							<div className="container">
								<div className="w-100">
								<div className="d-flex align-content-between align-items-center">
									<p>Meet Newsblock. The Next Generation WordPress News Theme.</p>
									<div className="d-flex">
										<FaInstagram />
									</div>
								</div>
								</div>
							</div>
						</div>
						<div className="header-content">
							<div className="container">
								<div className="d-flex align-content-between align-items-center justify-content-between">
									<div className="brand">
										{/*<img src="https://www.moveisdevalor.com.br/portal/theme/magazine/img/logo-moveis-de-valor-branca.png" width="140"/>*/}
										<img src="https://www.moveisdevalor.com.br/portal/theme/flosix/images/logo-portal_2021.png" width="150"/>
									</div>
									<div className="">
										<Banner size="top" />
									</div>
									<div className="d-flex gap-3">

										<LuFacebook />
										<LuInstagram />
										<LuLinkedin />
										<LuTwitter />

									</div>
								</div>
							</div>
						</div>
						<div className="header-bottom">
							<div className="container">
								<div className="menus">
									<div className="menu d-flex gap-3 justify-content-between">
										<nav className="navbar navbar-expand-lg justify-content-center">
											<button className="navbar-toggler" type="button" data-bs-toggle="collapse"
													data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false"
													aria-label="Toggle navigation">
												<span className="navbar-toggler-icon"></span>
											</button>
											<div className="collapse navbar-collapse" id="navbarText">
												<ul className="navbar-nav">
													<li className="nav-item">
														<a className="nav-link active" aria-current="page" href="/">Home</a>
													</li>
													{/*<li className="nav-item">*/}
													{/*	<a className="nav-link" href="/sobre">Sobre</a>*/}
													{/*</li>*/}
													<li className="nav-item">
														<a className="nav-link" href="/noticias">Notícias</a>
													</li>
													<li className="nav-item">
														<a className="nav-link" href="/publicacoes">Revistas</a>
													</li>
													<li className="nav-item">
														<a className="nav-link" href="/cursos">Cursos</a>
													</li>
													<li className="nav-item">
														<a className="nav-link" href="/mvtv">MVTV</a>
													</li>
													<li className="nav-item">
														<a className="nav-link" href="/hub">HUB do Setor</a>
													</li>
													<li className="nav-item">
														<a className="nav-link" href="/feiras-e-eventos">Feiras e Eventos</a>
													</li>
													<li className="nav-item">
														<a className="nav-link" href="/contato">Contato</a>
													</li>
												</ul>
											</div>
										</nav>
										<div className="d-flex gap-3 align-items-center">
											<div className="news d-flex gap-2 align-items-center">
												<a href="subscribe">
													<LuMail />
												Newsletter
												</a>
												</div>
											<div className="social d-flex align-items-center">
												<a href="loja">
													<LuShoppingBag />
												</a>
												<a href="pesquisar">
												<LuSearch />
												</a>
											</div>
										</div>

									</div>
								</div>
							</div>
						</div>

					</header>
				</>


			)}
		</>

	);
}
