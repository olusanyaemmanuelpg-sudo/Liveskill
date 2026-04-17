/** @format */

import { getAccessToken, setAccessToken } from './auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function refreshToken() {
	try {
		const response = await fetch(`${BACKEND_URL}/refresh`, {
			method: 'GET',
			credentials: 'include', // Important to include cookies
		});
		console.log('Refresh token response status:', response.status);
		if (response.ok) {
			const data = await response.json();
			console.log('New access token received:', data.accessToken);
			setAccessToken(data.accessToken);
			return true;
		} else {
			console.error('Failed to refresh token:', response.status);
			return null;
		}
	} catch (err) {
		console.error('Error refreshing token:', err);
		return null;
	}
}

export async function makeAuthenticatedRequest(url, navigate, options = {}) {
	let token = getAccessToken();

	try {
		let res = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${token}`,
			},
			credentials: 'include',
		});

		console.log('Response status:', res.status);

		if (res.status === 401) {
			console.log('Access token expired, attempting to refresh...');
			const refreshed = await refreshToken();

			if (!refreshed) {
				console.log('Token refresh failed, redirecting to login');
				navigate('/login');
				return null;
			}

			// Retry the original request with the new token
			res = await fetch(url, {
				...options,
				headers: {
					...options.headers,
					Authorization: `Bearer ${getAccessToken()}`,
				},
				credentials: 'include',
			});
		}

		if (!res.ok) {
			// Optionally handle other errors here
			console.error(`Request to ${url} failed with status ${res.status}`);
			throw new Error(`Request failed with status ${res.status}`);
		}

		return res;
	} catch (err) {
		console.error('Network or auth error:', err);
		navigate('/login');
		throw err;
	}
}
