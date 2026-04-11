/** @format */

import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import '../pages/StreamRoom.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export function ChatRoom({ roomName = 'default-room', user = 'Guest' }) {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [viewerCount, setViewerCount] = useState(0);
	const chatEndRef = useRef(null);
	const socketRef = useRef(null);

	useEffect(() => {
		// Create socket connection once, inside the effect
		const socket = io(BACKEND_URL, {
			withCredentials: true,
		});
		socketRef.current = socket;

		// Join the room only after the socket handshake completes
		const onConnect = () => {
			socket.emit('join-room', roomName);
		};

		if (socket.connected) {
			// Already connected (unlikely on first mount, but safe to guard)
			socket.emit('join-room', roomName);
		} else {
			socket.on('connect', onConnect);
		}

		// Listen for incoming messages
		socket.on('receive-message', (data) => {
			setMessages((prev) => [...prev, data]);
		});

		socket.on('viewer-count', (count) => {
			setViewerCount(count);
		});

		// Cleanup on unmount or roomName change
		return () => {
			socket.off('connect', onConnect);
			socket.off('receive-message');
			socket.disconnect();
			socket.off('viewer-count');
		};
	}, [roomName]);

	// Auto-scroll to latest message
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = () => {
		if (!message.trim() || !socketRef.current) return;

		socketRef.current.emit('send-message', {
			roomName,
			message,
			user,
		});

		setMessage('');
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') sendMessage();
	};

	const formatTime = (timestamp) => {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<div className='chat-area'>
			<div className='chat-header'>
				<h4>Stream Chat</h4>
				<div className='chat-count'>
					<h3>{viewerCount}</h3>
					<i className='fa-solid fa-users'></i>
				</div>
			</div>

			<div className='chat-messages'>
				{/* System welcome messages */}
				<div className='message system'>Welcome to the chat room!</div>
				<div className='message system'>Be respectful and kind to others.</div>

				{/* Live messages */}
				{messages.map((msg, idx) => (
					<div key={idx} className='message'>
						<span className={`chat-user ${msg.user === user ? 'host' : ''}`}>
							{msg.user}:
						</span>{' '}
						{msg.message}
						{msg.time && (
							<span className='chat-time'>{formatTime(msg.time)}</span>
						)}
					</div>
				))}

				<div ref={chatEndRef} />
			</div>

			<div className='chat-input-container'>
				<input
					type='text'
					placeholder='Send a message...'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button onClick={sendMessage} title='Send message'>
					<i className='fa-solid fa-paper-plane'></i>
				</button>
			</div>
		</div>
	);
}
