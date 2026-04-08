/** @format */

import { useState } from 'react';
import './ProfileUpload.css';

export default function ProfileUpload({ setProfileUrl }) {
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);

	// Cloudinary config (replace with your own if needed)
	const CLOUD_NAME = 'dovuy2zci';
	const UPLOAD_PRESET = 'liveskill';

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(null);
		}
	};

	const uploadImage = async () => {
		if (!image) return;
		setLoading(true);
		const formData = new FormData();
		formData.append('file', image);
		formData.append('upload_preset', UPLOAD_PRESET);

		try {
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
				{
					method: 'POST',
					body: formData,
				},
			);
			const data = await response.json();
			if (data.secure_url) {
				setProfileUrl(data.secure_url);
			} else {
				alert('Upload failed');
			}
		} catch (error) {
			alert('Error during upload');
			console.error('Upload error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='profile-upload-container'>
			<label htmlFor='profile-upload-input' className='profile-upload-label'>
				Upload Profile Picture
			</label>
			<input
				id='profile-upload-input'
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				className='profile-upload-input'
			/>
			{preview && (
				<div className='profile-upload-preview'>
					<img src={preview} alt='Profile Preview' />
				</div>
			)}
			<button
				type='button'
				className='profile-btn'
				onClick={uploadImage}
				disabled={loading || !image}
				style={{ marginTop: '0.5rem' }}>
				{loading ? 'Uploading...' : 'Upload'}
			</button>
		</div>
	);
}
