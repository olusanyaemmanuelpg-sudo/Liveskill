/** @format */
import { useNavigate } from 'react-router';
import './Header.css';

export function Header() {
	const navigate = useNavigate();
	const scrollToSection = (sectionId) => {
		if (window.location.pathname === '/') {
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			navigate(`/#${sectionId}`);
		}
	};
	return (
		<header>
			<nav>
				<h1 className='logo'>
					<span className='logo-icon'>⚡</span> LiveSkill
				</h1>
				<ul className='links'>
					<li>
						<a href='/'>Home</a>
					</li>
					<li>
						<a
							href='#feature-section'
							onClick={(e) => {
								e.preventDefault();
								scrollToSection('feature-section');
							}}>
							Feature
						</a>
					</li>
					<li>
						<a
							href='#review-section'
							onClick={(e) => {
								e.preventDefault();
								scrollToSection('review-section');
							}}>
							Review
						</a>
					</li>
				</ul>
			</nav>

			<div className='nav-action'>
				<span
					className='login-link'
					onClick={() => {
						navigate('login');
					}}>
					Log in
				</span>
				<button
					className='sign-btn'
					onClick={() => {
						navigate('signin');
					}}>
					Sign Up
				</button>
			</div>
		</header>
	);
}
