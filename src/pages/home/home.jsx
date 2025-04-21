// import React, {  useState } from 'react';
import React, { useState, useEffect, useMemo} from 'react';
import { Link } from 'react-router-dom';
import './home.scss';

import Navbar from "../../components/navbar/navbar";
// import Footer from '../../components/footer/footer';



const Home = () => {

  
      
    return (
        <>

            <div className='home'>
            <Navbar  selectedPage="home" />
            </div>
        </>
    );
}


export default Home;