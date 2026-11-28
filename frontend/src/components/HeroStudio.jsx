/** @format */

import { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { requestOtp } from '../../authentication/otpAuth';
import './HeroStudio.css';

const STUDIO_SCENES = [
	'https://res.cloudinary.com/dovuy2zci/image/upload/v1774647316/smiling-ceo-his-office_23-2147626275_iwtgns.jpg',
	'https://res.cloudinary.com/dovuy2zci/image/upload/v1774647171/handsome-man-smiling-happy-face-portrait-close-up_53876-139608_wdtxpb.jpg',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function HeroStudio() {
	const [email, setEmail] = useState('');
	const [agreed, setAgreed] = useState(false);
	const [sceneIndex, setSceneIndex] = useState(0);
	const [isSending, setIsSending] = useState(false);
	const [heroError, setHeroError] = useState('');
	const navigate = useNavigate();
	const idPrefix = useId();

	useEffect(() => {
		const timer = setInterval(() => {
			setSceneIndex((prev) => (prev + 1) % STUDIO_SCENES.length);
		}, 6500);
		return () => clearInterval(timer);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const trimmed = email.trim().toLowerCase();
		if (!EMAIL_REGEX.test(trimmed)) {
			setHeroError('Please enter a valid email address.');
			return;
		}
		setHeroError('');
		setIsSending(true);
		try {
			const data = await requestOtp(trimmed);
			navigate('/signin', {
				state: {
					email: trimmed,
					otpSent: true,
					devOtp: data?.devOtp || '',
				},
			});
		} catch (err) {
			setHeroError(
				err?.response?.data?.message ||
					'Could not send login code. Please try again.',
			);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<section className='sy-hero'>
			<div className='sy-hero-media' aria-hidden='true'>
				{STUDIO_SCENES.map((src, idx) => (
					<img
						key={src}
						src={src}
						alt=''
						className={`sy-hero-scene ${idx === sceneIndex ? 'is-active' : ''}`}
					/>
				))}
				<div className='sy-hero-scrim' />
			</div>

			<div className='sy-hero-container'>
				<div className='sy-hero-copy'>
					<h1>The easiest way to learn live and stream</h1>
					<p className='sy-hero-subtitle'>
						LiveSkill is a professional live streaming and skill-sharing studio
						in your browser. Teach coding, design, music, or stream live with
						learners worldwide.
					</p>
				</div>

				<div className='sy-hero-card'>
					<form onSubmit={handleSubmit} noValidate>
						<button
							type='button'
							className='sy-google-pill'
							onClick={() => navigate('/signin')}>
							<img src='images/google.png' alt='' width='18' height='18' />
							<span>Continue with Google</span>
						</button>

						<div className='sy-email-divider'>
							<span>Or continue with email</span>
						</div>

						<label htmlFor={`${idPrefix}-hero-email`} className='visually-hidden'>
							Email address
						</label>
						<input
							id={`${idPrefix}-hero-email`}
							name='email'
							type='email'
							placeholder='Enter email address'
							autoComplete='email'
							autoCorrect='off'
							autoCapitalize='none'
							spellCheck={false}
							enterKeyHint='go'
							className='sy-hero-input'
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (heroError) setHeroError('');
							}}
						/>

						{heroError && (
							<p className='sy-hero-error' role='alert'>
								{heroError}
							</p>
						)}

						<button
							type='submit'
							className='sy-hero-submit'
							disabled={isSending}>
							{isSending ? 'Sending code...' : 'Get started - it’s free!'}
						</button>

						<div className='sy-consent-box'>
							<label className='sy-consent-label'>
								<span className='sy-check-wrap'>
									<input
										type='checkbox'
										checked={agreed}
										onChange={(e) => setAgreed(e.target.checked)}
									/>
									<span className='sy-check-visual' aria-hidden='true'>
										{agreed && <i className='fa-solid fa-check' />}
									</span>
								</span>
								<span className='sy-consent-text'>
									I agree to receive live workshop updates and creator news, as
									described in the <Link to='/login'>privacy policy</Link>.
								</span>
							</label>
						</div>

						<p className='sy-hero-trusted'>
							Trusted by creators &amp; learners worldwide!
						</p>

						<p className='sy-hero-legal'>
							By continuing, you accept our{' '}
							<Link to='/login'>Terms of Service</Link> and acknowledge receipt
							of our <Link to='/login'>Privacy Policy</Link>.
						</p>

						<div className='sy-card-rule' aria-hidden='true' />

						<p className='sy-hero-login-note'>
							Already using LiveSkill? <Link to='/login'>Log in</Link>.
						</p>
					</form>
				</div>
			</div>
		</section>
	);
}
