"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { LuX, LuCopy, LuCheck } from "react-icons/lu";
import { api } from "../../../api";
import { buildPixPayload, PIX_KEY_DISPLAY } from "@/lib/pix";

type PixModalProps = {
	productId: number;
	productName: string;
	amount: number | null;
	onClose: () => void;
};

export default function PixModal({ productId, productName, amount, onClose }: PixModalProps) {
	const [name, setName] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [txid, setTxid] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const handleGenerate = async () => {
		if (!name.trim()) {
			setError("Informe seu nome para continuar.");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const { data } = await api.post(`/product/${productId}/order`, {
				name: name.trim(),
				whatsapp: whatsapp.trim(),
			});
			setTxid(data.txid);
		} catch {
			setError("Não foi possível gerar o Pix. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const payload = txid ? buildPixPayload(amount, txid) : null;

	const handleCopy = async () => {
		if (!payload) return;
		try {
			await navigator.clipboard.writeText(payload);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// clipboard indisponível — usuário copia manualmente
		}
	};

	return (
		<div className="pix-modal-overlay" onClick={onClose}>
			<div className="pix-modal" onClick={(e) => e.stopPropagation()}>
				<button type="button" className="pix-modal-close" onClick={onClose} aria-label="Fechar">
					<LuX />
				</button>

				<h3 className="pix-modal-title">Pagar com Pix</h3>
				<p className="pix-modal-subtitle">{productName}</p>

				{!payload ? (
					<div className="pix-modal-form">
						<input
							type="text"
							className="pix-modal-input"
							placeholder="Seu nome"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							type="text"
							className="pix-modal-input"
							placeholder="WhatsApp (opcional)"
							value={whatsapp}
							onChange={(e) => setWhatsapp(e.target.value)}
						/>
						{error && <p className="pix-modal-error">{error}</p>}
						<button type="button" className="pix-modal-copy" onClick={handleGenerate} disabled={loading}>
							{loading ? "Gerando..." : "Gerar QR code"}
						</button>
					</div>
				) : (
					<>
						<div className="pix-modal-qr">
							<QRCode value={payload} size={200} />
						</div>

						<p className="pix-modal-hint">Escaneie o QR code ou copie o código abaixo no app do seu banco</p>

						<button type="button" className="pix-modal-copy" onClick={handleCopy}>
							{copied ? <LuCheck /> : <LuCopy />}
							{copied ? "Código copiado!" : "Copiar código Pix"}
						</button>

						<p className="pix-modal-key">Chave Pix (CNPJ): {PIX_KEY_DISPLAY}</p>
					</>
				)}
			</div>
		</div>
	);
}
