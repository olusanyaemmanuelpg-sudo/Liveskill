/** @format */

import { useId, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthShell } from './AuthShell';
import handleLogin from '../../authentication/handleLogin';
import handleRegister from '../../authentication/handleRegister';
import { setAccessToken } from '../../authentication/auth';
import './EmailAuthFlow.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailAuthFlow({ mode = 'signin' }) {
	const navigate = useNavigate();
	const idPrefix = useId();
	const isLogin = mode === 'login';

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		const trimmedEmail = email.trim().toLowerCase();
		const trimmedName = name.trim();

		if (!EMAIL_REGEX.test(trimmedEmail)) {
			setError('Please enter a valid email address.');
			return;
		}
		if (!password) {
			setError('Please enter your password.');
			return;
		}

		if (!isLogin) {
			if (!trimmedName) {
				setError('Please enter your full name.');
				return;
			}
			if (password.length < 6) {
				setError('Password must be at least 6 characters.');
				return;
			}
			if (password !== confirmPassword) {
				setError('Passwords do not match.');
				return;
			}
		}

		setError('');
		setIsLoading(true);
		try {
			if (isLogin) {
				const result = await handleLogin({
					email: trimmedEmail,
					pwd: password,
				});
				if (result?.accessToken) {
					setAccessToken(result.accessToken);
					if (result.user && !result.user.hasCompletedOnboarding) {
						navigate('/welcome');
					} else {
						navigate('/liveskill');
					}
				}
			} else {
				const result = await handleRegister({
					user: trimmedName,
					email: trimmedEmail,
					pwd: password,
				});
				if (result?.accessToken) {
					setAccessToken(result.accessToken);
					navigate('/welcome');
				} else if (result?.success) {
					navigate('/login');
				}
			}
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					(isLogin
						? 'Login failed. Check your email and password or use a 6-digit email code.'
						: 'Could not create your account. Make sure the backend server is running.'),
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleClick = () => {
		setError('Google OAuth is not configured yet — continue with the form below.');
	};

	return (
		<AuthShell>
			<div className='sy-email-card'>
				<div className='sy-email-card-body'>
					<h1>{isLogin ? 'Log in to LiveSkill' : 'Create your LiveSkill account'}</h1>
					<p className='sy-email-sub'>
						{isLogin
							? 'Welcome back — enter your email and password to continue.'
							: 'Join live workshops, interact in real time, or start streaming.'}
					</p>

					<button
						type='button'
						className='sy-auth-google-btn'
						onClick={handleGoogleClick}>
						<img src='images/google.png' alt='' width='18' height='18' />
						<span>Continue with Google</span>
					</button>

					<div className='sy-auth-or'>
						<span>Or continue with email</span>
					</div>

					<form className='sy-email-form' onSubmit={handleSubmit} noValidate>
						{!isLogin && (
							<div className='sy-field-group'>
								<label htmlFor={`${idPrefix}-name`}>Full name</label>
								<input
									id={`${idPrefix}-name`}
									name='name'
									type='text'
									placeholder='John Doe'
									autoComplete='name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
						)}

						<div className='sy-field-group'>
							<label htmlFor={`${idPrefix}-email`}>Email address</label>
							<input
								id={`${idPrefix}-email`}
								name='email'
								type='email'
								placeholder='you@example.com'
								autoComplete='email'
								autoCorrect='off'
								autoCapitalize='none'
								spellCheck={false}
								enterKeyHint='next'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className='sy-field-group'>
							<label htmlFor={`${idPrefix}-pwd`}>Password</label>
							<div className='sy-pwd-wrap'>
								<input
									id={`${idPrefix}-pwd`}
									name='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='••••••••'
									autoComplete={isLogin ? 'current-password' : 'new-password'}
									minLength={isLogin ? undefined : 6}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								<button
									type='button'
									className='sy-pwd-toggle'
									aria-pressed={showPassword}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
									onClick={() => setShowPassword((prev) => !prev)}>
									<i
										className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
										aria-hidden='true'
									/>
								</button>
							</div>
						</div>

						{!isLogin && (
							<div className='sy-field-group'>
								<label htmlFor={`${idPrefix}-confirm-pwd`}>Confirm password</label>
								<div className='sy-pwd-wrap'>
									<input
										id={`${idPrefix}-confirm-pwd`}
										name='confirmPassword'
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder='••••••••'
										autoComplete='new-password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
									<button
										type='button'
										className='sy-pwd-toggle'
										aria-pressed={showConfirmPassword}
										aria-label={
											showConfirmPassword
												? 'Hide confirm password'
												: 'Show confirm password'
										}
										onClick={() => setShowConfirmPassword((prev) => !prev)}>
										<i
											className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
											aria-hidden='true'
										/>
									</button>
								</div>
							</div>
						)}

						{error && (
							<p className='sy-email-error' role='alert'>
								{error}
							</p>
						)}

						<button
							type='submit'
							className='sy-email-submit'
							disabled={isLoading}>
							{isLoading
								? isLogin
									? 'Logging in...'
									: 'Creating account...'
								: isLogin
									? 'Log in'
									: 'Create account'}
						</button>
					</form>

					<Link to='/verify-otp' className='sy-otp-alt-link'>
						Or sign in with a 6-digit email code
					</Link>
				</div>

				<div className='sy-email-card-footer'>
					{isLogin ? (
						<p>
							New to LiveSkill? <Link to='/signin'>Create an account</Link>
						</p>
					) : (
						<p>
							Already using LiveSkill? <Link to='/login'>Log in</Link>
						</p>
					)}
				</div>
			</div>
		</AuthShell>
	);
}
