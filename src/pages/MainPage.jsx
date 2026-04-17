/** @format */

import { useNavigate } from 'react-router';
import { makeAuthenticatedRequest } from '../../authentication/request';
import logout from '../../authentication/logout';
import { useEffect, useState } from 'react';
import './MainPage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export function MainPage() {
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [liveStreams, setLiveStreams] = useState([]);
	const [loadingStreams, setLoadingStreams] = useState(true);
	const [joiningRoom, setJoiningRoom] = useState(null); // tracks which card is loading

	// Auth check
	useEffect(() => {
		makeAuthenticatedRequest(`${BACKEND_URL}/liveskill`, navigate).catch(
			(err) => {
				console.error(err);
			},
		);
	}, []);

	// Fetch live streams and refresh every 15s
	useEffect(() => {
		const fetchStreams = async () => {
			try {
				const res = await fetch(`${BACKEND_URL}/live-streams`);
				const data = await res.json();
				setLiveStreams(data);
			} catch (err) {
				console.error('Failed to fetch live streams:', err);
			} finally {
				setLoadingStreams(false);
			}
		};

		fetchStreams();
		const interval = setInterval(fetchStreams, 15000);
		return () => clearInterval(interval);
	}, []);

	const formatDuration = (startedAt) => {
		const diff = Math.floor((Date.now() - new Date(startedAt)) / 1000);
		const h = Math.floor(diff / 3600);
		const m = Math.floor((diff % 3600) / 60);
		const s = diff % 60;
		return (
			h > 0 ? `${h}h ${m}m`
			: m > 0 ? `${m}m ${s}s`
			: `${s}s`
		);
	};

	// Join a live stream as a viewer
	const handleJoinStream = async (stream) => {
		if (joiningRoom) return; // prevent double-click
		setJoiningRoom(stream.roomName);
		try {
			const res = await fetch(`${BACKEND_URL}/livestream`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					userId: 'viewer-' + Date.now(), // anonymous viewer ID
					roomName: stream.roomName,
					role: 'viewer',
				}),
			});
			const { token } = await res.json();
			navigate('/liveskill-viewroom', {
				state: { token, stream },
			});
		} catch (err) {
			console.error('Failed to join stream:', err);
			alert('Could not join stream. Please try again.');
		} finally {
			setJoiningRoom(null);
		}
	};

	return (
		<div className={`liveSkill-main ${isCollapsed ? 'collapsed' : ''}`}>
			<section className='sidebar'>
				<div className='logo'>
					<i
						className='fa-solid fa-bars'
						onClick={() => setIsCollapsed(!isCollapsed)}
						style={{ cursor: 'pointer' }}></i>
					<h2 onClick={() => navigate('/')}>
						<img src='images/youtube.png' alt='logo' />
						LiveSkil
					</h2>
				</div>
				<div className='sidebar-btns'>
					<div>
						<i className='fa-solid fa-house'></i> <p>Home</p>
					</div>
					<div>
						<i className='fa-solid fa-circle' style={{ color: 'red' }}></i>{' '}
						<p>Live</p>
					</div>
					<div>
						<i className='fa-solid fa-folder-open'></i>
						<p>Categories</p>
					</div>
				</div>
				<div className='user-btns'>
					<div>
						<i className='fa-solid fa-user'></i>
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
					<button onClick={() => navigate('/liveskill-streaminfo')}>
						🎥 <span>Start streaming</span>
					</button>
				</div>
			</section>

			<section className='main-section'>
				{/* Top bar */}
				<div className='input-section'>
					<div className='input-body'>
						<i className='fa-solid fa-microphone'></i>
						<input type='text' placeholder='Explore' />
					</div>
					<div className='logout'>
						<button onClick={() => logout(navigate)}>
							<i className='fa-solid fa-right-from-bracket'></i>Logout
						</button>
					</div>
				</div>

				{/* Live Streams Grid */}
				<div className='live-streams-section'>
					<div className='live-streams-header'>
						<h2>
							<i
								className='fa-solid fa-circle fa-beat'
								style={{ color: '#ef4444', marginRight: '10px' }}></i>
							Live Now
						</h2>
						<span className='stream-count'>
							{liveStreams.length} stream{liveStreams.length !== 1 ? 's' : ''}
						</span>
					</div>

					{loadingStreams ?
						<div className='streams-loading'>
							<i className='fa-solid fa-spinner fa-spin'></i>
							<p>Loading live streams...</p>
						</div>
					: liveStreams.length === 0 ?
						<div className='streams-empty'>
							<i className='fa-solid fa-video-slash'></i>
							<p>No streams live right now.</p>
							<p className='streams-empty-sub'>Be the first to go live!</p>
						</div>
					:	<div className='streams-grid'>
							{liveStreams.map((stream) => (
								<div
									key={stream.roomName}
									className={`stream-card ${joiningRoom === stream.roomName ? 'joining' : ''}`}
									onClick={() => handleJoinStream(stream)}>
									{/* Thumbnail placeholder */}
									<div className='stream-card-thumb'>
										{joiningRoom === stream.roomName ?
											<i
												className='fa-solid fa-spinner fa-spin'
												style={{ color: 'white' }}></i>
										:	<i className='fa-solid fa-video'></i>}
										<span className='live-pill'>LIVE</span>
										<span className='duration-pill'>
											{formatDuration(stream.startedAt)}
										</span>
									</div>
									{/* Info */}
									<div className='stream-card-info'>
										<h3 className='stream-card-title'>
											{stream.title || stream.roomName}
										</h3>
										<p className='stream-card-host'>
											<i className='fa-solid fa-user'></i> {stream.host}
										</p>
									</div>
								</div>
							))}
						</div>
					}
				</div>
			</section>
		</div>
	);
}
