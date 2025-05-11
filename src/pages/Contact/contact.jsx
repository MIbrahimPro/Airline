import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Notification from '../../components/notifications/notifications';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import ContactPopup from '../../components/contactpopup/contactpopup';

import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import './contact.scss';

export default function ContactUs() {

    const [notification, setNotification] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);

    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactWA, setContactWA] = useState('');
    const [addressText, setAddressText] = useState('');
    const [mapEmbedUrl, setMapEmbedUrl] = useState(null);


    const openPopup = () => {
        setNotification(null)
        setShowPopup(true);
        setTimeout(() => setPopupVisible(true), 10);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setTimeout(() => setShowPopup(false), 300);
    };

    const handleSubmit = async (data) => {
        startLoading();
        try {
            const response = await axios.post('/api/contact', data);
            console.log('Contact form submitted successfully:', response.data);
            setNotification({ type: 'success', message: 'Message sent successfully!' });
            closePopup();
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setGlobalError('Failed to send message.');
            setNotification({ type: 'error', message: 'Failed to send message.' });
        } finally {
            endLoading();
        }
    };

    useEffect(() => {
        startLoading();
        Promise.all([
            axios.get('/api/siteinfo/public/contact'),
            axios.get('/api/siteinfo/public/address'),
        ])
            .then(([contactRes, addressRes]) => {
                if (contactRes.data) {
                    setContactEmail(contactRes.data.contactEmail);
                    setContactPhone(contactRes.data.contactPhone);
                    setContactWA(contactRes.data.contactWA);
                }
                if (addressRes.data) {
                    setAddressText(addressRes.data.addressText);
                    setMapEmbedUrl(addressRes.data.mapEmbedCode);
                }
            })
            .catch((err) => {
                setGlobalError(
                    'Error fetching Contact information.'
                );
            })
            .finally(() => {
                endLoading();
            });
    }, [startLoading, endLoading, setGlobalError]);



    return (
        <div className="contact-page">
            <Navbar selectedPage="contact" />

            <div className="contact-main">

                <h1>Contact Us</h1>

                <p>
                    We'd love to hear from you! Whether you have any questions about our services or just want to say hello,
                    our team is here to help.
                </p>

                <div className="contact-cards">

                    <div className="contact-card" onClick={() => window.open(`mailto:${contactEmail}`)} >
                        <img src="../icons/email.svg" alt="Email Icon" />
                        <div className="text">
                            <p>Email</p>
                            <strong>{contactEmail || "loading..."}</strong>
                        </div>
                    </div>

                    <div className="contact-card" onClick={() => window.open(`tel:${contactPhone}`)} >
                        <img src="../icons/call.svg" alt="Phone Icon" />
                        <div className="text">
                            <p>Phone</p>
                            <strong>{contactPhone || "loading"}</strong>
                        </div>
                    </div>

                    <div className="contact-card" onClick={() => window.open(`https://wa.me/${contactWA.replace(/[\s+]/g, '')}`)} >
                        <img src="../icons/wa.svg" alt="WhatsApp Icon" />
                        <div className="text">
                            <p>WhatsApp</p>
                            <strong>{contactWA || "loading..."}</strong>
                        </div>
                    </div>

                    <div className="contact-card" onClick={() => window.open(mapEmbedUrl, '_blank')} >
                        <img src="../icons/location.svg" alt="Location Icon" />
                        <div className="text">
                            <p>Address</p>
                            <strong>{addressText || "loading..."}</strong>
                        </div>
                    </div>

                </div>



                <button className="contact-btn" onClick={openPopup}>
                    Get in Touch
                </button>



                <div className="map-section">
                    <iframe
                        title="Google Maps"
                        height="300"
                        frameBorder="0"
                        width="100%"
                        allowFullScreen
                        src={mapEmbedUrl}
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    >

                    </iframe>
                </div>

            </div>

            <Footer />

            {notification && (
                <Notification type={notification.type} message={notification.message} />
            )}

            {showPopup && (
                <ContactPopup
                    visible={popupVisible}
                    onClose={closePopup}
                    onSubmit={handleSubmit}
                />
            )}

        </div>
    );
}
