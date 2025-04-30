import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalStatus } from '../../context/GlobalLoaderContext'; // adjust path if needed
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import Why from '../../components/why/why';
import FAQ from '../../components/FAQ/FAQ';
import './about.scss';

export default function About() {
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();
    const [aboutText, setAboutText] = useState('');

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

                <Why />
                <FAQ />
            </div>
            <Footer />
        </>
    );
}
