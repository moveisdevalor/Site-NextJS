"use client";

import AOS from 'aos';
import {useEffect} from "react";

export default function Register() {
	useEffect(() => {
		AOS.init({ duration: 1200 });
	}, []);
	return (
		<>
		</>
	);
}
