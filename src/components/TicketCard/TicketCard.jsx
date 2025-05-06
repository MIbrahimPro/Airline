import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TicketCard.scss';

const FlightCard = ({

  id,
  loading,
  recommended,
  type,

  airlineLogo,
  airlineName,

  deptPort,
  deptPortFull,
  
  flightTime,
  
  arrivalPort,
  arrivalPortFull,
  
  original,
  saving,
  price,
  
  depart, 
  ret,   

  adults: initAdults = 1,
  children: initChildren = 0,
  infants: initInfants = 0,
}) => {



  const [showModal, setShowModal] = useState(false);
  const [notif, setNotif] = useState('');
  const [form, setForm] = useState({
    email: '',
    contact: '',
    contactPref: 'call',
    adults: initAdults,
    children: initChildren,
    infants: initInfants,
    details: '',
  });

  useEffect(() => {
    if (notif) {
      const t = setTimeout(() => setNotif(''), 3000);
      return () => clearTimeout(t);
    }
  }, [notif]);

  const openModal = () => {
    setForm(f => ({
      ...f,
      adults: initAdults || 1,
      children: initChildren || 0,
      infants: initInfants || 0,
    }));
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = e => {
    const { name, value } = e.target;
    let v = value;
    if (['adults','children','infants'].includes(name)) {
      v = Math.max(name === 'adults' ? 1 : 0, Number(value));
    }
    setForm(f => ({ ...f, [name]: v }));
  };

  const formatISO = dateStr => {
    if (!dateStr) return null;
    // assume dateStr is YYYY-MM-DD already
    return dateStr;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/booking', {
        flightId: id,
        userEmail: form.email,
        contactPhone: form.contact,
        contactPreference: form.contactPref,
        adults: form.adults,
        children: form.children,
        infants: form.infants,
        extraDetails: form.details,
        departureDate: depart, // Use the ISO 8601 format directly
        returnDate: type === 'round-trip' ? ret : undefined, // Include returnDate only for round-trips
        initialBookingPrice: price,
      });
      setNotif('Booking successfully made, we will contact you very soon');
      closeModal();
    } catch (err) {
      console.error(err);
      setNotif('Failed to book, please try again');
    }
  };


  

  if(loading){
    return(
      <div className="loading-card"></div>
    )
  }

  return (
    <>
      <div className="flight-card">
        <div className="top-badges">
          {recommended && <div className="badge recommended">Recommended</div>}
          {saving > 0 && <div className="badge saving">Save ${saving.toFixed(2)}</div>}
        </div>
        <div className="main">
          <div className="details">
            <div className="airline">
              <img src={airlineLogo} alt={`${airlineName} logo`} className="airline-logo" />
              <span className="airline-name">{airlineName}</span>
            </div>
            <div className="info-cont">
              <div className="info">
                <div className="segment">
                  <div className="port" title={deptPortFull}>{deptPort}</div>
                </div>
                <div className="dashed-line" />
                <div className="middle">
                  <div className="duration">{flightTime}</div>
                  <div className="date">{depart.split('-').reverse().join('/')}</div>
                </div>
                <div className="dashed-line" />
                <div className="segment">
                  <div className="port" title={arrivalPortFull}>{arrivalPort}</div>
                </div>
              </div>
              {type === 'round-trip' && (
                <div className="info">
                  <div className="segment">
                    <div className="port" title={arrivalPortFull}>{arrivalPort}</div>
                  </div>
                  <div className="dashed-line" />
                  <div className="middle">
                    <div className="duration">{flightTime}</div>
                    <div className="date">{ret.split('-').reverse().join('/')}</div>
                  </div>
                  <div className="dashed-line" />
                  <div className="segment">
                    <div className="port" title={deptPortFull}>{deptPort}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="booking">
            <div className="type">{type}</div>
            {saving > 0 && <p className="original">${(price + saving).toFixed(2)}</p>}
            <div className="price">${price.toFixed(2)}</div>
            <button className="book-btn" onClick={openModal}>Book Now</button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="booking-overlay" onClick={closeModal}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>Complete Your Booking</h2>
            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
              <label>Contact Number</label>
              <input type="text" name="contact" value={form.contact} onChange={handleChange} required />
              <label>Contact Preference</label>
              <select name="contactPref" value={form.contactPref} onChange={handleChange}>
                <option value="call">Call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
              <div className="passenger-counts">
                <div>
                  <label>Adults</label>
                  <input type="number" name="adults" min="1" value={form.adults} onChange={handleChange} required />
                </div>
                <div>
                  <label>Children</label>
                  <input type="number" name="children" min="0" value={form.children} onChange={handleChange} />
                </div>
                <div>
                  <label>Infants</label>
                  <input type="number" name="infants" min="0" value={form.infants} onChange={handleChange} />
                </div>
              </div>
              <label>Extra Details</label>
              <textarea name="details" value={form.details} onChange={handleChange} rows="3" />
              <button type="submit" className="submit-btn">Submit Booking</button>
            </form>
          </div>
        </div>
      )}
      {notif && <div className="booking-notif">{notif}</div>}
    </>
  );
};

export default FlightCard;





















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './TicketCard.scss';

// export default function FlightCard({
//   id,
//   recommended = false,
//   type = '',
//   airlineLogo = '',
//   airlineName = '',
//   deptPort = '',
//   deptPortFull = '',
//   arrPort = '',
//   arrPortFull = '',
//   departureDate = null,
//   arrivalDate = null,
//   flightTime = '',
//   original = 0,
//   saving = 0,
//   price = 0,
//   adults: initAdults = 1,
//   children: initChildren = 0,
//   infants: initInfants = 0,
// }) {
//   const [showModal, setShowModal] = useState(false);
//   const [notif, setNotif] = useState('');
//   const [form, setForm] = useState({
//     email: '', contact: '', contactPref: 'call',
//     adults: initAdults, children: initChildren, infants: initInfants, details: ''
//   });

//   // Escape-to-close & scroll lock
//   useEffect(() => {
//     if (!showModal) return;
//     const onKey = e => e.key === 'Escape' && closeModal();
//     document.body.classList.add('modal-open');
//     window.addEventListener('keydown', onKey);
//     return () => {
//       document.body.classList.remove('modal-open');
//       window.removeEventListener('keydown', onKey);
//     };
//   }, [showModal]);

//   useEffect(() => {
//     if (!notif) return;
//     const t = setTimeout(() => setNotif(''), 3000);
//     return () => clearTimeout(t);
//   }, [notif]);

//   const openModal = () => {
//     setForm(f => ({ ...f, adults: initAdults || 1, children: initChildren || 0, infants: initInfants || 0 }));
//     setShowModal(true);
//   };
//   const closeModal = () => setShowModal(false);

//   const handleChange = e => {
//     const { name, value } = e.target;
//     let v = value;
//     if (['adults','children','infants'].includes(name)) v = Math.max(name==='adults'?1:0, Number(value));
//     setForm(f => ({ ...f, [name]: v }));
//   };

//   const formatDMY = obj => {
//     if (!obj) return '';
//     const { day, month, year } = obj;
//     return `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`;
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/booking', {
//         flightId: id,
//         userEmail: form.email,
//         contactPhone: form.contact,
//         contactPreference: form.contactPref,
//         adults: form.adults,
//         children: form.children,
//         infants: form.infants,
//         extraDetails: form.details,
//         departureDate: departureDate ? `${departureDate.year}-${departureDate.month}-${departureDate.day}` : undefined,
//         returnDate: type==='round-trip' && arrivalDate ? `${arrivalDate.year}-${arrivalDate.month}-${arrivalDate.day}` : undefined,
//         initialBookingPrice: price,
//       });
//       setNotif('Booking successful! We’ll contact you shortly.');
//       closeModal();
//     } catch {
//       setNotif('Booking failed. Please try again.');
//     }
//   };

//   const outbound = { port: deptPort, full: deptPortFull, dateObj: departureDate };
//   const inbound = arrivalDate ? { port: arrPort, full: arrPortFull, dateObj: arrivalDate } : null;

//   return (
//     <>
//       <div className="flight-card">
//         <div className="top-badges">
//           {recommended && <div className="badge recommended">Recommended</div>}
//           {saving > 0 && <div className="badge saving">Save ${saving.toFixed(2)}</div>}
//         </div>
//         <div className="main">
//           <div className="details">
//             <div className="airline">
//               <img src={airlineLogo} alt={`${airlineName} logo`} className="airline-logo" />
//               <span className="airline-name">{airlineName}</span>
//             </div>
//             <div className="info-cont">
//               {[outbound, inbound].filter(Boolean).map((seg,i)=>(
//                 <React.Fragment key={i}>
//                   <div className="info">
//                     <div className="segment"><div className="port" title={seg.full}>{seg.port}</div></div>
//                     <div className="dashed-line"/>
//                     <div className="middle"><div className="duration">{flightTime}</div><div className="date">{formatDMY(seg.dateObj)}</div></div>
//                     <div className="dashed-line"/>
//                     <div className="segment"><div className="port" title={seg.full}>{seg.port}</div></div>
//                   </div>
//                   {type==='round-trip'&&i===0&&<div className="info-spacer"/>}
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//           <div className="booking">
//             <div className="type">{type ? type.replace(/-/g,' ') : ''}</div>
//             {saving > 0 && <p className="original">${(price + saving).toFixed(2)}</p>}
//             <div className="price">${price.toFixed(2)}</div>
//             <button className="book-btn" onClick={openModal}>Book Now</button>
//           </div>
//         </div>
//       </div>

//       {showModal && (
//         <div className="booking-overlay" onClick={closeModal} role="dialog" aria-modal="true">
//           <div className="booking-modal" onClick={e=>e.stopPropagation()}>
//             <button className="modal-close" onClick={closeModal}>×</button>
//             <h2>Complete Your Booking</h2>
//             <form onSubmit={handleSubmit}>
//               <label>Email</label>
//               <input type="email" name="email" value={form.email} onChange={handleChange} required />
//               <label>Contact Number</label>
//               <input type="text" name="contact" value={form.contact} onChange={handleChange} required />
//               <label>Contact Preference</label>
//               <select name="contactPref" value={form.contactPref} onChange={handleChange}>
//                 <option value="call">Call</option>
//                 <option value="whatsapp">WhatsApp</option>
//                 <option value="email">Email</option>
//               </select>
//               <div className="passenger-counts">
//                 <div><label>Adults</label><input type="number" name="adults" min="1" value={form.adults} onChange={handleChange} required/></div>
//                 <div><label>Children</label><input type="number" name="children" min="0" value={form.children} onChange={handleChange}/></div>
//                 <div><label>Infants</label><input type="number" name="infants" min="0" value={form.infants} onChange={handleChange}/></div>
//               </div>
//               <label>Extra Details</label>
//               <textarea name="details" value={form.details} onChange={handleChange} rows="3" />
//               <button type="submit" className="submit-btn">Submit Booking</button>
//             </form>
//           </div>
//         </div>
//       )}
//       {notif && <div className="booking-notif">{notif}</div>}
//     </>
//   );
// }