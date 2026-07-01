import './styles3.css';
import {LuFacebook, LuInstagram, LuLinkedin, LuMail, LuSearch, LuShoppingBag, LuTwitter} from "react-icons/lu";

import Banner from "../Banner";
type NavbarProps = {
	menuType: 'default' | 'simple';
};

export default function Sidebar({ menuType }: NavbarProps) {
	return (
		<>
			{menuType === 'simple' ? (
				<div>Menu simples</div>
			) : (
				<>
					<header className="dark-header">
						<div className="container">
							<div className="d-flex align-content-between align-items-center">
								<div className="brand">
									<img src="https://www.moveisdevalor.com.br/portal/upload/files/image/25985/nova.png" width="140"/>
									{/*<img src="https://www.moveisdevalor.com.br/portal/theme/magazine/img/logo-moveis-de-valor-branca.png" width="140"/>*/}
									{/*<img src="https://www.moveisdevalor.com.br/portal/theme/flosix/images/logo-portal_2021.png" width="150"/>*/}
								</div>
								<div className="menus">
									<div className="header-top d-flex justify-content-between align-content-center">
										<p>Tenha clareza sobre a dor que seu negócio resolve e compartilhe, de forma consistente, conteúdo, energia e caminhos para solucioná-la.
										</p>
										<div className="d-flex">
											<LuShoppingBag />
											<LuSearch />
										</div>
									</div>
									<div className="menu d-flex gap-3 justify-content-between ">
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
												</ul>
											</div>
										</nav>
										<div className="d-flex gap-3 align-items-center">
											<div className="news d-flex gap-1 align-items-center">
												<LuMail />
												Newsletter</div>
											<div className="social d-flex align-items-center">
												<LuFacebook />
												<LuInstagram />
												<LuLinkedin />
												<LuTwitter />

											</div>
										</div>

									</div>
								</div>
							</div>

						</div>
					</header>
					<div className="section">
						<Banner size="top" />
					</div>
					{/*<div className="mt-2">*/}
					{/*	<Banner size="top" />*/}
					{/*</div>*/}

				</>


			)}
		</>

	);
}
