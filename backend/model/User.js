/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	roles: {
		user: {
			type: Number,
			default: 2001,
		},
		Admin: Number,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: false,
	},
	profilePicture: {
		type: String,
		default:
			'https://res.cloudinary.com/dovuy2zci/image/upload/q_auto/f_auto/v1775173420/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869_ceoomy.jpg',
	},
	otpCodeHash: String,
	otpExpiresAt: Date,
	isVerified: {
		type: Boolean,
		default: false,
	},
	hasCompletedOnboarding: {
		type: Boolean,
		default: false,
	},
	discoverySource: String,
	discoveryDetail: String,
	onboardingGoal: String,
	refreshToken: String,
});

module.exports = mongoose.model('User', userSchema);
