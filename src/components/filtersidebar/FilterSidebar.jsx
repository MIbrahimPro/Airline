import React, { useState, useEffect } from 'react';
import './FilterSidebar.scss';
import axios from 'axios';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import { useSearchParams, useNavigate } from 'react-router-dom';







export default function FilterSidebar() {


    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const priceMinBound = 1;
    const priceMaxBound = 100000;
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [minEnabled, setMinEnabled] = useState(false);
    const [maxEnabled, setMaxEnabled] = useState(false);

    const [airlines, setAirline] = useState([]);
    const [selectedAirlines, setSelectedAirlines] = useState([]);

    const [shouldUpdateURL, setShouldUpdateURL] = useState(false);

    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();






    useEffect(() => {
        startLoading();
        axios
            .get('/api/airline/')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setAirline(response.data);
                } else {
                    setGlobalError('Invalid airline data received.');
                }
            })
            .catch((err) => {
                setGlobalError(
                    err.response?.data?.message || err.message || 'Error fetching airlines.'
                );
            })
            .finally(() => {
                endLoading();
            });
    }, []);


    useEffect(() => {
        if (shouldUpdateURL) {
            const urlParams = new URLSearchParams(window.location.search);

            if (minPrice !== null) {
                urlParams.set('minPrice', minPrice.toString());
            }
            if (maxPrice !== null) {
                urlParams.set('maxPrice', maxPrice.toString());
            }
            urlParams.delete('airlines_id');
            selectedAirlines.forEach(airlineId => {
                urlParams.append('airlines_id', airlineId);
            });

            const currentURL = new URL(window.location.href);
            const newURL = `${currentURL.pathname}?${urlParams.toString()}`;

            navigate(newURL);

            setShouldUpdateURL(false);
        }
    }, [minPrice, maxPrice, selectedAirlines, shouldUpdateURL, navigate]);


    useEffect(() => {
        const minPriceParam = searchParams.get('minPrice');
        const maxPriceParam = searchParams.get('maxPrice');
        const airlinesIdParams = searchParams.getAll('airlines_id');

        setMinPrice(minPriceParam ? parseInt(minPriceParam, 10) : null);
        setMaxPrice(maxPriceParam ? parseInt(maxPriceParam, 10) : null);
        setSelectedAirlines(airlinesIdParams);
    }, [searchParams]);






    const toggleAirline = (airline) => {

        setSelectedAirlines((prev) =>
            prev.includes(airline)
                ? prev.filter((v) => v !== airline)
                : [...prev, airline]
        );

        setShouldUpdateURL(true);

    };


    const handleMinPriceChange = (e) => {
        let value = e.target.value === '' ? null : Number(e.target.value);
        setMinPrice(value);
    };


    const handleMaxPriceChange = (e) => {
        let value = e.target.value === '' ? null : Number(e.target.value);
        setMaxPrice(value);
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.target.blur();
        }
    };


    const handleBlur = () => {

        if (minPrice !== null) {
            if (minPrice < priceMinBound) {
                setMinPrice(priceMinBound);
            } else if (minPrice > priceMaxBound) {
                setMinPrice(priceMaxBound);
            }
        }
        if (maxPrice !== null) {
            if (maxPrice < priceMinBound) {
                setMaxPrice(priceMinBound);
            } else if (maxPrice > priceMaxBound) {
                setMaxPrice(priceMaxBound);
            }
        }
        if (maxPrice !== null && minPrice !== null) {
            if (maxPrice < minPrice) {
                setMinPrice(Math.max(maxPrice - 1, priceMinBound));
            }
        }

        setShouldUpdateURL(true);

    };


    const handleReset = () => {
        setMaxPrice(null);
        setMinPrice(null);
        setSelectedAirlines([]);
        setShouldUpdateURL(true);
    }









    return (
        <div className="filter-sidebar-inner">



            <div className="fs-header">
                <h3>Filter</h3>
                <button className="reset-btn" onClick={() => handleReset()}>Reset</button>
            </div>




            {/* Price Selector */}
            <div className="fs-group">
                <h4>Price <small>(in $)</small></h4>


                <div className="price-inputs">
                    <div className="price-field">
                        <label>
                            <input
                                type="checkbox"
                                checked={minEnabled}
                                onChange={(e) => setMinEnabled(e.target.checked ? true : false)}
                            />
                            Min Price
                        </label>
                        <input
                            type="number"
                            placeholder="Min price"
                            value={minPrice !== null ? minPrice : ''}
                            onChange={handleMinPriceChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            disabled={!minEnabled}
                        />
                    </div>
                    <div className="price-field">
                        <label>
                            <input
                                type="checkbox"
                                checked={maxEnabled}
                                onChange={(e) => setMaxEnabled(e.target.checked ? true : false)}
                            />
                            Max Price
                        </label>
                        <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice !== null ? maxPrice : ''}
                            onChange={handleMaxPriceChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            disabled={!maxEnabled}
                        />
                    </div>
                </div>


            </div>



            {/* Airlines */}
            <div className="fs-group">
                <h4>Airlines</h4>
                <div className="airlines-grid">
                    {airlines.map((a) => (
                        <div
                            key={a._id}
                            className={`airline-tile ${selectedAirlines.includes(a._id) ? 'selected' : ''}`}
                            onClick={() => toggleAirline(a._id)}
                        >
                            <img src={a.monogramPicture} alt={a.shortName} />
                        </div>
                    ))}
                </div>
            </div>



        </div>
    );
}