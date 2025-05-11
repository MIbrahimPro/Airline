import React, { useState, useEffect } from 'react';
import { useGlobalStatus } from '../../context/GlobalLoaderContext';
import axios from 'axios';
import './FAQ.scss';


const FaqSection = () => {
    const [faqData, setFaqData] = useState([]);
    const [expandedItemId, setExpandedItemId] = useState(null);
    const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

    useEffect(() => {
        startLoading();
        axios
            .get('/api/siteinfo/public/FAQ')
            .then((response) => {
                if (response.data && response.data.faq) {
                    setFaqData(response.data.faq);
                } else {
                    setGlobalError('Invalid response format.');
                }
            })
            .catch((err) => {
                console.error(err);
                setGlobalError(err.message || 'Error fetching data');
            })
            .finally(() => {
                endLoading();
            });

    }, [startLoading, endLoading, setGlobalError]);

    const toggleAccordion = (index) => {
        setExpandedItemId((prevId) => (prevId === index ? null : index));
    };

    return (
        <div className="faqSection">
            <h2 className="faqTitle">In case you missed anything.</h2>
            <ul className="faqList">
                {faqData.map((item, index) => (
                    <li className="faqItem" key={index}>
                        <div
                            className="faqQuestionContainer"
                            onClick={() => toggleAccordion(index)}
                        >
                            <h3 className="faqQuestion">{item.question}</h3>
                            <button className="faqToggleButton">
                                {expandedItemId === index ? (
                                    <img src="../icons/minus.svg" alt="Minus Icon" className="toggleIcon" />
                                ) : (
                                    <img src="../icons/plus.svg" alt="Plus Icon" className="toggleIcon" />
                                )}
                            </button>
                        </div>
                        {expandedItemId === index && (
                            <div className="faqAnswer">{item.answer}</div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FaqSection;