/** @format */

import axios from 'axios';
import { getAccessToken } from './auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function requestOtp(email) {
	const response = await axios.post(
		`${BACKEND_URL}/auth/otp/request`,
		{ email },
		{ withCredentials: true },
	);
	return response.data;
}

export async function verifyOtp(email, otp) {
	const response = await axios.post(
		`${BACKEND_URL}/auth/otp/verify`,
		{ email, otp },
		{ withCredentials: true },
	);
	return response.data;
}

export async function saveOnboarding(payload) {
	const token = getAccessToken();
	const response = await axios.post(
		`${BACKEND_URL}/auth/onboarding`,
		payload,
		{
			withCredentials: true,
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		},
	);
	return response.data;
}
