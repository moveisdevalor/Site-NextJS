import "./styles.css";

export default function Blog() {

	return (

		<div className="section">
			<div className="container">
				<div className="row">
					<div className="col-12 d-flex gap-3 mb-2">
						<a href="" className="btn">Tecnologia</a>
						<a href="" className="btn">Software</a>
						<a href="" className="btn">Hardware</a>
						<a href="" className="btn">IA</a>
					</div>
					<div className="col-4 mt-3">
						<div className="card">
							<div className="card-body">
								Foto|
								Title|
								Descrição|
								Botão|
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
