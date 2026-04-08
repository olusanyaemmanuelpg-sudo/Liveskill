/** @format */

import { useNavigate } from 'react-router';
import myvideo from '../assets/animation/Web_app_live_202603231920 (1).mp4';
import { makeAuthenticatedRequest, logout } from '../../authentication/request';
import { useEffect, useState } from 'react';
import './MainPage.css';

export function MainPage() {
	const VITE_BACKEND_URL =
		import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);

	// Only run on mount
	useEffect(() => {
		makeAuthenticatedRequest(`${VITE_BACKEND_URL}/liveskill`, navigate).catch(
			(err) => {
				// Optionally handle error here
				console.error(err);
			},
		);
	}, []);

	return (
		<div className={`liveSkill-main ${isCollapsed ? 'collapsed' : ''}`}>
			<section className='sidebar'>
				<div className='logo'>
					<i
						className='fa-solid fa-bars'
						onClick={() => setIsCollapsed(!isCollapsed)}
						style={{ cursor: 'pointer' }}></i>
					<h2
						onClick={() => {
							navigate('/');
						}}>
						<img src='images/youtube.png' alt='logo' />
						LiveSkil
					</h2>
				</div>
				<div className='sidebar-btns'>
					<div>
						<i class='fa-solid fa-house'></i> <p>Home</p>
					</div>
					<div>
						<i class='fa-solid fa-circle'></i> <p>Live</p>
					</div>
					<div>
						<i class='fa-solid fa-folder-open'></i>
						<p>Categories</p>
					</div>
					<div></div>
					<div></div>
				</div>
				<div className='user-btns'>
					<div>
						<i class='fa-solid fa-user'></i>
						<p>Following</p>
					</div>
					<div>
						<img
							src='https://res.cloudinary.com/dovuy2zci/image/upload/q_auto/f_auto/v1775173420/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869_ceoomy.jpg'
							alt='profile'
						/>
						<p className='profile'>WebDeji</p>
					</div>
				</div>
				<div className='sidebar-cta'>
					<button>
						🎥 <span>Start streaming</span>
					</button>
				</div>
			</section>
			<section className='main-section'>
				<div className='input-section'>
					<div className='input-body'>
						<i class='fa-solid fa-microphone'></i>
						<input type='text' placeholder='Explore' />
					</div>
					<div className='logout'>
						<button
							onClick={() => {
								logout(navigate);
							}}>
							<i class='fa-solid fa-right-from-bracket'></i>Logout
						</button>
					</div>
				</div>
				<section className='vid-chat-main'>
					<section className='live-sec'>
						<div className='video-player'>
							<video controls width='100%' height='400'>
								<source src={myvideo} type='video/mp4' />
								Your browser does not support the video tag.
							</video>
							<div className='stream-info'>
								<h3>Live Stream Title</h3>
								<p>
									Streamer: <span>@WebDeji</span> | Viewers:
									<span className='viewer'> 1.2K</span>
								</p>
							</div>
						</div>
					</section>
					<section className='chatbar-sec'>
						<div className='chat-header'>
							<h4>
								<i class='fa-solid fa-circle fa-fade'></i>Live Chat
							</h4>
						</div>
						<div className='chat-messages'>
							<div className='message'>
								<strong>User1:</strong> Great stream!
							</div>
							<div className='message'>
								<strong>User2:</strong> Hello everyone!
							</div>
						</div>
						<div className='chat-input'>
							<input type='text' placeholder='Type a message...' />
							<button>Send</button>
						</div>
					</section>
				</section>
			</section>
		</div>
	);
}
