import React from 'react';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import './privacy.scss';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <Navbar selectedPage="privacy" />

      <div className="privacy-content">
        <h1>Privacy Policy</h1>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to YourBrand. This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website. Please read this policy carefully to understand our views and
            practices regarding your personal data and how we will treat it.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site
            includes:
          </p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, phone number, etc.</li>
            <li><strong>Derivative Data:</strong> Browser type, IP address, access times, and referring website.</li>
            <li><strong>Cookies:</strong> Data collected via cookies and tracking technologies.</li>
          </ul>
        </section>

        <section>
          <h2>3. Use of Your Information</h2>
          <p>
            We use your information to:
            <ul>
              <li>Provide and manage services</li>
              <li>Improve user experience</li>
              <li>Respond to inquiries and customer service requests</li>
              <li>Send administrative emails and promotional content</li>
            </ul>
          </p>
        </section>

        <section>
          <h2>4. Disclosure of Your Information</h2>
          <p>
            We may share your information with:
            <ul>
              <li>Third-party service providers for website operations</li>
              <li>Law enforcement when required by applicable law</li>
              <li>Business partners for analytics and marketing</li>
            </ul>
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, please note that
            no electronic transmission over the Internet or information storage technology can be guaranteed to be 100%
            secure.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to:
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw your consent at any time</li>
            </ul>
          </p>
        </section>

        <section>
          <h2>7. Policy Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
            revision date.
          </p>
        </section>

        <section>
          <h2>8. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
            <br />
            <strong>Email:</strong> privacy@yourbrand.com
            <br />
            <strong>Address:</strong> 123 Example Street, City, Country
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
} 