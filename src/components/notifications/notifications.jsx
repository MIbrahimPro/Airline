import React, { useEffect, useState } from 'react';
import './notifications.scss';

const Notification = ({ type, message }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer); 
    }, []);

    return isVisible ? (
        <div className={`notification ${type}`}>
            <p>{message}</p>
        </div>
    ) : null;
};

export default Notification;