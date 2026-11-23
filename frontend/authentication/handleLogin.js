/** @format */

import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const handleLogin = async ({ email, pwd }) => {
	try {
		const response = await axios.post(`${BACKEND_URL}/auth`, {
			email,
			pwd,
		}, {
			withCredentials: true
		});
		return response.data;
	} catch (err) {
		console.error('Login error:', err);
		throw err;
	}
};

export default handleLogin;
