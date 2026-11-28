/** @format */

const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleNewUser = async (req, res) => {
	const { user, pwd, email } = req.body;
	const cleanUser = typeof user === 'string' ? user.trim() : '';
	const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

	if (!cleanUser || !pwd || !cleanEmail) {
		return res
			.status(400)
			.json({ message: 'Full name, email, and password are required.' });
	}

	try {
		const duplicate = await User.findOne({
			$or: [{ username: cleanUser }, { email: cleanEmail }],
		}).exec();

		if (duplicate) {
			return res.status(409).json({
				message: 'An account with that email or name already exists.',
			});
		}

		const hashedPwd = await bcrypt.hash(pwd, 10);
		const newUser = await User.create({
			username: cleanUser,
			password: hashedPwd,
			email: cleanEmail,
			isVerified: true,
			hasCompletedOnboarding: false,
		});

		const roles = Object.values(newUser.roles || { user: 2001 }).filter(Boolean);
		const accessToken = jwt.sign(
			{
				userInfo: {
					username: newUser.username,
					roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' },
		);

		const refreshToken = jwt.sign(
			{ username: newUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' },
		);

		newUser.refreshToken = refreshToken;
		await newUser.save();

		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		return res.status(201).json({
			success: `New user ${cleanUser} created`,
			accessToken,
			user: {
				username: newUser.username,
				email: newUser.email,
				hasCompletedOnboarding: false,
			},
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { handleNewUser };
