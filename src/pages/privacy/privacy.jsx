import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalStatus } from '../../context/GlobalLoaderContext'; 
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import './privacy.scss';

export default function PrivacyPolicy() {
  const [policySections, setPolicySections] = useState([]);
  const { startLoading, endLoading, setGlobalError } = useGlobalStatus();

  useEffect(() => {
    startLoading();
    axios
      .get('/api/siteinfo/public/privacy')
      .then((response) => {
        if (response.data && Array.isArray(response.data.privacyPolicy)) {
          setPolicySections(response.data.privacyPolicy);
        } else {
          setGlobalError('Invalid privacy policy format received from server.');
        }
      })
      .catch((err) => {
        setGlobalError(
          err.response?.data?.message ||
            err.message ||
            'Error fetching privacy policy. Please try again later.'
        );
      })
      .finally(() => {
        endLoading();
      });
  }, []);

  return (
    <div className="privacy-page">
      <Navbar selectedPage="privacy" />

      <div className="privacy-content">
        <h1>Privacy Policy</h1>

        {policySections.map((section, index) => (
          <section key={index}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
            {section.bullets && section.bullets.length > 0 && (
              <ul>
                {section.bullets.map((bullet, i) => (
                  <li key={i}>
                    {bullet.heading && <strong>{bullet.heading} </strong>}
                    {bullet.text}
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
