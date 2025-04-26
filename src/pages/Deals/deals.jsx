import React, {useState} from 'react';


import Navbar from "../../components/navbar/navbar";
import SearchForm from '../../components/filter/filter';
import Footer from "../../components/footer/footer";

import './deals.scss';



export default function DealsPage() {
    const [showSearchPopup, setShowSearchPopup] = useState(false);

    const handleSearchSubmit = (data) => {
        console.log('Search submitted:', data);
    };

    return (
        <>


            <Navbar selectedPage="deals" />



            <div className="deals-page">


                <div className="desktop-search-form">
                    <SearchForm inline onSubmit={handleSearchSubmit} />
                </div>

                <div
                    className="mobile-search-btn"
                    onClick={() => setShowSearchPopup(true)}
                >
                    <span className="btn-text">Search Flights</span>
                    <img className="btn-icon" src="../icons/search.svg" alt="search" />
                </div>



            </div>



            <Footer />



            {showSearchPopup && (
                <SearchForm
                    visible={showSearchPopup}
                    onClose={() => setShowSearchPopup(false)}
                    onSubmit={handleSearchSubmit}
                />
            )}

        </>
    );
}
