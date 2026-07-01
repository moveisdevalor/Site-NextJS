
import { api } from '../../../api';
import { useEffect, useState } from 'react';
// import './index.css';

import PostThumbnail from "../../../components/Image/image.tsx";
// import Loading from "../../components/Loading/Loading.tsx";
import LoadingSkeleton from "../../../components/Loading/LoadingSkeleton";

type PublicationType = {
	fn_revista_id: number
	fc_status: string;
	fn_revista: number;
	fn_capa_id: number;
	fn_edicao: number;
	fd_cadastro: string;
};

export default function Users() {
	const [publications, setPublications] = useState<PublicationType[]>([]);
	const [loading, setLoading] = useState(false);

	const getPublications = async () => {
		setLoading(true); // ✅ liga o loading antes da chamada

		try {
			const response = await api.get('/publications');
			setPublications(response.data);
		} catch (err) {
			console.error("Erro ao buscar", err);
		} finally {
			setLoading(false); // ✅ desliga ao finalizar
		}
	};

	useEffect(() => {
		getPublications();
	}, []);

	function getRevistaTipo(fn_revista: number | string): string {
		switch (Number(fn_revista)) {
			case 1:
				return "Móveis de Valor";
			case 2:
				return "MVDecor";
			case 3:
				return "Norte & Nordeste:";
			case 4:
				return "Planejados&Cia";
			case 5:
				return "100% PDV";
			case 5:
				return "Anuário";
			default:
				return "Revista não identificada";
		}
	}
	if (loading) {
		return <LoadingSkeleton />;
	}

	return (
		<div>

			<div className="container">
				<div className="row">
							{publications.map((publication) => (
								<div className="col-3 mb-2">
									<div className="mb-2">
										<div className="card-body">
											<div className="d-flex align-items-center justify-content-between">
												<PostThumbnail image_id={publication.fn_capa_id} ratio="3/4"/>
											</div>
											<div>
												<h5 className="subtitle">{getRevistaTipo(publication.fn_revista)} Ed.{publication.fn_edicao}</h5>
											</div>
										</div>
									</div>
								</div>
							))}

				</div>
			</div>
		</div>
	);
}
