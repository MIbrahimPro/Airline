import React from 'react';
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
    price

}) => {

    if (loading) {
        return (
            <div className={"loading-card"}>
            </div>
        )
    }

    return (
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
                    {saving > 0 ? (
                        <p className='orignal'>${(price + saving).toFixed(2)}</p>
                    ) : null
                    }
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
