import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './filter.scss';








function AirlineMultiSelect({ data, updateData }) {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selected, setSelected] = useState([]);
    const wrapperRef = useRef(null);




    useEffect(() => {
        if (data.airlines_id.length === 0) {
            setSelected([]);
            return;
        }

        Promise.all(
            data.airlines_id.map(id =>
                axios.get(`/api/airline/${id}`)
                    .then(res => res.data)
                    .catch(() => null)
            )
        )
            .then(airlines => {
                setSelected(airlines.filter(a => a));
            });
    }, [data.airlines_id]);


    useEffect(() => {
        if (!showDropdown || !query) {
            setOptions([]);
            return;
        }
        const source = axios.CancelToken.source();
        axios.get('/api/airline/search', {
            params: { q: query },
            cancelToken: source.token,
        })
            .then(res => setOptions(res.data))
            .catch(err => {
                if (!axios.isCancel(err)) console.error(err);
            });
        return () => source.cancel();
    }, [query, showDropdown]);


    useEffect(() => {
        function onClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);





    const handleFocus = () => setShowDropdown(true);

    const handleSelect = (airline) => {

        if (!data.airlines_id.includes(airline._id)) {
            updateData(prev => ({
                ...prev,
                airlines_id: [...prev.airlines_id, airline._id]
            }));
            setSelected(s => [...s, airline]);
        }
        setQuery('');
        setShowDropdown(false);
    };

    const handleRemove = (_id) => {
        updateData(prev => ({
            ...prev,
            airlines_id: prev.airlines_id.filter(id => id !== _id)
        }));
        setSelected(s => s.filter(a => a._id !== _id));
    };





    return (
        <div className="field half advanced airline-select" ref={wrapperRef}>
            <label>Preferred Airlines</label>
            <input
                type="text"
                placeholder="Type to search…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={handleFocus}
                autoComplete="off"
            />

            {showDropdown && options.length > 0 && (
                <div className="airline-dropdown">
                    {options.map(a => (
                        <div
                            key={a._id}
                            className="airline-option"
                            onMouseDown={() => handleSelect(a)}
                        >
                            <img
                                src={a.monogramPicture || a.logoPicture}
                                alt={a.shortName}
                                className="option-icon"
                            />
                            <span className="option-text">{a.shortName}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="airline-pills">
                {selected.length === 0
                    ? <span className="any-airline">Any airline</span>
                    : selected.map(a => (
                        <span key={a._id} className="airline-pill">
                            <img
                                src={a.monogramPicture || a.logoPicture}
                                alt={a.shortName}
                                className="pill-icon"
                            />
                            {a.shortName}
                            <button
                                type="button"
                                className="pill-remove"
                                onClick={() => handleRemove(a._id)}
                            >×</button>
                        </span>
                    ))
                }
            </div>
        </div>
    );
}



function AirportInput({
    name,      // "from" or "to"
    value,     // data.from or data.to
    onChange,  // your handleChange
    updateData,   // setter for your data state
}) {
    const [options, setOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (!showDropdown || !value) {
            setOptions([]);
            return;
        }

        const source = axios.CancelToken.source();
        axios.get('/api/airport/search-advanced', {
            params: { q: value },
            cancelToken: source.token,
        })
            .then(res => setOptions(res.data))
            .catch(err => {
                if (!axios.isCancel(err)) console.error(err);
            });

        return () => source.cancel();
    }, [value, showDropdown]);

    // close when clicking outside
    useEffect(() => {
        const onClickOutside = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const handleFocus = () => {
        updateData(prev => ({ ...prev, [`${name}_id`]: null }));
        setShowDropdown(true);
    };

    const handleOptionClick = airport => {
        const display = `${airport.airportName}(${airport.airportCode}), ${airport.locationName}, ${airport.countryName}, ${airport.regionName}`;
        // fake event for your existing handler
        onChange({ target: { name, value: display, type: 'text' } });
        updateData(prev => ({ ...prev, [`${name}_id`]: airport.airportId }));
        setShowDropdown(false);
    };

    return (
        <div className="field half airport-input" ref={wrapperRef}>
            <label>{name === 'from' ? 'Leaving From' : 'Going To'}</label>
            <div className="input-icon-wrapper">
                <img
                    src={name === 'from'
                        ? "../icons/takeoff_b.svg"
                        : "../icons/landing_b.svg"
                    }
                    alt=""
                    className="input-icon"
                />
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    autoComplete="off"
                    required
                />
            </div>

            {showDropdown && options.length > 0 && (
                <div className="dropdwn">
                    {options.map(airport => {
                        const id = airport.airportId;
                        const display = `${airport.airportName}(${airport.airportCode}), ${airport.locationName}, ${airport.countryName}, ${airport.regionName}`;
                        return (
                            <div
                                key={id}
                                className="dropdwn-item"
                                onMouseDown={() => handleOptionClick(airport)}
                            >
                                {display}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}



function SearchFormContent({ inline, tab, setTab, data, setData, dateError, setDateError, handleChange, handleSubmit, handleSearch }) {

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDepart = tomorrow.toISOString().slice(0, 10);



    return (
        <div className={`sf-content ${inline ? 'inline' : ''}`}>


            <div className="sf-header">
                <div className="sf-tabs">
                    <button
                        className={tab === 'standard' ? 'active' : ''}
                        onClick={() => setTab('standard')}
                        type="button"
                    >
                        Standard
                    </button>
                    <button
                        className={tab === 'advanced' ? 'active' : ''}
                        onClick={() => setTab('advanced')}
                        type="button"
                    >
                        Advanced
                    </button>
                </div>

                {!inline && <div className="sf-close" onClick={handleSearch}>×</div>}
            </div>


            <form className="sf-body" onSubmit={handleSubmit}>


                <div className="sf-fields">




                    <div className="row">


                        <div className="field half">
                            <label>Trip‑Type</label>
                            <div className="radio-group">
                                <label className="radio-button">
                                    <input
                                        type="radio"
                                        name="tripType"
                                        value="round-trip"
                                        checked={data.tripType === 'round-trip'}
                                        onChange={handleChange}
                                    />
                                    <span className="custom-radio" />
                                    Round‑Trip
                                </label>
                                <label className="radio-button">
                                    <input
                                        type="radio"
                                        name="tripType"
                                        value="one-way"
                                        checked={data.tripType === 'one-way'}
                                        onChange={handleChange}
                                    />
                                    <span className="custom-radio" />
                                    One-way
                                </label>
                            </div>
                        </div>


                        {tab === 'advanced' && (

                            <div className="field half plane-toggle-field">
                                <label className="plane-switch">
                                    <input
                                        type="checkbox"
                                        name="directFlights"
                                        checked={data.directFlights}
                                        onChange={handleChange}
                                    />
                                    <div>
                                        <div>
                                            <svg viewBox="0 0 13 13">
                                                <path d="M1.55989957,5.41666667 L5.51582215,5.41666667 L4.47015462,0.108333333 L4.47015462,0.108333333 C4.47015462,0.0634601974 4.49708054,0.0249592654 4.5354546,0.00851337035 L4.57707145,0 L5.36229752,0 C5.43359776,0 5.50087375,0.028779451 5.55026392,0.0782711996 L5.59317877,0.134368264 L7.13659662,2.81558333 L8.29565964,2.81666667 C8.53185377,2.81666667 8.72332694,3.01067661 8.72332694,3.25 C8.72332694,3.48932339 8.53185377,3.68333333 8.29565964,3.68333333 L7.63589819,3.68225 L8.63450135,5.41666667 L11.9308317,5.41666667 C12.5213171,5.41666667 13,5.90169152 13,6.5 C13,7.09830848 12.5213171,7.58333333 11.9308317,7.58333333 L8.63450135,7.58333333 L7.63589819,9.31666667 L8.29565964,9.31666667 C8.53185377,9.31666667 8.72332694,9.51067661 8.72332694,9.75 C8.72332694,9.98932339 8.53185377,10.1833333 8.29565964,10.1833333 L7.13659662,10.1833333 L5.59317877,12.8656317 C5.55725264,12.9280353 5.49882018,12.9724157 5.43174295,12.9907056 L5.36229752,13 L4.57707145,13 L4.55610333,12.9978962 C4.51267695,12.9890959 4.48069792,12.9547924 4.47230803,12.9134397 L4.47223088,12.8704208 L5.51582215,7.58333333 L1.55989957,7.58333333 L0.891288881,8.55114605 C0.853775374,8.60544678 0.798421006,8.64327676 0.73629202,8.65879796 L0.672314689,8.66666667 L0.106844414,8.66666667 L0.0715243949,8.66058466 L0.0715243949,8.66058466 C0.0297243066,8.6457608 0.00275502199,8.60729104 0,8.5651586 L0.00593007386,8.52254537 L0.580855011,6.85813984 C0.64492547,6.67265611 0.6577034,6.47392717 0.619193545,6.28316421 L0.580694768,6.14191703 L0.00601851064,4.48064746 C0.00203480725,4.4691314 0,4.45701613 0,4.44481314 C0,4.39994001 0.0269259152,4.36143908 0.0652999725,4.34499318 L0.106916826,4.33647981 L0.672546853,4.33647981 C0.737865848,4.33647981 0.80011301,4.36066329 0.848265401,4.40322477 L0.89131128,4.45169723 L1.55989957,5.41666667 Z" fill="currentColor"></path>
                                            </svg>
                                        </div>
                                        <span className="street-middle"></span>
                                        <span className="cloud"></span>
                                        <span className="cloud two"></span>
                                    </div>
                                </label>
                                <span className="toggle-label">
                                    {data.directFlights
                                        ? 'Direct flights only'
                                        : 'All flights'}
                                </span>
                            </div>


                        )}





                    </div>


                    {/* Row 2: Leaving From & Going To */}
                    <div className="row">

                        <AirportInput
                            name="from"
                            value={data.from}
                            onChange={handleChange}
                            updateData={setData}
                        />
                        <AirportInput
                            name="to"
                            value={data.to}
                            onChange={handleChange}
                            updateData={setData}
                        />


                    </div>



                    {/* Row 3: Dates */}
                    <div className="row">
                        <div className="field half">
                            <label>Departure Date</label>
                            <input
                                type="date"
                                name="depart"
                                min={minDepart}
                                value={data.depart}
                                onChange={e => {
                                    if (data.ret && e.target.value >= data.ret) {
                                        setData(prev => ({ ...prev, ret: '' }));
                                    }
                                    handleChange(e);
                                }}
                                required
                            />
                            {dateError && (
                                <div className="error-message">
                                    {dateError}
                                </div>
                            )}
                        </div>
                        {data.tripType === 'round-trip' && (
                            <div className="field half">
                                <label>Return Date</label>
                                <input
                                    type="date"
                                    name="ret"
                                    min={data.depart}
                                    value={data.ret}
                                    onChange={handleChange}
                                    required={data.tripType === 'round-trip'}
                                />
                            </div>
                        )}




                    </div>



                    {/* Row 4: Passengers */}
                    <div className="row">
                        <div className="field third">
                            <label>Adults</label>
                            <input
                                type="number"
                                name="adults"
                                min="1"
                                value={data.adults}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="field third">
                            <label>Children (under 12)</label>
                            <input
                                type="number"
                                name="children"
                                min="0"
                                value={data.children}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="field third">
                            <label>Infants (under 2)</label>
                            <input
                                type="number"
                                name="infant"
                                min="0"
                                value={data.infant}
                                onChange={handleChange}
                            />
                        </div>
                    </div>



                    {/* Advanced fields */}
                    {tab === 'advanced' && (
                        <>


                            {/* Row 5: ± Days */}

                            {/* <div className="row">
                                <div className="field half advanced">
                                    <label>± Days Departure</label>
                                    <input
                                        type="number"
                                        name="flexDepart"
                                        placeholder='0-10'
                                        min="0"
                                        max="10"
                                        value={data.flexDepart}
                                        onChange={handleChange}
                                    />
                                </div>
                                {data.tripType === 'round-trip' && (
                                    <div className="field half advanced">
                                        <label>± Days Return</label>
                                        <input
                                            type="number"
                                            name="flexReturn"
                                            placeholder='0-10'
                                            min="0"
                                            max="10"
                                            value={data.flexReturn}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </div> */}


                            {/* Row 6: Class & Preferred Airline */}
                            <div className="row">

                                <AirlineMultiSelect
                                    data={data}
                                    updateData={setData}
                                />

                            </div>
                        </>
                    )}




                </div>

                <div className="sf-footer">
                    <button type="submit" className="sf-submit">Search</button>
                </div>


            </form>
        </div>
    );
}














export default function Filter({ visible, onClose, onSubmit, inline }) {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [dateError, setDateError] = useState('');

    const [tab, setTab] = useState('standard');
    const [data, setData] = useState({
        tripType: 'round-trip',
        directFlights: false,
        from: '',
        to: '',
        from_id: null,
        to_id: null,
        depart: '',
        ret: '',
        adults: 1,
        children: 0,
        infant: 0,
        flexDepart: 0,
        flexReturn: 0,
        airlines_id: []
    });

    const handleSubmit = e => {
        e.preventDefault();
        setDateError('');

        const depDate = new Date(data.depart);
        const today0 = new Date();
        today0.setHours(0, 0, 0, 0);

        // 1) depart must be ≥ tomorrow
        if (depDate <= today0) {
            setDateError('Departure must be tomorrow or later.');
            return;
        }

        // 2) if round-trip, return must be > depart
        if (data.tripType === 'round-trip') {
            const retDate = new Date(data.ret);
            if (!data.ret || retDate <= depDate) {
                setDateError('Return date must be after departure.');
                return;
            }
        }

        // all good → proceed
        // const newParams = new URLSearchParams(searchParams);

        // const ownKeys = Object.keys(data);
        // ownKeys.forEach(k => newParams.delete(k));

        // ownKeys.forEach(k => {
        //     const v = data[k];
        //     if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;

        //     if (Array.isArray(v)) {
        //         v.forEach(item => newParams.append(k, item));
        //     } else {
        //         newParams.set(k, String(v));
        //     }
        // });

        const newParams = new URLSearchParams(searchParams);
        const ownKeys = Object.keys(data);

        ownKeys.forEach(k => {
            newParams.delete(k);
            const v = data[k];
            if (v == null || v === '' || (Array.isArray(v) && v.length === 0) || (typeof v === 'boolean' && v === false)) return;

            if (Array.isArray(v)) {
                v.forEach(item => newParams.append(k, item));
            } else {
                newParams.set(k, String(v));
            }
        });


        navigate({ pathname: '/search', search: newParams.toString() });
    };




    const formProps = {
        inline,
        tab,
        setTab,
        data,
        setData,
        dateError,
        setDateError,
        handleChange: e => {
            const { name, value, type, checked } = e.target;
            setData(prev => ({
                ...prev,
                [name]: type === 'checkbox'
                    ? checked
                    : type === 'number'
                        ? Number(value)
                        : value,
            }));
        },
        handleSubmit,
        handleSearch: onClose,
    };





    useEffect(() => {
        setData(prev => {
            const next = { ...prev };
            ['tripType', 'from', 'from_id', 'to', 'to_id', 'depart', 'ret',
                'adults', 'children', 'infant', 'flexDepart', 'flexReturn', 'travelClass', 'directFlights']
                .forEach(key => {
                    if (searchParams.has(key)) {
                        const raw = searchParams.get(key);
                        // coerce numbers
                        if (['adults', 'children', 'infant', 'flexDepart', 'flexReturn']
                            .includes(key)) {
                            next[key] = Number(raw);

                        } else if (key === 'directFlights') {
                            next[key] = raw === 'true';
                        } else {
                            next[key] = raw;
                        }
                    }
                });

            // Array field
            const airlines = searchParams.getAll('airlines_id');
            next.airlines_id = airlines;
            return next;
        });
    }, [searchParams]);





    if (!inline) {
        return (
            <div className="sf-overlay" onClick={onClose}>
                <div
                    className={`search-form${visible ? ' open' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SearchFormContent {...formProps} />
                </div>
            </div>
        );
    } else {
        return (
            <>
                <SearchFormContent {...formProps} />
            </>
        );
    }
}

