

import React from 'react';
import './why.scss';

const features = [
    {
        id: 'itineraries',
        title: 'Custom Itineraries',
        description: 'Tailor-made plans for unforgettable travel experiences.',
    },
    {
        id: 'best-deals',
        title: 'Best Flight Deals',
        description: 'Lowest fares and exclusive offers to maximize your budget.',
    },
    {
        id: 'support',
        title: '24/7 Support',
        description: 'Dedicated experts providing real-time assistance anytime.',
    },
    {
        id: 'secure',
        title: 'Secure Bookings',
        description: 'Advanced encryption protects your data and payments.',
    },
];

export default function WhyChooseUs({ openFilter }) {
    return (
        <section className="why-choose">
            
            <h2 className="wc-title">Why Choose Us</h2>
            
            
            <div className="wc-search">
                <div
                    className="search-button-gbl"
                    onClick={openFilter}
                >
                    <span className="btn-text">Search Flights</span>
                    <img className="btn-icon" src="../icons/search.svg" alt="search" />
                </div>
            </div>


            <div className="wc-grid">
                {features.map((f) => (
                    <div key={f.id} className="wc-tile">
                        <div className="wc-icon">
                            <img src={`../icons/${f.id}.svg`} alt={f.title} />
                        </div>
                        <h3 className="wc-feature-title">{f.title}</h3>
                        <p className="wc-feature-desc">{f.description}</p>
                    </div>
                ))}
            </div>


        </section>
    );
}
