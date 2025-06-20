import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalStatus } from "../../context/GlobalLoaderContext";
import "./footer.scss";

export default function Footer() {
    const [aboutInfo, setAboutInfo] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactWA, setContactWA] = useState("");
    const [addressText, setAddressText] = useState("");
    const [mapURL, setmapURL] = useState("");

    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

    useEffect(() => {
        startLoading();
        Promise.all([
            axios.get("/api/siteinfo/public/about"),
            axios.get("/api/siteinfo/public/contact"),
            axios.get("/api/siteinfo/public/address"),
        ])
            .then(([aboutRes, contactRes, addressRes]) => {
                if (aboutRes.data && aboutRes.data.aboutInfo) {
                    setAboutInfo(aboutRes.data.aboutInfo);
                }
                if (contactRes.data) {
                    setContactEmail(contactRes.data.contactEmail);
                    setContactPhone(contactRes.data.contactPhone);
                    setContactWA(contactRes.data.contactWA);
                }
                if (addressRes.data && addressRes.data.addressText) {
                    setAddressText(addressRes.data.addressText);
                    setmapURL(addressRes.data.mapEmbedCode);
                }
            })
            .catch((err) => {
                setGlobalError("Error fetching footer information:" + err);
            })
            .finally(() => {
                endLoading();
            });
    }, [startLoading, endLoading, setGlobalError]);

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <img
                        src="../logo.png"
                        alt="Brand Logo"
                        className="brand-logo"
                    />
                    <p className="brand-description">{aboutInfo}</p>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>
                            <img src="../icons/right_arrow.svg" alt="" />
                            <a href="/about">About Us</a>
                        </li>
                        <li>
                            <img src="../icons/right_arrow.svg" alt="" />
                            <a href="/contact">Contact Us</a>
                        </li>
                        <li>
                            <img src="../icons/right_arrow.svg" alt="" />
                            <a href="/privacy">Privacy Policy</a>
                        </li>
                        <li>
                            <img src="../icons/right_arrow.svg" alt="" />
                            <a href="/terms">Booking Terms</a>
                        </li>
                        <li>
                            <img src="../icons/right_arrow.svg" alt="" />
                            <a href="/paylater">Book-now Pay-Later</a>
                        </li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4> Contact Us</h4>

                    <p>
                        <img src="./icons/call_w.svg" alt="Phone:"></img>{" "}
                        <a href={`tel:${contactPhone}`}>{contactPhone}</a>{" "}
                    </p>
                    <p>
                        <img src="./icons/email_w.svg" alt="Email:"></img>{" "}
                        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>{" "}
                    </p>
                    <p>
                        <img src="./icons/location_w.svg" alt="Address:"></img>{" "}
                        <a href={mapURL} target="blank">
                            {addressText}{" "}
                        </a>{" "}
                    </p>
                    <p>
                        <img src="./icons/wa_w.svg" alt="WhatsApp:"></img>{" "}
                        <a
                            href={`https://wa.me/${contactWA.replace(
                                /[\s+]/g,
                                ""
                            )}`}
                        >
                            {contactWA}{" "}
                        </a>{" "}
                    </p>
                </div>

                <div className="footer-payment">
                    <h4>Secure Payments</h4>
                    <div className="payment-logos">
                        <img src="../icons/visa.svg" alt="Visa" />
                        <img src="../icons/mastercard.svg" alt="MasterCard" />
                        <img
                            src="../icons/express.svg"
                            alt="American Express"
                        />
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    &copy; {new Date().getFullYear()} Flyva. All Rights
                    Reserved.
                </p>
            </div>
        </footer>
    );
}
