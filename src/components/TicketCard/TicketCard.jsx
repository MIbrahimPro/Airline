import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './TicketCard.scss';


const FlightCard = ({

    loading,

    id,
    recommended,
    type,

    airlineLogo,
    airlineName,

    deptPort,
    deptTime,
    deptPortFull,

    dateD,
    dateM,
    dateY,

    flightTime,

    arrivalPort,
    arrivalTime,
    arrivalPortFull,

    orignal,
    saving,
    price,

    adults: initAdults = 1,
    children: initChildren = 0,
    infants: initInfants = 0,

}) => {

    const [showModal, setShowModal] = useState(false);
    const [notif, setNotif] = useState('');
    const [failed, setfailed] = useState(false);
    const [form, setForm] = useState({
        userEmail: '',
        contactPhone: '',
        contactPreference: 'call',
        adults: initAdults,
        children: initChildren,
        infants: initInfants,
        extraDetails: '',
    });



    useEffect(() => {
        if (notif) {
            const t = setTimeout(() => setNotif(''), 3000);
            return () => clearTimeout(t);
        }
    }, [notif]);




    const openModal = () => {
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
        const { name, value, type } = e.target;
        let v = value;
        if (['adults', 'children', 'infants'].includes(name)) {
            v = Math.max(name === 'adults' ? 1 : 0, Number(value));
        }
        setForm(f => ({ ...f, [name]: v }));
    };



    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('/api/booking', { flightId: id, ...form });
            setfailed(false);
            setNotif('Booking successfully made, we will contact you very soon');
            closeModal();
        } catch (err) {
            console.error(err);
            setfailed(true);
            setNotif('Failed to book, please try again');
        }
    };







    if (loading) {
        return (
            <div className={"loading-card"}>
            </div>
        )
    }

    return (

        <>
            <div className={"flight-card"}>
                <div className='top-badges'>
                    {recommended && <div className="badge recommended">Recommended</div>}
                    {saving > 0 && <div className="badge saving">Save ${saving.toFixed(2)}</div>}
                </div>


                <div className="main">





                    <div className='details'>


                        <div className="airline">
                            <img
                                src={`${airlineLogo}`}
                                alt={`${airlineName} logo`}
                                className="airline-logo"
                            />
                            <span className="airline-name">{airlineName}</span>
                        </div>


                        <div className='info-cont'>
                            <div className="info">

                                <div className="segment">
                                    <div
                                        className="port"
                                        title={deptPortFull}
                                    >
                                        {deptPort}
                                    </div>
                                </div>

                                <div className='dashed-line'></div>

                                <div className="middle">
                                    <div className="duration">{flightTime}</div>
                                    <div className="date">{dateD + "/" + dateM + "/" + dateY}</div>
                                </div>

                                <div className='dashed-line'></div>

                                <div className="segment">
                                    <div
                                        className="port"
                                        title={arrivalPortFull}
                                    >
                                        {arrivalPort}
                                    </div>
                                </div>
                            </div>
                            {type === "round-trip" ? (
                                <div className="info">

                                    <div className="segment">
                                        <div
                                            className="port"
                                            title={arrivalPortFull}
                                        >
                                            {arrivalPort}
                                        </div>
                                    </div>

                                    <div className='dashed-line'></div>

                                    <div className="middle">
                                        <div className="duration">{flightTime}</div>
                                        <div className="date">{dateD + "/" + dateM + "/" + dateY}</div>
                                    </div>

                                    <div className='dashed-line'></div>

                                    <div className="segment">
                                        <div
                                            className="port"
                                            title={deptPortFull}
                                        >
                                            {deptPort}
                                        </div>
                                    </div>
                                </div>
                            ) : null
                            }
                        </div>

                    </div>

                    <div className="booking">

                        <div className="type">{type}</div>
                        {saving > 0 &&
                            <p className='original'>${(price + saving).toFixed(2)}</p>
                        }
                        <div className="price">${price.toFixed(2)}</div>
                        <button className="book-btn" onClick={openModal}>Book Now</button>

                    </div>



                </div>







            </div>




            {showModal && (
                <div className="booking-overlay" onClick={closeModal}>
                    <div className="booking-modal" onClick={e => e.stopPropagation()}>

                        <button className="modal-close" onClick={closeModal}>×</button>
                        <h2>Complete Your Booking</h2>

                        <form onSubmit={handleSubmit}>



                            <label>Email</label>
                            <input type="email" name="userEmail" value={form.userEmail}
                                onChange={handleChange} required />


                            <label>Contact Number</label>
                            <input type="text" name="contactPhone" value={form.contactPhone}
                                onChange={handleChange} required />


                            <label>Contact Preference</label>
                            <select name="contactPreference" value={form.contactPreference}
                                onChange={handleChange}>
                                <option value="call">Call</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="email">Email</option>
                            </select>


                            {/* <div className="passenger-counts"> */}
                            {/* <div> */}
                            <label>Adults</label>
                            <input type="number" name="adults"
                                min="1" value={form.adults}
                                onChange={handleChange} required />
                            {/* </div> */}
                            {/* <div> */}
                            <label>Children</label>
                            <input type="number" name="children"
                                min="0" value={form.children}
                                onChange={handleChange} />
                            {/* </div> */}
                            {/* <div> */}
                            <label>Infants</label>
                            <input type="number" name="infants"
                                min="0" value={form.infants}
                                onChange={handleChange} />
                            {/* </div> */}
                            {/* </div> */}


                            <label>Extra Details</label>
                            <textarea name="extraDetails" value={form.extraDetails}
                                onChange={handleChange} rows="3" />



                            <button type="submit" className="submit-btn">
                                Submit Booking
                            </button>



                        </form>
                    </div>
                </div>
            )}
            {notif && <div className={`booking-notif ${failed ? "red" : "green"}`}>{notif}</div>}

        </>
    );
};


FlightCard.defaultProps = {
    recommended: false,
    saving: 0,
};

export default FlightCard;
