import React, {useState, useEffect} from 'react';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import './airlinepage.scss';
import axios from 'axios';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';




export default function AirlinesPage() {
    const [airlinesData, setAirlinesData] = useState([]);
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

	useEffect(() => {
		startLoading();
		axios
			.get('/api/airline/')
			.then((response) => {
				if (Array.isArray(response.data)) {
					setAirlinesData(response.data);
				} else {
					setGlobalError('Invalid airline data received.');
				}
			})
			.catch((err) => {
				setGlobalError(
					err.response?.data?.message || err.message || 'Error fetching airlines.'
				);
			})
			.finally(() => {
				endLoading();
			});
	}, []);





    return (
        <>
            <Navbar selectedPage="airlines" />

            <div className="airlines-page">
                <div className="airlines-content">
                    <h1>Our Partner Airlines</h1>
                    <div className="airlines-grid">
                        {airlinesData.map((airline) => (
                            <div key={airline._id} className="airline-card">
                                <div className="airline-logo">
                                    <img src={airline.logoPicture} alt={airline.shortName} />
                                </div>
                                <div className="airline-info">
                                    <h2>{airline.name}</h2>
                                    <p>{airline.overview}</p>
                                </div>
                                <button className="fly-btn" onClick={() => window.location.href = `/flight/${airline._id}`}>
                                    <img src="../icons/takeoff_w.svg" alt="Takeoff" className="btn-icon" />
                                    Fly <span className="btn-text-long">{airline.shortName}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />

        </>
    );
}
