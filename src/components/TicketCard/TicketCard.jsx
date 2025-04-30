import React from 'react';
import './TicketCard.scss';
 

const FlightCard = ({
    recommended,
    airlineLogo,
    airlineName,
    deptPort,
    deptPortFull,
    flightTime,
    arrivalPort,
    arrivalPortFull,
    saving,
    price
}) => {

    return (
        <div className="flight-card">
            <div className='top-badges'>
                {recommended && <div className="badge recommended">Recommended</div>}
                {saving > 0 && <div className="badge saving"> <p className='orignal'>${(saving + price).toFixed(2)}</p> Save ${saving.toFixed(2)}</div>}
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
                            <div className="date">12/April/2025</div>
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

                </div>


                <div className="booking">
                    <div className="deal">Your Deal</div>
                    <div className="price">${price.toFixed(2).toLocaleString()}</div>
                    <button className="book-btn">Book Now</button>
                </div>



            </div>
        </div>
    );
};


FlightCard.defaultProps = {
    recommended: false,
    saving: 0,
};

export default FlightCard;
