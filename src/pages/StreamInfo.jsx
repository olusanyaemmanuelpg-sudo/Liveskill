/** @format */

import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import startStreaming from '../../livestream/stream';
import { makeAuthenticatedRequest } from '../../authentication/request';
import './MainPage.css';
import './StreamInfo.css';

export function StreamInfo() {
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		category: 'Gaming',
		tags: '',
		username: 'WebDeji', // TODO: pull from Auth context
	});

	const VITE_BACKEND_URL =
		import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		try {
			console.log('Requesting stream token for:', formData.title);
			const response = await startStreaming({
				userId: 'webdeji', // TODO: Replace with dynamic user ID from Auth context
				roomName: formData.title, // Note: Consider slugifying for cleaner room IDs
				role: 'host',
			});

			console.log('Stream Info Token Received:', response.token);

			// Navigate to stream room with token and form data
			navigate('/liveskill-streamroom', {
				state: { token: response.token, formData },
			});
		} catch (error) {
			console.error('Failed to setup stream:', error);
			alert(
				'Could not generate stream token. Please check console for errors.',
			);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		makeAuthenticatedRequest(`${VITE_BACKEND_URL}/liveskill`, navigate).catch(
			(err) => {
				// Optionally handle error here
				console.error(err);
			},
		);
	}, []);

	return (
		<div
			className={`liveSkill-main StreamInfo-page ${isCollapsed ? 'collapsed' : ''}`}>
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
					<div
						onClick={() => {
							navigate('/liveskill');
						}}>
						<i className='fa-solid fa-house'></i> <p>Home</p>
					</div>
					<div>
						<i className='fa-solid fa-circle'></i> <p>Live</p>
					</div>
					<div>
						<i className='fa-solid fa-folder-open'></i>
						<p>Categories</p>
					</div>
					<div></div>
					<div></div>
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
					<button>
						🎥 <span>Start streaming</span>
					</button>
				</div>
			</section>

			<section className='main-section stream-info-section'>
				<div className='form-container'>
					<div className='form-header'>
						<h2>Set Up Your Stream</h2>
						<p>
							Provide details about your upcoming live stream to attract
							viewers.
						</p>
					</div>
					<form className='stream-info-form' onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='title'>Stream Title</label>
							<input
								type='text'
								id='title'
								name='title'
								placeholder='Enter a catchy title...'
								value={formData.title}
								onChange={handleChange}
								required
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='description'>Description</label>
							<textarea
								id='description'
								name='description'
								placeholder='What is this stream about? (optional)'
								rows='4'
								value={formData.description}
								onChange={handleChange}></textarea>
						</div>

						<div className='form-row'>
							<div className='form-group'>
								<label htmlFor='category'>Category</label>
								<select
									id='category'
									name='category'
									value={formData.category}
									onChange={handleChange}>
									<option value='Gaming'>Gaming</option>
									<option value='Education'>Education</option>
									<option value='Talk Show'>Talk Show</option>
									<option value='Music'>Music</option>
									<option value='Just Chatting'>Just Chatting</option>
								</select>
							</div>

							<div className='form-group'>
								<label htmlFor='tags'>Tags</label>
								<input
									type='text'
									id='tags'
									name='tags'
									placeholder='e.g., react, tutorial'
									value={formData.tags}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className='form-actions'>
							<button
								type='button'
								className='btn-cancel'
								onClick={() => navigate(-1)}
								disabled={isLoading}>
								Cancel
							</button>
							<button type='submit' className='btn-submit' disabled={isLoading}>
								<i className='fa-solid fa-signal'></i>{' '}
								{isLoading ? 'Generating Token...' : 'Save & Continue'}
							</button>
						</div>
					</form>
				</div>
			</section>
		</div>
	);
}
