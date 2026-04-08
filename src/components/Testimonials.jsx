/** @format */

import { useState, useEffect } from 'react';
import './Testimonials.css';

const testimonials = [
	{
		id: 1,
		name: 'Sarah Johnson',
		role: 'Software Developer',
		comment:
			'LiveSkill transformed my learning experience. The live coding sessions with real experts are incredible!',
		avatar:
			'https://res.cloudinary.com/dovuy2zci/image/upload/v1774647316/smiling-ceo-his-office_23-2147626275_iwtgns.jpg',
		rating: 5,
	},
	{
		id: 2,
		name: 'Mike Chen',
		role: 'UI/UX Designer',
		comment:
			'Being able to interact with designers in real-time while they create has boosted my skills tremendously.',
		avatar:
			'https://res.cloudinary.com/dovuy2zci/image/upload/v1774647281/smiling-young-african-american-teen-girl-making-phone-call-talking-with-friend-in-bedroom-at-home-photo_ajrreg.jpg',
		rating: 5,
	},
	{
		id: 3,
		name: 'Emma Rodriguez',
		role: 'Music Producer',
		comment:
			'The live music production sessions are amazing. Learning from professionals while they work is priceless.',
		avatar:
			'https://res.cloudinary.com/dovuy2zci/image/upload/v1774647171/handsome-man-smiling-happy-face-portrait-close-up_53876-139608_wdtxpb.jpg',
		rating: 5,
	},
	{
		id: 4,
		name: 'David Kim',
		role: 'Entrepreneur',
		comment:
			'LiveSkill helped me understand business strategies through real-time discussions with successful entrepreneurs.',
		avatar:
			'https://res.cloudinary.com/dovuy2zci/image/upload/v1774647253/portrait-smiling-woman-early-fall-park-13020862_n3wfsu.jpg',
		rating: 4,
	},
];

export function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	const nextTestimonial = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex(
			(prevIndex) =>
				(prevIndex - 1 + testimonials.length) % testimonials.length,
		);
	};

	const goToTestimonial = (index) => {
		setCurrentIndex(index);
	};

	// Handle touch events for swipe
	const minSwipeDistance = 50;

	const onTouchStart = (e) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			nextTestimonial();
		}
		if (isRightSwipe) {
			prevTestimonial();
		}
	};

	// Auto-play functionality
	useEffect(() => {
		const timer = setInterval(() => {
			nextTestimonial();
		}, 5000); // Change testimonial every 5 seconds

		return () => clearInterval(timer);
	}, []);

	return (
		<section className='testimonials-section' id='review-section'>
			<div className='testimonials-container'>
				<h2>What Our Users Say</h2>
				<div
					className='testimonial-carousel'
					onTouchStart={onTouchStart}
					onTouchMove={onTouchMove}
					onTouchEnd={onTouchEnd}>
					<div
						className='testimonial-card'
						style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
						{testimonials.map((testimonial) => (
							<div key={testimonial.id} className='testimonial-content'>
								<div className='testimonial-header'>
									<img
										src={testimonial.avatar}
										alt={testimonial.name}
										className='testimonial-avatar'
									/>
									<div className='testimonial-info'>
										<h3>{testimonial.name}</h3>
										<p className='testimonial-role'>{testimonial.role}</p>
									</div>
								</div>
								<div className='testimonial-rating'>
									{[...Array(testimonial.rating)].map((_, i) => (
										<span key={i} className='star'>
											⭐
										</span>
									))}
								</div>
								<p className='testimonial-comment'>"{testimonial.comment}"</p>
							</div>
						))}
					</div>
				</div>
				<div className='testimonial-navigation'>
					<button className='nav-btn prev-btn' onClick={prevTestimonial}>
						‹
					</button>
					<div className='testimonial-dots'>
						{testimonials.map((_, index) => (
							<button
								key={index}
								className={`dot ${index === currentIndex ? 'active' : ''}`}
								onClick={() => goToTestimonial(index)}
							/>
						))}
					</div>
					<button className='nav-btn next-btn' onClick={nextTestimonial}>
						›
					</button>
				</div>
			</div>
		</section>
	);
}
