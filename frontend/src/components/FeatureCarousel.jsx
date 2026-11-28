/** @format */

import { useRef } from 'react';
import { Link } from 'react-router';
import './FeatureCarousel.css';

const FEATURE_CARDS = [
	{ id: 'recording', title: 'Live HD Studio' },
	{ id: 'tracks', title: 'Skill Tracks' },
	{ id: 'guests', title: 'Live Rooms' },
	{ id: 'branding', title: 'Room Branding' },
	{ id: 'workshops', title: 'Workshops' },
	{ id: 'screenshare', title: 'Screen Share' },
	{ id: 'chat', title: 'Live Chat' },
	{ id: 'discovery', title: 'Discovery Feed' },
];

export function FeatureCarousel() {
	const trackRef = useRef(null);

	const scrollTrack = (direction) => {
		if (!trackRef.current) return;
		trackRef.current.scrollBy({
			left: direction * 292,
			behavior: 'smooth',
		});
	};

	return (
		<section className='sy-carousel-section' id='features-carousel'>
			<h2 className='sy-carousel-heading'>
				Meet the live streaming platform built for real-time skills
			</h2>

			<div className='sy-carousel-stage'>
				<div className='sy-edge-fade sy-edge-left' aria-hidden='true' />
				<div className='sy-edge-fade sy-edge-right' aria-hidden='true' />

				<button
					type='button'
					className='sy-round-arrow sy-round-prev'
					aria-label='Scroll features left'
					onClick={() => scrollTrack(-1)}>
					<i className='fa-solid fa-chevron-left' aria-hidden='true' />
				</button>

				<div className='sy-carousel-track' ref={trackRef}>
					{FEATURE_CARDS.map((card) => (
						<Link to='/login' key={card.id} className='sy-fc-card'>
							<div className='sy-fc-graphic'>
								{card.id === 'recording' && (
									<div className='gfx-recording'>
										<div className='gfx-bars' aria-hidden='true'>
											<span />
											<span />
											<span />
											<span />
											<span />
											<span />
											<span />
										</div>
										<div className='gfx-4k-badge'>1080p</div>
									</div>
								)}

								{card.id === 'tracks' && (
									<div className='gfx-tiles'>
										<span>
											<i className='fa-solid fa-code' style={{ color: '#0066FF' }} aria-hidden='true' />
										</span>
										<span>
											<i className='fa-solid fa-pen-nib' style={{ color: '#EF4444' }} aria-hidden='true' />
										</span>
										<span>
											<i className='fa-solid fa-music' style={{ color: '#111319' }} aria-hidden='true' />
										</span>
										<span>
											<i className='fa-solid fa-gamepad' style={{ color: '#0A66C2' }} aria-hidden='true' />
										</span>
										<span>
											<i className='fa-solid fa-briefcase' style={{ color: '#7B61FF' }} aria-hidden='true' />
										</span>
										<span>
											<i className='fa-solid fa-chalkboard-user' style={{ color: '#E1306C' }} aria-hidden='true' />
										</span>
										<span>
											<i className='fa-solid fa-plus' style={{ color: '#111319' }} aria-hidden='true' />
										</span>
									</div>
								)}

								{card.id === 'guests' && (
									<div className='gfx-guests'>
										<span className='g-orb g-center'>
											<img
												src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647281/smiling-young-african-american-teen-girl-making-phone-call-talking-with-friend-in-bedroom-at-home-photo_ajrreg.jpg'
												alt=''
											/>
										</span>
										<span className='g-orb g-tl'>
											<img
												src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647316/smiling-ceo-his-office_23-2147626275_iwtgns.jpg'
												alt=''
											/>
										</span>
										<span className='g-orb g-tr'>
											<img
												src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647171/handsome-man-smiling-happy-face-portrait-close-up_53876-139608_wdtxpb.jpg'
												alt=''
											/>
										</span>
										<span className='g-orb g-bl'>CM</span>
										<span className='g-orb g-br'>DL</span>
									</div>
								)}

								{card.id === 'branding' && (
									<div className='gfx-branding'>
										<div className='br-tile br-purple'>
											<strong>Aa</strong>
											<span>#7B61FF</span>
										</div>
										<div className='br-tile br-orange'>
											<i className='fa-solid fa-bolt' aria-hidden='true' />
										</div>
										<div className='br-tile br-dark'>
											<span className='br-you'>You</span>
											<span className='br-host'>Host</span>
										</div>
									</div>
								)}

								{card.id === 'workshops' && (
									<div className='gfx-workshops'>
										<div className='wk-bubble wk-green'>
											<i className='fa-solid fa-microphone' aria-hidden='true' />
										</div>
										<div className='wk-bubble wk-amber'>
											<i className='fa-solid fa-microphone-lines' aria-hidden='true' />
										</div>
									</div>
								)}

								{card.id === 'screenshare' && (
									<div className='gfx-screen'>
										<div className='sc-top'>
											<span />
											<span />
											<span />
										</div>
										<code>shareScreen()</code>
									</div>
								)}

								{card.id === 'chat' && (
									<div className='gfx-chat'>
										<div className='ch-pill ch-white'>How does LiveKit work?</div>
										<div className='ch-pill ch-blue'>Showing line 42 now!</div>
									</div>
								)}

								{card.id === 'discovery' && (
									<div className='gfx-discovery'>
										<span className='ds-live'>LIVE</span>
										<span className='ds-count'>2.4k viewers</span>
									</div>
								)}
							</div>
							<span className='sy-fc-label'>{card.title}</span>
						</Link>
					))}
				</div>

				<button
					type='button'
					className='sy-round-arrow sy-round-next'
					aria-label='Scroll features right'
					onClick={() => scrollTrack(1)}>
					<i className='fa-solid fa-chevron-right' aria-hidden='true' />
				</button>
			</div>
		</section>
	);
}
