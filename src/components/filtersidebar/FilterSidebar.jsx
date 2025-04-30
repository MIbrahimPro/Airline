import React, { useState, useEffect } from 'react';
import './FilterSidebar.scss';
import axios from 'axios';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';

 
// const airlines = [
// 	'aegean-airlines',
// 	'air-albania',
// 	'air-canada',
// 	'air-france',
// 	'air-india',
// 	'air-mauritius',
// 	'air-new-zealand',
// 	'air-serbia',
// 	'air-transat',
// 	'akasa-air',
// 	'asiana-airlines',
// 	'avianca',
// 	'azerbaijan-airlines',
// 	'british-airways',
// 	'brussels-airlines',
// 	'cathay-pacific',
// 	'copa-airlines',
// 	'eurowings',
// 	'garuda-indonesia',
// 	'kenya-airways',
// 	'klm',
// 	'lufthansa',
// 	'malaysia-airlines',
// 	'oman-air',
// 	'philippine-airlines',
// 	'qatar-airways',
// 	'riyadh-air',
// 	'ryanair',
// 	'singapore-airlines',
// 	'starlux-airlines',
// 	'swiss',
// 	'transavia',
// 	'turkish-airlines',
// 	'united-airlines',
// 	'vietnam-airlines',
// 	'virgin-atlantic',
// 	'westjet'
// ];

// export default function FilterSidebar() {

// 	const priceMinBound = 1;
// 	const priceMaxBound = 1000;
// 	const [priceMin, setPriceMin] = useState(100);
// 	const [priceMax, setPriceMax] = useState(800);
// 	const [airlines, setAirline] = useState([]);const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

// 	useEffect(() => {
// 		startLoading();
// 		axios
// 			.get('/api/airline/')
// 			.then((response) => {
// 				if (Array.isArray(response.data)) {
// 					setAirline(response.data);
// 				} else {
// 					setGlobalError('Invalid airline data received.');
// 				}
// 			})
// 			.catch((err) => {
// 				setGlobalError(
// 					err.response?.data?.message || err.message || 'Error fetching airlines.'
// 				);
// 			})
// 			.finally(() => {
// 				endLoading();
// 			});
// 	}, []);

// 	const [selectedAirlines, setSelectedAirlines] = useState([]);

// 	const toggleAirline = (airline) => {
// 		setSelectedAirlines((prev) =>
// 			prev.includes(airline)
// 				? prev.filter((v) => v !== airline)
// 				: [...prev, airline]
// 		);
// 	};

// 	const handleMinPriceChange = (e) => {
// 		const value = Number(e.target.value);
// 		if (value > priceMax) {
// 			setPriceMin(priceMax);
// 		} else {
// 			setPriceMin(value);
// 		}
// 	};

// 	const handleMaxPriceChange = (e) => {
// 		const value = Number(e.target.value);
// 		if (value < priceMin) {
// 			setPriceMax(priceMin);
// 		} else {
// 			setPriceMax(value);
// 		}
// 	};

// 	return (
// 		<div className="filter-sidebar-inner">



// 			<div className="fs-header">
// 				<h3>Filter</h3>
// 				<button className="reset-btn">Reset</button>
// 			</div>




// 			{/* Price Selector */}
// 			<div className="fs-group">
// 				<h4>Price <small>(in k PKR)</small></h4>

// 				<div className="range-container">
// 					<input
// 						type="range"
// 						min={priceMinBound}
// 						max={priceMaxBound}
// 						value={priceMin}
// 						onChange={handleMinPriceChange}
// 						className="range-input min-range"
// 					/>
// 					<input
// 						type="range"
// 						min={priceMinBound}
// 						max={priceMaxBound}
// 						value={priceMax}
// 						onChange={handleMaxPriceChange}
// 						className="range-input max-range"
// 					/>
// 					<div className="range-track">
// 						<div
// 							className="range-active"
// 							style={{
// 								left:
// 									((priceMin - priceMinBound) /
// 										(priceMaxBound - priceMinBound)) *
// 									100 +
// 									'%',
// 								right:
// 									(100 -
// 										((priceMax - priceMinBound) /
// 											(priceMaxBound - priceMinBound)) *
// 										100) +
// 									'%',
// 							}}
// 						></div>
// 					</div>
// 				</div>

// 				<div className="price-inputs">
// 					<input
// 						type="number"
// 						placeholder="Min price (k)"
// 						value={priceMin}
// 						onChange={handleMinPriceChange}
// 						min={priceMinBound}
// 						max={priceMaxBound}
// 					/>
// 					<input
// 						type="number"
// 						placeholder="Max price (k)"
// 						value={priceMax}
// 						onChange={handleMaxPriceChange}
// 						min={priceMinBound}
// 						max={priceMaxBound}
// 					/>
// 				</div>
// 			</div>



// 			{/* Airlines */}
// 			<div className="fs-group">
// 				<h4>Airlines</h4>
// 				<div className="airlines-grid">
// 					{airlines.map((a) => (
// 						<div
// 							key={a}
// 							className={`airline-tile ${selectedAirlines.includes(a) ? 'selected' : ''}`}
// 							onClick={() => toggleAirline(a)}
// 						>
// 							<img src={a.monogramPicture} alt={a.shortName} />
// 						</div>
// 					))}
// 				</div>
// 			</div>


			
// 		</div>
// 	);
// }




export default function FilterSidebar({ minPrice, setMinPrice, maxPrice, setMaxPrice, selectedAirlines, setSelectedAirlines }) {
    const priceMinBound = 1;
    const priceMaxBound = 1000;
    const [airlines, setAirlines] = useState([]);
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

    useEffect(() => {
        startLoading();
        axios
            .get('/api/airline/')
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setAirlines(response.data);
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

    const handleMinPriceChange = (e) => {
        const value = Number(e.target.value);
        if (value > (maxPrice || priceMaxBound)) {
            setMinPrice(maxPrice || priceMaxBound);
        } else {
            setMinPrice(value || null);
        }
    };

    const handleMaxPriceChange = (e) => {
        const value = Number(e.target.value);
        if (value < (minPrice || priceMinBound)) {
            setMaxPrice(minPrice || priceMinBound);
        } else {
            setMaxPrice(value || null);
        }
    };

    const toggleAirline = (airline) => {
        setSelectedAirlines((prev) =>
            prev.includes(airline)
                ? prev.filter((v) => v !== airline)
                : [...prev, airline]
        );
    };

    return (
        <div className="filter-sidebar-inner">
            <div className="fs-header">
                <h3>Filter</h3>
                <button className="reset-btn">Reset</button>
            </div>

            {/* Price Selector */}
            <div className="fs-group">
                <h4>Price <small>(in k PKR)</small></h4>
                <div className="range-container">
                    <input
                        type="range"
                        min={priceMinBound}
                        max={priceMaxBound}
                        value={minPrice || priceMinBound}
                        onChange={handleMinPriceChange}
                        className="range-input min-range"
                    />
                    <input
                        type="range"
                        min={priceMinBound}
                        max={priceMaxBound}
                        value={maxPrice || priceMaxBound}
                        onChange={handleMaxPriceChange}
                        className="range-input max-range"
                    />
                    <div className="range-track">
                        <div
                            className="range-active"
                            style={{
                                left: ((minPrice || priceMinBound) / priceMaxBound) * 100 + '%',
                                right: (1 - ((maxPrice || priceMaxBound) / priceMaxBound)) * 100 + '%',
                            }}
                        ></div>
                    </div>
                </div>
                <div className="price-inputs">
                    <input
                        type="number"
                        placeholder="Min price (k)"
                        value={minPrice || ''}
                        onChange={handleMinPriceChange}
                        min={priceMinBound}
                        max={priceMaxBound}
                    />
                    <input
                        type="number"
                        placeholder="Max price (k)"
                        value={maxPrice || ''}
                        onChange={handleMaxPriceChange}
                        min={priceMinBound}
                        max={priceMaxBound}
                    />
                </div>
            </div>

            {/* Airlines */}
            <div className="fs-group">
                <h4>Airlines</h4>
                <div className="airlines-grid">
                    {airlines.map((a) => (
                        <div
                            key={a.shortName}
                            className={`airline-tile ${selectedAirlines.includes(a.shortName) ? 'selected' : ''}`}
                            onClick={() => toggleAirline(a.shortName)}
                        >
                            <img src={a.monogramPicture} alt={a.shortName} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}