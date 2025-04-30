// src/pages/ErrorPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './error.scss';

export default function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevPath = location.state?.prevPath || '/';

  const handleRetry = () => {
    navigate(prevPath);
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>Oops, something went wrong!</h1>
        <p>An error occurred while loading the page. Please try again later.</p>
        <button onClick={handleRetry}>Go Back</button>
      </div>
    </div>
  );
}
