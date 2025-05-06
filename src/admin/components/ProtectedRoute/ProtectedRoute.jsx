

import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../../utils/auth';

const ProtectedRoute = () => {
	const [loggedIn, setLoggedIn] = useState(null);

	useEffect(() => {
		async function checkAuth() {
			const valid = await isLoggedIn();
			setLoggedIn(valid);
		}
		checkAuth();
	}, []);

	if (loggedIn === null) {
		return <div>Checking login…</div>;
	}

	return loggedIn ? <Outlet /> : <Navigate to="/admin" />;
};

export default ProtectedRoute;
