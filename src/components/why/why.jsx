

import React from 'react';
import './why.scss';

const features = [
    {
        id: 'confidences',
        title: 'Book with Confidences',
        description: 'All of your bookings will be covered by ATOL. You will be ATOL protected.',
    },
    {
        id: 'book now pay later',
        title: 'Book now and pay in Installments',
        description: 'You can book and you can easily pay as per your convenience upto 6 easy installments.',
    },
    {
        id: 'support',
        title: '24/7 suppport',
        description: 'Dedicated experts providing real-time assistance anytime.',
    },
    {
        id: 'lowest',
        title: 'lowest price guarantee',
        description: 'Flyva UK guarantees the lowest and unbeatable price. You will not get on any other website.',
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
