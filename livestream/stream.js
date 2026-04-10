/** @format */
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const startStreaming = async ({ userId, roomName, role }) => {
	try {
		const res = await axios.post(
			`${BACKEND_URL}/livestream`,
			{
				userId,
				roomName,
				role,
			},
			{
				withCredentials: true,
			},
		);
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export default startStreaming;
