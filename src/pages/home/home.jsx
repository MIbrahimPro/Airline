import Navbar from "../../components/navbar/navbar";
import Filter from "../../components/filter/filter";
import Why from "../../components/why/why";
import Airlines from "../../components/airlines/airlines";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/footer/footer";
import Imager from "../../components/imager/imager";

import { useGlobalStatus } from '../../context/GlobalLoaderContext';

import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './home.scss';


export default function Home() {
    
    const [showForm, setShowForm] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const origin = { x: 0, y: 0 };
    const [activeDest, setActiveDest] = useState(null);

    const [popularDestinations, setPopularDestinations] = useState([]);

    const navigate = useNavigate();
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();


    const handleHeroClick = (e) => {
        if (!e.target.closest('.destination-item')) {
            setActiveDest(null);
        }
    };

    const openForm = () => {
        setShowForm(true);
        setTimeout(() => setFormVisible(true), 10);
    };

    const closeForm = () => {
        setFormVisible(false);
        setTimeout(() => setShowForm(false), 300);
    };

    useEffect(() => {
        startLoading();
        axios
            .get('/api/location/popular')
            .then((response) => {
                setPopularDestinations(response.data);
            })
            .catch((err) => {
                endLoading();
                console.log(err);
                setGlobalError(
                    'Error fetching popular destinations.'
                );
            })
            .finally(() => {
                endLoading();
                endLoading();

                const formjump = setTimeout(() => {
                    openForm();
                }, 3500);

                return () => clearTimeout(formjump);
            });
    }, [startLoading, endLoading, setGlobalError]);

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
                        <Imager
                            key={dest._id}
                            dest={dest}
                            activeDest={activeDest}
                            setActiveDest={setActiveDest}
                        />
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
                    onSubmit={(data) => {
                        const params = {
                            type: data.tripType === 'return' ? 'round-trip' : 'one-way',
                            from: data.from,
                            to: data.to,
                            date: data.depart ? new Date(data.depart).toLocaleDateString('en-GB') : '',
                            airlines: data.airline ? data.airline.split(',').map(a => a.trim()).join(',') : '',
                        };
                        const queryString = new URLSearchParams(params).toString();
                        navigate(`/search-results?${queryString}`);
                    }}
                />
            )}
        </div>
    );
}
