/** @format */

import { Routes, Route } from 'react-router';
import { HomePage } from './pages/Home';
import { Login } from './pages/Login';
import { Signin } from './pages/Signin';
import { Welcome } from './pages/Welcome';
import { MainPage } from './pages/MainPage';
import { StreamInfo } from './pages/StreamInfo';
import { StreamRoom } from './pages/StreamRoom';
import { ViewerRoom } from './pages/ViewerRoom';
import './App.css';

function App() {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='login' element={<Login />} />
			<Route path='signin' element={<Signin />} />
			<Route path='welcome' element={<Welcome />} />
			<Route path='liveskill' element={<MainPage />} />
			<Route path='liveskill-streaminfo' element={<StreamInfo />} />
			<Route path='liveskill-streamroom' element={<StreamRoom />} />
			<Route path='liveskill-viewroom' element={<ViewerRoom />} />
		</Routes>
	);
}

export default App;
