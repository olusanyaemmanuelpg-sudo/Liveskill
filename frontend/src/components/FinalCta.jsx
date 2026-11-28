/** @format */

import { Link } from 'react-router';
import './FinalCta.css';

export function FinalCta() {
	return (
		<section className='sy-final-banner'>
			<div className='sy-final-inner'>
				<h2>Amplify your skill.</h2>
				<Link to='/signin' className='sy-final-cta-btn'>
					Get started - it’s free!
				</Link>
				<p>
					Join creators and learners streaming live on LiveSkill right from
					their browser today.
				</p>
			</div>
		</section>
	);
}
