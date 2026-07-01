import { useEffect, useState } from "react";
import {
	LuFacebook,
	LuInstagram,
	LuLinkedin,
	LuMail,
	LuMenu,
	LuX,
} from "react-icons/lu";
import { FaYoutube } from "react-icons/fa";

import "./styles4.css";

type MenuType = "default" | "transparent" | "simple";

type SidebarProps = {
	menuType?: MenuType;
};

export default function Sidebar({
									menuType = "default",
								}: SidebarProps) {

	const [open, setOpen] = useState(false);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);

	const closeMenu = () => setOpen(false);

	return (
		<header className={`header header-${menuType}`}>

			{open && (
				<div
					className="overlay"
					onClick={closeMenu}
				/>
			)}

			<div className="container header-inner">

				<a href="/" className="logo">
					<img
						src="https://www.moveisdevalor.com.br/assets/logo-moveis-de-valor.png"
						alt="Logo"
					/>
				</a>

				<nav className="nav-desktop">
					<a href="/">Home</a>
					<a href="/noticias">Notícias</a>
					<a href="/publicacoes">Revistas</a>
					<a href="/cursos">Cursos</a>
					<a href="/mvtv">MVTV</a>
					<a href="/hub">HUB Colaborativo</a>
					<a href="/feiras-e-eventos">Feiras e Eventos</a>
				</nav>

				<div className="actions">

					<a
						href="/newsletter/cadastro"
						className="newsletter"
					>
						<LuMail />
						Newsletter
					</a>

					<div className="social">
						<a href="https://www.facebook.com/MoveisdeValor"><LuFacebook /></a>
						<a href="https://www.instagram.com/moveisdevalor/"><LuInstagram /></a>
						<a href="https://www.linkedin.com/company/revistamoveisdevalor/"><LuLinkedin /></a>
						<a href="https://www.youtube.com/user/moveisdevalor"><FaYoutube /></a>
					</div>

				</div>

				<button
					className="menu-btn"
					onClick={() => setOpen(true)}
				>
					<LuMenu size={26} />
				</button>

			</div>

			<aside className={`drawer ${open ? "open" : ""}`}>

				<div className="drawer-header">
					<a href="/" className="drawer-logo" onClick={closeMenu}>
						<img
							src="https://www.moveisdevalor.com.br/assets/logo-moveis-de-valor.png"
							alt="Logo"
						/>
					</a>
					<button
						className="close-btn"
						onClick={closeMenu}
						aria-label="Fechar menu"
					>
						<LuX size={22} />
					</button>
				</div>

				<nav className="nav-mobile">

					<a href="/" onClick={closeMenu}>Home</a>
					<a href="/noticias" onClick={closeMenu}>Notícias</a>
					<a href="/publicacoes" onClick={closeMenu}>Revistas</a>
					<a href="/cursos" onClick={closeMenu}>Cursos</a>
					<a href="/mvtv" onClick={closeMenu}>MVTV</a>
					<a href="/hub" onClick={closeMenu}>HUB Colaborativo</a>
					<a href="/feiras-e-eventos" onClick={closeMenu}>Feiras e Eventos</a>

				</nav>

				<div className="drawer-footer">

					<a
						href="/newsletter/cadastro"
						className="newsletter"
					>
						<LuMail />
						Newsletter
					</a>

					<div className="social">
						<a href="https://www.facebook.com/MoveisdeValor" aria-label="Facebook"><LuFacebook /></a>
						<a href="https://www.instagram.com/moveisdevalor/" aria-label="Instagram"><LuInstagram /></a>
						<a href="https://www.linkedin.com/company/revistamoveisdevalor/" aria-label="LinkedIn"><LuLinkedin /></a>
						<a href="https://www.youtube.com/user/moveisdevalor" aria-label="YouTube"><FaYoutube /></a>
					</div>

				</div>

			</aside>

		</header>
	);
}
