import React, { useState } from 'react';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import ContactPopup from '../../components/contactpopup/contactpopup';
import './contact.scss';

export default function ContactUs() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);

    const openPopup = () => {
        setShowPopup(true);
        setTimeout(() => setPopupVisible(true), 10);
    };

    const closePopup = () => {
        setPopupVisible(false);
        setTimeout(() => setShowPopup(false), 300);
    };

    const handleSubmit = (data) => {
        // Process the contact form data (e.g. send to an API)
        console.log('Contact form submitted:', data);
        closePopup();
    };

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
                    <div
                        className="contact-card"
                        onClick={() => window.open("mailto:info@yourbrand.com")}
                    >
                        <img src="../icons/email.svg" alt="Email Icon" />
                        <div className="text">
                            <p>Email</p>
                            <strong>info@yourbrand.com</strong>
                        </div>
                    </div>

                    <div
                        className="contact-card"
                        onClick={() => window.open("tel:+1234567890")}
                    >
                        <img src="../icons/call.svg" alt="Phone Icon" />
                        <div className="text">
                            <p>Phone</p>
                            <strong>+123 456 7890</strong>
                        </div>
                    </div>

                    <div
                        className="contact-card"
                        onClick={() =>
                            window.open(
                                "https://www.google.com/maps/search/?api=1&query=123+Example+Street,+City,+Country"
                            )
                        }
                    >
                        <img src="../icons/location.svg" alt="Location Icon" />
                        <div className="text">
                            <p>Address</p>
                            <strong>123 Example Street, City, Country</strong>
                        </div>
                    </div>
                </div>





                <button className="contact-btn" onClick={openPopup}>
                    Get in Touch
                </button>
                <div className="map-section">
                    <iframe
                        title="Google Maps"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019795574948!2d-122.41941568468137!3d37.77492977975985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c8a7d3f07%3A0x985f6e6f86b7e1d8!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus"
                        width="100%"
                        height="300"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            <Footer />

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
