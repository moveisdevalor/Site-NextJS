"use client";

import { useState } from "react";

import './styles.css';

export default function Newsletter() {

	const [email, setEmail] = useState("");
	const [consent, setConsent] = useState(false);

	const params = new URLSearchParams();
	if (email) params.set("email", email);
	if (consent) params.set("authorized", "1");

	const href = params.toString()
		? `/newsletter/cadastro?${params.toString()}`
		: "/newsletter/cadastro";

	return (
		<div className='newsletter'>
			<h2>Inscreva-se para receber atualizações diárias</h2>

			<div className="mt-4">
				<input type="text" className="form-control" placeholder="Email"
					   aria-label="Recipient's username" aria-describedby="button-addon2"
					   value={email} onChange={e => setEmail(e.target.value)}/>
				<div className="">
					<a className="btn btn-outline-secondary" href={href} id="button-addon2">Enviar
					</a>
				</div>
			</div>
			<div className="consent-wrapper mt-3">
				<label className="consent">
					<input type="checkbox" required checked={consent}
						   onChange={e => setConsent(e.target.checked)} />

					<span>
		Ao marcar esta caixa, você confirma que leu e concorda com nossa{" "}
						<a href="/politica-de-privacidade">política de privacidade</a>{" "}
						referentes ao armazenamento dos dados enviados por meio deste formulário.
	</span>
				</label>
			</div>

		</div>
	);
}
