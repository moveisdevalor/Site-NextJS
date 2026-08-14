// =====================================================================
// Gera o payload Pix "copia e cola" (BR Code / EMV) estático.
// =====================================================================

const PIX_KEY = "13548222000195";
const MERCHANT_NAME = "CORSI EDITORA LTDA - EPP";
const MERCHANT_CITY = "CURITIBA";

function tlv(id: string, value: string): string {
	const len = String(value.length).padStart(2, "0");
	return `${id}${len}${value}`;
}

function crc16(payload: string): string {
	let crc = 0xffff;

	for (let i = 0; i < payload.length; i++) {
		crc ^= payload.charCodeAt(i) << 8;
		for (let j = 0; j < 8; j++) {
			crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
			crc &= 0xffff;
		}
	}

	return crc.toString(16).toUpperCase().padStart(4, "0");
}

// remove acentos e caracteres fora do padrão aceito pelo Pix (alfanumérico + espaço/hífen)
function sanitize(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-zA-Z0-9 \-.]/g, "")
		.toUpperCase();
}

export function parsePriceToAmount(value: string): number | null {
	if (!value) return null;
	const normalized = value.trim().replace(/\./g, "").replace(",", ".");
	const amount = Number(normalized);
	if (!amount || isNaN(amount) || amount <= 0) return null;
	return amount;
}

export function buildPixPayload(amount: number | null, txid?: string | null): string {
	const gui = tlv("00", "BR.GOV.BCB.PIX");
	const keyField = tlv("01", PIX_KEY);
	const merchantAccountInfo = tlv("26", gui + keyField);

	const payloadFormat = tlv("00", "01");
	const mcc = tlv("52", "0000");
	const currency = tlv("53", "986");
	const amountField = amount ? tlv("54", amount.toFixed(2)) : "";
	const country = tlv("58", "BR");
	const merchantName = tlv("59", sanitize(MERCHANT_NAME).slice(0, 25));
	const merchantCity = tlv("60", sanitize(MERCHANT_CITY).slice(0, 15));
	const additionalData = tlv("62", tlv("05", txid || "***"));

	const payloadWithoutCrc =
		payloadFormat +
		merchantAccountInfo +
		mcc +
		currency +
		amountField +
		country +
		merchantName +
		merchantCity +
		additionalData +
		"6304";

	return payloadWithoutCrc + crc16(payloadWithoutCrc);
}

export const PIX_KEY_DISPLAY = "13.548.220/0001-95";
