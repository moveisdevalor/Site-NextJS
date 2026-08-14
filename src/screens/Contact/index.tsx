"use client";

import { useState } from "react";
import {LuClock, LuMail, LuMap, LuPhone} from "react-icons/lu";
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

		try {
			setLoading(true);
			setMessage("");

			await api.post("/contact", form);

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
						<p>contato@moveisdevalor.com.br</p>
					</div>
					<div className="phone d-flex pt-2">
						<LuPhone />
						<p>+55 41 99912-9877</p>
					</div>
					<div className="phone d-flex pt-2">
						<LuPhone />
						<p>+55 41 99994-0090 (Jornalismo)</p>
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
