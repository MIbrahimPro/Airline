import Navbar from "../../components/navbar/adminnavbar";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import './booking-admin.scss';
import { useSearchParams, useNavigate } from 'react-router-dom';




const BookingTile = ({ booking, isExpanded, onExpand, onEdit, onDelete }) => {
    const { flight, customerName, userEmail, departureDate, returnDate, state } = booking;
    const { departureAirport, arrivalAirport, airline } = flight;

    return (
        <div className={`booking-tile ${isExpanded ? 'expanded' : ''}`}>
            <div className="booking-header">
                <div className="booking-info">
                    <img src={airline.monogramPicture} alt={airline.shortName} className="airline-monogram" />
                    <div className="flight-details">
                        <span>{departureAirport.name} ({departureAirport.code}) → {arrivalAirport.name} ({arrivalAirport.code})</span>
                        <span>{airline.shortName}</span>
                    </div>
                    <div className="customer-details">
                        <span>{customerName}</span>
                        <span>{userEmail}</span>
                        <span>{departureDate} - {returnDate}</span>
                    </div>
                    <span className={`state-pill ${state.toLowerCase()}`}>{state}</span>
                </div>
                <div className="booking-actions">
                    <button className="expand-btn" onClick={onExpand}>
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                    <button className="edit-btn" onClick={onEdit}>
                        <img src="../icons/edit.svg" alt="Edit" />
                    </button>
                    <button className="delete-btn" onClick={onDelete}>
                        <img src="../icons/delete.svg" alt="Delete" />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="booking-details">
                    <div className="detail-section">
                        <h4>Passenger Info</h4>
                        <p>Adults: {booking.peopleCount.adults}</p>
                        <p>Children: {booking.peopleCount.children}</p>
                        <p>Infants: {booking.peopleCount.infants}</p>
                    </div>
                    <div className="detail-section">
                        <h4>Contact Info</h4>
                        <p>Phone: {booking.contactPhone}</p>
                        <p>Preference: {booking.contactPreference}</p>
                    </div>
                    <div className="detail-section">
                        <h4>Booking Details</h4>
                        <p>Initial Price: ${booking.initialBookingPrice}</p>
                        <p>Final Price: ${booking.finalPrice}</p>
                        <p>Extra Details: {booking.extraDetails || 'None'}</p>
                        <p>Notes: {booking.notes || 'None'}</p>
                    </div>
                    <div className="detail-section">
                        <h4>Flight Duration</h4>
                        <p>Outbound: {flight.fromDuration.hours}h {flight.fromDuration.minutes}m</p>
                        <p>Return: {flight.toDuration.hours}h {flight.toDuration.minutes}m</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const DeleteConfirmationPopup = ({ booking, onConfirm, onCancel }) => {
    return (
        <div className="popup-overlay" onClick={onCancel}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete the booking for {booking.customerName}?</p>
                <div className="popup-actions">
                    <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                    <button className="confirm-btn" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};

const EditBookingPopup = ({ booking, onUpdate, onCancel }) => {
    const [formData, setFormData] = useState({
        departureDate: booking.departureDate,
        returnDate: booking.returnDate,
        peopleCount: { ...booking.peopleCount },
        state: booking.state,
        finalPrice: booking.finalPrice,
        notes: booking.notes,
        departureCode: booking.flight.departureAirport.code,
        arrivalCode: booking.flight.arrivalAirport.code,
        airlineShortName: booking.flight.airline.shortName
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('peopleCount.')) {
            const key = name.split('.')[1];
            setFormData({
                ...formData,
                peopleCount: { ...formData.peopleCount, [key]: parseInt(value) || 0 }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <div className="popup-overlay" onClick={onCancel}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <h3>Edit Booking</h3>
                <div className="edit-form">
                    <label>
                        Departure Date:
                        <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} />
                    </label>
                    <label>
                        Return Date:
                        <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} />
                    </label>
                    <label>
                        Adults:
                        <input type="number" name="peopleCount.adults" value={formData.peopleCount.adults} onChange={handleChange} min="0" />
                    </label>
                    <label>
                        Children:
                        <input type="number" name="peopleCount.children" value={formData.peopleCount.children} onChange={handleChange} min="0" />
                    </label>
                    <label>
                        Infants:
                        <input type="number" name="peopleCount.infants" value={formData.peopleCount.infants} onChange={handleChange} min="0" />
                    </label>
                    <label>
                        State:
                        <select name="state" value={formData.state} onChange={handleChange}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </label>
                    <label>
                        Final Price:
                        <input type="number" name="finalPrice" value={formData.finalPrice} onChange={handleChange} min="0" step="0.01" />
                    </label>
                    <label>
                        Notes:
                        <textarea name="notes" value={formData.notes} onChange={handleChange} />
                    </label>
                    <label>
                        Departure Airport Code:
                        <input type="text" name="departureCode" value={formData.departureCode} onChange={handleChange} />
                    </label>
                    <label>
                        Arrival Airport Code:
                        <input type="text" name="arrivalCode" value={formData.arrivalCode} onChange={handleChange} />
                    </label>
                    <label>
                        Airline Short Name:
                        <input type="text" name="airlineShortName" value={formData.airlineShortName} onChange={handleChange} />
                    </label>
                    <div className="popup-actions">
                        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                        <button className="submit-btn" onClick={handleSubmit}>Make Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <p className='active'>
                {currentPage} of {totalPages}
            </p>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

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

const Form = () => {


    const [searchParams] = useSearchParams(); // ADDED
    const [data, setData] = useState({
        from: '',
        to: '',
        from_id: '',
        to_id: '',
        airlines_id: [],
        state: '',

    });

    useEffect(() => {

        (async () => {
            const init = {};

            const airlineParams = searchParams.getAll('airline');
            if (airlineParams.length) init.airlines_id = airlineParams;

            const fromParam = searchParams.get('departureAirport');
            if (fromParam) {
                init.from_id = fromParam;
                const { data: apFrom } = await axios.get(`/api/airport/${fromParam}`);
                init.from =
                    `${apFrom.name}(${apFrom.code}), ` +
                    `${apFrom.location.name}, ` +
                    `${apFrom.location.country.name}, ` +
                    `${apFrom.location.country.region.name}`;
            }

            const toParam = searchParams.get('arrivalAirport');
            if (toParam) {
                init.to_id = toParam;
                const { data: apTo } = await axios.get(`/api/airport/${toParam}`);
                init.to =
                    `${apTo.name}(${apTo.code}), ` +
                    `${apTo.location.name}, ` +
                    `${apTo.location.country.name}, ` +
                    `${apTo.location.country.region.name}`;
            }

            const stateParam = searchParams.get('state');
            if (stateParam) init.state = stateParam;

            setData(prev => ({ ...prev, ...init }));
        })();


    }, [searchParams]);

    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        data.airlines_id.forEach(id => params.append('airline', id));
        if (data.from_id) params.set('departureAirport', data.from_id);
        if (data.to_id) params.set('arrivalAirport', data.to_id);
        if (data.state) params.set('state', data.state);
        navigate({ search: params.toString() });
    };

    return (
        <form className="sf-body booking-form-admin" onSubmit={handleSubmit}>

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

            <AirlineMultiSelect
                data={data}
                updateData={setData}
            />


            <div className='field half'>
                <label>State</label>
                <select
                    name="state" // Add this line
                    value={data.state}
                    onChange={handleChange}
                >
                    <option value="">Select State</option>
                    {['pending', 'cancelled', 'confirmed', 'in-progress'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div className="submit-btn">
                <button type="submit" className="sf-submit">Search</button>
            </div>



        </form>
    );
};


const BookingAdmin = () => {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedBookingId, setExpandedBookingId] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [bookingToEdit, setBookingToEdit] = useState(null);
    const [searchParams] = useSearchParams();

    const limit = 10;

    // useEffect(() => {
    //     fetchBookings(currentPage);
    // }, [currentPage, searchParams]);

    // const fetchBookings = async (page) => {
    //     setLoading(true);
    //     try {
    //         const token = getToken();
    //         const airlineParams = searchParams.getAll('airline');    // [] if none
    //         const departureAirport = searchParams.get('departureAirport') || '';
    //         const arrivalAirport = searchParams.get('arrivalAirport') || '';
    //         const state = searchParams.get('state') || '';

    //         const qs = new URLSearchParams();
    //         airlineParams.forEach(id => qs.append('airline', id));
    //         if (departureAirport) qs.set('departureAirport', departureAirport);
    //         if (arrivalAirport) qs.set('arrivalAirport', arrivalAirport);
    //         if (state) qs.set('state', state);
    //         qs.set('page', page);
    //         qs.set('limit', limit);



    //         const response = await axios.get(
    //             `/api/booking/filter?${qs.toString()}`,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         setBookings(response.data.results);
    //         setCurrentPage(response.data.currentPage);
    //         setTotalPages(response.data.totalPages);
    //         setLoading(false);
    //     } catch (err) {
    //         setError('Failed to fetch bookings');
    //         setLoading(false);
    //     }
    // };


    const fetchBookings = useCallback(async (page) => {
        setLoading(true);
        try {
            const token = getToken();
            const airlineParams = searchParams.getAll('airline');
            const departureAirport = searchParams.get('departureAirport') || '';
            const arrivalAirport = searchParams.get('arrivalAirport') || '';
            const state = searchParams.get('state') || '';

            const qs = new URLSearchParams();
            airlineParams.forEach(id => qs.append('airline', id));
            if (departureAirport) qs.set('departureAirport', departureAirport);
            if (arrivalAirport) qs.set('arrivalAirport', arrivalAirport);
            if (state) qs.set('state', state);
            qs.set('page', page);
            qs.set('limit', limit);

            const response = await axios.get(
                `/api/booking/filter?${qs.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBookings(response.data.results);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    }, [searchParams, limit]);

    useEffect(() => {
        fetchBookings(currentPage);
    }, [fetchBookings, currentPage]);



    const handleExpand = (bookingId) => {
        setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
    };

    const handleDelete = (booking) => {
        setBookingToDelete(booking);
    };

    const confirmDelete = async () => {
        try {
            const token = getToken();
            await axios.delete(`/api/booking/${bookingToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookings.filter(b => b._id !== bookingToDelete._id));
            setBookingToDelete(null);
        } catch (err) {
            setError('Failed to delete booking');
        }
    };

    const handleEdit = (booking) => {
        setBookingToEdit(booking);
    };

    const handleUpdate = async (updatedBooking) => {
        try {
            const token = getToken();
            await axios.put(
                `/api/booking/${bookingToEdit._id}`,
                updatedBooking,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchBookings(currentPage);
            setBookingToEdit(null);
        } catch (err) {
            setError('Failed to update booking');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <Navbar />
            <div className="booking-admin">
                <h2>Booking Management</h2>

                <Form />

                <div className="booking-list">
                    {bookings.map(booking => (
                        <BookingTile
                            key={booking._id}
                            booking={booking}
                            isExpanded={expandedBookingId === booking._id}
                            onExpand={() => handleExpand(booking._id)}
                            onEdit={() => handleEdit(booking)}
                            onDelete={() => handleDelete(booking)}
                        />
                    ))}
                </div>
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
                {bookingToDelete && (
                    <DeleteConfirmationPopup
                        booking={bookingToDelete}
                        onConfirm={confirmDelete}
                        onCancel={() => setBookingToDelete(null)}
                    />
                )}
                {bookingToEdit && (
                    <EditBookingPopup
                        booking={bookingToEdit}
                        onUpdate={handleUpdate}
                        onCancel={() => setBookingToEdit(null)}
                    />
                )}
            </div>
        </>
    );
};

export default BookingAdmin;



