import { useEffect, useState } from "react";
import "./styles.css";

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 min
const CURRENT_VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "dev";

export default function VersionChecker() {
	const [updateAvailable, setUpdateAvailable] = useState(false);

	useEffect(() => {
		if (CURRENT_VERSION === "dev") return;

		let cancelled = false;

		const check = async () => {
			try {
				const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
				if (!res.ok) return;
				const data = (await res.json()) as { version?: string };
				if (!cancelled && data.version && data.version !== CURRENT_VERSION) {
					setUpdateAvailable(true);
				}
			} catch {
				/* ignora falha de rede */
			}
		};

		check();
		const id = window.setInterval(check, CHECK_INTERVAL_MS);

		const onFocus = () => check();
		window.addEventListener("focus", onFocus);

		return () => {
			cancelled = true;
			window.clearInterval(id);
			window.removeEventListener("focus", onFocus);
		};
	}, []);

	const handleReload = () => {
		window.location.reload();
	};

	if (!updateAvailable) return null;

	return (
		<div className="version-update" role="status" aria-live="polite">
			<span className="version-update__text">Nova versão disponível</span>
			<button
				type="button"
				className="version-update__btn"
				onClick={handleReload}
			>
				Atualizar
			</button>
		</div>
	);
}
