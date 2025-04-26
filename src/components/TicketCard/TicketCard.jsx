import React from 'react';
import PropTypes from 'prop-types';
import './TicketCard.scss';

function calculateArrival(deptTime, duration) {
    // deptTime e.g. "10:00 am", duration e.g. "1h 55m"
    const [time, modifier] = deptTime.split(' ');
    console.log(time);
    console.log(modifier);
    let [h, m] = time.split(':').map(Number);
    if (modifier.toLowerCase() === 'pm' && h !== 12) h += 12;
    if (modifier.toLowerCase() === 'am' && h === 12) h = 0;
    const durMatch = duration.match(/(\d+)h(?: (\d+)m)?/);
    const dh = parseInt(durMatch[1], 10);
    const dm = durMatch[2] ? parseInt(durMatch[2], 10) : 0;
    let total = h * 60 + m + dh * 60 + dm;
    total %= 24 * 60;
    let ah = Math.floor(total / 60);
    const am = total % 60;
    const aMod = ah >= 12 ? 'pm' : 'am';
    ah = ah % 12 || 12;
    const amStr = String(am).padStart(2, '0');
    return `${ah}:${amStr} ${aMod}`;
}

const FlightCard = ({
    recommended,
    airlineLogo,
    airlineName,
    deptTime,
    deptPort,
    deptPortFull,
    flightTime,
    stops,
    arrivalPort,
    arrivalPortFull,
    saving,
    price
}) => {
    const arrivalTime = calculateArrival(deptTime, flightTime);

    let stopsText, stopsClass;
    if (stops === 0) {
        stopsText = 'Non-Stop';
        stopsClass = 'stops--nonstop';
    } else if (stops === 1) {
        stopsText = '1 Stop';
        stopsClass = 'stops--one';
    } else {
        stopsText = `${stops} Stops`;
        stopsClass = 'stops--many';
    }

    return (
        <div className="flight-card">
            <div className='top-badges'>
                {recommended && <div className="badge recommended">Recommended</div>}
                {saving > 0 && <div className="badge saving">Save {saving} PKR</div>}
            </div>


            <div className="main">


                <div className='details'>


                    <div className="airline">
                        <img
                            src={`../airlines/icons/${airlineLogo}.svg`}
                            alt={`${airlineName} logo`}
                            className="airline-logo"
                        />
                        <span className="airline-name">{airlineName}</span>
                    </div>

                    <div className="info">

                        <div className="segment">
                            <div className="time">{deptTime}</div>
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
                            <div className={"stops " + stopsClass}>{stopsText}</div>
                        </div>

                        <div className='dashed-line'></div>

                        <div className="segment">
                            <div className="time">{arrivalTime}</div>
                            <div
                                className="port"
                                title={arrivalPortFull}
                            >
                                {arrivalPort}
                            </div>
                        </div>
                    </div>

                </div>


                <div className="booking">
                    <div className="deal">Your Deal</div>
                    <div className="price">Rs {price.toLocaleString()}</div>
                    <button className="book-btn">Book Now</button>
                </div>



            </div>
        </div>
    );
};

FlightCard.propTypes = {
    recommended: PropTypes.bool,
    airlineLogo: PropTypes.string.isRequired,
    airlineName: PropTypes.string.isRequired,
    deptTime: PropTypes.string.isRequired,
    deptPort: PropTypes.string.isRequired,
    deptPortFull: PropTypes.string.isRequired,
    flightTime: PropTypes.string.isRequired,
    stops: PropTypes.number.isRequired,
    arrivalPort: PropTypes.string.isRequired,
    arrivalPortFull: PropTypes.string.isRequired,
    saving: PropTypes.number,
    price: PropTypes.number.isRequired,
};

FlightCard.defaultProps = {
    recommended: false,
    saving: 0,
};

export default FlightCard;
