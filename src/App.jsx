/** @format */

import { Routes, Route } from 'react-router';
import { HomePage } from './pages/Home';
import { Login } from './pages/Login';
import { Signin } from './pages/Signin';
import { MainPage } from './pages/MainPage';
import { StreamInfo } from './pages/StreamInfo';
import { StreamRoom } from './pages/StreamRoom';
import './App.css';

function App() {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='login' element={<Login />} />
			<Route path='signin' element={<Signin />} />
			<Route path='liveskill' element={<MainPage />} />
			<Route path='liveskill-streaminfo' element={<StreamInfo />} />
			<Route path='liveskill-streamroom' element={<StreamRoom />} />
		</Routes>
	);
}

export default App;
