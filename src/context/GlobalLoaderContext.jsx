// src/contexts/GlobalLoaderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GlobalStatusContext = createContext();

export const GlobalStatusProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Functions to control loading:
  const startLoading = () => setLoadingCount((count) => count + 1);
  const endLoading = () => setLoadingCount((count) => Math.max(count - 1, 0));

  // For setting error, store the current location as previous path and navigate to /error.
  const setGlobalError = (errorMsg) => {
    setError(errorMsg);
    // Pass current location as previous route in state.
    navigate('/error', { state: { prevPath: location.pathname } });
  };

  const clearError = () => setError(null);

  // OPTIONAL: Set up axios interceptors to automatically manage loading and error state.
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      startLoading();
      return config;
    });
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        endLoading();
        return response;
      },
      (err) => {
        endLoading();
        setGlobalError(err.message || 'An error occurred. Please try again.');
        return Promise.reject(err);
      }
    );
    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <GlobalStatusContext.Provider
      value={{
        loadingCount,
        error,
        startLoading,
        endLoading,
        setGlobalError,
        clearError,
      }}
    >
      {children}
    </GlobalStatusContext.Provider>
  );
};

export const useGlobalStatus = () => useContext(GlobalStatusContext);
