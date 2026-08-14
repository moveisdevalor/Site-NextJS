import './styles.css';

export default function Footer() {
	return (
		<footer className="site-footer">
			<div className="container py-5">
				<div className="row g-4">

					<div className="col-12 col-lg-3 footer-brand text-center text-lg-start">
						<a href="https://www.moveisdevalor.com.br">
							<img
								src="https://www.moveisdevalor.com.br/assets/logo-moveis-de-valor-branca.png"
								width="190"
								alt="Móveis de Valor"
							/>
						</a>
					</div>

					<div className="col-6 col-md-4 col-lg-3">
						<h4 className="footer-title">Portal</h4>
						<ul className="footer-list">
							<li><a href="/">Home</a></li>
							<li><a href="/noticias">Notícias</a></li>
							<li><a href="/publicacoes">Revistas</a></li>
							<li><a href="/mvtv">MVTV</a></li>
							<li><a href="/hub">HUB</a></li>
							<li><a href="/feiras-e-eventos">Feiras e Eventos</a></li>
						</ul>
					</div>

					<div className="col-6 col-md-4 col-lg-3">
						<h4 className="footer-title">Institucional</h4>
						<ul className="footer-list">
							<li><a href="/sobre">Sobre</a></li>
							<li><a href="/anuncie">Anuncie</a></li>
							<li><a href="/cursos">Cursos</a></li>
							<li><a href="/faq">FAQ</a></li>
							<li><a href="/contato">Contato</a></li>
						</ul>
					</div>

					<div className="col-12 col-md-4 col-lg-3">
						<h4 className="footer-title">Sites</h4>
						<ul className="footer-list">
							<li><a href="https://www.anuariodecolchoes.com.br/">Anuário de Colchões</a></li>
							<li><a href="https://www.impulso.net.br/">Instituto Impulso</a></li>
						</ul>
					</div>

				</div>
			</div>

			<div className="copy">
				<div className="container py-3 text-center">
					<p>© 2026 IntelligenceGroup, All Rights Reserved</p>
				</div>
			</div>
		</footer>
	);
}
