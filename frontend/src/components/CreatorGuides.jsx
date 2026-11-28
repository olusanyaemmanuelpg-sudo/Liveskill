/** @format */

import { Link } from 'react-router';
import './CreatorGuides.css';

const GUIDES = [
	{
		tone: 'coral',
		kicker: 'WORKSHOP GUIDE',
		headline: 'LIVE CODE',
		author: 'Written by @CodeMentor',
		title: 'How to schedule and host a live coding session from your browser',
	},
	{
		tone: 'electric',
		kicker: 'AUDIO SETUP',
		headline: 'PRO SOUND',
		author: 'Written by Emma Rodriguez',
		title: '7 ways to improve your live stream microphone and room audio',
	},
	{
		tone: 'cream',
		kicker: 'WORKSHOP FLOW',
		headline: 'SCREEN + CAM',
		author: 'Written by Mike Chen',
		title: 'How long should an interactive live skill workshop be?',
	},
	{
		tone: 'cobalt',
		kicker: 'STUDIO CHECK',
		headline: 'TEST STREAM',
		author: 'Written by David Kim',
		title: 'How to test your camera, mic, and screen share before going live',
	},
];

export function CreatorGuides() {
	return (
		<section className='sy-guides-wrap' id='creator-resources'>
			<div className='sy-guides-head'>
				<h2>Stream better, grow faster</h2>
				<p>
					Discover tips, tricks, and practical workflows to help you run crisp
					live sessions and grow an engaged learning community.
				</p>
				<Link to='/login' className='sy-see-all'>
					See all guides
				</Link>
			</div>

			<div className='sy-guides-row'>
				{GUIDES.map((guide) => (
					<article key={guide.title} className='sy-blog-card'>
						<div className={`sy-blog-thumb tone-${guide.tone}`}>
							<span>{guide.kicker}</span>
							<strong>{guide.headline}</strong>
						</div>
						<div className='sy-blog-content'>
							<span className='sy-blog-by'>{guide.author}</span>
							<h4>{guide.title}</h4>
							<Link to='/login' className='sy-blog-read'>
								<span>Read more</span>
								<i className='fa-solid fa-arrow-right' aria-hidden='true' />
							</Link>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
