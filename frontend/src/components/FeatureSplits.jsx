/** @format */

import { useState } from 'react';
import { Link } from 'react-router';
import './FeatureSplits.css';

export function FeatureSplits() {
	const [compareMode, setCompareMode] = useState('hd');

	return (
		<div className='sy-splits-wrapper'>
			{/* Split 1: Visual Left / Copy Right */}
			<section className='sy-split-row' id='split-screen-share'>
				<div className='sy-split-container'>
					<div className='sy-split-visual'>
						<div className='sy-split-card'>
							<div className='sy-dual-stage'>
								<div className='sy-tile-cam'>
									<img
										src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647171/handsome-man-smiling-happy-face-portrait-close-up_53876-139608_wdtxpb.jpg'
										alt='@DesignLive presenter'
									/>
									<span className='sy-tile-tag'>@DesignLive</span>
								</div>
								<div className='sy-tile-screen'>
									<div className='sy-tile-screen-head'>
										<span />
										<span />
										<span />
									</div>
									<div className='sy-tile-screen-body'>
										<span className='sy-sc-label'>Screen Shared • 1080p</span>
										<code>const track = await createLocalScreenTracks();</code>
										<code>await room.publishTrack(track);</code>
									</div>
								</div>
							</div>

							<div className='sy-dashed-routes' aria-hidden='true'>
								<span />
								<span />
								<span />
								<span />
								<span />
							</div>

							<div className='sy-dest-row'>
								<span title='Coding'>
									<i className='fa-solid fa-code' style={{ color: '#0066FF' }} aria-hidden='true' />
								</span>
								<span title='Design'>
									<i className='fa-solid fa-pen-nib' style={{ color: '#E1306C' }} aria-hidden='true' />
								</span>
								<span title='Music'>
									<i className='fa-solid fa-music' style={{ color: '#111319' }} aria-hidden='true' />
								</span>
								<span title='Gaming'>
									<i className='fa-solid fa-gamepad' style={{ color: '#7B61FF' }} aria-hidden='true' />
								</span>
								<span title='Business'>
									<i className='fa-solid fa-briefcase' style={{ color: '#0A66C2' }} aria-hidden='true' />
								</span>
							</div>
						</div>
					</div>

					<div className='sy-split-copy'>
						<h2>Share your screen and switch cameras seamlessly</h2>
						<p>
							Move effortlessly between your HD webcam, external cameras, and
							full-screen code or design tools. When you end a screen share,
							LiveSkill automatically restores your active camera.
						</p>
					</div>
				</div>
			</section>

			{/* Split 2: Copy Left / Visual Right */}
			<section className='sy-split-row' id='split-clarity'>
				<div className='sy-split-container sy-is-reversed'>
					<div className='sy-split-copy'>
						<h2>Studio quality streams on any connection</h2>
						<p>
							Stop losing learners to blurry compressed recordings. LiveSkill
							streams crisp audio and video directly via LiveKit WebRTC, keeping
							your live room sharp and interactive.
						</p>
						<div className='sy-compare-toggle' role='group' aria-label='Compare video clarity'>
							<button
								type='button'
								className={compareMode === 'hd' ? 'is-active' : ''}
								onClick={() => setCompareMode('hd')}>
								LiveSkill 1080p
							</button>
							<button
								type='button'
								className={compareMode === 'low' ? 'is-active' : ''}
								onClick={() => setCompareMode('low')}>
								Compressed Upload
							</button>
						</div>
					</div>

					<div className='sy-split-visual'>
						<div className='sy-split-card sy-compare-box'>
							<div
								className={`sy-compare-video ${compareMode === 'low' ? 'is-blurry' : ''}`}>
								<img
									src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647281/smiling-young-african-american-teen-girl-making-phone-call-talking-with-friend-in-bedroom-at-home-photo_ajrreg.jpg'
									alt='@GameStreamer streaming live'
								/>
								<span className='sy-res-badge'>
									{compareMode === 'hd' ? '1080p HD' : '480p Low'}
								</span>
								<span className='sy-watermark'>⚡ liveskill</span>
							</div>

							<div className='sy-compare-feed'>
								<div className='sy-feed-bubble'>
									<strong>Alex</strong>
									<span>Cleanest stream quality all week!</span>
								</div>
								<div className='sy-feed-bubble'>
									<strong>Toby</strong>
									<span>Can read every detail on screen</span>
								</div>
								<div className='sy-feed-bubble is-host'>
									<strong>@GameStreamer</strong>
									<span>Let’s break down round 4 live!</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Split 3: Visual Left / Copy Right */}
			<section className='sy-split-row' id='split-branding'>
				<div className='sy-split-container'>
					<div className='sy-split-visual'>
						<div className='sy-split-card sy-brand-card'>
							<div className='sy-brand-callout-top'>
								<span className='sy-hand-note'>your category ↘</span>
								<span className='sy-category-badge'>Education</span>
							</div>

							<div className='sy-brand-center'>
								<img
									src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647316/smiling-ceo-his-office_23-2147626275_iwtgns.jpg'
									alt='Host streaming live'
								/>
							</div>

							<div className='sy-brand-lower'>
								<div className='sy-lower-pill'>
									<i className='fa-solid fa-bolt' aria-hidden='true' />
									<span>Live React Workshop • #react #livekit</span>
								</div>
								<span className='sy-hand-note'>custom room tags ↗</span>
							</div>
						</div>
					</div>

					<div className='sy-split-copy'>
						<h2>Brand your live room. No design skills required.</h2>
						<p>
							Set your stream title, description, skill category, and searchable
							tags in seconds. Go live straight from your browser and publish to
							the LiveSkill discovery feed automatically.
						</p>
					</div>
				</div>
			</section>

			{/* Split 4: Copy Left / Visual Right */}
			<section className='sy-split-row' id='split-live-chat'>
				<div className='sy-split-container sy-is-reversed'>
					<div className='sy-split-copy'>
						<h2>Go live with your audience in real-time</h2>
						<p>
							Built-in Socket.io stream chat connects hosts and learners with
							live viewer counts, host highlights, and timestamps — no external
							software needed.
						</p>
					</div>

					<div className='sy-split-visual'>
						<div className='sy-split-card sy-guests-card'>
							<span className='sy-orange-orb' aria-hidden='true'>
								<i className='fa-solid fa-tower-broadcast' />
							</span>
							<div className='sy-trio-grid'>
								<div className='sy-trio-cell'>
									<img
										src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647316/smiling-ceo-his-office_23-2147626275_iwtgns.jpg'
										alt='@CodeMentor'
									/>
									<span className='sy-tile-tag'>@CodeMentor</span>
								</div>
								<div className='sy-trio-cell'>
									<img
										src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647281/smiling-young-african-american-teen-girl-making-phone-call-talking-with-friend-in-bedroom-at-home-photo_ajrreg.jpg'
										alt='@GameStreamer'
									/>
									<span className='sy-tile-tag'>@GameStreamer</span>
								</div>
								<div className='sy-trio-cell'>
									<img
										src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647171/handsome-man-smiling-happy-face-portrait-close-up_53876-139608_wdtxpb.jpg'
										alt='@DesignLive'
									/>
									<span className='sy-tile-tag'>@DesignLive</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Split 5: Visual Left / Copy Right */}
			<section className='sy-split-row' id='split-discovery'>
				<div className='sy-split-container'>
					<div className='sy-split-visual'>
						<div className='sy-split-card sy-onair-card'>
							<div className='sy-onair-video'>
								<img
									src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647171/handsome-man-smiling-happy-face-portrait-close-up_53876-139608_wdtxpb.jpg'
									alt='Live mentor session'
								/>
								<span className='sy-onair-badge'>LIVE • 1080p</span>
							</div>

							<div className='sy-float-comment fc-top'>
								<strong>Jocelyn94</strong>
								<span>Best live walkthrough yet!</span>
							</div>
							<div className='sy-float-comment fc-mid'>
								<strong>Juanlango</strong>
								<span>Can you share the repo link?</span>
							</div>
							<div className='sy-float-comment fc-bot'>
								<strong>EricV</strong>
								<span>Joining every Tuesday now ⚡</span>
							</div>
						</div>
					</div>

					<div className='sy-split-copy'>
						<h2>Discover active rooms and watch live in one click</h2>
						<p>
							Browse ongoing streams in LiveSkill’s real-time discovery grid,
							see how long each session has been live, and enter any viewer room
							immediately.
						</p>
						<Link to='/login' className='sy-split-arrow-link'>
							<i className='fa-solid fa-arrow-right' aria-hidden='true' />
							<span>See why learners are switching</span>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
