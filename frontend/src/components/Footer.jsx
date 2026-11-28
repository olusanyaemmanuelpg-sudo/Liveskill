/** @format */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
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
			notificationRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			});
		}
	}, [notification.message]);

	const showNotification = (message, isError = false) => {
		setNotification({ message, isError });
		setTimeout(() => setNotification({ message: '', isError: false }), 4000);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
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
		<footer className='sy-footer'>
			<div className='sy-footer-container'>
				<div className='sy-footer-brand-row'>
					<Link to='/' className='sy-footer-brand-link'>
						<span className='sy-logo-badge' aria-hidden='true'>
							<i className='fa-solid fa-bolt' />
						</span>
						<span className='sy-logo-text'>liveskill</span>
					</Link>
					<p className='sy-footer-tagline'>
						The easiest way to learn live, teach live, and stream
					</p>
				</div>

				<div className='sy-footer-grid'>
					<div className='sy-footer-col'>
						<h4>Product</h4>
						<ul>
							<li>
								<Link to='/login'>Live Studio</Link>
							</li>
							<li>
								<a href='#split-screen-share'>Screen Sharing</a>
							</li>
							<li>
								<a href='#split-clarity'>HD WebRTC Streams</a>
							</li>
							<li>
								<a href='#split-branding'>Room Branding</a>
							</li>
							<li>
								<a href='#split-live-chat'>Real-Time Chat</a>
							</li>
							<li>
								<a href='#split-discovery'>Discovery Feed</a>
							</li>
						</ul>
					</div>

					<div className='sy-footer-col'>
						<h4>Community</h4>
						<ul>
							<li>
								<a href='#creator-resources'>Creator Guides</a>
							</li>
							<li>
								<a href='#creators-spotlight'>Featured Mentors</a>
							</li>
							<li>
								<Link to='/login'>Coding Rooms</Link>
							</li>
							<li>
								<Link to='/login'>Design Critiques</Link>
							</li>
							<li>
								<Link to='/login'>Music Workshops</Link>
							</li>
						</ul>
					</div>

					<div className='sy-footer-col'>
						<h4>LiveSkill for</h4>
						<ul>
							<li>
								<Link to='/login'>Mentors &amp; Educators</Link>
							</li>
							<li>
								<Link to='/signin'>Creators</Link>
							</li>
							<li>
								<Link to='/login'>Learners</Link>
							</li>
						</ul>
					</div>

					<div className='sy-footer-col'>
						<h4>Join us</h4>
						<p className='sy-footer-subcopy'>
							Get live session highlights and updates directly in your inbox.
						</p>
						<form className='sy-footer-form' onSubmit={onSubmit}>
							<label htmlFor='footer-email' className='visually-hidden'>
								Email address for updates
							</label>
							<input
								type='email'
								name='email'
								id='footer-email'
								placeholder='Email address'
								autoComplete='email'
								autoCorrect='off'
								autoCapitalize='none'
								spellCheck={false}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<button type='submit'>Send</button>
						</form>
						{notification.message && (
							<p
								ref={notificationRef}
								role='status'
								aria-live='polite'
								className='sy-footer-notice'
								style={{
									color: notification.isError ? '#f87171' : '#6cc04a',
								}}>
								{notification.message}
							</p>
						)}
						<div className='sy-footer-socials'>
							<a href='#features-carousel' aria-label='YouTube'>
								<i className='fa-brands fa-youtube' aria-hidden='true' />
							</a>
							<a href='#features-carousel' aria-label='X'>
								<i className='fa-brands fa-x-twitter' aria-hidden='true' />
							</a>
							<a href='#features-carousel' aria-label='Instagram'>
								<i className='fa-brands fa-instagram' aria-hidden='true' />
							</a>
							<a href='#features-carousel' aria-label='LinkedIn'>
								<i className='fa-brands fa-linkedin' aria-hidden='true' />
							</a>
						</div>
					</div>
				</div>

				<div className='sy-footer-utility'>
					<div className='sy-footer-legal-links'>
						<Link to='/login'>Terms of Service</Link>
						<Link to='/login'>Privacy Policy</Link>
						<Link to='/login'>Cookies Policy</Link>
						<Link to='/login'>Community Guidelines</Link>
						<Link to='/login'>Help Center</Link>
					</div>
					<span className='sy-footer-lang'>English</span>
				</div>

				<div className='sy-footer-copyright'>
					© LiveSkill 2026. All rights reserved. Real-time browser studio
					powered by LiveKit &amp; Socket.io.
				</div>
			</div>
		</footer>
	);
}
