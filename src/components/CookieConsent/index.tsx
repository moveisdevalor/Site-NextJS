import { useEffect, useState } from "react";
import "./styles.css";

const STORAGE_KEY = "mv_cookie_consent";

export default function CookieConsent() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!localStorage.getItem(STORAGE_KEY)) {
			setVisible(true);
		}
	}, []);

	const handleChoice = (value: "accepted" | "rejected") => {
		localStorage.setItem(STORAGE_KEY, value);
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className="cookie-consent" role="dialog" aria-label="Aviso de cookies e cache">
			<div className="cookie-consent__content">
				<p className="cookie-consent__text">
					Utilizamos cookies e cache para melhorar sua experiência de navegação, analisar
					o tráfego do site e personalizar conteúdo. Ao continuar navegando, você concorda
					com nossa{" "}
					<a href="/politica-de-privacidade" className="cookie-consent__link">
						Política de Privacidade
					</a>
					.
				</p>
				<div className="cookie-consent__actions">
					<button
						type="button"
						className="cookie-consent__btn cookie-consent__btn--reject"
						onClick={() => handleChoice("rejected")}
					>
						Recusar
					</button>
					<button
						type="button"
						className="cookie-consent__btn cookie-consent__btn--accept"
						onClick={() => handleChoice("accepted")}
					>
						Aceitar
					</button>
				</div>
			</div>
		</div>
	);
}
