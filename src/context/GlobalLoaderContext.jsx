// src/contexts/GlobalLoaderContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
// import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GlobalStatusContext = createContext();

export const GlobalStatusProvider = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const startLoading = useCallback(() => {
        setLoadingCount((count) => count + 1);
    }, []);

    const endLoading = useCallback(() => {
        setLoadingCount((count) => Math.max(count - 1, 0));
    }, []);

    const setGlobalError = useCallback((errorMsg) => {
        console.log(errorMsg);
        navigate('/error', { state: { prevPath: location.pathname } });
    }, [navigate, location.pathname]); // Note the dependencies here

    const clearError = useCallback(() => setError(null), []);



    //   // Functions to control loading:
    //   const startLoading = () => {
    //     setLoadingCount((count) => count + 1)
    //   };
    //   const endLoading = () => {
    //     setLoadingCount((count) => Math.max(count - 1, 0))
    //   };

    // For setting error, store the current location as previous path and navigate to /error.
    //   const setGlobalError = (errorMsg) => {
    //     console.log(errorMsg);
    //     // Pass current location as previous route in state.
    //     navigate('/error', { state: { prevPath: location.pathname } });
    //   };

    //   const clearError = () => setError(null);



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
