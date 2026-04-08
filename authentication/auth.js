/** @format */

import { refreshToken } from './request';

let accessToken = null;
let expiryTimer = null;

export const setAccessToken = (token) => {
	accessToken = token;
	scheduleExpiry(token);
};

export const getAccessToken = () => {
	return accessToken;
};

export function clearAccessToken() {
	accessToken = null;
	if (expiryTimer) {
		clearTimeout(expiryTimer);
	}
}

function scheduleExpiry(token) {
	if (expiryTimer) {
		clearTimeout(expiryTimer);
	}
	const payload = JSON.parse(atob(token.split('.')[1]));
	const expiresIn = payload.exp * 1000 - Date.now();

	// Trigger refresh 5 seconds before it actually expires
	const timeUntilRefresh = Math.max(0, expiresIn - 5000);

	console.log('Token refreshing in (ms):', timeUntilRefresh / 1000); // Debugging line
	expiryTimer = setTimeout(() => {
		console.log('Auto-refreshing token...');
		refreshToken();
	}, timeUntilRefresh);
}
