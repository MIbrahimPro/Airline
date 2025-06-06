import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from "../../components/navbar/navbar"
import Notification from '../../components/notifications/notifications';
import QuotePopup from '../../components/quotePopup/quotePopup';
import Footer from "../../components/footer/footer";
import FilterSidebar from '../../components/filtersidebar/FilterSidebar';
import FlightCard from '../../components/TicketCard/TicketCard';
import FilterSidebarModal from '../../components/filtersidebar/FilterSidebarModal';
import SearchForm from '../../components/filter/filter';



import './searchResults.scss';


export default function SearchResultsPage() {

    const navigate = useNavigate();

    const [notification, setNotification] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    // const [searchParams] = useSearchParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const infant = searchParams.get('infant');
    const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage
    const [totalPages, setTotalPages] = useState(0);     // Initialize totalPages

    const openPopup = () => {
        setNotification(null)
        setShowPopup(true);
        setTimeout(() => setPopupVisible(true), 10);
    };


    const closePopup = () => {
        setPopupVisible(false);
        setTimeout(() => setShowPopup(false), 300);
    };


    const handleSearchSubmit = (data) => {
        console.log('Search submitted:', data);
    };


    const handlePageChange = (page) => {
        // Update the 'page' parameter in the URL
        setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set('page', page.toString());
            return newParams;
        });
        setCurrentPage(page); // Update local state as well, for consistency
    };

    const handleSubmit = () => {
        setNotification({ type: 'success', message: 'Message sent successfully!' });
        closePopup();
    }


    useEffect(() => {


        setLoading(true);
        setError(null);

        const params = {};

        const tripType = searchParams.get('tripType');
        if (tripType) {
            params.type = tripType;
        }

        const minPrice = searchParams.get('minPrice');
        if (minPrice) {
            params.minPrice = parseInt(minPrice, 10);
        }

        const maxPrice = searchParams.get('maxPrice');
        if (maxPrice) {
            params.maxPrice = parseInt(maxPrice, 10);
        }

        params.page = currentPage;


        const from_id = searchParams.get('from_id');
        if (from_id) {
            params.from_id = from_id;
        }

        const to_id = searchParams.get('to_id');
        if (to_id) {
            params.to_id = to_id;
        }

        const depDateStr = searchParams.get('depart')
        if (depDateStr) {
            params.depDateStr = depDateStr;
        }

        const arrDateStr = searchParams.get('ret')
        if (arrDateStr) {
            params.arrDateStr = arrDateStr;
        }

        const from = searchParams.get('from');
        if (from) {
            params.from = from;
        }

        const to = searchParams.get('to');
        if (to) {
            params.to = to;
        }

        const airlines_id = searchParams.getAll('airlines_id');
        if (airlines_id) {
            params.airlines_id = airlines_id;
        }

        const airlines = searchParams.get('airlines');
        if (airlines) {
            params.airlines = airlines;
        }

        const directFlag = searchParams.get('directFlights');
        if (directFlag !== null) {
            params.direct = directFlag === 'true';
        }

        console.log(params);


        let apiUrl = '/api/flight/filter';
        const queryParams = new URLSearchParams(params).toString();
        if (queryParams) {
            apiUrl += `?${queryParams}`;
        }

        axios.get(apiUrl)
            .then(response => {
                setFlights(response.data.results || []);
                setTotalPages(response.data.totalPages || 0); // Extract totalPages from response
                console.log(response.data.results);
            })
            .catch(() => {
                console.error('Error fetching flights:', error);
                setError(error || 'Failed to fetch flights');
            })
            .finally(() => {
                setLoading(false)
                // setTimeout(() => setLoading(false), 5000);
            });
    }, [searchParams, currentPage, error]);



    return (
        <>
            <Navbar />
            <div className="results-page">
                <aside className="filter-sidebar">
                    <FilterSidebar />
                </aside>

                <main className="results-main">

                    <div className='Pay-later-card'>
                        <div className="pl-icon">
                            <img src="./icons/paylater.svg" alt="Pay Later Icon" />
                        </div>
                        <div className="pl-content">
                            <h3>Book Now - Pay Later</h3>
                            <p>You can book now but pay later through our services</p>
                        </div>
                        <button
                            className="pl-more-info-btn"
                            onClick={() => navigate('/paylater')}
                        >
                            More Info
                        </button>
                    </div>

                    <div className="desktop-search-form">
                        <SearchForm inline onSubmit={handleSearchSubmit} />
                    </div>

                    <div className='res-btns-cont'>
                        <button
                            className="mobile-filter-btn"
                            onClick={() => setShowFilterModal(true)}
                        >
                            <img src='../icons/filter.svg' alt='' />

                            <p>Filter</p>
                        </button>
                        <div
                            className="mobile-search-btn"
                            onClick={() => setShowSearchPopup(true)}
                        >
                            <span className="btn-text">Search Flights</span>
                            <img className="btn-icon" src="../icons/search.svg" alt="search" />
                        </div>
                    </div>


                    <div className="tickets-list">
                        {loading ? (
                            Array.from({ length: 25 }).map((_, index) => (
                                <FlightCard key={index} loading={true} />
                            ))
                        ) : (

                            flights.length === 0 ? (
                                <div className='no-flights'>
                                    <h2>No flights found.</h2>
                                    <button className="quote-btn" onClick={openPopup}>
                                        Get in Touch
                                    </button>
                                </div>
                            ) : (

                                flights.map(f => (
                                    <FlightCard

                                        key={f.flightId}
                                        id={f.flightId}
                                        recommended={f.recommended}
                                        type={searchParams.get('tripType') || 'round-trip'}

                                        airlineLogo={f.airlineMono}
                                        airlineName={f.airlineName}

                                        deptPort={f.depAirportCode}
                                        deptPortFull={f.depAirportName}

                                        flightTime={f.fromDuration}
                                        returnTime={f.toDuration || "0"}

                                        arrivalPort={f.arrAirportCode}
                                        arrivalPortFull={f.arrAirportName}

                                        original={f.originalPrice}
                                        saving={f.discount}
                                        price={f.finalPrice}

                                        stops={f.stops}

                                        adults={adults}
                                        children={children}
                                        infants={infant}

                                        depart={f.departureDate.year + "-" + f.departureDate.month + "-" + f.departureDate.day}
                                        ret={f.arrivalDate.year + "-" + f.arrivalDate.month + "-" + f.arrivalDate.day}

                                    />
                                ))
                            )


                        )

                        }
                    </div>


                    {totalPages > 1 && !loading && flights.length > 0 && (
                        <div className="pagination">
                            {currentPage > 1 && (
                                <button onClick={() => handlePageChange(currentPage - 1)}>
                                    Previous
                                </button>
                            )}
                            <span>Page {currentPage} of {totalPages}</span>
                            {currentPage < totalPages && (
                                <button onClick={() => handlePageChange(currentPage + 1)}>
                                    Next
                                </button>
                            )}
                        </div>
                    )}



                </main>
            </div>
            <Footer />

            {showFilterModal && (
                <FilterSidebarModal onClose={() => setShowFilterModal(false)} />
            )}

            {showSearchPopup && (
                <SearchForm
                    visible={showSearchPopup}
                    onClose={() => setShowSearchPopup(false)}
                    onSubmit={handleSearchSubmit}
                />
            )}

            {notification && (
                <Notification type={notification.type} message={notification.message} />
            )}
            {showPopup && (
                <QuotePopup
                    visible={popupVisible}
                    onClose={closePopup}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
}



