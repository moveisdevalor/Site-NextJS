import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import Providers from "./providers";
import AnalyticsPageview from "./analytics-pageview";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "aos/dist/aos.css";

const SITE_URL = "https://www.moveisdevalor.com.br";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Móveis de Valor",
		template: "%s | Móveis de Valor",
	},
	description:
		"Portal de notícias, conteúdo e negócios para a indústria moveleira brasileira.",
	icons: {
		icon: "/assets/favicon-32x32.png",
	},
	verification: {
		google: "QBgXBYHB6N6PbpWTABq0lpH2o79EpPZMJ93aoz1Bmvg",
	},
	facebook: {
		appId: "1322363489178171",
	},
	openGraph: {
		type: "website",
		locale: "pt_BR",
		siteName: "Móveis de Valor",
		url: SITE_URL,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="pt-br">
			<head>
				{/*
					Shim: Safari iOS antigo / modo privado lanca SecurityError ao
					acessar localStorage. Troca por stub em memoria se falhar.
					Inline e bloqueante: roda antes de qualquer outro script.
				*/}
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){function m(){var d={};return{getItem:function(k){return Object.prototype.hasOwnProperty.call(d,k)?d[k]:null;},setItem:function(k,v){d[k]=String(v);},removeItem:function(k){delete d[k];},clear:function(){d={};},key:function(i){return Object.keys(d)[i]||null;},get length(){return Object.keys(d).length;}};}function c(n){try{var s=window[n];s.setItem('__mv_t','1');s.removeItem('__mv_t');return true;}catch(e){return false;}}if(!c('localStorage')){try{Object.defineProperty(window,'localStorage',{configurable:true,value:m()});}catch(e){}}if(!c('sessionStorage')){try{Object.defineProperty(window,'sessionStorage',{configurable:true,value:m()});}catch(e){}}})();`,
					}}
				/>
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Cookie&family=Dancing+Script:wght@400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Leckerli+One&family=Meow+Script&family=Outfit:wght@100..900&display=swap"
				/>
			</head>
			<body>
				<Providers>{children}</Providers>

				<AnalyticsPageview />

				{/* Google Ads */}
				<Script
					id="gtag-ads-src"
					strategy="afterInteractive"
					src="https://www.googletagmanager.com/gtag/js?id=AW-838350046"
				/>
				<Script id="gtag-ads-init" strategy="afterInteractive">
					{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'AW-838350046');
					gtag('event', 'conversion', {
						'send_to': 'AW-838350046/GvcqCMeB-JccEN7p4I8D',
						'value': 1.0,
						'currency': 'BRL',
						'aw_remarketing_only': true
					});
					`}
				</Script>

				{/* Google Analytics 4 */}
				<Script
					id="gtag-ga4-src"
					strategy="afterInteractive"
					src="https://www.googletagmanager.com/gtag/js?id=G-6JKGP8PMLX"
				/>
				<Script id="gtag-ga4-init" strategy="afterInteractive">
					{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-6JKGP8PMLX', { send_page_view: false });
					`}
				</Script>

				{/* Google News - Subscribe with Google */}
				<Script
					id="swg-basic"
					strategy="afterInteractive"
					src="https://news.google.com/swg/js/v1/swg-basic.js"
				/>
				<Script id="swg-basic-init" strategy="afterInteractive">
					{`
					(self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
						basicSubscriptions.init({
							type: "NewsArticle",
							isPartOfType: ["Product"],
							isPartOfProductId: "CAoiEA0plcQurZI9BDDUz8n2OFk:openaccess",
							clientOptions: { theme: "light", lang: "pt-PT" }
						});
					});
					`}
				</Script>

				{/* OneSignal Web Push */}
				<Script
					id="onesignal-src"
					strategy="afterInteractive"
					src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
				/>
				<Script id="onesignal-init" strategy="afterInteractive">
					{`
					window.OneSignalDeferred = window.OneSignalDeferred || [];
					OneSignalDeferred.push(async function(OneSignal) {
						await OneSignal.init({
							appId: "abe7f73f-e368-4b24-9cfc-efdfafbfe87a",
							allowLocalhostAsSecureOrigin: true,
							notifyButton: {
								enable: true,
								size: "medium",
								position: "bottom-right",
								theme: "default",
								showCredit: false,
								prenotify: true,
								text: {
									"tip.state.unsubscribed": "Fique por dentro das últimas notícias",
									"tip.state.subscribed": "Você receberá as notícias em primeira mão",
									"tip.state.blocked": "Notificações bloqueadas no seu navegador",
									"message.prenotify": "Receba as notícias mais importantes do dia",
									"message.action.subscribed": "Pronto! Você não perde mais nenhuma notícia.",
									"message.action.resubscribed": "Bem-vindo de volta às notificações",
									"message.action.unsubscribed": "Você não receberá mais nossas notícias",
									"dialog.main.title": "Gerenciar notificações",
									"dialog.main.button.subscribe": "QUERO RECEBER",
									"dialog.main.button.unsubscribe": "CANCELAR",
									"dialog.blocked.title": "Desbloquear notificações",
									"dialog.blocked.message": "Siga as instruções para voltar a receber as notícias:"
								}
							},
							welcomeNotification: {
								title: "Bem-vindo ao Móveis de Valor",
								message: "Você será o primeiro a saber das principais notícias."
							},
							promptOptions: {
								slidedown: {
									prompts: [{
										type: "push",
										autoPrompt: true,
										text: {
											actionMessage: "Ative as notificações e seja o primeiro a saber das principais notícias do dia.",
											acceptButton: "QUERO RECEBER",
											cancelButton: "AGORA NÃO"
										},
										delay: { pageViews: 1, timeDelay: 10 }
									}]
								}
							}
						});
					});
					`}
				</Script>
			</body>
		</html>
	);
}
