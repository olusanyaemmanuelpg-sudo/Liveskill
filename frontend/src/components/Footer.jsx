/** @format */

import { useState, useEffect, useRef } from 'react';
import './Footer.css';

export function Footer({ email, setEmail, emailToUpdate }) {
	const [notification, setNotification] = useState({
		message: '',
		isError: false,
	});
	const notificationRef = useRef(null);
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	useEffect(() => {
		if (notification.message && notificationRef.current) {
			notificationRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [notification.message]);

	const showNotification = (message, isError = false) => {
		setNotification({ message, isError });
		setTimeout(() => setNotification({ message: '', isError: false }), 4000);
	};

	const onSubmit = async () => {
		if (!email) {
			return showNotification('Please provide an email address.', true);
		}
		if (!emailRegex.test(email)) {
			return showNotification('Please enter a valid email address.', true);
		}
		try {
			const result = await emailToUpdate({ emailUpdate: email });
			if (result && result.success) {
				showNotification(result.success, false);
				setEmail('');
			}
		} catch (err) {
			console.error('err', err.message);
			showNotification('An error occurred. Please try again.', true);
		}
	};
	return (
		<footer>
			<h2>LiveSKill</h2>
			<div className='footer-con'>
				<div className='footer-left'>
					<p>© LiveSkill 2026</p>
					<p>Privacy policy</p>
					<p>Cookies policy</p>
					<p>Terms of use</p>
				</div>
				<div className='footer-right'>
					<h3>Updates directly to your inbox</h3>
					<div className='footer-right-div'>
						<input
							type='email'
							name='email'
							id='email'
							placeholder='Email Address'
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
						<button
							onClick={() => {
								onSubmit();
							}}>
							Send
						</button>
					</div>
					{notification.message && (
						<p
							ref={notificationRef}
							className='notification'
							style={{
								color: notification.isError ? '#ff4d4f' : '#52c41a',
							}}>
							{notification.message}
						</p>
					)}
				</div>
			</div>
		</footer>
	);
}
