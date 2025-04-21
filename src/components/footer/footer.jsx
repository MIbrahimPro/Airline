// src/components/footer/Footer.jsx
import React from 'react';
import './footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">
          <h2>WIMBLEDOWN</h2>
        </div>
        <nav className="footer-nav">
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </nav>
        <div className="footer-social">
          <a href="https://www.instagram.com/wimbledown/" target='blank' aria-label="Facebook">
            <img src="/facebook.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/wimbledown/" target='blank' aria-label="Messenger">
            <img src="/messenger.png" alt="Messenger" />
          </a>
          <a href="https://www.instagram.com/wimbledown/" target='blank' aria-label="Instagram">
            <img src="/instagram.png" alt="Instagram" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">
          &copy; {currentYear} WIMBLEDOWN. All rights reserved.
        </p>
        {/* <div className="developer">
          <p>developed by&nbsp;</p>
          <a 
            href="https://m-ibrahimdev.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Muhammad Ibrahim 
            <span className="material-symbols-outlined">
              open_in_new
            </span>
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
