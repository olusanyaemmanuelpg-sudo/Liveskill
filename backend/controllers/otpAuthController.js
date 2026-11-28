/** @format */

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function deriveUsername(email) {
	const base = email
		.split('@')[0]
		.replace(/[^a-zA-Z0-9_]/g, '')
		.slice(0, 18);
	const suffix = crypto.randomInt(100, 999);
	return `${base || 'creator'}${suffix}`;
}

async function sendOtpEmail(email, otp) {
	// If RESEND_API_KEY is configured, send real transactional email
	if (process.env.RESEND_API_KEY) {
		const from = process.env.EMAIL_FROM || 'LiveSkill <onboarding@resend.dev>';
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from,
				to: email,
				subject: `${otp} is your LiveSkill login code`,
				html: `<p>Your 6-digit LiveSkill login code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
			}),
		});
		if (!response.ok) {
			const detail = await response.text();
			throw new Error(`Email delivery failed: ${detail}`);
		}
		return { deliveredVia: 'resend' };
	}

	console.log(`[LiveSkill OTP] 6-digit login code for ${email}: ${otp}`);
	return { deliveredVia: 'console' };
}

const requestOtp = async (req, res) => {
	const rawEmail = req.body?.email;
	const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

	if (!email || !EMAIL_REGEX.test(email)) {
		return res.status(400).json({ message: 'Please enter a valid email address.' });
	}

	try {
		let user = await User.findOne({ email }).exec();
		if (!user) {
			user = await User.create({
				username: deriveUsername(email),
				email,
				isVerified: false,
				hasCompletedOnboarding: false,
			});
		}

		const otp = crypto.randomInt(100000, 1000000).toString();
		user.otpCodeHash = await bcrypt.hash(otp, 10);
		user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
		await user.save();

		const delivery = await sendOtpEmail(email, otp);

		const payload = {
			success: true,
			message: `We sent a 6-digit login code to ${email}.`,
		};

		// Expose devOtp only in non-production environments when no external email provider is configured
		if (
			delivery.deliveredVia === 'console' &&
			process.env.NODE_ENV !== 'production'
		) {
			payload.devOtp = otp;
		}

		return res.status(200).json(payload);
	} catch (err) {
		console.error('requestOtp error:', err);
		return res.status(500).json({ message: 'Unable to send verification code right now.' });
	}
};

const verifyOtp = async (req, res) => {
	const rawEmail = req.body?.email;
	const rawOtp = req.body?.otp;
	const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
	const otp = typeof rawOtp === 'string' ? rawOtp.trim() : '';

	if (!email || !EMAIL_REGEX.test(email) || !/^\d{6}$/.test(otp)) {
		return res.status(400).json({ message: 'Valid email and 6-digit code are required.' });
	}

	try {
		const foundUser = await User.findOne({ email }).exec();
		if (
			!foundUser ||
			!foundUser.otpCodeHash ||
			!foundUser.otpExpiresAt ||
			foundUser.otpExpiresAt.getTime() < Date.now()
		) {
			return res.status(401).json({
				message: 'Code expired or not found. Request a new 6-digit code.',
			});
		}

		const isMatch = await bcrypt.compare(otp, foundUser.otpCodeHash);
		if (!isMatch) {
			return res.status(401).json({
				message: 'Incorrect 6-digit code. Please check your email and try again.',
			});
		}

		foundUser.otpCodeHash = undefined;
		foundUser.otpExpiresAt = undefined;
		foundUser.isVerified = true;

		const roles = Object.values(foundUser.roles || { user: 2001 }).filter(Boolean);
		const accessToken = jwt.sign(
			{
				userInfo: {
					username: foundUser.username,
					roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' },
		);

		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' },
		);

		foundUser.refreshToken = refreshToken;
		await foundUser.save();

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			accessToken,
			user: {
				username: foundUser.username,
				email: foundUser.email,
				hasCompletedOnboarding: Boolean(foundUser.hasCompletedOnboarding),
			},
		});
	} catch (err) {
		console.error('verifyOtp error:', err);
		return res.status(500).json({ message: 'Verification failed. Please try again.' });
	}
};

const saveOnboarding = async (req, res) => {
	const username = req.user;
	if (!username) {
		return res.sendStatus(401);
	}

	const { discoverySource, discoveryDetail, onboardingGoal } = req.body || {};

	try {
		const user = await User.findOne({ username }).exec();
		if (!user) {
			return res.sendStatus(404);
		}

		if (discoverySource) user.discoverySource = String(discoverySource);
		if (discoveryDetail) user.discoveryDetail = String(discoveryDetail);
		if (onboardingGoal) user.onboardingGoal = String(onboardingGoal);
		user.hasCompletedOnboarding = true;

		await user.save();

		return res.status(200).json({
			success: true,
			hasCompletedOnboarding: true,
		});
	} catch (err) {
		console.error('saveOnboarding error:', err);
		return res.status(500).json({ message: 'Could not save onboarding preferences.' });
	}
};

module.exports = { requestOtp, verifyOtp, saveOnboarding };
