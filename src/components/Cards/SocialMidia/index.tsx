import "./styles.css";
import {LuFacebook, LuInstagram, LuLinkedin, LuTwitter, LuYoutube} from "react-icons/lu";

export default function Card() {
	return (
		<>
			<div className="social-midia">
				<h2>Siga-nos</h2>
				<div className="icons-midia d-flex">
					<LuFacebook />
					<LuInstagram />
					<LuLinkedin />
					<LuTwitter />
					<LuYoutube />
				</div>
			</div>
		</>
	);
}
