// Topbar.jsx
import React, { useState, useEffect } from 'react';
import './topbar.scss';

const Topbar = () => {
    const texts = [
        "Delivery and Pickup only on Friday",
        "Free shipping on orders over 1000 Pkr",
        "Shipping is done every Monday",
        "20% off on your first order!"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
                setFade(true);
            }, 300);
        }, 4000);

        return () => clearInterval(interval);
    }, [texts.length]);

    // These functions handle manual arrow clicks.
    const handlePrev = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + texts.length) % texts.length);
            setFade(true);
        }, 300);
    };

    const handleNext = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
            setFade(true);
        }, 300);
    };

    return (
        <div className="topbar" >
          
            <div className="arrows arrow-left" onClick={handlePrev}>
                <span className="material-symbols-outlined">chevron_left</span>
            </div>
            <div className={`content ${fade ? '' : 'fade'}`}>
                {texts[currentIndex]}
            </div>
            <div className="arrows arrow-right" onClick={handleNext}>
                <span className="material-symbols-outlined">chevron_right</span>
            </div>

        </div>
    );
};

export default Topbar;
