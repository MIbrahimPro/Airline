import React from 'react';
import './footer.scss';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Top section with multiple columns */}
      <div className="footer-top">
        <div className="footer-brand">
          <img src="../logow.svg" alt="Brand Logo" className="brand-logo" />
          <p className="brand-description">
            Travel. is dedicated to providing exceptional travel experiences all around the world.
            We combine premium services with unbeatable deals to ensure your journey is unforgettable.
          </p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><img src='../icons/right_arrow.svg' alt='' /><a href="/about">About Us</a></li>
            <li><img src='../icons/right_arrow.svg' alt='' /><a href="/services">Our Services</a></li>
            <li><img src='../icons/right_arrow.svg' alt='' /><a href="/destinations">Destinations</a></li>
            <li><img src='../icons/right_arrow.svg' alt='' /><a href="/contact">Contact</a></li>
            <li><img src='../icons/right_arrow.svg' alt='' /><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Phone: +92 319 7877750</p>
          <p>Email: info@travel.com</p>
          <p>
          Dhok-Kala-Khan Shamsabad, <br />
          Rawalpindi, Pakistan
          </p>
        </div>
        <div className="footer-payment">
          <h4>Secure Payments</h4>
          <div className="payment-logos">
            <img src="../icons/visa.svg" alt="Visa" />
            <img src="../icons/mastercard.svg" alt="MasterCard" />
            <img src="../icons/paypal.svg" alt="PayPal" />
          </div>
        </div>
      </div>
      {/* Bottom section with copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} YourBrand. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
