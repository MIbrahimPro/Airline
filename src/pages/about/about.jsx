import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalStatus } from '../../context/GlobalLoaderContext'; // adjust path if needed
import Navbar from '../../components/navbar/navbar';
import Filter from "../../components/filter/filter";
import Footer from '../../components/footer/footer';
import Why from '../../components/why/why';
import FAQ from '../../components/FAQ/FAQ';
import './about.scss';

export default function About() {
    const [showForm, setShowForm] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();
    const origin = { x: 0, y: 0 };
    const [aboutText, setAboutText] = useState('');
    const navigate = useNavigate();

    const openForm = () => {
        setShowForm(true);
        setTimeout(() => setFormVisible(true), 10);
    };

    const closeForm = () => {
        setFormVisible(false);
        setTimeout(() => setShowForm(false), 300);
    };

    useEffect(() => {
        startLoading();
        axios
            .get('/api/siteinfo/public/about-long')
            .then((response) => {
                if (response.data && response.data.aboutUsLong) {
                    setAboutText(response.data.aboutUsLong);
                } else {
                    setGlobalError('Invalid About Us data received from server.');
                }
            })
            .catch((err) => {
                setGlobalError(
                    err.response?.data?.message ||
                    err.message ||
                    'Error fetching About Us information.'
                );
            })
            .finally(() => {
                endLoading();
            });
    }, []);

    return (
        <>
            <Navbar selectedPage="about" />
            <div className="about-page">

                <div className="about-main">
                    <div className="about-text">
                        <h1>About Us</h1>
                        <p>{aboutText}</p>
                    </div>
                    <div className="about-image">
                        <img src="./about.webp" alt="About Us" />
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
    );
}
