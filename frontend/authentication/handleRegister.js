/** @format */

import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const handleRegister = async ({ user, email, pwd }) => {
	try {
		const response = await axios.post(`${BACKEND_URL}/register`, {
			user,
			email,
			pwd,
		});
		return response.data;
	} catch (err) {
		console.error('Registration error:', err);
		throw err;
	}
};

export default handleRegister;
