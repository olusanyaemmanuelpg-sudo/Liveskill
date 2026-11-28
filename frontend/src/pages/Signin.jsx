/** @format */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import handleRegister from '../../authentication/handleRegister';
import './Signin.css';

const slides = [
	{
		title: 'Welcome to LiveSkill',
		desc: 'Start learning with structured courses and mentor support.',
		bg: 'linear-gradient(135deg, #7b65ff 0%, #b58aff 100%)',
	},
	{
		title: 'Build your portfolio',
		desc: 'Create real-world projects and showcase your skills.',
		bg: 'linear-gradient(135deg, #3f7fff 0%, #94caff 100%)',
	},
	{
		title: 'Stay consistent',
		desc: 'Daily streaks and check-ins to keep your momentum strong.',
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

export function Signin() {
	const location = useLocation();
	const [name, setName] = useState('');
	const [email, setEmail] = useState(location.state?.email || '');
	const [pwd, setPwd] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [emailTouched, setEmailTouched] = useState(false);
	const [emailValid, setEmailValid] = useState(true);
	const [passwordsMatch, setPasswordsMatch] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	// Email validation regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Remove setState from useEffect, do validation in handlers
	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		setEmailTouched(true);
		setEmailValid(emailRegex.test(e.target.value));
	};

	const handlePwdChange = (e) => {
		setPwd(e.target.value);
		setPasswordsMatch(
			e.target.value === confirmPassword || confirmPassword === '',
		);
	};

	const handleConfirmPwdChange = (e) => {
		setConfirmPassword(e.target.value);
		setPasswordsMatch(pwd === e.target.value || e.target.value === '');
	};

	// clicking submit will trigger this function, which will validate the inputs and call handleRegister
	const onSubmit = async (e) => {
		e.preventDefault();
		if (!emailRegex.test(email)) {
			setEmailTouched(true);
			setEmailValid(false);
			return;
		}
		if (pwd !== confirmPassword) {
			setPasswordsMatch(false);
			return;
		}

		// Call handleRegister and wait for result
		setIsLoading(true);
		try {
			const result = await handleRegister({
				user: name,
				email,
				pwd,
			});
			if (result && result.success) {
				navigate('/liveskill');
			} else {
				setError(
					result?.message ||
						'Username and email already exists. Please try again.',
				);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='auth-page'>
			<div className='auth-card'>
				<div className='auth-left'>
					<AuthCarousel />
				</div>

				<div className='auth-right'>
					<h2>Sign Up</h2>
					<form className='auth-form' onSubmit={onSubmit}>
						<label>
							Full name
							<input
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='John Doe'
								required
							/>
						</label>

						<label>
							Email address
							<input
								type='email'
								value={email}
								onChange={handleEmailChange}
								onBlur={() => setEmailTouched(true)}
								placeholder='john@example.com'
								required
								className={!emailValid && emailTouched ? 'input-error' : ''}
							/>
						</label>

						<label>
							Password
							<input
								type='password'
								value={pwd}
								onChange={handlePwdChange}
								placeholder='********'
								required
								className={!passwordsMatch ? 'input-error' : ''}
							/>
						</label>

						<label>
							Confirm password
							<input
								type='password'
								value={confirmPassword}
								onChange={handleConfirmPwdChange}
								placeholder='********'
								required
								className={!passwordsMatch ? 'input-error' : ''}
							/>
						</label>
						{error && <p className='error-message'>{error}</p>}

						<button type='submit' className='btn-primary' disabled={isLoading}>
							{isLoading ? 'Creating Account...' : 'Create Account'}
						</button>
					</form>

					<p className='auth-switch'>
						Already have an account? <Link to='/login'>Log In</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
