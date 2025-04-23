import React, { useState } from 'react';
import './filter.scss';
import { useNavigate } from 'react-router-dom';


export default function Filter({ visible, onClose, onSubmit }) {

    const navigate = useNavigate();


    const handleClick = () => {
        navigate(`/search`);
    };
    const [tab, setTab] = useState('standard');
    const [data, setData] = useState({
        tripType: 'return',
        from: '',
        to: '',
        depart: '',
        ret: '',
        adults: 1,
        children: 0,
        infant: 0,
        flexDepart: 0,
        flexReturn: 0,
        travelClass: 'economy',
        airline: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setData((d) => ({
            ...d,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <div className="sf-overlay" onClick={onClose}>
            <div
                className={`search-form${visible ? ' open' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                {/* HEADER */}
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
                    <div className="sf-close" onClick={onClose}>×</div>
                </div>

                {/* BODY (scrollable) */}
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
                                            value="return"
                                            checked={data.tripType === 'return'}
                                            onChange={handleChange}
                                        />
                                        <span className="custom-radio" />
                                        Round‑Trip
                                    </label>
                                    <label className="radio-button">
                                        <input
                                            type="radio"
                                            name="tripType"
                                            value="oneway"
                                            checked={data.tripType === 'oneway'}
                                            onChange={handleChange}
                                        />
                                        <span className="custom-radio" />
                                        One‑way
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Leaving From & Going To */}
                        <div className="row">
                            <div className="field half">
                                <label>Leaving From</label>
                                <input
                                    type="text"
                                    name="from"
                                    value={data.from}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="field half">
                                <label>Going To</label>
                                <input
                                    type="text"
                                    name="to"
                                    value={data.to}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 3: Departure & (optional) Return Date */}
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
                            {data.tripType === 'return' && (
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

                        {/* Row 4: Passengers (Adults, Children, Infants) */}
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
                                {/* Row 5: ± Days Departure & ± Days Return */}
                                <div className="row">
                                    <div className="field half advanced">
                                        <label>± Days Departure</label>
                                        <input
                                            type="number"
                                            name="flexDepart"
                                            min="0"
                                            value={data.flexDepart}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {data.tripType === 'return' && (
                                        <div className="field half advanced">
                                            <label>± Days Return</label>
                                            <input
                                                type="number"
                                                name="flexReturn"
                                                min="0"
                                                value={data.flexReturn}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Row 6: Class & Preferred Airline */}
                                <div className="row">
                                    <div className="field half advanced">
                                        <label>Class</label>
                                        <select
                                            name="travelClass"
                                            value={data.travelClass}
                                            onChange={handleChange}
                                        >
                                            {['economy', 'premium economy', 'business', 'first'].map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field half advanced">
                                        <label>Preferred Airline</label>
                                        <input
                                            type="text"
                                            name="airline"
                                            value={data.airline}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="sf-footer">
                        <button  onClick={handleClick} className="sf-submit">Search</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
