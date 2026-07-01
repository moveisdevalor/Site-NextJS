import axios from 'axios';
import { getTrackingHeaders } from '../hooks/trackEvent';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
	if (typeof window === 'undefined') {
		// SSR: sem localStorage; segue sem auth/tracking
		return config;
	}

	const token = localStorage.getItem('token');

	if (token) {
		config.headers.set('Authorization', `Bearer ${token}`);
	}

	const trackingHeaders = getTrackingHeaders(window.location.search);

	Object.entries(trackingHeaders).forEach(([key, value]) => {
		if (value) {
			config.headers.set(key, value);
		}
	});

	return config;
});