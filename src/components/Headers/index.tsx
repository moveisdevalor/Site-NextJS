import './styles.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {FaInstagram} from "react-icons/fa";

export default function Header() {
	return (
		<>
			<Navbar expand="lg" className="">
				<Container>
					<Navbar.Brand href="/">
						<img src="https://www.moveisdevalor.com.br/portal/theme/flosix/images/logo-portal_2021.png"/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">

						<Nav>
							<Nav.Link href="/">Home</Nav.Link>
							<Nav.Link href="noticias">Notícias</Nav.Link>
							<Nav.Link href="publicacoes">Publicações</Nav.Link>
							<Nav.Link href="anuario-de-colchao">Anuário de Colchões</Nav.Link>
							<Nav.Link href="norte-e-nordeste">Norte & Nordeste</Nav.Link>
							<Nav.Link href="mvtv">MVTV</Nav.Link>
							<Nav.Link href="sobre">Sobre</Nav.Link>
							<Nav.Link href="cursos">Cursos</Nav.Link>
						</Nav>
					</Navbar.Collapse>
					<Nav className="nav-right">
						<Nav.Link href="blog" className='nav-contact'>Blog</Nav.Link>
						<Nav.Link href="https://www.instagram.com/shartech_solucoes/" className='instagram'><FaInstagram /></Nav.Link>
					</Nav>
				</Container>
			</Navbar>
			{/*<div className="container align-items-center text-center mb-4">*/}
			{/*	<img src="https://www.moveisdevalor.com.br/portal/upload/files/image/24557/Sayerlack_2024_Anuncio_Forest_web_728x90.png" width={700}/>*/}
			{/*	/!*<Banner size='top'/>*!/*/}
			{/*</div>*/}
		</>

	);
}
