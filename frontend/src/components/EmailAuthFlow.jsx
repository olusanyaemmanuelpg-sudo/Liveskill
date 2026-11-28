/** @format */

import { useId, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthShell } from './AuthShell';
import { OtpVerificationCard } from './OtpVerificationCard';
import { requestOtp, verifyOtp } from '../../authentication/otpAuth';
import handleLogin from '../../authentication/handleLogin';
import { setAccessToken } from '../../authentication/auth';
import './EmailAuthFlow.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailAuthFlow({ mode = 'signin' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const idPrefix = useId();

  const initialEmail = location.state?.email || '';
  const initialOtpSent = Boolean(location.state?.otpSent && initialEmail);

  const [step, setStep] = useState(initialOtpSent ? 'otp' : 'email');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState(location.state?.devOtp || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
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
      setStep('otp');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not send verification code. Make sure the backend server is running.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed) || !password) {
      setError('Email and password are required.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await handleLogin({ email: trimmed, pwd: password });
      if (result?.accessToken) {
        setAccessToken(result.accessToken);
        if (result.user && !result.user.hasCompletedOnboarding) {
          navigate('/welcome');
        } else {
          navigate('/liveskill');
        }
      }
    } catch {
      setError(
        'Login failed. Check your email and password or use a 6-digit code.',
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

  const handleResendCode = async () => {
    setError('');
    try {
      const data = await requestOtp(email);
      setDevOtpHint(data?.devOtp || '');
      return { success: true };
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Failed to resend code. Please try again.',
      );
      return { success: false };
    }
  };

  const handleGoogleClick = () => {
    setError(
      'Google OAuth is not configured yet — continue with your email code below.',
    );
  };

  const isLogin = mode === 'login';

  return (
    <AuthShell>
      {step === 'otp' ? (
        <OtpVerificationCard
          email={email}
          onVerify={handleVerifyCode}
          onResend={handleResendCode}
          onChangeEmail={() => {
            setError('');
            setStep('email');
          }}
          onGoogleClick={handleGoogleClick}
          devOtpHint={devOtpHint}
          isSubmitting={isLoading}
          error={error}
        />
      ) : (
        <div className="sy-email-card">
          <div className="sy-email-card-body">
            <h1>
              {isLogin ? 'Log in to LiveSkill' : 'Create a LiveSkill account'}
            </h1>
            <p className="sy-email-sub">
              {usePassword
                ? 'Sign in with your email and password.'
                : 'Enter your email address and we’ll send a 6-digit login code.'}
            </p>

            <button
              type="button"
              className="sy-auth-google-btn"
              onClick={handleGoogleClick}
            >
              <img src="images/google.png" alt="" width="18" height="18" />
              <span>Continue with Google</span>
            </button>

            <div className="sy-auth-or">
              <span>Or continue with email</span>
            </div>

            <form
              className="sy-email-form"
              onSubmit={usePassword ? handlePasswordLogin : handleSendOtp}
              noValidate
            >
              <div className="sy-field-group">
                <label htmlFor={`${idPrefix}-email`}>Email address</label>
                <input
                  id={`${idPrefix}-email`}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint={usePassword ? 'next' : 'go'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {isLogin && usePassword && (
                <div className="sy-field-group">
                  <label htmlFor={`${idPrefix}-pwd`}>Password</label>
                  <input
                    id={`${idPrefix}-pwd`}
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {error && (
                <p className="sy-email-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="sy-email-submit"
                disabled={isLoading}
              >
                {isLoading
                  ? usePassword
                    ? 'Logging in...'
                    : 'Sending code...'
                  : usePassword
                    ? 'Log in'
                    : 'Continue'}
              </button>
            </form>

            {isLogin && (
              <button
                type="button"
                className="sy-mode-toggle"
                onClick={() => {
                  setError('');
                  setUsePassword((prev) => !prev);
                }}
              >
                {usePassword
                  ? 'Use a 6-digit email code instead'
                  : 'Log in with password instead'}
              </button>
            )}
          </div>

          <div className="sy-email-card-footer">
            {isLogin ? (
              <p>
                New to LiveSkill?{' '}
                <Link to="/signin">Get started — it’s free</Link>
              </p>
            ) : (
              <p>
                Already using LiveSkill? <Link to="/login">Log in</Link>
              </p>
            )}
          </div>
        </div>
      )}
    </AuthShell>
  );
}
