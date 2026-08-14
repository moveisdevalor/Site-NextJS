import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	LuFacebook,
	LuInstagram,
	LuLinkedin,
	LuMail,
	LuMenu,
	LuSearch,
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

	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);

	useEffect(() => {
		if (!searchOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setSearchOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [searchOpen]);

	const closeMenu = () => setOpen(false);

	const runSearch = () => {
		const value = searchValue.trim();
		if (!value) return;

		router.push(`/noticias?q=${encodeURIComponent(value)}`);
		setSearchValue("");
		setSearchOpen(false);
		closeMenu();
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") runSearch();
		if (e.key === "Escape") setSearchOpen(false);
	};

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
					<a href="/loja">Loja</a>
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

						<div className="search-toggle" ref={searchRef}>
							<button
								type="button"
								className="search-btn"
								aria-label="Pesquisar"
								onClick={() => setSearchOpen((o) => !o)}
							>
								<LuSearch />
							</button>

							{searchOpen && (
								<div className="search-popover">
									<input
										type="text"
										className="search-input"
										placeholder="Pesquisar no site"
										value={searchValue}
										onChange={(e) => setSearchValue(e.target.value)}
										onKeyDown={handleSearchKeyDown}
										autoFocus
									/>
									<button
										type="button"
										className="search-popover-btn"
										aria-label="Buscar"
										onClick={runSearch}
									>
										<LuSearch />
									</button>
								</div>
							)}
						</div>
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
					<a href="/loja" onClick={closeMenu}>Loja</a>

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

					<div className="drawer-search">
						<input
							type="text"
							className="search-input"
							placeholder="Pesquisar no site"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							onKeyDown={handleSearchKeyDown}
						/>
						<button
							type="button"
							className="search-btn"
							aria-label="Pesquisar"
							onClick={runSearch}
						>
							<LuSearch />
						</button>
					</div>

				</div>

			</aside>

		</header>
	);
}
