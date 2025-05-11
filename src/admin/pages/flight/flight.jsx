import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from "../../utils/auth";

import Navbar from "../../components/navbar/adminnavbar"



import './flight.scss';


const Notification = ({ type, message }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return isVisible ? (
        <div className={`notification-admin ${type}`}>
            <p>{message}</p>
        </div>
    ) : null;
};



const FlightCard = ({
    id,
    loading = false,
    recommended,
    type,
    airlineId,
    airlineLogo,
    airlineName,
    depAirportId,
    deptPort,
    deptPortFull,
    flightTime,
    returnTime,
    arrAirportId,
    arrivalPort,
    arrivalPortFull,
    original,
    saving,
    price,
    depart,
    ret,
}) => {
    const [notification, setNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [hasBookings, setHasBookings] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const token = getToken();
    const navigate = useNavigate();

    useEffect(() => {

        console.log("booking check for ", id, "loading", loading);
        if (!loading && id !== undefined) {
            console.log("checking")
            console.log("booking check for ", id);
            const fetchHasBookings = async () => {
                try {
                    const response = await axios.get(`/api/flight/${id}/has-bookings`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.hasBookings) {
                        setHasBookings("booking");
                    } else {
                        setHasBookings("delete");
                    }
                } catch (err) {
                    console.error('Error fetching booking status:', err);
                    setHasBookings("");
                } finally {
                    console.log("done checking")
                }
            };
            fetchHasBookings();
        }
    }, [loading, id, token]);

    const openModal = async (type) => {
        setModalType(type);
        if (type === 'edit') {
            try {
                console.log(id);
                const response = await axios.get(`/api/flight/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const flight = response.data;
                setEditForm({
                    toDuration: flight.toDuration || { hours: 0, minutes: 0 },
                    fromDuration: flight.fromDuration || { hours: 0, minutes: 0 }, // Default if not round-trip
                    prices: flight.prices,
                });
            } catch (err) {
                console.error('Error fetching flight details:', err);
                setNotification({ type: 'error', message: 'Failed to load flight details.' });
                return;
            }
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
        setNotification(null);
    };

    const handleDurationChange = (e, durationType) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [durationType]: {
                ...prev[durationType],
                [name]: Number(value),
            },
        }));
    };

    const handlePriceChange = (index, field, value) => {
        setEditForm((prev) => {
            const newPrices = [...prev.prices];
            if (field.startsWith('discount.')) {
                const discountField = field.split('.')[1];
                newPrices[index].discount = {
                    ...newPrices[index].discount,
                    [discountField]: Number(value),
                };
            } else {
                newPrices[index][field] = Number(value);
            }
            return { ...prev, prices: newPrices };
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        try {
            const updates = {
                toDuration: editForm.toDuration,
                fromDuration: type === 'round-trip' ? editForm.fromDuration : undefined,
                prices: editForm.prices,
            };
            await axios.put(`/api/flight/${id}`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotification({ type: 'success', message: 'Flight updated successfully!' });
            closeModal();
        } catch (err) {
            console.error('Error updating flight:', err);
            setNotification({ type: 'error', message: 'Failed to update flight. Please try again.' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleDelete = async () => {
        setLoadingSubmit(true);
        try {
            await axios.delete(`/api/flight/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotification({ type: 'success', message: 'Flight deleted successfully!' });
            closeModal();
        } catch (err) {
            console.error('Error deleting flight:', err);
            setNotification({ type: 'error', message: 'Failed to delete flight. Please try again.' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loading) {
        return <div className="loading-card-admin"></div>;
    }

    return (
        <>
            <div className="flight-card-admin">
                <div className="top-badges">
                    {recommended && <div className="badge recommended">Recommended</div>}
                    {saving > 0 && <div className="badge saving">Save £{saving.toFixed(2)}</div>}
                </div>
                <div className="main">
                    <div className="details">
                        <div className="airline">
                            <img src={airlineLogo} alt={`${airlineName} logo`} className="airline-logo" />
                            <span className="airline-name">{airlineName}</span>
                        </div>
                        <div className="info-cont">
                            <div className="info">
                                <div className="segment">
                                    <div className="port" title={deptPortFull}>{deptPort}</div>
                                </div>
                                <div className="dashed-line" />
                                <div className="middle">
                                    <div className="duration">{flightTime}</div>
                                    <div className="date">{depart.split('-').reverse().join('/')}</div>
                                </div>
                                <div className="dashed-line" />
                                <div className="segment">
                                    <div className="port" title={arrivalPortFull}>{arrivalPort}</div>
                                </div>
                            </div>
                            {type === 'round-trip' && (
                                <div className="info">
                                    <div className="segment">
                                        <div className="port" title={arrivalPortFull}>{arrivalPort}</div>
                                    </div>
                                    <div className="dashed-line" />
                                    <div className="middle">
                                        <div className="duration">{returnTime}</div>
                                        <div className="date">{ret.split('-').reverse().join('/')}</div>
                                    </div>
                                    <div className="dashed-line" />
                                    <div className="segment">
                                        <div className="port" title={deptPortFull}>{deptPort}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="booking">

                        <div className="type">{type}</div>
                        {saving > 0 && <p className="original">£{(original).toFixed(2)}</p>}
                        <div className="price">£{price.toFixed(2)}</div>

                        <button className="book-btn" onClick={() => openModal('edit')}>EDIT</button>

                        {hasBookings === "delete" && (
                            <button className="book-btn" onClick={() => openModal('delete')}>DELETE</button>
                        )}

                        {hasBookings === "booking" && (
                            <button
                                className="book-btn"
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    if (airlineId) params.set('airline', airlineId);
                                    if (depAirportId) params.set('departureAirport', depAirportId);
                                    if (arrAirportId) params.set('arrivalAirport', arrAirportId);
                                    navigate(`/admin/bookings?${params.toString()}`);
                                }}
                            >
                                BOOKINGS
                            </button>
                        )}


                    </div>
                </div>
            </div>

            {showModal && (
                <div className="booking-overlay" onClick={closeModal}>
                    <div className="booking-modal-admin" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        {modalType === 'edit' && editForm && (
                            <>
                                <h2>Edit Flight</h2>
                                <div className="flight-info">
                                    <p><strong>Airline:</strong> {airlineName}</p>
                                    <p><strong>From:</strong> {deptPortFull}</p>
                                    <p><strong>To:</strong> {arrivalPortFull}</p>
                                    <p><strong>Departure Date:</strong> {depart.split('-').reverse().join('/')}</p>
                                    {type === 'round-trip' && (
                                        <p><strong>Return Date:</strong> {ret.split('-').reverse().join('/')}</p>
                                    )}
                                </div>
                                <div className="duration-inputs">
                                    <label>
                                        Flight Time Hours:
                                        <input
                                            type="number"
                                            name="hours"
                                            min="0"
                                            value={editForm.toDuration.hours}
                                            onChange={(e) => handleDurationChange(e, 'toDuration')}
                                        />
                                    </label>
                                    <label>
                                        Flight Time Minutes:
                                        <input
                                            type="number"
                                            name="minutes"
                                            min="0"
                                            max="59"
                                            value={editForm.toDuration.minutes}
                                            onChange={(e) => handleDurationChange(e, 'toDuration')}
                                        />
                                    </label>
                                    {type === 'round-trip' && (
                                        <>
                                            <label>
                                                Return Hours:
                                                <input
                                                    type="number"
                                                    name="hours"
                                                    min="0"
                                                    value={editForm.fromDuration.hours}
                                                    onChange={(e) => handleDurationChange(e, 'fromDuration')}
                                                />
                                            </label>
                                            <label>
                                                Return Minutes:
                                                <input
                                                    type="number"
                                                    name="minutes"
                                                    min="0"
                                                    max="59"
                                                    value={editForm.fromDuration.minutes}
                                                    onChange={(e) => handleDurationChange(e, 'fromDuration')}
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                                <table className="modal-table">
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>One-Way Price</th>
                                            <th>One-Way Discount</th>
                                            <th>Round-Trip Price</th>
                                            <th>Round-Trip Discount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {editForm.prices.map((priceEntry, index) => (
                                            <tr key={priceEntry.month}>
                                                <td>{priceEntry.month}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={priceEntry.oneWay}
                                                        onChange={(e) => handlePriceChange(index, 'oneWay', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={priceEntry.discount.oneWay || 0}
                                                        onChange={(e) => handlePriceChange(index, 'discount.oneWay', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={priceEntry.roundTrip}
                                                        onChange={(e) => handlePriceChange(index, 'roundTrip', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={priceEntry.discount.roundTrip || 0}
                                                        onChange={(e) => handlePriceChange(index, 'discount.roundTrip', e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    onClick={handleEditSubmit}
                                    className="submit-btn"
                                    disabled={loadingSubmit}
                                >
                                    {loadingSubmit ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        )}
                        {modalType === 'delete' && (
                            <>
                                <h2>Confirm Deletion</h2>
                                <p>Are you sure you want to delete this flight?</p>
                                <div className="modal-buttons">
                                    <button
                                        onClick={handleDelete}
                                        className="submit-btn"
                                        disabled={loadingSubmit}
                                    >
                                        {loadingSubmit ? 'Deleting...' : 'Yes, Delete'}
                                    </button>
                                    <button onClick={closeModal} className="cancel-btn">Cancel</button>
                                </div>
                            </>
                        )}
                        {notification && (
                            <div className={`notification ${notification.type}`}>
                                {notification.message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};


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
    required
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
                    required={required}
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

function SearchFormContent({ inline, data, setData, handleChange, handleSubmit, handleSearch }) {






    return (
        <div className={`sf-content ${inline ? 'inline' : ''}`}>


            <div className="sf-header">

                {!inline && <div className="sf-close" onClick={handleSearch}>×</div>}
            </div>


            <form className="sf-body" onSubmit={handleSubmit}>


                <div className="sf-fields">




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



                    <div className="row">

                        <AirlineMultiSelect
                            data={data}
                            updateData={setData}
                        />

                    </div>




                </div>

                <div className="sf-footer">
                    <button type="submit" className="sf-submit">Search</button>
                </div>


            </form>
        </div>
    );
}

function SearchForm({ visible, onClose, onSubmit, inline }) {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [dateError, setDateError] = useState('');

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
        setDateError('');

        const today0 = new Date();
        today0.setHours(0, 0, 0, 0);

        // all good → proceed
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


        navigate({ pathname: '/admin/flight', search: newParams.toString() });
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


            const airlines = searchParams.getAll('airlines_id');
            next.airlines_id = airlines;
            return next;
        });
    }, [searchParams]);





    if (!inline) {
        return (
            <div className="sf-overlay-admin" onClick={onClose}>
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


function AirlineSingleSelect({ data, updateData }) {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);



    useEffect(() => {
        if (!data.airlines_id) {
            setQuery({ shortName: '' });
            return;
        }

        axios.get(`/api/airline/${data.airlines_id}`)
            .then(res => {
                setQuery(res.data);
            })
            .catch(() => {
                setQuery({ shortName: '' });
            });
    }, [data.airlines_id]);


    useEffect(() => {
        if (!showDropdown || !query) {
            setOptions([]);
            return;
        }
        const source = axios.CancelToken.source();
        axios.get('/api/airline/search', {
            params: { q: query.shortName },
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

        updateData(prev => ({
            ...prev,
            airlines_id: airline._id
        }));
        setQuery(airline);
        setShowDropdown(false);
    };



    const handleChange = (e) => {
        setQuery({ shortName: e.target.value })
        updateData(prev => ({
            ...prev,
            airlines_id: ''
        }));
    }




    return (
        <div className="field half airline-select" ref={wrapperRef}>
            <label>Preferred Airlines</label>

            <div className='input-icon-wrapper'>
                {query.monogramPicture && (
                    <img
                        src={query.monogramPicture}
                        alt={query.shortName}
                        className="input-icon"
                    />
                )

                }

                <input
                    type="text"
                    placeholder="Type to search…"
                    value={query.shortName}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    autoComplete="off"
                />
            </div>
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
        </div>
    );
}



function AddFormContent({ data, setData, handleChange, handleSubmit, handleSearch }) {


    return (
        <div className={`sf-content`}>


            <div className="sf-header">

                <div className="sf-close" onClick={handleSearch}>x</div>
            </div>


            <form className="sf-body" onSubmit={handleSubmit}>


                <div className="sf-fields">

                    {/* Row 2: Leaving From & Going To */}
                    <div className="row">

                        <AirportInput
                            name="from"
                            value={data.from}
                            onChange={handleChange}
                            updateData={setData}
                            required
                        />
                        <AirportInput
                            name="to"
                            value={data.to}
                            onChange={handleChange}
                            updateData={setData}
                            required
                        />


                    </div>




                    <div className="row">

                        <AirlineSingleSelect
                            data={data}
                            updateData={setData}
                        />

                    </div>


                </div>



                <div className="sf-footer">
                    <button type="submit" className="sf-submit">Add Flight</button>
                </div>



            </form>

        </div>
    );
}

function AddFlights({ visible, onClose, onSubmit }) {
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();

    const [data, setData] = useState({
        from: '',
        to: '',
        from_id: null,
        to_id: null,
        airlines_id: null
    });

    const handleSubmit = async e => {
        e.preventDefault();


        if (!data.from_id || !data.to_id || !data.airlines_id) {
            setNotification({
                type: 'error',
                message: 'Please select departure, arrival, and an airline before submitting.'
            });
            return;
        }

        try {
            await axios.post('/api/flight/search-or-create', {
                departureAirport: data.from_id,
                arrivalAirport: data.to_id,
                airline_id: data.airlines_id
            });

            setNotification({
                type: 'success',
                message: 'Flight added successfully'
            });

            onClose();

            navigate(
                `/admin/flight/` +
                `?from_id=${data.from_id}` +
                `&to_id=${data.to_id}` +
                `&airlines_id=${data.airlines_id}`
            );
        } catch (err) {
            setNotification({
                type: 'error',
                message: 'Failed to add Flight. Please try again.'
            });
        }

    };




    const formProps = {
        data,
        setData,
        handleChange: e => {
            const { name, value } = e.target;
            setData(prev => ({
                ...prev,
                [name]: value,
            }));
        },
        handleSubmit,
        handleSearch: onClose,  // or whatever you have
    };


    return (
        <>
            <div className="sf-overlay-admin" onClick={onClose}>
                <div
                    className={`search-form${visible ? ' open' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <AddFormContent {...formProps} />
                </div>
            </div>
            {notification && (
                <Notification type={notification.type} message={notification.message} />
            )}
        </>
    );
}

function SearchResultsPage() {


    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [ShowAddPopup, setShowAddPopup] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');
    const infant = searchParams.get('infant');
    const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage
    const [totalPages, setTotalPages] = useState(0);     // Initialize totalPages




    const handleSearchSubmit = (data) => {
        console.log('Search submitted:', data);
    };


    const handleAddSubmit = (data) => {
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



    useEffect(() => {


        setLoading(true);
        setError(null);

        const params = {};

        params.page = currentPage;


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

        console.log(params);


        let apiUrl = '/api/flight/filter';
        const queryParams = new URLSearchParams(params).toString();
        if (queryParams) {
            apiUrl += `?${queryParams}`;
        }

        axios.get(apiUrl)
            .then(response => {
                setFlights(response.data.results || []);
                setTotalPages(response.data.totalPages || 0);
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
            <div className="results-page-admin">

                <main className="results-main">

                    <div className="desktop-search-form">
                        <SearchForm inline onSubmit={handleSearchSubmit} />
                    </div>

                    <div
                        className="add-btn"
                        onClick={() => setShowAddPopup(true)}
                    >
                        <span className="btn-text">Add Flights</span>
                        <img className="btn-icon" src="../icons/plus_w.svg" alt="search" />
                    </div>


                    <div className='res-btns-cont'>
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
                                </div>
                            ) : (

                                flights.map(f => (
                                    <FlightCard

                                        key={f.flightId}
                                        id={f.flightId}
                                        recommended={f.recommended}
                                        type={searchParams.get('tripType') || 'round-trip'}

                                        airlineId={f.airlineId}
                                        airlineLogo={f.airlineMono}
                                        airlineName={f.airlineName}

                                        depAirportId={f.depAirportId}
                                        deptPort={f.depAirportCode}
                                        deptPortFull={f.depAirportName}

                                        flightTime={f.fromDuration}
                                        returnTime={f.toDuration || "0"}

                                        arrAirportId={f.arrAirportId}
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



            {showSearchPopup && (
                <SearchForm
                    visible={showSearchPopup}
                    onClose={() => setShowSearchPopup(false)}
                    onSubmit={handleSearchSubmit}
                />
            )}

            {ShowAddPopup && (
                <AddFlights
                    visible={ShowAddPopup}
                    onClose={() => setShowAddPopup(false)}
                    onSubmit={handleAddSubmit}
                />
            )}
        </>
    );



}



export default SearchResultsPage;



