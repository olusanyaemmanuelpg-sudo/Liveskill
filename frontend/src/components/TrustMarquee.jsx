/** @format */

import './TrustMarquee.css';

const TRUST_BRANDS = [
	{ name: 'Live Coding', icon: 'fa-code' },
	{ name: 'UI/UX Design', icon: 'fa-pen-nib' },
	{ name: 'Music Studio', icon: 'fa-music' },
	{ name: 'Game Coaching', icon: 'fa-gamepad' },
	{ name: 'Founder Talks', icon: 'fa-briefcase' },
	{ name: 'WebRTC 1080p', icon: 'fa-tower-broadcast' },
	{ name: 'Screen Share', icon: 'fa-desktop' },
	{ name: 'Socket.io Chat', icon: 'fa-comments' },
	{ name: 'Live Workshops', icon: 'fa-chalkboard-user' },
	{ name: 'Creator Rooms', icon: 'fa-users' },
];

export function TrustMarquee() {
	return (
		<section
			className='sy-marquee-band'
			aria-label='Live sessions and studio capabilities'>
			<h2 className='sy-marquee-heading'>Trusted by creators teaching:</h2>
			<div className='sy-marquee-viewport'>
				<div className='sy-marquee-track'>
					{[...TRUST_BRANDS, ...TRUST_BRANDS].map((brand, idx) => (
						<div key={`${brand.name}-${idx}`} className='sy-marquee-logo'>
							<i className={`fa-solid ${brand.icon}`} aria-hidden='true' />
							<span>{brand.name}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
