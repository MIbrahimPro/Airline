import React, { useEffect, useState } from "react";
import axios from "axios";
import "./contactpopup.scss";

import { useGlobalStatus } from "../../context/GlobalLoaderContext";

export default function ContactPopup({ visible, onClose, onSubmit }) {
    const [waNumber, setWaNumber] = useState("+00000000000");
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

    useEffect(() => {
        const fetchWaNumber = async () => {
            startLoading();
            try {
                const res = await axios.get("/api/siteinfo/public/contact");
                setWaNumber(res.data.contactWA);
            } catch (error) {
                console.error("Failed to get WhatsApp number:", error);
                setGlobalError("Failed to get WhatsApp number.");
            } finally {
                endLoading();
            }
        };

        fetchWaNumber();
    }, [startLoading, endLoading, setGlobalError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <div className="cp-overlay" onClick={onClose}>
            <div
                className={`contact-popup ${visible ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="cp-header">
                    <h2>Contact Us</h2>
                    <div className="cp-close" onClick={onClose}>
                        ×
                    </div>
                </div>
                <form className="cp-body" onSubmit={handleSubmit}>
                    <div className="cp-fields">
                        <div className="cp-field">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="cp-field">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="cp-field">
                            <label>Phone (Optional)</label>
                            <input
                                type="text"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="cp-field">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={data.message}
                                onChange={handleChange}
                                rows="5"
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="cp-footer">
                        <button type="submit" className="cp-submit-btn">
                            Send Message
                        </button>
                        <a
                            href={"https://wa.me/" + waNumber}
                            className="cp-submit-wa"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {/* Whatsaap */}
                            <img src="/icons/wa_w.svg" alt="Whatsaap" />
                            <p>&nbsp;&nbsp;{waNumber}</p>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
