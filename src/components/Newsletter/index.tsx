import './styles.css';

export default function Newsletter() {

	return (
		<div className='newsletter'>
			<h2>Assine para receber atualizações diárias</h2>

			<div className="mt-4">
				<input type="text" className="form-control" placeholder="Email"
					   aria-label="Recipient's username" aria-describedby="button-addon2"/>
				<div className="">
					<button className="btn btn-outline-secondary" type="button" id="button-addon2">Enviar
					</button>
				</div>
			</div>
			<div className="consent-wrapper mt-3">
				<label className="consent">
					<input type="checkbox" required />

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
