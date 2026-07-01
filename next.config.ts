import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,

	// Lint nao bloqueia o build de producao.
	// Rodar `npm run lint` separadamente pra ver warnings/erros.
	eslint: {
		ignoreDuringBuilds: true,
	},

	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "**" },
			{ protocol: "http", hostname: "**" },
		],
	},

	// Normalizacao de case acontece em src/middleware.ts (case-sensitive
	// de verdade, sem o matcher fuzzy dos `redirects()` do Next).
};

export default nextConfig;
