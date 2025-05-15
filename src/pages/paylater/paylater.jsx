import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useGlobalStatus } from '../../context/GlobalLoaderContext'; // adjust path if needed
import './paylater.scss'

import Navbar from '../../components/navbar/navbar';
import Filter from "../../components/filter/filter";
import Why from '../../components/why/why';
import FAQ from '../../components/FAQ/FAQ';
import Footer from '../../components/footer/footer';




function Paylater() {
    const navigate = useNavigate();


    const [showForm, setShowForm] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();
    const origin = { x: 0, y: 0 };

    const openForm = () => {
        setShowForm(true);
        setTimeout(() => setFormVisible(true), 10);
    };

    const closeForm = () => {
        setFormVisible(false);
        setTimeout(() => setShowForm(false), 300);
    };


    const [paylater, setPaylater] = useState('');

    useEffect(() => {
        startLoading();
        axios
            .get('/api/siteinfo/public/booking')
            .then((response) => {
                if (response.data && response.data.booking) {
                    setPaylater(response.data.booking);
                } else {
                    setGlobalError('Invalid Paylater received from server.');
                }
            })
            .catch((err) => {
                setGlobalError(
                    err.response?.data?.message ||
                    err.message ||
                    'Error fetching Paylater information.'
                );
            })
            .finally(() => {
                endLoading();
            });
    }, [startLoading, endLoading, setGlobalError]);



    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (subheading) => {
        setExpandedItems(prev => ({
            ...prev,
            [subheading]: !prev[subheading],
        }));
    };



    return (
        <>
            <Navbar />

            <div className="paylater">

                <div className="paylater-main">
                    <h1>{paylater.heading}</h1>
                    <p className="pl-mp">
                        &nbsp;&nbsp;&nbsp; {paylater.text}
                    </p>

                    <div className="pl-items-cont">

                        {paylater.items &&

                            paylater.items.map((item) => (
                                <div key={item.subheading} className="pl-item">
                                    <h3>{item.subheading}</h3>
                                    {/* <p>{item.text}</p> */}
                                    <div className="pl-item-text-container">
                                        <p className={`pl-item-text ${expandedItems[item.subheading] ? 'expanded' : ''}`}>
                                            {item.text}
                                        </p>

                                        <a
                                            className="read-more-button"
                                            onClick={() => toggleExpand(item.subheading)}
                                        >
                                            {expandedItems[item.subheading] ? 'Read less' : 'Read more'}
                                        </a>
                                    </div>
                                </div>

                            ))

                        }
                    </div>



                </div>

                <Why openFilter={openForm} />
                <FAQ />

            </div>
            <Footer />



            {showForm && (

                <Filter
                    origin={origin}
                    visible={formVisible}
                    onClose={closeForm}
                    onSubmit={(data) => {
                        const params = {
                            type: data.tripType === 'return' ? 'round-trip' : 'one-way',
                            from: data.from,
                            to: data.to,
                            date: data.depart ? new Date(data.depart).toLocaleDateString('en-GB') : '',
                            airlines: data.airline ? data.airline.split(',').map(a => a.trim()).join(',') : '',
                        };
                        const queryString = new URLSearchParams(params).toString();
                        navigate(`/search-results?${queryString}`);
                    }}
                />
            )}

        </>
    )

}

export default Paylater;