"use client";

import { useState } from "react";
import {LuClock, LuMail, LuMap} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { api } from "../../api";
import './contact.css';

const INITIAL_FORM = {
	name: "",
	email: "",
	empresa: "",
	phone: "",
	message: "",
};

export default function Contact() {
	const [form, setForm] = useState(INITIAL_FORM);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [newsletter, setNewsletter] = useState(false);
	const [accepted, setAccepted] = useState(false);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!form.name) {
			setMessage("Informe seu nome");
			return;
		}

		if (!form.email) {
			setMessage("Informe um email válido");
			return;
		}

		if (!accepted) {
			setMessage("Aceite a Política de Privacidade para enviar");
			return;
		}

		try {
			setLoading(true);
			setMessage("");

			await api.post("/contact", form);

			// e-mail já cadastrado na newsletter (409) não é erro para o contato
			if (newsletter) {
				await api.post("/email", { name: form.name, email: form.email, empresa: form.empresa, phone: form.phone, authorized: 1 }).catch(() => {});
			}

			setMessage("Mensagem enviada com sucesso!");
			setForm(INITIAL_FORM);
		} catch {
			setMessage("Erro ao enviar.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="contact-page">

			<div className="contact-container">
				{/* HERO */}
				<div className="contact-hero">
					<p>
						Ficou com dúvida?
					</p>
					<h1>Entre em contato</h1>

					<p>
						Nossa equipe está pronta para atender você. Preencha o
						formulário ao lado ou fale diretamente pelos canais abaixo.
					</p>

					<div className="mail d-flex pt-4">
						<LuMail />
						<p>
							<a href="mailto:contato@moveisdevalor.com.br">
								contato@moveisdevalor.com.br
							</a>
						</p>
					</div>
					<div className="phone d-flex pt-2">
						<FaWhatsapp />
						<p>
							<a
								href="https://wa.me/5541999129877?text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
								target="_blank"
								rel="noopener noreferrer"
							>
								+55 41 99912-9877
							</a>
						</p>
					</div>
					<div className="phone d-flex pt-2">
						<FaWhatsapp />
						<p>
							<a
								href="https://wa.me/5541999940090?text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es."
								target="_blank"
								rel="noopener noreferrer"
							>
								+55 41 99994-0090
							</a>{" "}
							(Jornalismo)
						</p>
					</div>

					<div className="adress d-flex pt-2">
						<LuMap />
						<p>
							Rua Deputado Estefano Mikilita n°125<br/>
							Portão Curitiba/PR
						</p>
					</div>

					<div className="hours d-flex pt-2">
						<LuClock />
						<p>
							Atendimento: segunda-feira a sexta-feira<br/>
							Das 9h às 12h30 e das 13h30 às 17h
						</p>
					</div>

				</div>

				{/* FORM */}
				<div className="contact-form-card">
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							name="name"
							placeholder="Nome"
							value={form.name}
							onChange={handleChange}
						/>

						<input
							type="email"
							name="email"
							placeholder="Digite seu melhor email"
							value={form.email}
							onChange={handleChange}
						/>

						<input
							type="text"
							name="empresa"
							placeholder="Empresa"
							value={form.empresa}
							onChange={handleChange}
						/>

						<input
							type="text"
							name="phone"
							placeholder="Telefone"
							value={form.phone}
							onChange={handleChange}
						/>

						<textarea
							name="message"
							placeholder="Mensagem"
							value={form.message}
							onChange={handleChange}
							rows={4}
						/>

						<label className="contact-newsletter">
							<input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
							Quero receber notícias da newsletter Móveis de Valor
						</label>

						<label className="contact-newsletter">
							<input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
							<span>
								Li e concordo com a{" "}
								<a href="/politica-de-privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>
							</span>
						</label>

						<button disabled={loading}>
							{loading ? "Enviando..." : "Enviar"}
						</button>
					</form>

					{message && <div className="message">{message}</div>}

					{/* SOCIAL LINKS */}
					<div className="social-section d-none">
						<span>Ou acompanhe nossos canais:</span>

						<div className="social-links">
							<a href="#" target="_blank">Instagram</a>
							<a href="#" target="_blank">LinkedIn</a>
							<a href="https://whatsapp.com/channel/0029Vb6kmHj6LwHfY16P9d2R" target="_blank">WhatsApp</a>
							<a href="#" target="_blank">YouTube</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
