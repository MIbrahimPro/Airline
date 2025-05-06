import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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


    const [notification, setNotification] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [searchParams] = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const departRaw = searchParams.get('depart');
    const retRaw = searchParams.get('ret');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const infant = searchParams.get('infant');

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


    const formatDate = (iso) => {
        if (!iso) return '';
        const [year, month, day] = iso.split('-');
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = () => {
        setNotification({ type: 'success', message: 'Message sent successfully!' });
        closePopup();
    }


    useEffect(() => {
        const params = {};

        // Map searchParams to API parameters
        const tripType = searchParams.get('tripType');
        if (tripType) {
            params.type = tripType; // API uses 'type' not 'tripType'
        }

        const minPrice = searchParams.get('minPrice');
        if (minPrice) {
            params.minPrice = parseInt(minPrice, 10);
        }

        const maxPrice = searchParams.get('maxPrice');
        if (maxPrice) {
            params.maxPrice = parseInt(maxPrice, 10);
        }

        const page = searchParams.get('page');
        if (page) {
            params.page = parseInt(page, 10);
        }

        const from_id = searchParams.get('from_id');
        if (from_id) {
            params.from_id = from_id;
        }

        const to_id = searchParams.get('to_id');
        if (to_id) {
            params.to_id = to_id;
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

        setLoading(true);
        setError(null);

        let apiUrl = '/api/flight/filter';
        const queryParams = new URLSearchParams(params).toString();
        if (queryParams) {
            apiUrl += `?${queryParams}`;
        }

        axios.get(apiUrl)
            .then(response => {
                setFlights(response.data.results || []);
            })
            .catch(error => {
                console.error('Error fetching flights:', error);
                setError(error.message || 'Failed to fetch flights');
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 5000);
            });
    }, [searchParams]);



    return (
        <>
            <Navbar />
            <div className="results-page">
                <aside className="filter-sidebar">
                    <FilterSidebar />
                </aside>

                <main className="results-main">

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
                            flights.map((ticket) => (
                                <FlightCard
                                    loading={true}
                                />
                            ))
                        ) : (

                            flights.length === 0 ? (
                                <>
                                    <h2>No flights found.</h2>
                                    <button className="quote-btn" onClick={openPopup}>
                                        Get in Touch
                                    </button>
                                </>
                            ) : (

                                flights.map((ticket) => (
                                    flights.map(f => (
                                        <FlightCard
                                            
                                            key={f.flightId}
                                            id={f.flightId}
                                            recommended={f.recommended}
                                            type={searchParams.get('type') || 'round-trip'}
                                            
                                            airlineLogo={f.airlineMono}
                                            airlineName={f.airlineName}

                                            deptPort={f.depAirportCode}
                                            deptPortFull={f.depAirportName}
                                            
                                            flightTime={f.flightTime}

                                            arrivalPort={f.arrAirportCode}
                                            arrivalPortFull={f.arrAirportName}

                                            original={f.originalPrice}
                                            saving={f.discount}
                                            price={f.finalPrice}

                                            adults={adults}
                                            children={children}
                                            infants={infant}
                                            
                                            depart={f.departureDate.year + "-" + f.departureDate.month + "-" + f.departureDate.day}
                                            ret={f.arrivalDate.year + "-" + f.arrivalDate.month + "-" + f.arrivalDate.day}
                                        />
                                    ))
                                ))
                            )


                        )

                        }
                    </div>
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









// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';

// import Navbar from "../../components/navbar/navbar";
// import Notification from '../../components/notifications/notifications';
// import QuotePopup from '../../components/quotePopup/quotePopup';
// import Footer from "../../components/footer/footer";
// import FilterSidebar from '../../components/filtersidebar/FilterSidebar';
// import FlightCard from '../../components/TicketCard/TicketCard';
// import FilterSidebarModal from '../../components/filtersidebar/FilterSidebarModal';
// import SearchForm from '../../components/filter/filter';

// import './searchResults.scss';

// export default function SearchResultsPage() {
//     const [notification, setNotification] = useState(null);
//     const [showPopup, setShowPopup] = useState(false);
//     const [popupVisible, setPopupVisible] = useState(false);
//     const [showFilterModal, setShowFilterModal] = useState(false);
//     const [showSearchPopup, setShowSearchPopup] = useState(false);
//     const [searchParams] = useSearchParams();
//     const [flights, setFlights] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // NEW: Filter state
//     const [minPrice, setMinPrice] = useState(0);
//     const [maxPrice, setMaxPrice] = useState(10000);
//     const [selectedAirlines, setSelectedAirlines] = useState([]);

//     const departRaw = searchParams.get('depart');
//     const retRaw = searchParams.get('ret');
//     const adults = searchParams.get('adults');
//     const children = searchParams.get('children');
//     const infant = searchParams.get('infant');

//     const openPopup = () => {
//         setNotification(null);
//         setShowPopup(true);
//         setTimeout(() => setPopupVisible(true), 10);
//     };

//     const closePopup = () => {
//         setPopupVisible(false);
//         setTimeout(() => setShowPopup(false), 300);
//     };

//     const handleSearchSubmit = (data) => {
//         console.log('Search submitted:', data);
//     };

//     const formatDate = (iso) => {
//         if (!iso) return '';
//         const [year, month, day] = iso.split('-');
//         return `${day}-${month}-${year}`;
//     };

//     const handleSubmit = () => {
//         setNotification({ type: 'success', message: 'Message sent successfully!' });
//         closePopup();
//     };

//     useEffect(() => {
//         const params = {};
//         const tripType = searchParams.get('tripType');
//         if (tripType) params.type = tripType;
//         const date = searchParams.get('date');
//         if (date) params.date = date;
//         if (minPrice) params.minPrice = minPrice;
//         if (maxPrice) params.maxPrice = maxPrice;
//         const page = searchParams.get('page');
//         if (page) params.page = parseInt(page, 10);
//         const from_id = searchParams.get('from_id');
//         if (from_id) params.from_id = from_id;
//         const to_id = searchParams.get('to_id');
//         if (to_id) params.to_id = to_id;
//         const from = searchParams.get('from');
//         if (from) params.from = from;
//         const to = searchParams.get('to');
//         if (to) params.to = to;
//         const airlines = searchParams.get('airlines');
//         if (airlines) params.airlines = airlines;

//         setLoading(true);
//         setError(null);

//         let apiUrl = '/api/flight/filter';
//         const queryParams = new URLSearchParams(params).toString();
//         if (queryParams) apiUrl += `?${queryParams}`;

//         axios.get(apiUrl)
//             .then(response => {
//                 setFlights(response.data.results || []);
//             })
//             .catch(error => {
//                 console.error('Error fetching flights:', error);
//                 setError(error.message || 'Failed to fetch flights');
//             })
//             .finally(() => setLoading(false));
//     }, [searchParams, minPrice, maxPrice, selectedAirlines]);

//     return (
//         <>
//             <Navbar />
//             <div className="results-page">
//                 <aside className="filter-sidebar">
//                     <FilterSidebar
//                         minPrice={minPrice}
//                         setMinPrice={setMinPrice}
//                         maxPrice={maxPrice}
//                         setMaxPrice={setMaxPrice}
//                         selectedAirlines={selectedAirlines}
//                         setSelectedAirlines={setSelectedAirlines}
//                     />
//                 </aside>

//                 <main className="results-main">
//                     <div className="desktop-search-form">
//                         <SearchForm inline onSubmit={handleSearchSubmit} />
//                     </div>

//                     <div className='res-btns-cont'>
//                         <button
//                             className="mobile-filter-btn"
//                             onClick={() => setShowFilterModal(true)}
//                         >
//                             <img src='../icons/filter.svg' alt='' />
//                             <p>Filter</p>
//                         </button>
//                         <div
//                             className="mobile-search-btn"
//                             onClick={() => setShowSearchPopup(true)}
//                         >
//                             <span className="btn-text">Search Flights</span>
//                             <img className="btn-icon" src="../icons/search.svg" alt="search" />
//                         </div>
//                     </div>

//                     <div className="tickets-list">
//                         {loading ? (
//                             [...Array(3)].map((_, idx) => (
//                                 <FlightCard key={idx} loading={true} />
//                             ))
//                         ) : flights.length === 0 ? (
//                             <>
//                                 <h2>No flights found.</h2>
//                                 <button className="quote-btn" onClick={openPopup}>
//                                     Get in Touch
//                                 </button>
//                             </>
//                         ) : (
//                             flights.map((f) => (
//                                 <FlightCard
//                                     key={f.flightId}
//                                     id={f.flightId}
//                                     recommended={f.recommended}
//                                     type={searchParams.get('type') || 'round-trip'}
//                                     airlineLogo={f.airlineMono}
//                                     airlineName={f.airlineName}
//                                     deptPort={f.depAirportCode}
//                                     deptTime={formatDate(departRaw)}
//                                     deptPortFull={f.depAirportName}
//                                     dateD={f.date.day}
//                                     dateM={f.date.month}
//                                     dateY={f.date.year}
//                                     flightTime={f.flightTime}
//                                     arrivalPort={f.arrAirportCode}
//                                     arrivalTime={formatDate(retRaw)}
//                                     arrivalPortFull={f.arrAirportName}
//                                     original={f.originalPrice}
//                                     saving={f.discount}
//                                     price={f.finalPrice}
//                                     adults={adults}
//                                     children={children}
//                                     infants={infant}
//                                     depart={departRaw}
//                                     ret={retRaw}
//                                 />
//                             ))
//                         )}
//                     </div>
//                 </main>
//             </div>
//             <Footer />

//             {showFilterModal && (
//                 <FilterSidebarModal
//                     onClose={() => setShowFilterModal(false)}
//                     minPrice={minPrice}
//                     setMinPrice={setMinPrice}
//                     maxPrice={maxPrice}
//                     setMaxPrice={setMaxPrice}
//                     selectedAirlines={selectedAirlines}
//                     setSelectedAirlines={setSelectedAirlines}
//                 />
//             )}

//             {showSearchPopup && (
//                 <SearchForm
//                     visible={showSearchPopup}
//                     onClose={() => setShowSearchPopup(false)}
//                     onSubmit={handleSearchSubmit}
//                 />
//             )}

//             {notification && (
//                 <Notification type={notification.type} message={notification.message} />
//             )}
//             {showPopup && (
//                 <QuotePopup
//                     visible={popupVisible}
//                     onClose={closePopup}
//                     onSubmit={handleSubmit}
//                 />
//             )}
//         </>
//     );
// }
