import Navbar from "../../components/navbar/navbar";
import Filter from "../../components/filter/filter";
import Why from "../../components/why/why";
import Airlines from "../../components/airlines/airlines";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/footer/footer";

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.scss';

const popularDestinations = [
    {
        id: 'paris',
        name: 'Paris',
        img: '../samples/paris.jpg',
        description: 'Experience romance in this iconic city, with charming cafes and unforgettable landmarks.',
    },
    {
        id: 'hongkong',
        name: 'Hongkong',
        img: '../samples/hongkong.jpg',
        description: 'A vibrant metropolis where Eastern traditions beautifully meet Western modernity.',
    },
    {
        id: 'ksa',
        name: 'Ksa',
        img: '../samples/ksa.jpg',
        description: 'Explore the rich history and witness the impressive modern marvels of this ancient land.',
    },
    {
        id: 'maldives',
        name: 'Maldives',
        img: '../samples/maldives.jpg',
        description: 'Indulge in the beauty of this tropical paradise, boasting stunning beaches and clear turquoise waters.',
    },
    {
        id: 'switzerland',
        name: 'Switzerland',
        img: '../samples/switzerland.jpg',
        description: 'Discover breathtaking alpine scenery and explore the quaint, charming villages nestled in the mountains.',
    },
    {
        id: 'thailand',
        name: 'Thailand',
        img: '../samples/thailand.jpg',
        description: 'Immerse yourself in exotic temples, experience vibrant nightlife, and relax on beautiful, sun‑kissed beaches.',
    },
];

export default function Home() {
    const [showForm, setShowForm] = useState(false);         // mounted?
    const [formVisible, setFormVisible] = useState(false);   // open (for animation)
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [activeDest, setActiveDest] = useState(null);
    const navigate = useNavigate();

    // Deselect if click happens outside any .destination-item
    const handleHeroClick = (e) => {
        if (!e.target.closest('.destination-item')) {
            setActiveDest(null);
        }
    };

    const openForm = () => {
        // compute button center
       
        setShowForm(true);
        // slight delay so CSS transition kicks in
        setTimeout(() => setFormVisible(true), 10);
    };

    const closeForm = () => {
        // begin reverse animation
        setFormVisible(false);
        // unmount after animation
        setTimeout(() => setShowForm(false), 300);
    };

    return (
        <div className="home">
            <Navbar selectedPage="home" />

            <div className="hero" onClick={handleHeroClick}>
                <div className="hero-content">
                    <h1>Fly Premium. Explore the World.</h1>
                    <div

                        className="search-button-gbl"
                        onClick={openForm}
                    >
                        <span className="btn-text">Search Flights</span>
                        <img className="btn-icon" src="../icons/search.svg" alt="search" />
                    </div>
                </div>

                <div className="destinations">
                    <div className="spacer" />
                    {popularDestinations.map((dest) => (
                        <div
                            key={dest.id}
                            className={`destination-item${activeDest === dest.id ? ' active' : ''}`}
                            onClick={() =>
                                setActiveDest(activeDest === dest.id ? null : dest.id)
                            }
                        >
                            <img className="dest-image" src={dest.img} alt={dest.name} />
                            <p className="name">{dest.name}</p>

                            <div className="overlay">
                                <p className="description">{dest.description}</p>
                                <div
                                    className="dest-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/${dest.id}`);
                                    }}
                                >
                                    <img src="../icons/fly.svg" alt="open" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="spacer" />
                </div>
            </div>

            <Airlines />
            
            <Why openFilter={openForm} />
            
            <FAQ />

            <Footer />
            
            {showForm && (
                <Filter
                    origin={origin}
                    visible={formVisible}
                    onClose={closeForm}
                    onSubmit={() => navigate('/search-results')}
                />
            )}
        </div>
    );
}
