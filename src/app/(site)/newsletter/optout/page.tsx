import type { Metadata } from "next";
import { Suspense } from "react";

import NewsletterOptOUT from "@/screens/Newsletter/optout";

export const metadata: Metadata = {
	title: "Cancelar inscrição — Newsletter",
	description: "Gerencie sua inscrição na newsletter da Móveis de Valor.",
	robots: { index: false, follow: false },
};

export default function NewsletterOptOutPage() {
	return (
		<Suspense fallback={null}>
			<NewsletterOptOUT />
		</Suspense>
	);
}
