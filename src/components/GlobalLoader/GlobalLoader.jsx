// src/components/GlobalLoader.jsx
import React from 'react';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import './GlobalLoader.scss';

export default function GlobalLoader() {
  const { loadingCount } = useGlobalStatus();

  if (loadingCount === 0) return null;

  return (
    <div className="global-loader">
      <div className="spinner">
        {/* Simple spinner; replace with any spinner component as needed */}
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  );
}
