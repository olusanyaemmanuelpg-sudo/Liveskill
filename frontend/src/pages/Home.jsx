/** @format */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Header } from '../components/Header';
import { HeroStudio } from '../components/HeroStudio';
import { TrustMarquee } from '../components/TrustMarquee';
import { FeatureCarousel } from '../components/FeatureCarousel';
import { SpotlightBanner } from '../components/SpotlightBanner';
import { FeatureSplits } from '../components/FeatureSplits';
import { CreatorGuides } from '../components/CreatorGuides';
import { Testimonials } from '../components/Testimonials';
import { FinalCta } from '../components/FinalCta';
import { Footer } from '../components/Footer';
import emailToUpdate from '../../authentication/emailUpdate';
import './Home.css';

export function HomePage() {
	const [email, setEmail] = useState('');
	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			const id = location.hash.replace('#', '');
			const timer = setTimeout(() => {
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [location]);

	return (
		<div className='sy-home'>
			<Header />
			<main id='main-content' role='main'>
				<HeroStudio />
				<TrustMarquee />
				<FeatureCarousel />
				<SpotlightBanner />
				<FeatureSplits />
				<CreatorGuides />
				<Testimonials />
				<FinalCta />
			</main>
			<Footer setEmail={setEmail} email={email} emailToUpdate={emailToUpdate} />
		</div>
	);
}
