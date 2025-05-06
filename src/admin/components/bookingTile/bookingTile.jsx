import Navbar from "../../components/navbar/adminnavbar";
import react, { useState } from "react";
import EditPopup from "../editPopup/editPopup";
import "./bookingTile.scss";

const BookingTile = ({ booking, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div className="booking-tile">
      <div className="header" onClick={()=>setExpanded(e=>!e)}>
        <div><strong>{booking.userEmail}</strong></div>
        <div>{new Date(booking.departureDate).toLocaleDateString()}</div>
        <div className={`state ${booking.state}`}>{booking.state}</div>
        <div className="actions">
          <button onClick={e=>{e.stopPropagation(); setEditing(true);}}>Edit</button>
          <button onClick={e=>{e.stopPropagation(); onDelete(booking._id);}}>Delete</button>
        </div>
      </div>
      {expanded && (
        <div className="body">
          <p><strong>Flight:</strong> {booking.flight.departureAirport.code} → {booking.flight.arrivalAirport.code}</p>
          <p><strong>Class:</strong> {booking.travelClass} | <strong>Price:</strong> ${booking.finalPrice}</p>
          <p><strong>Passengers:</strong> A:{booking.peopleCount.adults} C:{booking.peopleCount.children}</p>
          <p><strong>Contact:</strong> {booking.contactPreference} – {booking.contactPhone}</p>
          <p><strong>Notes:</strong> {booking.notes}</p>
        </div>
      )}
      {editing && <EditPopup booking={booking} onCancel={()=>setEditing(false)} onSave={data=>onUpdate(booking._id, data)} />}
    </div>
  );
};

export default BookingTile;
