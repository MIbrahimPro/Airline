import React from 'react';
import './navbar.scss';


import Links from '../links/links';

const Navbar = ({ selectedPage = null }) => {

  const navItems = ['home', 'flight', 'tickets', 'deals'];

  return (

    <>
    <div className='logo'>
        <img src='../logob.svg' alt='Travel.' />
    </div>
    <nav className="navbar">
        
      {navItems.map((item) => (
        <Links
          key={item}
          name={item}
          selected={item === selectedPage}
        />
      ))}

    </nav>
    </>

  );

};

export default Navbar;
