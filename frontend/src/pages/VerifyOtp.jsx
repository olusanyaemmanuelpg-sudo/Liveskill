/** @format */

import { useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthShell } from '../components/AuthShell';
import { OtpVerificationCard } from '../components/OtpVerificationCard';
import { requestOtp, verifyOtp } from '../../authentication/otpAuth';
import { setAccessToken } from '../../authentication/auth';
import '../components/EmailAuthFlow.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function VerifyOtp() {
	const location = useLocation();
	const navigate = useNavigate();
	const idPrefix = useId();

	const initialEmail = location.state?.email || '';
	const initialOtpSent = Boolean(location.state?.otpSent && initialEmail);

	const [email, setEmail] = useState(initialEmail);
	const [otpSent, setOtpSent] = useState(initialOtpSent);
	const [devOtpHint, setDevOtpHint] = useState(location.state?.devOtp || '');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSendCode = async (e) => {
		e.preventDefault();
		const trimmed = email.trim().toLowerCase();
		if (!EMAIL_REGEX.test(trimmed)) {
			setError('Please enter a valid email address.');
			return;
		}
		setError('');
		setIsLoading(true);
		try {
			const data = await requestOtp(trimmed);
			setEmail(trimmed);
			setDevOtpHint(data?.devOtp || '');
			setOtpSent(true);
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					'Could not send login code. Make sure the backend server is running.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyCode = async (code) => {
		setError('');
		setIsLoading(true);
		try {
			const result = await verifyOtp(email, code);
			if (result?.accessToken) {
				setAccessToken(result.accessToken);
				if (result.user && !result.user.hasCompletedOnboarding) {
					navigate('/welcome', { state: { email } });
				} else {
					navigate('/liveskill');
				}
			}
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					'Invalid or expired 6-digit code. Please try again.',
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResend = async () => {
		setError('');
		try {
			const data = await requestOtp(email);
			setDevOtpHint(data?.devOtp || '');
			return { success: true };
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					'Failed to resend 6-digit code. Please try again.',
			);
			return { success: false };
		}
	};

	return (
		<AuthShell>
			{otpSent ? (
				<OtpVerificationCard
					email={email}
					onVerify={handleVerifyCode}
					onResend={handleResend}
					onChangeEmail={() => {
						setError('');
						setOtpSent(false);
					}}
					onGoogleClick={() =>
						setError(
							'Google OAuth is not configured yet — enter your 6-digit email code above.',
						)
					}
					devOtpHint={devOtpHint}
					isSubmitting={isLoading}
					error={error}
				/>
			) : (
				<div className='sy-email-card'>
					<div className='sy-email-card-body'>
						<h1>Continue with email code</h1>
						<p className='sy-email-sub'>
							Enter your email address and we’ll send a 6-digit verification
							code.
						</p>

						<form className='sy-email-form' onSubmit={handleSendCode} noValidate>
							<div className='sy-field-group'>
								<label htmlFor={`${idPrefix}-otp-email`}>Email address</label>
								<input
									id={`${idPrefix}-otp-email`}
									name='email'
									type='email'
									placeholder='you@example.com'
									autoComplete='email'
									autoCorrect='off'
									autoCapitalize='none'
									spellCheck={false}
									enterKeyHint='go'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							{error && (
								<p className='sy-email-error' role='alert'>
									{error}
								</p>
							)}

							<button
								type='submit'
								className='sy-email-submit'
								disabled={isLoading}>
								{isLoading ? 'Sending code...' : 'Send 6-digit code'}
							</button>
						</form>
					</div>

					<div className='sy-email-card-footer'>
						<p>
							Prefer password? <Link to='/login'>Log in with password</Link>
						</p>
					</div>
				</div>
			)}
		</AuthShell>
	);
}
