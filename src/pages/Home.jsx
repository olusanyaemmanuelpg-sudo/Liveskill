/** @format */

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Testimonials } from '../components/Testimonials';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import myvideo from '../assets/animation/Web_app_live_202603231920 (1).mp4';
import './Home.css';

export function HomePage() {
	const location = useLocation();
	useEffect(() => {
		if (location.hash) {
			const id = location.hash.replace('#', '');
			setTimeout(() => {
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
		}
	}, [location]);
	return (
		<div className='home-page'>
			<Header />
			<section className='hero-section'>
				<div className='avatar'></div>
				<div className='hero-section-information'>
					<h1>Learn Live. Teach Live. Earn Live.</h1>
					<p>
						Join live sessions, interact in real-time, and learn direct from
						creators around the world.
					</p>
					<div className='cta-btns'>
						<a href='login' className='watch-live-btn'>
							Watch Live 🎥
						</a>
						<a href='login' className='start-streaming-btn'>
							Start Streaming
						</a>
					</div>

					<div className='heroes-information'>
						<div className='heroes-information-p'>
							<p>
								<img src='images/code.png' alt='code icon' />
								Coding
							</p>

							<p>
								<img src='images/joystick.png' alt='game icon' />
								Gaming
							</p>
							<p>
								<img src='images/idea.png' alt='design icon' />
								Design
							</p>
							<p>
								<img src='images/musical-note.png' alt='music icon' />
								Music
							</p>
							<p>
								<img src='images/briefcase.png' alt='business icon' />
								Business
							</p>
							<p>
								<img src='images/webinar.png' alt='tutorial icon' />
								Tutorial
							</p>
						</div>
					</div>
				</div>
				<div className='avatars'></div>
			</section>
			<section className='video-section' id='feature-section'>
				<div className='video'>
					<video
						src={myvideo}
						width='100%'
						muted
						autoPlay
						playsInline
						loop></video>
				</div>
				<nav className='newnav'>
					<ul>
						<li>
							<a href='#'>
								<img src='images/home.png' alt='Home icon' />
								Home
							</a>
						</li>
						<li>
							<a href='login'>
								<img src='images/search.png' alt='explore icon' />
								Explore
							</a>
							{/* Browse all streams & discovery page */}
						</li>
						<li>
							<a href='login'>
								<img src='images/live-stream.png' alt='Live stream icon' />
								Live
							</a>
							{/* Shows only currently live streams */}
						</li>
						<li>
							<a href='login'>
								<img src='images/category.png' alt='category icon' />
								Categories
							</a>
							{/* coding, gaming, design, business */}
						</li>
						<li>
							<a href='login'>
								<img src='images/faq.png' alt='FAQ icon' />
								How it Works
							</a>
							{/* explains platform simply */}
						</li>
					</ul>
				</nav>
			</section>
			<section className='creator-section'>
				<h1>
					Meet LiveSkill Creators - Learn from <br />
					Experts in Real-Time
				</h1>
				<div className='creators'>
					<div className='creator-card'>
						<div>
							<img
								src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647316/smiling-ceo-his-office_23-2147626275_iwtgns.jpg'
								alt='avatar'
							/>
						</div>
						<div className='creator-card-texts'>
							<p>Live Coding Sessions</p>
							<h2>@CodeMentor</h2>
						</div>
					</div>
					<div className='creator-card'>
						<div>
							<img
								src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647281/smiling-young-african-american-teen-girl-making-phone-call-talking-with-friend-in-bedroom-at-home-photo_ajrreg.jpg'
								alt='avatar'
							/>
						</div>
						<div className='creator-card-texts'>
							<p>Gaming & Streaming</p>
							<h2>@GameStreamer</h2>
						</div>
					</div>
					<div className='creator-card'>
						<div>
							<img
								src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647171/handsome-man-smiling-happy-face-portrait-close-up_53876-139608_wdtxpb.jpg'
								alt='avatar'
							/>
						</div>
						<div className='creator-card-texts'>
							<p>Creative & Design</p>
							<h2>@DesignLive</h2>
						</div>
					</div>
				</div>
				<div className='creator-btns'>
					<a href='login'>🔍 Explore Streams</a>
					<a href='login'>🎥 Start Streaming</a>
				</div>
			</section>
			<section className='cap-texts'>
				<p>You don't need more videos.</p>
				<p>You need live experiences.</p>
				<p>Because without interaction, content is just watching.</p>
				<p>With it, it bocomes learning, connection, and growth</p>
			</section>
			<Testimonials />
			<section className='question-section'>
				<div className='question-texts'>
					<h2>
						Questions? <br />
						Let's talk
					</h2>
					<p>
						Contact us through our 24/7 live chat.We’re always happy to help!
					</p>
					<a href='login'>Get Started</a>
				</div>
				<div className='question-image'>
					<img src='images/chatroom.jpg' alt='image of a chatroom' />
				</div>
			</section>
			<hr className='hr' />
			<Footer />
		</div>
	);
}
