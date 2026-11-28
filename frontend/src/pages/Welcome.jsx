/** @format */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthShell } from '../components/AuthShell';
import { saveOnboarding } from '../../authentication/otpAuth';
import './Welcome.css';

const DISCOVERY_OPTIONS = [
	'Searching on Google',
	'AI recommended it (e.g. ChatGPT)',
	'A friend told me about it',
	'A creator spoke about it',
	'I saw the LiveSkill logo',
	'I joined a LiveSkill stream as a guest',
	'I saw an ad',
	'Other',
];

const SEARCH_DETAIL_OPTIONS = [
	'Clicking through to a website result',
	'A short summary shown directly on Google (AI Overview)',
	"I don't remember / not sure",
];

const GOAL_OPTIONS = [
	{
		id: 'learn',
		label: 'Watch & learn from live creators',
		route: '/liveskill',
	},
	{
		id: 'host',
		label: 'Host live streams & skill workshops',
		route: '/liveskill-streaminfo',
	},
	{
		id: 'both',
		label: 'Both — learn and teach live',
		route: '/liveskill',
	},
];

export function Welcome() {
	const navigate = useNavigate();
	const [step, setStep] = useState('discover'); // 'discover' | 'google-detail' | 'goal'
	const [discoverySource, setDiscoverySource] = useState('');
	const [discoveryDetail, setDiscoveryDetail] = useState('');
	const [isSaving, setIsSaving] = useState(false);

	const completeAndEnter = async (payload, targetRoute = '/liveskill') => {
		setIsSaving(true);
		try {
			await saveOnboarding(payload);
		} catch {
			// Proceed cleanly even if onboarding preference save hits a transient error
		} finally {
			setIsSaving(false);
			navigate(targetRoute);
		}
	};

	const handleDiscoverySelect = (option) => {
		setDiscoverySource(option);
		if (option === 'Searching on Google') {
			setStep('google-detail');
		} else {
			setStep('goal');
		}
	};

	const handleGoogleDetailSelect = (detail) => {
		setDiscoveryDetail(detail);
		setStep('goal');
	};

	const handleGoalSelect = (goalOption) => {
		completeAndEnter(
			{
				discoverySource,
				discoveryDetail,
				onboardingGoal: goalOption.label,
			},
			goalOption.route,
		);
	};

	const handleBack = () => {
		if (step === 'goal') {
			setStep(discoverySource === 'Searching on Google' ? 'google-detail' : 'discover');
		} else if (step === 'google-detail') {
			setStep('discover');
		}
	};

	return (
		<AuthShell>
			<div className='sy-welcome-card'>
				<div className='sy-welcome-bar'>
					{step !== 'discover' ? (
						<button
							type='button'
							className='sy-welcome-icon-btn sy-back-btn'
							aria-label='Go back'
							onClick={handleBack}>
							<i className='fa-solid fa-arrow-left' aria-hidden='true' />
						</button>
					) : (
						<span />
					)}
					<button
						type='button'
						className='sy-welcome-icon-btn sy-close-btn'
						aria-label='Skip onboarding'
						onClick={() => completeAndEnter({ skipped: true }, '/liveskill')}>
						<i className='fa-solid fa-xmark' aria-hidden='true' />
					</button>
				</div>

				{step === 'discover' && (
					<div className='sy-welcome-content'>
						<h1>Welcome! How did you discover LiveSkill?</h1>
						<p className='sy-welcome-sub'>
							This will help us to improve your experience
						</p>
						<div className='sy-option-list'>
							{DISCOVERY_OPTIONS.map((option) => (
								<button
									key={option}
									type='button'
									className='sy-option-btn'
									onClick={() => handleDiscoverySelect(option)}>
									{option}
								</button>
							))}
						</div>
					</div>
				)}

				{step === 'google-detail' && (
					<div className='sy-welcome-content'>
						<h1>What information was most relevant when searching?</h1>
						<div className='sy-option-list'>
							{SEARCH_DETAIL_OPTIONS.map((option) => (
								<button
									key={option}
									type='button'
									className='sy-option-btn'
									onClick={() => handleGoogleDetailSelect(option)}>
									{option}
								</button>
							))}
						</div>
					</div>
				)}

				{step === 'goal' && (
					<div className='sy-welcome-content'>
						<h1>What brings you to LiveSkill today?</h1>
						<p className='sy-welcome-sub'>
							Choose how you want to start — you can switch anytime
						</p>
						<div className='sy-option-list'>
							{GOAL_OPTIONS.map((option) => (
								<button
									key={option.id}
									type='button'
									className='sy-option-btn'
									disabled={isSaving}
									onClick={() => handleGoalSelect(option)}>
									{option.label}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</AuthShell>
	);
}
