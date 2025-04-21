// SearchBar.jsx

import React from 'react';
import './search.scss'; // import the SCSS

const SearchBar = ({ onClose, animateOut }) => {

    return (
        <div className={`search ${animateOut ? 'slide-up' : 'slide-down'}`}>
            <div className="search-bar">
                <input className="search-bar-txt" type="text" placeholder="Search..." />
                <button className="search-bar-btn">
                    <span className="material-symbols-outlined">search</span>
                </button>
            </div>
            <button className="search-close" onClick={onClose}>
                <span>&#x2715;</span>
            </button>
        </div>
    );
    
};

export default SearchBar;
