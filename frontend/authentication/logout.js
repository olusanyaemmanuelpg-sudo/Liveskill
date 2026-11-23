/** @format */

import { clearAccessToken } from './auth';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

async function logout(navigate) {
	try {
		const res = await fetch(`${BACKEND_URL}/logout`, {
			method: 'GET',
			credentials: 'include',
		});
		if (res.ok) {
			clearAccessToken();
			navigate('/login');
		}
	} catch (err) {
		console.error('logout', err);
	}
}

export default logout;
