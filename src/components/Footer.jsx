/** @format */

import './Footer.css';

export function Footer() {
	return (
		<footer>
			<h2>LiveSKill</h2>
			<div className='footer-con'>
				<div className='footer-left'>
					<p>© LiveSkill 2026</p>
					<p>Privacy policy</p>
					<p>Cookies policy</p>
					<p>Terms of use</p>
				</div>
				<div className='footer-right'>
					<h3>Updates directly to your inbox</h3>
					<div className='footer-right-div'>
						<input
							type='email'
							name='email'
							id='email'
							placeholder='Email Address'
						/>
						<button>Send</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
