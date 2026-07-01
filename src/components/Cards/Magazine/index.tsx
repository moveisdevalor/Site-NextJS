import './styles.css';
import mapa from "../../../assets/Mock_UP_MV_250.png";

export default function Card() {
	return (
		<div className="card magazine">
			<div className="card-body">
				<h2 className="title">Revista Móveis de Valor</h2>
				<h1 className="title">Especial Cozinhas</h1>
				<img src={mapa.src} alt="Mapa" className="magazine-img" />
			</div>
		</div>
	);
}
