/** @format */

import { useEffect, useId, useRef, useState } from 'react';
import './OtpVerificationCard.css';

export function OtpVerificationCard({
	email,
	onVerify,
	onResend,
	onChangeEmail,
	onGoogleClick,
	devOtpHint,
	isSubmitting,
	error,
}) {
	const [code, setCode] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const [helpOpen, setHelpOpen] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const [resendMessage, setResendMessage] = useState('');
	const inputRef = useRef(null);
	const idPrefix = useId();

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		if (cooldown <= 0) return;
		const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [cooldown]);

	const handleChange = (e) => {
		const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
		setCode(digitsOnly);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (code.length === 6 && !isSubmitting) {
			onVerify(code);
		}
	};

	const handleResendClick = async () => {
		if (cooldown > 0) return;
		setResendMessage('');
		const res = await onResend();
		if (res?.success) {
			setCooldown(30);
			setResendMessage('A fresh 6-digit code was sent.');
		}
	};

	const activeSlot = Math.min(code.length, 5);

	return (
		<div className='sy-otp-card'>
			<div className='sy-otp-body'>
				<h1>Please check your email</h1>
				<p id={`${idPrefix}-otp-desc`} className='sy-otp-subtitle'>
					We’ve sent a 6-digit login code to
					<strong>{email}</strong>
				</p>

				{devOtpHint && (
					<div className='sy-dev-otp-banner'>
						<span>
							Local dev code: <strong>{devOtpHint}</strong>
						</span>
						<button
							type='button'
							onClick={() => {
								setCode(devOtpHint);
								inputRef.current?.focus();
							}}>
							Fill code
						</button>
					</div>
				)}

				<form className='sy-otp-form' onSubmit={handleSubmit} noValidate>
					<label htmlFor={`${idPrefix}-otp-input`} className='visually-hidden'>
						6-digit verification code
					</label>

					{/* Single accessible input overlaying 6 segmented digit boxes */}
					<div
						className='sy-otp-boxes-wrap'
						onClick={() => inputRef.current?.focus()}>
						<input
							ref={inputRef}
							id={`${idPrefix}-otp-input`}
							name='otp'
							type='text'
							inputMode='numeric'
							autoComplete='one-time-code'
							pattern='\d{6}'
							maxLength={6}
							aria-describedby={`${idPrefix}-otp-desc`}
							value={code}
							onChange={handleChange}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							required
							className='sy-otp-real-input'
						/>

						<div className='sy-otp-boxes' aria-hidden='true'>
							{Array.from({ length: 6 }).map((_, idx) => {
								const char = code[idx] || '';
								const isCurrent = isFocused && idx === activeSlot;
								return (
									<div
										key={idx}
										className={`sy-otp-box ${isCurrent ? 'is-focused' : ''} ${char ? 'is-filled' : ''}`}>
										{char || (isCurrent ? <span className='sy-otp-caret' /> : '')}
									</div>
								);
							})}
						</div>
					</div>

					{error && (
						<p className='sy-otp-error' role='alert'>
							{error}
						</p>
					)}

					<button
						type='submit'
						className={`sy-otp-submit ${code.length === 6 ? 'is-ready' : ''}`}
						disabled={code.length !== 6 || isSubmitting}>
						{isSubmitting ? 'Verifying...' : 'Log in'}
					</button>
				</form>
			</div>

			<div className='sy-otp-footer'>
				<button
					type='button'
					className='sy-otp-help-trigger'
					aria-expanded={helpOpen}
					aria-controls={`${idPrefix}-otp-help`}
					onClick={() => setHelpOpen((prev) => !prev)}>
					<span>
						Didn’t receive an email?
						<br />
						<span className='sy-help-link-inline'>Sign up with Google</span> or
						try these steps...
					</span>
					<i
						className={`fa-solid fa-chevron-down ${helpOpen ? 'is-open' : ''}`}
						aria-hidden='true'
					/>
				</button>

				{helpOpen && (
					<div id={`${idPrefix}-otp-help`} className='sy-otp-help-panel'>
						<ul>
							<li>Check your spam, junk, or promotions folder.</li>
							<li>
								Verify that <strong>{email}</strong> is spelled correctly.
							</li>
						</ul>
						<div className='sy-otp-help-actions'>
							<button
								type='button'
								onClick={handleResendClick}
								disabled={cooldown > 0}>
								{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
							</button>
							<button type='button' onClick={onChangeEmail}>
								Change email
							</button>
							<button type='button' onClick={onGoogleClick}>
								Use Google
							</button>
						</div>
						{resendMessage && (
							<p className='sy-resend-ok' role='status'>
								{resendMessage}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
