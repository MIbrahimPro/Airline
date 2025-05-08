// QuotePopup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './quotePopup.scss';

export default function QuotePopup({ visible, onClose, onSubmit }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [airlines, setAirlines] = useState([]);
    const [data, setData] = useState({
        customerName: '',
        email: '',
        contactPhone: '',
        tripType: 'one-way',
        from: '',
        to: '',
        preferredAirline: '',
        departureDate: '',
        arrivalDate: '',
        passengerCount: { adults: 1, children: 0, infants: 0 },
        extraDetails: ''
    });

    useEffect(() => {
        axios.get('/api/airline/')
            .then(res => setAirlines(res.data))
            .catch(() => setAirlines([]));
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        if (['adults', 'children', 'infants'].includes(name)) {
            setData(prev => ({
                ...prev,
                passengerCount: { ...prev.passengerCount, [name]: Number(value) }
            }));
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/quote/', data);
            setSuccessMessage('Quote request submitted successfully!');
            onSubmit(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="qp-overlay" onClick={onClose}>

            <div className={`quote-popup ${visible ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
                
                
                <div className="qp-header">
                    <h2>Get a Quote</h2>
                    <div className="qp-close" onClick={onClose}>×</div>
                </div>
                
                
                <form className="qp-body" onSubmit={handleSubmit}>
                    
                    <div className="qp-fields">
                        
                        <div className="qp-field">
                            <label>Name</label>
                            <input name="customerName" value={data.customerName} onChange={handleChange} required />
                        </div>
                        
                        <div className="qp-field">
                            <label>Email</label>
                            <input type="email" name="email" value={data.email} onChange={handleChange} required />
                        </div>
                        
                        <div className="qp-field">
                            <label>Phone (Optional)</label>
                            <input name="contactPhone" value={data.contactPhone} onChange={handleChange} />
                        </div>

                        <div className="qp-field">
                            <label>Trip Type</label>
                            <select name="tripType" value={data.tripType} onChange={handleChange} required>
                                <option value="one-way">One-way</option>
                                <option value="round-trip">Round-trip</option>
                            </select>
                        </div>
                        
                        <div className="qp-field">
                            <label>From</label>
                            <input name="from" value={data.from} onChange={handleChange} required />
                        </div>
                        
                        <div className="qp-field">
                            <label>To</label>
                            <input name="to" value={data.to} onChange={handleChange} required />
                        </div>
                        
                        <div className="qp-field">
                            <label>Preferred Airline</label>
                            <select name="preferredAirline" value={data.preferredAirline} onChange={handleChange}>
                                <option value="">Any</option>
                                {airlines.map(a => (
                                    <option key={a._id} value={a._id}>
                                        {a.monogramPicture ? (<img src={a.monogramPicture} alt={a.shortName} />) : a.shortName}
                                        {` ${a.shortName}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="qp-field">
                            <label>Departure Date</label>
                            <input type="date" name="departureDate" value={data.departureDate} onChange={handleChange} required />
                        </div>
                        
                        {data.tripType === 'round-trip' && (
                            <div className="qp-field">
                                <label>Return Date</label>
                                <input type="date" name="arrivalDate" value={data.arrivalDate} onChange={handleChange} required />
                            </div>
                        )}
                        
                        <div className="qp-passengers">
                            <div className="qp-field">
                                <label>Adults</label>
                                <input type="number" name="adults" min="1" value={data.passengerCount.adults} onChange={handleChange} required />
                            </div>
                            <div className="qp-field">
                                <label>Children</label>
                                <input type="number" name="children" min="0" value={data.passengerCount.children} onChange={handleChange} />
                            </div>
                            <div className="qp-field">
                                <label>Infants</label>
                                <input type="number" name="infants" min="0" value={data.passengerCount.infants} onChange={handleChange} />
                            </div>
                        </div>
                        
                        <div className="qp-field">
                            <label>Additional Details</label>
                            <textarea name="extraDetails" rows="4" value={data.extraDetails} onChange={handleChange}></textarea>
                        </div>
                    
                    </div>
                    
                    
                    <div className="qp-footer">
                    
                        {error && <div className="qp-error">{error}</div>}
                        {successMessage && <div className="qp-success">{successMessage}</div>}
                        <button type="submit" className="qp-submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Request Quote'}
                        </button>
                    
                    </div>
                </form>
            </div>

        </div>
    );
}