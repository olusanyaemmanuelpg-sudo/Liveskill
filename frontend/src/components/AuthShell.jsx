/** @format */

import { Link } from 'react-router';
import './AuthShell.css';

export function AuthShell({ children }) {
	return (
		<div className='sy-auth-shell'>
			<header className='sy-auth-topbar'>
				<Link to='/' className='sy-auth-logo' aria-label='LiveSkill home'>
					<span className='sy-auth-logo-mark' aria-hidden='true'>
						<i className='fa-solid fa-bolt' />
					</span>
					<span className='sy-auth-logo-text'>liveskill</span>
				</Link>
			</header>

			{/* Floating StreamYard-style vector illustrations */}
			<div className='sy-auth-bg-art' aria-hidden='true'>
				<div className='art-float art-tl-window'>
					<div className='art-win-dots'>
						<span />
						<span />
						<span />
					</div>
					<div className='art-win-avatar'>
						<i className='fa-solid fa-user' />
					</div>
				</div>

				<div className='art-float art-tl-chats'>
					<i className='fa-solid fa-comment-dots' />
				</div>

				<div className='art-float art-bl-play'>
					<i className='fa-solid fa-play' />
				</div>

				<div className='art-float art-bl-monitor'>
					<i className='fa-solid fa-desktop' />
				</div>

				<div className='art-float art-bl-cam'>
					<i className='fa-solid fa-video' />
				</div>

				<div className='art-float art-bl-star'>
					<i className='fa-solid fa-star' />
				</div>

				<div className='art-float art-bm-portrait'>
					<i className='fa-solid fa-user-tie' />
				</div>

				<div className='art-float art-br-chart'>
					<i className='fa-solid fa-chart-pie' />
				</div>

				<div className='art-float art-tr-heart'>
					<i className='fa-solid fa-heart' />
				</div>

				<div className='art-float art-mr-card'>
					<i className='fa-solid fa-circle-play' />
					<div className='art-card-person'>
						<i className='fa-solid fa-user' />
					</div>
				</div>

				<div className='art-float art-mr-msg'>
					<i className='fa-solid fa-message' />
				</div>

				<div className='art-float art-br-cam'>
					<i className='fa-solid fa-video' />
				</div>

				<div className='art-float art-br-bubbles'>
					<i className='fa-solid fa-comments' />
				</div>
			</div>

			<main className='sy-auth-stage'>{children}</main>
		</div>
	);
}
