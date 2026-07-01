import './styles.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BsNavbar from 'react-bootstrap/Navbar';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

type NavbarProps = {
	menuType: 'default' | 'transparent' | 'simple';
};

const NAV_LINKS = [
	{ label: 'Home', href: '/' },
	{ label: 'Notícias', href: '/Noticias' },
	{ label: 'Revistas', href: '/publicacoes' },
	{ label: 'Cursos', href: '/cursos' },
	{ label: 'MVTV', href: '/mvtv' },
	{ label: 'Hub do Setor', href: '/hub' },
	{ label: 'Contato', href: '/contato' },
];

const SOCIAL_LINKS = [
	{ Icon: FaFacebook, href: '#' },
	{ Icon: FaLinkedin, href: '#' },
	{ Icon: FaInstagram, href: '#' },
];

type MenuConfig = {
	logo: string;
	logoWidth: number;
};

const MENU_CONFIG: Record<NavbarProps['menuType'], MenuConfig> = {
	default: {
		logo:
			'https://www.moveisdevalor.com.br/portal/theme/magazine/img/MoveisdeValor2021_linha.png',
		logoWidth: 190,
	},
	transparent: {
		logo:
			'https://www.moveisdevalor.com.br/portal/theme/magazine/img/logo-moveis-de-valor-branca.png',
		logoWidth: 140,
	},
	simple: {
		logo:
			'https://www.moveisdevalor.com.br/portal/theme/magazine/img/logo-moveis-de-valor-branca.png',
		logoWidth: 140,
	},
};

export default function Header({ menuType }: NavbarProps) {
	const isTransparent = menuType === 'transparent';
	const config = MENU_CONFIG[menuType];

	return (
		<>
			<BsNavbar
				expand="lg"
				className={isTransparent ? 'navbar-transparent' : ''}
			>
				<Container>
					<BsNavbar.Brand href="/" className="brand">
						<img
							src={config.logo}
							width={config.logoWidth}
							alt="Logo"
						/>
					</BsNavbar.Brand>

					<BsNavbar.Toggle aria-controls="responsive-navbar-nav" />

					<BsNavbar.Collapse
						id="responsive-navbar-nav"
						className="justify-content-center"
					>
						<Nav>
							{NAV_LINKS.map((link) => (
								<Nav.Link key={link.href} href={link.href}>
									{link.label}
								</Nav.Link>
							))}
						</Nav>
					</BsNavbar.Collapse>

					<Nav className="nav-right">
						{SOCIAL_LINKS.map(({ Icon, href }, idx) => (
							<Nav.Link key={idx} href={href} className="instagram">
								<Icon />
							</Nav.Link>
						))}
					</Nav>
				</Container>
			</BsNavbar>

			{!isTransparent && (
				<div className="container header-page mt-5 mb-4 d-none">
					<div className="col-12 col-md-12 text-center">
						<img
							src="https://www.moveisdevalor.com.br/portal/upload/files/image/25898/banner-top_copiar2.jpg"
							alt="Banner"
						/>
					</div>
				</div>
			)}
		</>
	);
}

