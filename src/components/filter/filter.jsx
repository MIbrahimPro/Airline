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



function SearchFormContent({ inline, tab, setTab, data, setData, handleChange, handleSubmit, handleSearch }) {



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


                    {/* Row 1: Trip Type */}
                    <div className="row">
                        <div className="field full">

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
                                value={data.depart}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {data.tripType === 'round-trip' && (
                            <div className="field half">
                                <label>Return Date</label>
                                <input
                                    type="date"
                                    name="ret"
                                    value={data.ret}
                                    onChange={handleChange}
                                    required
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
                            <label>Children (under 7)</label>
                            <input
                                type="number"
                                name="children"
                                min="0"
                                value={data.children}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="field third">
                            <label>Infants</label>
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
                            <div className="row">
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
                            </div>
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

    const [tab, setTab] = useState('standard');
    const [data, setData] = useState({
        tripType: 'round-trip',
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

        const newParams = new URLSearchParams(searchParams);

        const ownKeys = Object.keys(data);
        ownKeys.forEach(k => newParams.delete(k));

        ownKeys.forEach(k => {
            const v = data[k];
            if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;

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
        handleChange: e => {
            const { name, value, type } = e.target;
            setData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value,
            }));
        },
        handleSubmit,
        handleSearch: onClose,  // or whatever you have
    };





    useEffect(() => {
        setData(prev => {
            const next = { ...prev };
            ['tripType', 'from', 'from_id', 'to', 'to_id', 'depart', 'ret',
                'adults', 'children', 'infant', 'flexDepart', 'flexReturn', 'travelClass']
                .forEach(key => {
                    if (searchParams.has(key)) {
                        const raw = searchParams.get(key);
                        // coerce numbers
                        if (['adults', 'children', 'infant', 'flexDepart', 'flexReturn']
                            .includes(key)) {
                            next[key] = Number(raw);
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



// import { useState, useEffect,useRef } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './filter.scss';

// function AirlineMultiSelect({ data, updateData }) {
//     const [query, setQuery] = useState('');
//     const [options, setOptions] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [selected, setSelected] = useState([]);
//     const wrapperRef = useRef(null);

//     useEffect(() => {
//         if (!data.airlines_id || data.airlines_id.length === 0) {
//             setSelected([]);
//             return;
//         }
//         Promise.all(
//             data.airlines_id.map(id => axios.get(`/api/airline/${id}`)
//                 .then(res => res.data)
//                 .catch(() => null)
//             )
//         ).then(list => setSelected(list.filter(Boolean)));
//     }, [data.airlines_id]);

//     useEffect(() => {
//         if (!showDropdown || !query) {
//             setOptions([]);
//             return;
//         }
//         const source = axios.CancelToken.source();
//         axios.get('/api/airline/search', { params: { q: query }, cancelToken: source.token })
//             .then(res => setOptions(res.data))
//             .catch(err => { if (!axios.isCancel(err)) console.error(err); });
//         return () => source.cancel();
//     }, [query, showDropdown]);

//     useEffect(() => {
//         function handleOutside(e) {
//             if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//                 setShowDropdown(false);
//             }
//         }
//         document.addEventListener('mousedown', handleOutside);
//         return () => document.removeEventListener('mousedown', handleOutside);
//     }, []);

//     const selectAirline = airline => {
//         updateData(prev => ({
//             ...prev,
//             airlines_id: [...(prev.airlines_id || []), airline._id],
//             airlines: [...(prev.airlines || []), airline.shortName]
//         }));
//         setSelected(s => [...s, airline]);
//         setQuery('');
//         setShowDropdown(false);
//     };

//     const removeAirline = id => {
//         updateData(prev => ({
//             ...prev,
//             airlines_id: prev.airlines_id.filter(i => i !== id),
//             airlines: prev.airlines.filter(name => {
//                 const idx = prev.airlines_id.indexOf(id);
//                 return prev.airlines[prev.airlines_id.indexOf(id)] !== name;
//             })
//         }));
//         setSelected(s => s.filter(a => a._id !== id));
//     };

//     return (
//         <div className="field half advanced airline-select" ref={wrapperRef}>
//             <label>Preferred Airlines</label>
//             <input
//                 type="text"
//                 placeholder="Type to search…"
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//                 onFocus={() => setShowDropdown(true)}
//                 autoComplete="off"
//             />
//             {showDropdown && options.length > 0 && (
//                 <div className="airline-dropdown">
//                     {options.map(a => (
//                         <div key={a._id} className="airline-option" onMouseDown={() => selectAirline(a)}>
//                             <img src={a.monogramPicture || a.logoPicture} alt={a.shortName} className="option-icon" />
//                             <span className="option-text">{a.shortName}</span>
//                         </div>
//                     ))}
//                 </div>
//             )}
//             <div className="airline-pills">
//                 {(!selected || selected.length === 0)
//                     ? <span className="any-airline">Any airline</span>
//                     : selected.map(a => (
//                         <span key={a._id} className="airline-pill">
//                             <img src={a.monogramPicture || a.logoPicture} alt={a.shortName} className="pill-icon" />
//                             {a.shortName}
//                             <button type="button" className="pill-remove" onClick={() => removeAirline(a._id)}>×</button>
//                         </span>
//                     ))}
//             </div>
//         </div>
//     );
// }

// function AirportInput({ name, value, onChange, updateData }) {
//     const [options, setOptions] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const wrapperRef = useRef(null);

//     useEffect(() => {
//         if (!showDropdown || !value) { setOptions([]); return; }
//         const source = axios.CancelToken.source();
//         axios.get('/api/airport/search-advanced', { params: { q: value }, cancelToken: source.token })
//             .then(res => setOptions(res.data))
//             .catch(err => { if (!axios.isCancel(err)) console.error(err); });
//         return () => source.cancel();
//     }, [value, showDropdown]);

//     useEffect(() => {
//         const handleOutside = e => {
//             if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener('mousedown', handleOutside);
//         return () => document.removeEventListener('mousedown', handleOutside);
//     }, []);

//     const handleFocus = () => {
//         updateData(prev => ({ ...prev, [`${name}_id`]: null }));
//         setShowDropdown(true);
//     };

//     const choose = airport => {
//         const display = `${airport.airportName}(${airport.airportCode}), ${airport.locationName}, ${airport.countryName}, ${airport.regionName}`;
//         onChange({ target: { name, value: display, type: 'text' } });
//         updateData(prev => ({ ...prev, [`${name}_id`]: airport.airportId }));
//         setShowDropdown(false);
//     };

//     return (
//         <div className={`field half airport-input`} ref={wrapperRef}>
//             <label>{name === 'from' ? 'Leaving From' : 'Going To'}</label>
//             <div className="input-icon-wrapper">
//                 <img src={name === 'from' ? "../icons/takeoff_b.svg" : "../icons/landing_b.svg"} alt="" className="input-icon" />
//                 <input type="text" name={name} value={value} onChange={onChange} onFocus={handleFocus} autoComplete="off" />
//             </div>
//             {showDropdown && options.length > 0 && (
//                 <div className="dropdwn">
//                     {options.map(a => {
//                         const id = a.airportId;
//                         const display = `${a.airportName}(${a.airportCode}), ${a.locationName}, ${a.countryName}, ${a.regionName}`;
//                         return <div key={id} className="dropdwn-item" onMouseDown={() => choose(a)}>{display}</div>;
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// }

// function SearchFormContent({ inline, tab, setTab, data, setData, handleChange, handleSubmit, handleSearch }) {
//     return (
//         <div className={`sf-content ${inline ? 'inline' : ''}`}>...</div> // unchanged content omitted for brevity
//     );
// }

// export default function Filter({ visible, onClose, inline }) {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const [tab, setTab] = useState('standard');
//     const [data, setData] = useState({
//         tripType: 'round-trip',
//         from: null,
//         to: null,
//         from_id: null,
//         to_id: null,
//         depart: null,
//         ret: null,
//         adults: null,
//         children: null,
//         infant: null,
//         flexDepart: null,
//         flexReturn: null,
//         airlines_id: null,
//         airlines: null
//     });

//     useEffect(() => {
//         const next = { ...data };
//         ['tripType','from','from_id','to','to_id','depart','ret','adults','children','infant','flexDepart','flexReturn']
//             .forEach(key => {
//                 if (searchParams.has(key)) {
//                     const raw = searchParams.get(key);
//                     if (['adults','children','infant','flexDepart','flexReturn'].includes(key)) {
//                         next[key] = Number(raw);
//                     } else {
//                         next[key] = raw;
//                     }
//                 }
//             });
//         const ids = searchParams.getAll('airlines_id');
//         const names = searchParams.getAll('airlines');
//         if (ids.length) next.airlines_id = ids;
//         else next.airlines_id = null;
//         if (names.length) next.airlines = names;
//         else next.airlines = null;
//         setData(next);
//     }, [searchParams]);

//     const handleSubmit = e => {
//         e.preventDefault();
//         const params = new URLSearchParams();
//         Object.entries(data).forEach(([k,v]) => {
//             if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return;
//             if (Array.isArray(v)) v.forEach(item => params.append(k, item));
//             else params.set(k, String(v));
//         });
//         navigate({ pathname: '/search', search: params.toString() });
//     };

//     const formProps = { inline, tab, setTab, data, setData, handleChange: e => { const { name, value, type } = e.target; setData(prev => ({ ...prev, [name]: type==='number'?Number(value):value })); }, handleSubmit, handleSearch: onClose };

//     if (!inline) {
//         return (<div className="sf-overlay" onClick={onClose}><div className={`search-form${visible?' open':''}`} onClick={e=>e.stopPropagation()}><SearchFormContent {...formProps} /></div></div>);
//     }
//     return <SearchFormContent {...formProps} />;
// }
