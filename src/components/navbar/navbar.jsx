// src/components/navbar/Navbar.jsx
import React from 'react';
import './navbar.scss';


import Links from '../links/links';

const Navbar = ({ selectedPage = null }) => {

  const navItems = ['home', 'flight', 'tickets', 'deals'];

  return (

    <nav className="navbar">
        
      {navItems.map((item) => (
        <Links
          key={item}
          name={item}
          selected={item === selectedPage}
        />
      ))}

    </nav>

  );

};

export default Navbar;
