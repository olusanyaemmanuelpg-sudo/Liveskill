/** @format */

import { Routes, Route } from 'react-router';
import { HomePage } from './pages/Home';
import { Login } from './pages/Login';
import { Signin } from './pages/Signin';
import './App.css';
import { MainPage } from './pages/MainPage';

function App() {
	return (
		<Routes>
			<Route path='/' element={<HomePage />} />
			<Route path='login' element={<Login />} />
			<Route path='signin' element={<Signin />} />
			<Route path='liveskill' element={<MainPage />} />
		</Routes>
	);
}

export default App;
