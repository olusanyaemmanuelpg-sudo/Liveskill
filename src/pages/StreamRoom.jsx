/** @format */

import {
	Room,
	TrackPublication,
	createLocalVideoTrack,
	createLocalScreenTracks,
} from 'livekit-client';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useState, useRef } from 'react';

import { makeAuthenticatedRequest } from '../../authentication/request';

import './MainPage.css';
import './StreamRoom.css';

export function StreamRoom() {
	const navigate = useNavigate();
	const location = useLocation();
	const streamData = location.state || {};
	const [isCollapsed, setIsCollapsed] = useState(true);

	// Streaming states
	const [cameras, setCameras] = useState([]);
	const [activeCameraId, setActiveCameraId] = useState('');

	const { token, formData } = streamData;

	// Refs to hold mutable instances escaping the useEffect closure
	const videoRef = useRef(null);
	const roomRef = useRef(null);
	const videoTrackRef = useRef(null);

	//livekit and backend url
	const VITE_BACKEND_URL =
		import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
	const VITE_LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;

	useEffect(() => {
		makeAuthenticatedRequest(`${VITE_BACKEND_URL}/liveskill`, navigate).catch(
			(err) => {
				// Optionally handle error here
				console.error(err);
			},
		);
	}, []);

	useEffect(() => {
		if (!token) return;
		console.log('StreamRoom initialized with token:', token);

		let mounted = true;

		const startStreaming = async () => {
			try {
				const room = new Room();
				roomRef.current = room;

				await room.connect(VITE_LIVEKIT_URL, token);
				if (!mounted) {
					room.disconnect();
					return;
				}

				// 1. Fetch available cameras and populate UI state
				const devices = await Room.getLocalDevices('videoinput');
				setCameras(devices);
				if (!mounted) return;

				// 2. Select default camera (Fallback safely if HP HD Camera is missing)
				const defaultCam =
					devices.find((device) =>
						device.label.includes('HP HD Camera (04f2:b51d)'),
					) || devices[0];
				console.log(defaultCam);

				if (defaultCam) {
					setActiveCameraId(defaultCam.deviceId);
				}

				// 3. Create video track
				const videoTrack = await createLocalVideoTrack(
					defaultCam ? { deviceId: defaultCam.deviceId } : undefined,
				);
				if (!mounted) {
					videoTrack.stop();
					return;
				}
				videoTrackRef.current = videoTrack;

				// 4. Publish video & enable mic
				await room.localParticipant.publishTrack(videoTrack);
				await room.localParticipant.setMicrophoneEnabled(true);

				// 5. Attach video feed to DOM
				if (videoRef.current && mounted) {
					videoRef.current.innerHTML = ''; // Clear placeholder
					const element = videoTrack.attach();
					element.style.width = '100%';
					element.style.height = '100%';
					element.style.objectFit = 'cover';
					videoRef.current.appendChild(element);
				}
			} catch (err) {
				console.error('Error connecting to LiveKit:', err);
			}
		};

		startStreaming();

		// Cleanup function when component unmounts
		return () => {
			mounted = false;
			if (videoTrackRef.current) {
				videoTrackRef.current.stop();
			}
			if (roomRef.current) {
				roomRef.current.disconnect();
			}
			if (videoRef.current) {
				videoRef.current.innerHTML = '';
			}
		};
	}, [token, VITE_LIVEKIT_URL]);

	// Extracted Camera Switcher Handler
	const handleCameraSwitch = async (e) => {
		const newDeviceId = e.target.value;
		setActiveCameraId(newDeviceId);

		try {
			if (!roomRef.current) return;

			// 1. Remove old track physically and logically
			if (videoTrackRef.current) {
				videoTrackRef.current.stop();
				await roomRef.current.localParticipant.unpublishTrack(
					videoTrackRef.current,
				);
			}

			// 2. Create new track based on selected dropdown
			const newTrack = await createLocalVideoTrack({
				deviceId: newDeviceId,
			});

			videoTrackRef.current = newTrack;

			// 3. Publish new track to room
			await roomRef.current.localParticipant.publishTrack(newTrack);

			// 4. Update Video UI container securely
			if (videoRef.current) {
				videoRef.current.innerHTML = '';
				const element = newTrack.attach();
				element.style.width = '100%';
				element.style.height = '100%';
				element.style.objectFit = 'cover';
				videoRef.current.appendChild(element);
			}
		} catch (err) {
			console.error('Error switching camera:', err);
		}
	};

	//screen share
	const startScreenShare = async () => {
		try {
			if (!roomRef.current) return;

			// 1. Remove current camera track
			if (videoTrackRef.current) {
				videoTrackRef.current.stop();
				await roomRef.current.localParticipant.unpublishTrack(
					videoTrackRef.current,
				);
			}

			// 2. Create and get screen track
			const [screenTrack] = await createLocalScreenTracks();
			videoTrackRef.current = screenTrack;

			// 3. Publish screen track to room
			await roomRef.current.localParticipant.publishTrack(screenTrack);

			// 4. Attach screen track to UI container
			if (videoRef.current) {
				videoRef.current.innerHTML = '';
				const element = screenTrack.attach();
				element.style.width = '100%';
				element.style.height = '100%';
				element.style.objectFit = 'cover';
				videoRef.current.appendChild(element);
			}

			// 5. Handle when user manually stops sharing via browser popup
			screenTrack.on('ended', async () => {
				console.log('Screen share stopped by user, reverting to camera');
				await roomRef.current.localParticipant.unpublishTrack(screenTrack);

				// Revert back to the user's previous camera source seamlessly
				try {
					const fallbackTrack = await createLocalVideoTrack({
						deviceId: activeCameraId || undefined,
					});
					videoTrackRef.current = fallbackTrack;
					await roomRef.current.localParticipant.publishTrack(fallbackTrack);

					if (videoRef.current) {
						videoRef.current.innerHTML = '';
						const element = fallbackTrack.attach();
						element.style.width = '100%';
						element.style.height = '100%';
						element.style.objectFit = 'cover';
						videoRef.current.appendChild(element);
					}
				} catch (camErr) {
					console.error('Failed to restore camera after screen share:', camErr);
				}
			});
		} catch (err) {
			console.error('Screen share error:', err);
		}
	};

	// end streams
	const handleEndStream = () => {
		if (videoTrackRef.current) {
			videoTrackRef.current.stop();
		}
		if (roomRef.current) {
			roomRef.current.disconnect();
		}
		if (videoRef.current) {
			videoRef.current.innerHTML = '';
		}
		navigate('/liveskill');
	};

	return (
		<div
			className={`liveSkill-main stream-room-page ${isCollapsed ? 'collapsed' : ''}`}>
			{/* Shared Sidebar */}
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
					<div>
						<img
							src='https://res.cloudinary.com/dovuy2zci/image/upload/q_auto/f_auto/v1775173420/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869_ceoomy.jpg'
							alt='profile'
						/>
						<p className='profile'>WebDeji</p>
					</div>
				</div>
			</section>

			{/* Stream & Chat Layout */}
			<section className='main-section stream-room-main'>
				{/* 1. Left side: Video & Stream Metadata */}
				<div className='stream-content-area'>
					{/* Video Player Placeholder replacing old vid-chat-main */}
					<div className='live-video-container'>
						<div ref={videoRef} style={{ width: '100%', height: '100%' }}>
							{/* Video elements from livekit will be appended here */}
							<div className='video-mock'>
								<i className='fa-solid fa-video'></i>
								<p>Stream Active (Waiting for Video Track via LiveKit)</p>
							</div>
						</div>
						<div className='live-badge'>LIVE</div>
						<div className='overlay-controls-right'>
							<button className='share-screen-btn' onClick={startScreenShare}>
								<i className='fa-solid fa-desktop'></i>
								Share Screen
							</button>
							<button className='end-stream-btn' onClick={handleEndStream}>
								<i className='fa-solid fa-power-off'></i>
								End Stream
							</button>
						</div>
					</div>

					{/* Title and descriptions organized beautifully below */}
					<div className='stream-room-info'>
						<div
							className='info-header'
							style={{ justifyContent: 'space-between' }}>
							<div
								style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
								<img
									src='https://res.cloudinary.com/dovuy2zci/image/upload/q_auto/f_auto/v1775173420/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869_ceoomy.jpg'
									alt='host'
									className='host-avatar'
								/>
								<div className='info-titles'>
									<h2>{formData?.title || 'Untitled Core Stream'}</h2>
									<p className='stream-meta'>
										<span className='host-name'>@WebDeji</span> streaming in{' '}
										<span className='category-name'>
											{formData?.category || 'General'}
										</span>
									</p>
								</div>
							</div>

							{/* Action Controls and Camera Switcher */}
							<div
								style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
								{/* Dynamic Camera Switcher Dropdown */}
								{cameras.length > 0 && (
									<div className='camera-switcher'>
										<i
											className='fa-solid fa-camera'
											style={{ marginRight: '8px', color: '#6366f1' }}></i>
										<select
											value={activeCameraId}
											onChange={handleCameraSwitch}
											style={{
												padding: '8px 12px',
												borderRadius: '8px',
												border: '1px solid #e2e8f0',
												fontFamily: 'Poppins',
												fontSize: '13px',
												outline: 'none',
												cursor: 'pointer',
												background: '#f8fafc',
												color: '#334155',
												fontWeight: '500',
											}}>
											{cameras.map((cam, idx) => (
												<option key={cam.deviceId} value={cam.deviceId}>
													{cam.label || `Camera Device ${idx + 1}`}
												</option>
											))}
										</select>
									</div>
								)}
							</div>
						</div>

						{formData?.description && (
							<div className='stream-description-card'>
								<p>{formData.description}</p>
							</div>
						)}

						{formData?.tags && (
							<div className='stream-tags'>
								{formData.tags.split(',').map((tag, i) => {
									const trimmed = tag.trim();
									return trimmed ?
											<span key={i} className='stream-tag'>
												#{trimmed}
											</span>
										:	null;
								})}
							</div>
						)}
					</div>
				</div>

				{/* 2. Right side: Chat application */}
				<div className='chat-area'>
					<div className='chat-header'>
						<h4>Stream Chat</h4>
						<i className='fa-solid fa-users'></i>
					</div>

					<div className='chat-messages'>
						<div className='message system'>Welcome to the chat room!</div>
						<div className='message system'>
							Be respectful and kind to others.
						</div>
						<div className='message'>
							<span className='chat-user'>AvidFan99:</span> Can't wait for this
							stream to start!!
						</div>
						<div className='message'>
							<span className='chat-user host'>WebDeji:</span> Hello everyone,
							warming up the camera now.
						</div>
					</div>

					<div className='chat-input-container'>
						<input type='text' placeholder='Send a message...' />
						<button>
							<i className='fa-solid fa-paper-plane'></i>
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
