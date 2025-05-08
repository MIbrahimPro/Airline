import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';
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
                let { data } = await axios.get('/api/location/deals');
                console.log(data);
                setLastMinutes(
                    (data.lastMinutes || []).map((item) => ({
                        ...item,
                        description: item.dealingsDescription !== undefined ? item.dealingsDescription : item.description,
                    }))
                );
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


                    <section className="deals-section top-destinations">
                        <h2>Top Destinations</h2>
                        <div className="cards-grid">
                            {topDestinations.map(deal => (
                                <div
                                    key={deal._id}
                                    className="card"
                                    onClick={() => handleDealClick(deal)}
                                >
                                    <img src={deal.image} alt={deal.name} />
                                    <div className="info">
                                        <h3>{deal.name}</h3>
                                        <p className="deal-desc">{deal.dealingsDescription}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


                    <section className="deals-section last-minutes">
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
                    </section>


                    <section className="deals-section hot-deals">
                        <h2>Hot Deals</h2>
                        <div className="cards-grid">
                            {hotDeals.map(deal => (
                                <div
                                    key={deal._id}
                                    className="card hot-deal-card"
                                    onClick={() => handleDealClick(deal)}
                                >
                                    <div className="image-container">
                                        <img src={deal.image} alt={deal.name} />
                                        <div className="badge">Hot Deal</div>
                                    </div>
                                    <div className="info">
                                        <h3>{deal.name}</h3>
                                        <p className="deal-desc">{deal.dealingsDescription}</p>
                                        <button className="fly-btn">Fly Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>


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