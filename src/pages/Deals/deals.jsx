import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import { motion } from 'framer-motion';


import Navbar from "../../components/navbar/navbar";
import SearchForm from '../../components/filter/filter';
import Imager from "../../components/imager/imager";
import Footer from "../../components/footer/footer";

import './deals.scss';

export default function DealsPage() {
    const navigate = useNavigate();
    const [lastMinutes, setLastMinutes] = useState([]);
    const [topDestinations, setTopDestinations] = useState([]);
    const [hotDeals, setHotDeals] = useState([]);
    const [activeDest, setActiveDest] = useState(null);

    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();
    const [showSearchPopup, setShowSearchPopup] = useState(false);



    useEffect(() => {
        const fetchDeals = async () => {
            startLoading();
            try {
                const { data } = await axios.get('/api/location/deals');
                setLastMinutes(data.lastMinutes || []);
                setTopDestinations(data.topDestinations || []);
                setHotDeals(data.hotDeals || []);
            } catch (err) {
                console.error(err);
                setGlobalError('Failed to load deals');
            } finally {
                endLoading();
            }
        };
        fetchDeals();
    }, []);

    const handleDealClick = async (deal) => {
        try {
            const { data: airportIds } = await axios.get(
                `/api/airport/by-location/${deal._id}/ids`
            );
            if (airportIds.length) {
                navigate(`/search?to_id=${airportIds[0]}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const sectionVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: delay => ({ opacity: 1, y: 0, transition: { delay } })
    };

    return (
        <>


            <Navbar selectedPage="deals" />



            <div className="deals-page">


                <div className="desktop-search-form">
                    <SearchForm inline />
                </div>

                <div
                    className="mobile-search-btn"
                    onClick={() => setShowSearchPopup(true)}
                >
                    <span className="btn-text">Search Flights</span>
                    <img className="btn-icon" src="../icons/search.svg" alt="search" />
                </div>


                <div className="dealing">
                    <motion.section
                        className="deals-section last-minutes"
                        initial="hidden"
                        animate="visible"
                        custom={0.1}
                        variants={sectionVariant}
                    >
                        <h2>Last-Minute Deals</h2>
                        <div className="cards-row">
                            {lastMinutes.map(deal => (
                                <Imager
                                    key={deal._id}
                                    dest={deal}
                                    activeDest={activeDest}
                                    setActiveDest={setActiveDest}
                                />
                            ))}
                        </div>
                    </motion.section>

                    <motion.section
                        className="deals-section top-destinations"
                        initial="hidden"
                        animate="visible"
                        custom={0.3}
                        variants={sectionVariant}
                    >
                        <h2>Top Destinations</h2>
                        <div className="cards-grid masonry">
                            {topDestinations.map(deal => (
                                <motion.div
                                    key={deal._id}
                                    className="card"
                                    whileHover={{ scale: 1.03 }}
                                    onClick={() => handleDealClick(deal)}
                                >
                                    <img src={deal.image} alt={deal.name} />
                                    <div className="info">
                                        <h3>{deal.name}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    <motion.section
                        className="deals-section hot-deals"
                        initial="hidden"
                        animate="visible"
                        custom={0.5}
                        variants={sectionVariant}
                    >
                        <h2>Hot Deals</h2>
                        <div className="cards-grid standard">
                            {hotDeals.map(deal => (
                                <motion.div
                                    key={deal._id}
                                    className="card"
                                    whileHover={{ scale: 1.04 }}
                                    onClick={() => handleDealClick(deal)}
                                >
                                    <div className="image-wrapper">
                                        <img src={deal.image} alt={deal.name} />
                                    </div>
                                    <div className="info">
                                        <h3>{deal.name}</h3>
                                        <button className="btn">Fly {deal.name}</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>



            </div>



            <Footer />



            {showSearchPopup && (
                <SearchForm
                    visible={showSearchPopup}
                    onClose={() => setShowSearchPopup(false)}
                />
            )}

        </>
    );
}
