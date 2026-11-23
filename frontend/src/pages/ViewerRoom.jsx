/** @format */

import { Room, RoomEvent } from 'livekit-client';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ChatRoom } from '../components/Chatroom';
import './MainPage.css';
import './StreamRoom.css';

export function ViewerRoom() {
	const navigate = useNavigate();
	const location = useLocation();
	const { token, stream } = location.state || {};

	const [isCollapsed, setIsCollapsed] = useState(true);
	const [connectionState, setConnectionState] = useState('connecting'); // 'connecting' | 'connected' | 'error'

	const videoRef = useRef(null);
	const roomRef = useRef(null);

	const VITE_LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

	useEffect(() => {
		if (!token) {
			navigate('/liveskill');
			return;
		}

		let mounted = true;
		let localRoom = null;

		const startViewing = async () => {
			try {
				const room = new Room();
				localRoom = room;
				roomRef.current = room;

				// Listen for remote tracks being published by the host
				room.on(RoomEvent.TrackSubscribed, (track) => {
					if (!mounted || !videoRef.current) return;

					if (track.kind === 'video') {
						videoRef.current.innerHTML = '';
						const element = track.attach();
						element.style.width = '100%';
						element.style.height = '100%';
						element.style.objectFit = 'cover';
						videoRef.current.appendChild(element);
					} else if (track.kind === 'audio') {
						// Attach audio silently (no DOM element needed visually)
						const audioEl = track.attach();
						document.body.appendChild(audioEl);
					}
				});

				// Clean up video when host unpublishes
				room.on(RoomEvent.TrackUnsubscribed, (track) => {
					track.detach().forEach((el) => el.remove());
					if (track.kind === 'video' && videoRef.current) {
						videoRef.current.innerHTML = `
							<div class="video-mock">
								<i class="fa-solid fa-video-slash"></i>
								<p>Stream paused</p>
							</div>`;
					}
				});

				room.on(RoomEvent.Disconnected, () => {
					if (!mounted) return;
					setConnectionState('error');
				});

				await room.connect(VITE_LIVEKIT_URL, token);
				if (!mounted) {
					room.disconnect();
					return;
				}

				setConnectionState('connected');
			} catch (err) {
				if (err?.message?.includes('Client initiated disconnect')) return;
				console.error('Error joining stream:', err);
				setConnectionState('error');
			}
		};

		startViewing();

		return () => {
			mounted = false;
			if (localRoom) {
				localRoom.disconnect();
				localRoom = null;
			}
			// Remove any dangling audio elements
			document.querySelectorAll('audio[data-livekit]').forEach((el) =>
				el.remove(),
			);
		};
	}, [token, VITE_LIVEKIT_URL]);

	const handleLeave = () => {
		if (roomRef.current) roomRef.current.disconnect();
		navigate('/liveskill');
	};

	if (!token || !stream) {
		return null;
	}

	return (
		<div
			className={`liveSkill-main stream-room-page ${isCollapsed ? 'collapsed' : ''}`}>
			{/* Sidebar */}
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
					<div onClick={() => navigate('/liveskill')}>
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
				</div>
			</section>

			{/* Viewer Layout */}
			<section className='main-section stream-room-main'>
				{/* Left: Video */}
				<div className='stream-content-area'>
					<div className='live-video-container'>
						<div ref={videoRef} style={{ width: '100%', height: '100%' }}>
							{/* Placeholder shown until host video arrives */}
							<div className='video-mock'>
								{connectionState === 'connecting' ? (
									<>
										<i className='fa-solid fa-spinner fa-spin'></i>
										<p>Connecting to stream...</p>
									</>
								) : connectionState === 'error' ? (
									<>
										<i className='fa-solid fa-circle-xmark' style={{ color: '#ef4444' }}></i>
										<p>Stream ended or unavailable</p>
									</>
								) : (
									<>
										<i className='fa-solid fa-video'></i>
										<p>Waiting for host video...</p>
									</>
								)}
							</div>
						</div>

						{/* LIVE badge */}
						<div className='live-badge'>LIVE</div>

						{/* Leave button overlay */}
						<div className='overlay-controls-right'>
							<button className='end-stream-btn' onClick={handleLeave}>
								<i className='fa-solid fa-arrow-right-from-bracket'></i>
								Leave Stream
							</button>
						</div>
					</div>

					{/* Stream info panel */}
					<div className='stream-room-info'>
						<div className='info-header' style={{ justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
								<div className='info-titles'>
									<h2>{stream.title || stream.roomName}</h2>
									<p className='stream-meta'>
										<span className='host-name'>@{stream.host}</span>
										{' '}is streaming live
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right: Chat */}
				<ChatRoom
					roomName={stream.roomName}
					user={'Viewer'}
				/>
			</section>
		</div>
	);
}
