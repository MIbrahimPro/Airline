import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import './airlinedetail.scss';

function ExpandableDetail({ heading, description }) {
    return (
        <div className="expandable-detail">
            <div className="detail-header" >
                <h3>{heading}</h3>
            </div><p className="detail-content">{description}</p>
        </div>
    );
}

function BaggageSection({ baggageArray }) {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="baggage-section">
            <h2>Baggage Information</h2>
            {baggageArray.length > 1 ? (
                <div className="baggage-tabs">
                    <div className="baggage-tab-headers">
                        {baggageArray.map((item, index) => (
                            <button
                                key={index}
                                className={activeIndex === index ? 'active' : ''}
                                onClick={() => setActiveIndex(index)}
                            >
                                {item.heading}
                            </button>
                        ))}
                    </div>
                    <div className="baggage-tab-content">
                        <p>{baggageArray[activeIndex].description}</p>
                    </div>
                </div>
            ) : (
                <div className="single-baggage">
                    <h3>{baggageArray[0].heading}</h3>
                    <p>{baggageArray[0].description}</p>
                </div>
            )}
        </div>
    );
}

function YouMayAlsoLike({ suggestions }) {
    return (
        <div className="you-may-also-like">
            <h3>You May Also Like</h3>
            <div className="suggestions-grid">
                {suggestions.map((airline) => (

                    <div key={airline._id} className="airline-card"  onClick={() => window.location.href = `/flight/${airline._id}`}>
                        <div className="airline-logo">
                            <img src={airline.logoPicture} alt={airline.shortName} />
                        </div>
                        <div className="airline-info">
                            <h2>{airline.name}</h2>
                            <p>{airline.overview}</p>
                        </div>
                        <button className="fly-btn">
                            <img src="../icons/takeoff_w.svg" alt="Takeoff" className="btn-icon" />
                            Fly <span className="btn-text-long">{airline.shortName}</span>
                        </button>
                    </div>


                ))}






            </div>
        </div>
    );
}

export default function AirlineDetail() {
    const { id } = useParams();
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();
    const navigate = useNavigate();
    const [airline, setAirline] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    // Fetch detailed airline info
    useEffect(() => {
        startLoading();
        axios
            .get(`/api/airline/${id}`)
            .then((res) => setAirline(res.data))
            .catch((err) => {
                setGlobalError(err.response?.data?.message || 'Failed to load airline data.');
            })
            .finally(() => endLoading());
    }, [id, startLoading, endLoading, setGlobalError]);

    
    useEffect(() => {
        axios
            .get('/api/airline/')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    const others = res.data.filter((item) => item._id !== id);
                    const shuffled = others.sort(() => 0.5 - Math.random());
                    setSuggestions(shuffled.slice(0, 4));
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    if (!airline) return null;

    return (
        <>
            <Navbar selectedPage="airlines" />
            <div className="airline-detail-page">
                {/* Hero Section */}
                <div className="airline-hero">
                    <img className="hero-bg" src="/airline-bg.jpg" alt="Airline Banner" />
                    <div className="hero-overlay">
                        <div className="logo-container">
                            <img src={airline.logoPicture} alt={airline.shortName} />
                        </div>
                        <h1 className="airline-name">{airline.shortName}</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="airline-content">
                    <section className="overview-section">
                        <h2>Overview</h2>
                        <p>{airline.overview}</p>
                    </section>

                    {airline.baggage && airline.baggageArray && airline.baggageArray.length > 0 && (
                        <BaggageSection baggageArray={airline.baggageArray} />
                    )}

                    {airline.details && airline.details.length > 0 && (
                        <section className="details-section">
                            <h2>Details</h2>
                            {airline.details.map((detail, i) => (
                                <ExpandableDetail key={i} heading={detail.heading} description={detail.description} />
                            ))}
                        </section>
                    )}
                </div>

                {/* Action Button */}
                <div className="airline-action">
                    <button onClick={() => navigate(`/search?airlines_id=${airline._id}`)}>
                        Search Flights with {airline.shortName}
                    </button>
                </div>

                {/* "You May Also Like" Section */}
                {suggestions.length > 0 && <YouMayAlsoLike suggestions={suggestions} />}
            </div>
            <Footer />
        </>
    );
}
