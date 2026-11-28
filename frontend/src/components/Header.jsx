/** @format */

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import './Header.css';

const PRODUCT_ITEMS = [
	{
		label: 'Live Studio',
		desc: 'Stream in HD right from your browser',
		target: 'features-carousel',
		icon: 'fa-video',
	},
	{
		label: 'Screen Sharing',
		desc: 'Share code, slides & apps live',
		target: 'split-screen-share',
		icon: 'fa-desktop',
	},
	{
		label: 'WebRTC Clarity',
		desc: 'Low-latency LiveKit rooms',
		target: 'split-clarity',
		icon: 'fa-tower-broadcast',
	},
	{
		label: 'Room Setup',
		desc: 'Titles, categories & custom tags',
		target: 'split-branding',
		icon: 'fa-tags',
	},
	{
		label: 'Real-Time Chat',
		desc: 'Instant Socket.io viewer rooms',
		target: 'split-live-chat',
		icon: 'fa-comments',
	},
	{
		label: 'Live Discovery',
		desc: 'Browse active streams now',
		target: 'split-discovery',
		icon: 'fa-compass',
	},
];

const MENTOR_ITEMS = [
	{
		label: 'LiveSkill for Mentors',
		desc: 'Host live workshops & cohorts',
		to: '/login',
	},
	{
		label: 'Creator Playbooks',
		desc: 'Guides to grow live rooms',
		target: 'creator-resources',
	},
];

export function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const [openMenu, setOpenMenu] = useState(null); // 'product' | 'mentors' | null
	const [mobileOpen, setMobileOpen] = useState(false);
	const headerRef = useRef(null);

	const scrollToSection = (sectionId) => {
		setOpenMenu(null);
		setMobileOpen(false);
		if (location.pathname === '/') {
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		} else {
			navigate(`/#${sectionId}`);
		}
	};

	useEffect(() => {
		const onKeyDown = (e) => {
			if (e.key === 'Escape') {
				setOpenMenu(null);
				setMobileOpen(false);
			}
		};
		const onPointerDown = (e) => {
			if (headerRef.current && !headerRef.current.contains(e.target)) {
				setOpenMenu(null);
				setMobileOpen(false);
			}
		};
		document.addEventListener('keydown', onKeyDown);
		document.addEventListener('pointerdown', onPointerDown);
		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.removeEventListener('pointerdown', onPointerDown);
		};
	}, []);

	return (
		<div className='sy-header-wrap' ref={headerRef}>
			<header role='banner' className='sy-header-banner'>
				<div className='sy-header-pill'>
					<div className='sy-header-left'>
						<Link
							to='/'
							className='sy-logo'
							aria-current={location.pathname === '/' ? 'page' : undefined}>
							<span className='sy-logo-badge' aria-hidden='true'>
								<i className='fa-solid fa-bolt' />
							</span>
							<span className='sy-logo-text'>liveskill</span>
						</Link>
						<a href='#main-content' className='sy-skip-btn'>
							Skip to content
						</a>
					</div>

					<div className='sy-header-right'>
						<nav className='sy-nav' aria-label='Primary'>
							<ul className='sy-nav-list'>
								<li className='sy-nav-item'>
									<button
										type='button'
										className='sy-nav-trigger'
										aria-controls='nav-menu-product'
										aria-expanded={openMenu === 'product'}
										onClick={() =>
											setOpenMenu((prev) =>
												prev === 'product' ? null : 'product',
											)
										}>
										<span>Product</span>
										<i
											className={`fa-solid fa-chevron-down sy-caret ${openMenu === 'product' ? 'is-open' : ''}`}
											aria-hidden='true'
										/>
									</button>

									{openMenu === 'product' && (
										<ul id='nav-menu-product' className='sy-dropdown-menu'>
											{PRODUCT_ITEMS.map((item) => (
												<li key={item.label}>
													<a
														href={`#${item.target}`}
														onClick={(e) => {
															e.preventDefault();
															scrollToSection(item.target);
														}}>
														<span className='sy-dd-icon' aria-hidden='true'>
															<i className={`fa-solid ${item.icon}`} />
														</span>
														<span className='sy-dd-copy'>
															<strong>{item.label}</strong>
															<span>{item.desc}</span>
														</span>
													</a>
												</li>
											))}
										</ul>
									)}
								</li>

								<li>
									<a
										href='#creator-resources'
										onClick={(e) => {
											e.preventDefault();
											scrollToSection('creator-resources');
										}}>
										Guides
									</a>
								</li>

								<li>
									<a
										href='#review-section'
										onClick={(e) => {
											e.preventDefault();
											scrollToSection('review-section');
										}}>
										Reviews
									</a>
								</li>

								<li>
									<a
										href='#features-carousel'
										onClick={(e) => {
											e.preventDefault();
											scrollToSection('features-carousel');
										}}>
										What’s New
									</a>
								</li>

								<li className='sy-nav-item'>
									<button
										type='button'
										className='sy-nav-trigger'
										aria-controls='nav-menu-mentors'
										aria-expanded={openMenu === 'mentors'}
										onClick={() =>
											setOpenMenu((prev) =>
												prev === 'mentors' ? null : 'mentors',
											)
										}>
										<span>For Mentors</span>
										<i
											className={`fa-solid fa-chevron-down sy-caret ${openMenu === 'mentors' ? 'is-open' : ''}`}
											aria-hidden='true'
										/>
									</button>

									{openMenu === 'mentors' && (
										<ul
											id='nav-menu-mentors'
											className='sy-dropdown-menu sy-dropdown-compact'>
											{MENTOR_ITEMS.map((item) => (
												<li key={item.label}>
													{item.to ? (
														<Link
															to={item.to}
															onClick={() => setOpenMenu(null)}>
															<span className='sy-dd-copy'>
																<strong>{item.label}</strong>
																<span>{item.desc}</span>
															</span>
														</Link>
													) : (
														<a
															href={`#${item.target}`}
															onClick={(e) => {
																e.preventDefault();
																scrollToSection(item.target);
															}}>
															<span className='sy-dd-copy'>
																<strong>{item.label}</strong>
																<span>{item.desc}</span>
															</span>
														</a>
													)}
												</li>
											))}
										</ul>
									)}
								</li>
							</ul>
						</nav>

						<div className='sy-auth-actions'>
							<Link to='/login' className='sy-btn-outline'>
								Log in
							</Link>
							<Link to='/signin' className='sy-btn-blue'>
								Get started
							</Link>
						</div>
					</div>

					<div className='sy-mobile-actions'>
						<Link to='/signin' className='sy-btn-blue sy-btn-mobile-start'>
							Get started
						</Link>
						<button
							type='button'
							className='sy-hamburger'
							aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
							aria-expanded={mobileOpen}
							aria-controls='anon-nav-menu'
							onClick={() => setMobileOpen((prev) => !prev)}>
							<i
								className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}
								aria-hidden='true'
							/>
						</button>
					</div>
				</div>
			</header>

			{mobileOpen && (
				<nav
					id='anon-nav-menu'
					className='sy-mobile-drawer'
					aria-label='Mobile navigation'>
					<ul>
						<li>
							<a
								href='#features-carousel'
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('features-carousel');
								}}>
								Product &amp; Features
							</a>
						</li>
						<li>
							<a
								href='#creator-resources'
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('creator-resources');
								}}>
								Guides
							</a>
						</li>
						<li>
							<a
								href='#review-section'
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('review-section');
								}}>
								Reviews
							</a>
						</li>
						<li>
							<a
								href='#split-screen-share'
								onClick={(e) => {
									e.preventDefault();
									scrollToSection('split-screen-share');
								}}>
								For Mentors
							</a>
						</li>
					</ul>
					<div className='sy-mobile-drawer-btns'>
						<Link
							to='/login'
							className='sy-btn-outline'
							onClick={() => setMobileOpen(false)}>
							Log in
						</Link>
						<Link
							to='/signin'
							className='sy-btn-blue'
							onClick={() => setMobileOpen(false)}>
							Get started
						</Link>
					</div>
				</nav>
			)}
		</div>
	);
}
