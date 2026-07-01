"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../../api";
import "./optout.css";

export default function Optout() {
	const params = useSearchParams();

	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [done, setDone] = useState(false);

	useEffect(() => {
		AOS.init({ duration: 1200 });

		const emailParam = params?.get("email");
		if (emailParam) setEmail(emailParam);
	}, []);

	const handleOptout = async () => {
		if (!email || !email.includes("@")) {
			setMessage("Informe um email valido.");
			return;
		}

		try {
			setLoading(true);
			setMessage("");

			// 1) marca como inativo na nossa base
			await api.post("/email/optout", { email }).catch(() => {
				/* se nao existir na nossa base, segue assim mesmo para a blacklist */
			});

			// 2) se vier ?bl=URL na query, redireciona para a blacklist da plataforma
			const bl = params?.get("bl");
			if (bl) {
				setMessage("Cancelando inscricao...");
				window.location.href = bl;
				return;
			}

			setMessage("Seu email foi removido da newsletter.");
			setDone(true);
		} catch (err: any) {
			const status = err?.response?.status;
			if (status === 404) {
				setMessage("Email nao encontrado na nossa base.");
			} else {
				setMessage("Nao foi possivel processar sua solicitacao.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="optout-page">
			<div className="optout-card" data-aos="fade-up">
				<h1>Cancelar inscrição</h1>

				<p>
					Lamentamos ver você sair. Ao confirmar, seu email será removido
					da nossa lista de comunicação.
				</p>

				<input
					type="email"
					placeholder="Seu email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={done}
				/>

				{!done && (
					<button onClick={handleOptout} disabled={loading}>
						{loading ? "Processando..." : "Continuar"}
					</button>
				)}

				{message && <div className="message">{message}</div>}
			</div>
		</div>
	);
}
