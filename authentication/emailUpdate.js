/** @format */

import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

async function emailToUpdate({ emailUpdate }) {
	try {
		const res = await axios.post(`${BACKEND_URL}/email-update`, {
			emailUpdate,
		});
		return res.data;
	} catch (err) {
		console.error('err', err.message);
	}
}

export default emailToUpdate;
