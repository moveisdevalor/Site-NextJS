import './styles.css';
import {LuFacebook, LuInstagram, LuLinkedin} from "react-icons/lu";


type NavbarProps = {
	menuType: 'default' | 'simple';
};

export default function Sidebar({ menuType }: NavbarProps) {
	return (
		<>
			{menuType === 'simple' ? (
				<div>Menu simples</div>
			) : (
				<header className="mb-4">
					{/*<div className="header-top bg-light">*/}
					{/*	<div className="container d-flex gap-2">*/}
					{/*		<p className="/sobre">Sobre</p>*/}
					{/*		<p className="/contato">Contato</p>*/}
					{/*	</div>*/}
					{/*</div>*/}
					<div className="container p-3 mt-3">
						<div className="d-flex justify-content-between">
							<a className="navbar-brand" href="/">
								<img src="https://www.moveisdevalor.com.br/portal/theme/flosix/images/logo-portal_2021.png"/>
							</a>
							<div className="">
								<img src="https://www.moveisdevalor.com.br/portal/upload/files/image/24557/Sayerlack_2024_Anuncio_Forest_web_728x90.png" width={700}/>
								{/*<Banner size='top'/>*/}
							</div>
							<div className="d-flex flex-column gap-3 align-items-center">
								<LuFacebook />
								<LuInstagram />
								<LuLinkedin />
							</div>
						</div>
					</div>

					<div className="">
						<div className="container justify-content-center">
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
						</div>

					</div>

				</header>
			)}
		</>

	);
}
