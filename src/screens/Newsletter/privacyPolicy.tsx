"use client";

import "./privacy-policy.css";
import { useEffect } from "react";
import AOS from "aos";

export default function PrivacyPolicy() {

	useEffect(() => {
		AOS.init({ duration: 1200 });
	}, []);

	return (
		<>
			{/* HERO */}
			<div className="section partners bg-light p-50">
				<div className="container">
					<div className="row">

						<div
							className="col-lg-6 d-flex flex-column justify-content-center"
							data-aos="fade-right"
						>
							<h2 className="mb-3">
								<strong>Política de Privacidade</strong>
							</h2>

							<p>
								Este site é mantido e operado por Móveis de Valor.
							</p>
						</div>

						<div
							className="col-lg-6 d-flex align-items-center justify-content-center"
							data-aos="fade-left"
						>
							<h1 style={{ fontSize: 80, opacity: 0.1 }} />
						</div>

					</div>
				</div>
			</div>


			{/* CONTENT */}
			<div className="container mt-3">
				<div className="row">
					<p>
						Nós coletamos e utilizamos alguns dados pessoais pertencentes aos usuários
						do site. Ao fazê-lo, atuamos na qualidade de controlador desses dados,
						conforme a Lei Federal nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD).
					</p>
					<p>
						Esta Política descreve:
						<br />– quem deve utilizar nosso site;
						<br />– quais dados coletamos;
						<br />– como utilizamos esses dados;
						<br />– seus direitos como titular;
						<br />– como entrar em contato conosco.
					</p>
					<p className="mt-3">
						<strong>1. Dados que coletamos e finalidade da coleta</strong>
					</p>

					<p>
						Coletamos os seguintes dados pessoais fornecidos diretamente pelos usuários:
					</p>

					<p>
						<span className="badge">nome completo</span>
						<span className="badge">e-mail</span>
						<span className="badge">telefone</span>
						<span className="badge">profissão</span>
						<span className="badge">estado</span>
						<span className="badge">nome da empresa</span>
						<span className="badge">atividade</span>
						<span className="badge">ramo</span>
					</p>

					<p>
						A coleta ocorre quando:
						<br />– o usuário realiza cadastro na newsletter;
						<br />– o usuário entra em contato pelo formulário do site.
					</p>

					<p>
						Finalidades:
						<br />– permitir contato com nossa equipe;
						<br />– envio de notícias e comunicações do portal.
					</p>


					<p className="mt-3">
						<strong>2. Dados coletados automaticamente</strong>
					</p>

					<p>
						Também coletamos:
						<span className="badge">endereço IP</span>
						<span className="badge">dados de geolocalização</span>
					</p>

					<p>
						Esses dados são utilizados para personalizar a experiência do usuário.
					</p>


					<p className="mt-3">
						<strong>3. Dados sensíveis</strong>
					</p>

					<p>
						Não coletamos dados sensíveis conforme definidos nos artigos 11 e seguintes
						da LGPD.
					</p>

					<p>
						Isso inclui:
						<br />– origem racial ou étnica
						<br />– convicção religiosa
						<br />– opinião política
						<br />– filiação sindical
						<br />– dados de saúde
						<br />– dados biométricos
						<br />– dados genéticos
						<br />– vida sexual
					</p>


					<p className="mt-3">
						<strong>4. Cookies</strong>
					</p>

					<p>
						Cookies são pequenos arquivos armazenados no dispositivo do usuário para
						melhorar a experiência de navegação.
					</p>

					<p>
						Eles permitem:
						<br />– lembrar preferências
						<br />– personalizar conteúdos
						<br />– identificar sessões
					</p>


					<p className="mt-2"><strong>4.1 Cookies próprios</strong></p>

					<p>
						Utilizados para:
						<br />– funcionamento do site
						<br />– personalização da navegação
					</p>


					<p className="mt-2"><strong>4.2 Cookies de terceiros</strong></p>

					<p>
						Podem ser definidos por parceiros como:
						<br />– <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=pt-BR">Google Analytics</a>
						<br />– <a href="https://www.facebook.com/policies/cookies">Facebook</a>
						<br />– <a href="https://onesignal.com/privacy_policy">OneSignal</a>
						<br />– <a href="https://www.cloudflare.com/pt-br/privacypolicy/">Cloudflare</a>
					</p>

					<p className="mt-2"><strong>4.3 Gestão de cookies</strong></p>

					<p>
						O usuário pode desativar cookies diretamente no navegador:
					</p>

					<p>
						<a href="https://support.google.com/chrome/answer/95647?hl=pt-BR"> - Chrome</a>
					</p>

					<p>
						<a href="https://support.mozilla.org/pt-BR/kb/ative-e-desative-os-cookies-que-os-sites-usam"> - Firefox</a>
					</p>

					<p>
						<a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"> - Safari</a>
					</p>

					<p>
						<a href="https://www.opera.com/help/tutorials/security/privacy/"> - Opera</a>
					</p>

					<p>
						<a href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies"> - Internet Explorer</a>
					</p>

					<p>
						<i>A desativação pode comprometer funcionalidades do site.</i>
					</p>


					<p className="mt-3">
						<strong>5. Compartilhamento de dados</strong>
					</p>

					<p>
						Não compartilhamos dados pessoais com terceiros, exceto:
						<br />– por obrigação legal
						<br />– por ordem judicial
						<br />– por determinação de autoridade pública
					</p>


					<p className="mt-3">
						<strong>6. Tempo de armazenamento</strong>
					</p>

					<p>
						Os dados são armazenados apenas pelo período necessário para cumprir as
						finalidades descritas nesta política ou conforme exigido por lei.
					</p>

					<p>
						Após esse período:
						<br />– os dados são excluídos
						<br />ou
						<br />– anonimizados
					</p>


					<p className="mt-3">
						<strong>7. Bases legais para tratamento</strong>
					</p>

					<p>
						Tratamos dados pessoais com base em:
						<br />– consentimento do titular
						<br />– execução de contrato
						<br />– interesse legítimo do controlador
					</p>


					<p className="mt-3">
						<strong>8. Direitos do titular</strong>
					</p>

					<p>
						O usuário pode solicitar:
						<br />– confirmação do tratamento
						<br />– acesso aos dados
						<br />– correção de dados
						<br />– anonimização ou exclusão
						<br />– portabilidade
						<br />– revogação do consentimento
						<br />– informações sobre compartilhamento
						<br />– bloqueio de dados irregulares
					</p>


					<p className="mt-3">
						<strong>9. Segurança dos dados</strong>
					</p>

					<p>
						Adotamos medidas técnicas e organizacionais adequadas para proteger dados
						pessoais contra acessos não autorizados, perda ou alteração.
					</p>

					<p>
						Em caso de incidente relevante, notificaremos usuários e a ANPD.
					</p>


					<p className="mt-3">
						<strong>10. Alterações desta política</strong>
					</p>

					<p>
						Esta política pode ser atualizada periodicamente.
					</p>

					<p>
						Última atualização: <strong>01/04/2026</strong>
					</p>


					<p className="mt-3">
						<strong>11. Contato</strong>
					</p>

					<p>
						E-mail: <a href="mailto:moveisdevalor@moveisdevalor.com.br">moveisdevalor@moveisdevalor.com.br</a>
						<br />
						Telefone: <a href="https://api.whatsapp.com/send?phone=5541999129877">(41) 99912-9877</a>
						<br />
						Endereço:
						<br /><br />
						Rua Deputado Estefano Mikilita, 125 – 3º andar
						<br />
						Curitiba – PR – Brasil
						<br />
						CEP 81070-430
					</p>

				</div>
			</div>

		</>
	);
}
