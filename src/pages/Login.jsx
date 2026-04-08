/** @format */

import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import handleLogin from '../../authentication/handleLogin';
import './Login.css';
import { setAccessToken } from '../../authentication/auth';

const slides = [
	{
		title: 'You have full control over your personal data',
		desc: 'Privacy and speed are top of mind. Stay secure while you learn.',
		bg: 'linear-gradient(135deg, #7b65ff 0%, #b58aff 100%)',
	},
	{
		title: 'Unlock premium learning paths',
		desc: 'Progress dashboards and one-click enrollment at your fingertips.',
		bg: 'linear-gradient(135deg, #2a65ff 0%, #64b5ff 100%)',
	},
	{
		title: 'Connect with mentors and community',
		desc: 'Get real-time support and curated project feedback.',
		bg: 'linear-gradient(135deg, #43d7ff 0%, #9bf1ff 100%)',
	},
];

function AuthCarousel() {
	const [activeSlide, setActiveSlide] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveSlide((prev) => (prev + 1) % slides.length);
		}, 4500);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			{slides.map((slide, index) => (
				<div
					key={slide.title}
					className={`slide ${index === activeSlide ? 'active' : ''}`}
					style={{ background: slide.bg }}>
					<h1>{slide.title}</h1>
					<p>{slide.desc}</p>
				</div>
			))}

			<div className='dots'>
				{slides.map((_, index) => (
					<button
						key={`dot-${index}`}
						className={`dot ${index === activeSlide ? 'active' : ''}`}
						onClick={() => setActiveSlide(index)}
					/>
				))}
			</div>
		</>
	);
}

export function Login() {
	const [email, setEmail] = useState('');
	const [pwd, setPwd] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		// console.log('Login submit', { email, pwd });
		try {
			// Call the login handler and wait for the response
			const result = await handleLogin({ email, pwd });
			if (result && result.accessToken) {
				setAccessToken(result.accessToken);
				navigate('/liveskill');
			}
		} catch (err) {
			console.error('Login error:', err);
			setError('Login failed. Please check your credentials and try again.');
			return;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='auth-page login'>
			<div className='auth-card'>
				<div className='auth-left'>
					<AuthCarousel />
				</div>

				<div className='auth-right'>
					<h2>Log In</h2>
					<form className='auth-form' onSubmit={handleSubmit}>
						<label>
							Email address
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='john@example.com'
								required
							/>
						</label>

						<label>
							Password
							<input
								type='password'
								value={pwd}
								onChange={(e) => setPwd(e.target.value)}
								placeholder='********'
								required
							/>
						</label>

						{error && <p className='error-message'>{error}</p>}

						<button type='submit' className='btn-primary'>
							{isLoading ? 'Logging in...' : 'Log In'}
						</button>
					</form>

					<p className='auth-switch'>
						Not a member yet? <Link to='/signin'>Sign Up Now</Link>
					</p>

					<div className='auth-social'>
						<span>Or log in with</span>
						<button className='social-btn google'>
							<img src='images/google.png' alt='Google logo' /> Log in with
							Google
						</button>
						<button className='social-btn twitter'>
							<img src='images/twitter.png' alt='X logo' />
							Log in with Twitter
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
