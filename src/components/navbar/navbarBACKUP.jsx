// // import React from 'react';
// // import './navbar.scss';


// // import Links from '../links/links';

// // const Navbar = ({ selectedPage = null }) => {

// //   const navItems = ['home', 'flight', 'tickets', 'deals'];

// //   return (

// //     <>
// //     <div className='logo'>
// //         <img src='../logob.svg' alt='Travel.' />
// //     </div>
// //     <nav className="navbar">
        
// //       {navItems.map((item) => (
// //         <Links
// //           key={item}
// //           name={item}
// //           selected={item === selectedPage}
// //         />
// //       ))}

// //     </nav>
// //     </>

// //   );

// // };

// // export default Navbar;




// // // src/components/navbar/Navbar.jsx
// // import React, { useState } from 'react';
// // import { FaGlobe, FaStar } from 'react-icons/fa';
// // import './navbar.scss';
// // import Links from '../links/links';

// // const continents = ['Africa','Asia','Europe','North America','Oceania','South America'];
// // const popular   = ['Paris','Tokyo','New York','Sydney','Rio de Janeiro','Cape Town'];

// // export default function Navbar({ selectedPage = null }) {
// //   const [open, setOpen] = useState(false);
// //   const [closing, setClosing] = useState(false);

// //   const toggle = () => {
// //     if (open) {
// //       setClosing(true);
// //     } else {
// //       setOpen(true);
// //     }
// //   };

// //   const onAnimationEnd = () => {
// //     if (closing) {
// //       setOpen(false);
// //       setClosing(false);
// //     }
// //   };

// //   const navItems = ['home','flight','tickets','deals'];

// //   return (
// //     <div className="navbar-container">
// //       <div className="logo">
// //         <img src="../logob.svg" alt="Travel." />
// //       </div>

// //       <nav className="navbar">
// //         {navItems.map(item => (
// //           <Links
// //             key={item}
// //             name={item}
// //             selected={item === selectedPage || (item === 'flight' && open)}
// //             onClick={item === 'flight' ? toggle : undefined}
// //           />
// //         ))}
// //       </nav>

// //       {(open || closing) && (
// //         <>
// //           <div className="dropdown-overlay" onClick={() => { setClosing(true); }} />
// //           <div
// //             className={`flight-dropdown ${closing ? 'closing' : ''}`}
// //             onAnimationEnd={onAnimationEnd}
// //           >
// //             <div className="dropdown-section">
// //               <h5><FaGlobe className="heading-icon" /> Continents</h5>
// //               <div className="pill-container">
// //                 {continents.map(c => <span key={c} className="pill">{c}</span>)}
// //               </div>
// //             </div>

// //             <div className="dropdown-section">
// //               <h5><FaStar className="heading-icon" /> Popular Destinations</h5>
// //               <div className="pill-container">
// //                 {popular.map(p => <span key={p} className="pill">{p}</span>)}
// //               </div>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState, useRef, useEffect } from 'react';
// import './navbar.scss';
// import Links from '../links/links';
// import { FaGlobe, FaStar } from 'react-icons/fa';

// const continents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
// const popular = ['Paris', 'Tokyo', 'New York', 'Sydney', 'Rio de Janeiro', 'Cape'];
// const DROPDOWN_W = 550; // dropdown target width in px

// export default function Navbar({ selectedPage = null }) {
//   const [open, setOpen] = useState(false);
//   const [baseWidth, setBaseWidth] = useState(null);
//   const navRef = useRef();

//   // Measure natural navbar width once on mount
//   useEffect(() => {
//     if (navRef.current) {
//       const w = navRef.current.getBoundingClientRect().width;
//       setBaseWidth(w);
//     }
//   }, []);

//   const toggleOpen = () => setOpen(o => !o);

//   const navItems = ['home', 'flight', 'tickets', 'deals'];

//   return (
//     <div className="navbar-container">
//       {open && <div className="dropdown-overlay" onClick={toggleOpen} />}

//       <nav
//         ref={navRef}
//         className={`navbar${open ? ' expanded' : ''}`}
//         style={baseWidth != null ? { maxWidth: open ? DROPDOWN_W : baseWidth } : {}}
//       >
//         <div className="nav-row">
//           {navItems.map(item => (
//             <Links
//               key={item}
//               name={item}
//               iconSrc={`../icons/${item}.svg`}
//               selected={item === 'flight' ? open : item === selectedPage}
//               onClick={item === 'flight' ? toggleOpen : undefined}
//             />
//           ))}
//         </div>
//         <div className={`dropdown-wrapper ${open ? 'open' : ''}`}>
//           <div className="dropdown-content">
//             <div className="section">
//               <h5><FaGlobe className="heading-icon" /> Continents</h5>
//               <div className="pill-row">
//                 {continents.map((c, i) => (
//                   <Links key={i} name={c} smaller />
//                 ))}
//               </div>
//             </div>
//             <div className="section">
//               <h5><FaStar className="heading-icon" /> Popular</h5>
//               <div className="pill-row">
//                 {popular.map((p, i) => (
//                   <Links key={i} name={p} smaller />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }


// src/components/navbar/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import './navbar.scss';
import Links from '../links/linksBACKUP';

const continents = ['Africa','Asia','Europe','North America','Oceania','South America'];
const popular   = ['Paris','Tokyo','New York','Sydney','Rio de Janeiro','Cape Town'];
const DROPDOWN_W = 550;

export default function Navbar({ selectedPage = null }) {
  const [open, setOpen] = useState(false);
  const [baseWidth, setBaseWidth] = useState(null);
  const navRef = useRef();

  // measure natural width on mount
  useEffect(() => {
    if (navRef.current) {
      setBaseWidth(navRef.current.getBoundingClientRect().width);
    }
  }, []);

  const handleClick = (item) => {
    if (item === 'flight') {
      setOpen(o => !o);
    } else {
      // smooth-scroll to #item if it exists
      const el = document.getElementById(item);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = ['home','flight','tickets','deals'];

  return (
    <div className="navbar-container">
      {open && <div className="dropdown-overlay" onClick={() => setOpen(false)} />}

      <nav
        ref={navRef}
        className={`navbar${open ? ' expanded' : ''}`}
        style={ baseWidth != null ? { maxWidth: open ? DROPDOWN_W : baseWidth } : {} }
      >
        <div className="content-wrapper">
          {/* top row */}
          <div className="nav-row">
            {navItems.map(item => (
              <Links
                key={item}
                name={item}
                iconSrc={`../icons/${item}.svg`}
                selected={item === 'flight' && open}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>

          {/* dropdown always in DOM */}
          <div className={`dropdown-content${open ? ' expanded' : ''}`}>
            <div className="section">
              <h5><span className="heading-icon">🌐</span>Continents</h5>
              <div className="pill-row">
                {continents.map(c => (
                  <Links key={c} name={c} smaller />
                ))}
              </div>
            </div>
            <div className="section">
              <h5><span className="heading-icon">⭐</span>Popular</h5>
              <div className="pill-row">
                {popular.map(p => (
                  <Links key={p} name={p} smaller />
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
