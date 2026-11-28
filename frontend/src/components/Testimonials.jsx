/** @format */

import { useState, useEffect } from 'react';
import './Testimonials.css';

const TESTIMONIALS = [
	{
		id: 1,
		name: 'Sarah Johnson',
		comment:
			'LiveSkill transformed my learning experience. Watching real developers debug live and asking questions on the spot is unmatched!',
	},
	{
		id: 2,
		name: 'Mike Chen',
		comment:
			'Being able to interact with designers in real-time while they critique layouts has boosted my skills tremendously.',
	},
	{
		id: 3,
		name: 'Emma Rodriguez',
		comment:
			'The live music production workshops are amazing. Learning directly from working producers in real time is priceless.',
	},
	{
		id: 4,
		name: 'David Kim',
		comment:
			'LiveSkill helped me sharpen my business strategy through live office hours with founders — zero downloads, pure conversation.',
	},
	{
		id: 5,
		name: 'Priya Patel',
		comment:
			'Switching from my webcam to full-screen code takes one click. My live workshop attendees stay locked in from start to finish.',
	},
	{
		id: 6,
		name: 'Marcus Vance',
		comment:
			'The LiveKit clarity and instant Socket.io room chat turned my coaching streams into a thriving weekly community.',
	},
];

export function Testimonials() {
	const [page, setPage] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const totalPages = 2;

	const prevPage = () => setPage((p) => (p - 1 + totalPages) % totalPages);
	const nextPage = () => setPage((p) => (p + 1) % totalPages);

	useEffect(() => {
		if (isPaused || isHovering) return;
		const timer = setInterval(() => {
			setPage((p) => (p + 1) % totalPages);
		}, 6000);
		return () => clearInterval(timer);
	}, [isPaused, isHovering]);

	const visibleItems = TESTIMONIALS.slice(page * 3, page * 3 + 3);

	return (
		<section
			className='sy-reviews-section'
			id='review-section'
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}>
			<div className='sy-reviews-inner'>
				<h2>Thousands of live workshops and streams created on LiveSkill</h2>

				<div className='sy-reviews-carousel'>
					<div className='sy-reviews-track' aria-live='polite'>
						{visibleItems.map((item) => (
							<article key={item.id} className='sy-review-card'>
								<p className='sy-review-quote'>“{item.comment}”</p>
								<p className='sy-review-author'>{item.name}</p>
							</article>
						))}
					</div>

					<button
						type='button'
						className='sy-reviews-next'
						aria-label='Next slide'
						onClick={nextPage}>
						<i className='fa-solid fa-chevron-right' aria-hidden='true' />
					</button>
				</div>

				<div className='sy-reviews-nav'>
					<button
						type='button'
						className='sy-reviews-prev-text'
						aria-label='Previous slide'
						onClick={prevPage}>
						‹
					</button>
					<div className='sy-reviews-dots'>
						{Array.from({ length: totalPages }).map((_, idx) => (
							<button
								key={idx}
								type='button'
								className={`sy-review-dot ${idx === page ? 'is-active' : ''}`}
								aria-label={`Show testimonial page ${idx + 1}`}
								aria-current={idx === page ? 'true' : undefined}
								onClick={() => setPage(idx)}
							/>
						))}
					</div>
					<button
						type='button'
						className='sy-reviews-pause'
						aria-label={
							isPaused ? 'Play testimonial rotation' : 'Pause testimonial rotation'
						}
						onClick={() => setIsPaused((prev) => !prev)}>
						{isPaused ? 'Play' : 'Pause'}
					</button>
				</div>
			</div>
		</section>
	);
}
