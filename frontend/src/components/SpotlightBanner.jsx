/** @format */

import { Link } from 'react-router';
import './SpotlightBanner.css';

export function SpotlightBanner() {
	return (
		<section className='sy-spotlight-wrap' id='creators-spotlight'>
			<div className='sy-spotlight-banner'>
				<div className='sy-spotlight-media'>
					<img
						src='https://res.cloudinary.com/dovuy2zci/image/upload/v1774647316/smiling-ceo-his-office_23-2147626275_iwtgns.jpg'
						alt='@CodeMentor teaching a live workshop'
					/>
				</div>

				<div className='sy-spotlight-body'>
					<blockquote>
						“I’ve been blown away by LiveSkill’s real-time studio &amp;
						community. It enables me to teach live code and answer every
						student’s question as it happens.”
					</blockquote>

					<div className='sy-spotlight-author'>
						<h6>@CodeMentor</h6>
						<p>Software Architect &amp; Live Educator</p>
					</div>

					<Link to='/login' className='sy-watch-example'>
						<i className='fa-regular fa-circle-play' aria-hidden='true' />
						<span>Watch example</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
