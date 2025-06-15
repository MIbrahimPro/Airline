// src/components/SiteInfoPage/SiteInfoPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalStatus } from "../../context/GlobalLoaderContext";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import "./privacy.scss"; // reuse the same CSS

export default function SiteInfoPage({
    apiPath, // e.g. '/api/siteinfo/public/privacy'
    selectedPage, // e.g. 'privacy' or 'terms'
    pageTitle, // e.g. 'Privacy Policy' or 'Terms & Conditions'
}) {
    const [sections, setSections] = useState([]);
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

    useEffect(() => {
        startLoading();
        axios
            .get(apiPath)
            .then((response) => {
                const data =
                    response.data?.[
                        selectedPage === "privacy" ? "privacyPolicy" : "terms"
                    ];
                if (Array.isArray(data)) {
                    setSections(data);
                } else {
                    setGlobalError(
                        `Invalid ${selectedPage} format received from server.`
                    );
                }
            })
            .catch((err) => {
                setGlobalError(
                    err.response?.data?.message ||
                        err.message ||
                        `Error fetching ${selectedPage}. Please try again later.`
                );
            })
            .finally(endLoading);
    }, [apiPath, selectedPage, startLoading, endLoading, setGlobalError]);

    return (
        <div className="privacy-page">
            <Navbar selectedPage={selectedPage} />

            <div className="privacy-content">
                <h1>{pageTitle}</h1>

                {sections.map((section, idx) => (
                    <section key={idx}>
                        <h2>{section.heading}</h2>
                        <p>{section.text}</p>
                        {section.bullets?.length > 0 && (
                            <ul>
                                {section.bullets.map((b, i) => (
                                    <li key={i}>
                                        {b.heading && (
                                            <strong>{b.heading} </strong>
                                        )}
                                        {b.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>

            <Footer />
        </div>
    );
}
