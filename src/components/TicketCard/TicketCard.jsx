import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TicketCard.scss';
import Notification from '../notifications/notifications';

const FlightCard = ({

    id,
    loading,
    recommended,
    type,

    airlineLogo,
    airlineName,

    deptPort,
    deptPortFull,

    flightTime,
    returnTime,

    arrivalPort,
    arrivalPortFull,

    original,
    saving,
    price,

    stops,

    depart,
    ret,

    adults: initAdults = 1,
    children: initChildren = 0,
    infants: initInfants = 0,
}) => {



    const [notification, setNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loadingsubmit, setloadingsubmit] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        contact: '',
        contactPref: 'call',
        adults: initAdults,
        children: initChildren,
        infants: initInfants,
        details: '',
    });

    const openModal = () => {
        setNotification(null)
        setForm(f => ({
            ...f,
            adults: initAdults || 1,
            children: initChildren || 0,
            infants: initInfants || 0,
        }));
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const handleChange = e => {
        const { name, value } = e.target;
        let v = value;
        if (['adults', 'children', 'infants'].includes(name)) {
            v = Math.max(name === 'adults' ? 1 : 0, Number(value));
        }
        setForm(f => ({ ...f, [name]: v }));
    };



    useEffect(() => {
        // Fetch the phone number when component mounts
        axios
            .get('/api/siteinfo/public/contact')
            .then((response) => {
                const number = response.data.contactPhone;
                if (number) {
                    setPhoneNumber(number);
                } else {
                    console.error('Phone number is undefined or empty.');
                }
            })
            .catch((err) => {
                console.log(err);
                alert('Failed to retrieve phone number.');
            });
    }, []);

    const handlecall = () => {
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setloadingsubmit(true)
        try {
            await axios.post('/api/booking', {
                flightId: id,
                customerName: form.name,
                userEmail: form.email,
                contactPhone: form.contact,
                contactPreference: form.contactPref,
                adults: form.adults,
                children: form.children,
                infants: form.infants,
                extraDetails: form.details,
                // departureDate: depart,
                // returnDate: type === 'round-trip' ? ret : undefined, 
                departureDate: `${depart}T00:00`,
                returnDate: type === 'round-trip' ? `${ret}T00:00` : undefined,
                initialBookingPrice: price,
            });
            setNotification({ type: 'success', message: 'Booking made successfully!' });
            closeModal();

            setloadingsubmit(false)
        } catch (err) {
            console.error(err);
            setloadingsubmit(false)
            setNotification({ type: 'error', message: 'Failed to make Booking. Please try again' });
        }
    };




    if (loading) {
        return (
            <div className="loading-card"></div>
        )
    }

    return (
        <>
            <div className="flight-card">

                <div className="top-badges">

                    {stops != null && (
                        <div className={`stops ${stops === 0 ? 'direct' : stops === 1 ? 'single-stop' : 'multi-stops'}`}>
                            {stops === 0 ? "direct flight" : `${stops} stop${stops > 1 ? 's' : ''}`}
                        </div>
                    )}

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
                        <div className="type">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                        {saving > 0 && <p className="original">£{(price + saving).toFixed(2)}</p>}
                        <div className="price">£{price.toFixed(2)}</div>
                        <button className="book-btn" onClick={openModal}>Book Now</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="booking-overlay" onClick={closeModal}>

                    <div className="booking-modal" onClick={e => e.stopPropagation()}>

                        <div className='md-header'>

                            <h2>Complete Your Booking</h2>
                            <div className="md-close" onClick={closeModal}>×</div>

                        </div>


                        <form onSubmit={handleSubmit}>



                            < div className='bd-fields' >
                                <label>Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} required />

                                <label>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} required />

                                <label>Contact Number</label>
                                <input type="tel" name="contact" value={form.contact} onChange={handleChange} required />

                                <label>Contact Preference</label>
                                <select name="contactPref" value={form.contactPref} onChange={handleChange}>
                                    <option value="call">Call</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="email">Email</option>
                                </select>



                                <div className="passenger-counts">
                                    <div>
                                        <label>Adults</label>
                                        <input type="number" name="adults" min="1" value={form.adults} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label>Children</label>
                                        <input type="number" name="children" min="0" value={form.children} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label>Infants</label>
                                        <input type="number" name="infants" min="0" value={form.infants} onChange={handleChange} />
                                    </div>
                                </div>


                                <label>Extra Details</label>
                                <textarea name="details" value={form.details} onChange={handleChange} rows="3" />

                            </div>

                            <div className='sc-btn'>
                                <button type="submit" className="submit-btn">
                                    {loadingsubmit ? (
                                        <>Submitting...</>
                                    ) : (
                                        <>Submit Booking</>
                                    )}
                                </button>

                                <button onClick={handlecall} type='button' className='submit-btn'>
                                    Call Now {phoneNumber && `(${phoneNumber})`}
                                </button>
                            </div>



                        </form>


                    </div>


                </div>
            )}
            {/* {notif && <div className="booking-notif">{notif}</div>} */}
            {notification && (
                <Notification type={notification.type} message={notification.message} />
            )}
        </>
    );
};

export default FlightCard;





