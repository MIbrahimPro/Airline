import Navbar from "../../components/navbar/navbar";
import Filter from "../../components/filter/filter";
import Why from "../../components/why/why";
import Airlines from "../../components/airlines/airlines";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/footer/footer";
import Imager from "../../components/imager/imager";

import { useGlobalStatus } from '../../context/GlobalLoaderContext';

import React, { useState, useEffect, useRef } from 'react';
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
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus()



    const [duplicatedDestinations, setDuplicatedDestinations] = useState([]);
    const [singleSetSize, setSingleSetSize] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('horizontal');

    const destinationsRef = useRef(null);


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







    // Determine scroll direction based on screen size
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1200px) and (min-width: 881px)');
        const handleMediaChange = (e) => {
            setScrollDirection(e.matches ? 'vertical' : 'horizontal');
        };
        mediaQuery.addListener(handleMediaChange);
        handleMediaChange(mediaQuery);
        return () => mediaQuery.removeListener(handleMediaChange);
    }, []);

    // Compute duplicated destinations and single set size
    useEffect(() => {
        const computeItems = () => {
            const container = destinationsRef.current;
            if (!container || popularDestinations.length === 0) return;
            const isSmallScreen = window.innerWidth < 881;
            const destWidth = isSmallScreen ? 145 : 210;
            const destHeight = isSmallScreen ? 217.5 : 315;
            const gap = 20;
            const numberOfDestinations = popularDestinations.length;

            if (scrollDirection === 'horizontal') {
                const singleSetWidth = numberOfDestinations * (destWidth + gap) - gap;
                const needed = Math.ceil((container.clientWidth * 2) / singleSetWidth);
                const repeats = Math.max(needed, 2);
                setDuplicatedDestinations(Array.from({ length: repeats }).flatMap(() => popularDestinations));
                setSingleSetSize(singleSetWidth);
            } else {
                const singleSetHeight = numberOfDestinations * (destHeight + gap) - gap;
                const needed = Math.ceil((container.clientHeight * 2) / singleSetHeight);
                const repeats = Math.max(needed, 2);
                setDuplicatedDestinations(Array.from({ length: repeats }).flatMap(() => popularDestinations));
                setSingleSetSize(singleSetHeight);
            }
        };
        computeItems();
        window.addEventListener('resize', computeItems);
        return () => window.removeEventListener('resize', computeItems);
    }, [popularDestinations, scrollDirection]);

    // Auto-scrolling animation
    useEffect(() => {
        const container = destinationsRef.current;
        if (!container || duplicatedDestinations.length === 0) return;
        let frameId;
        const speed = 1; // Adjust speed as needed (pixels per frame)

        const step = () => {
            if (scrollDirection === 'horizontal') {
                container.scrollLeft += speed;
                if (container.scrollLeft >= singleSetSize) {
                    container.scrollLeft -= singleSetSize;
                }
            } else {
                container.scrollTop += speed;
                if (container.scrollTop >= singleSetSize) {
                    container.scrollTop -= singleSetSize;
                }
            }
            frameId = requestAnimationFrame(step);
        };

        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [duplicatedDestinations, singleSetSize, scrollDirection]);






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
                <div ref={destinationsRef} className="destinations">

                    <div className="spacer" />
                    {duplicatedDestinations.map((dest, idx) => (
                        <Imager
                            key={dest._id + '-' + idx}
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


