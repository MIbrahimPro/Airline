import react, { useState } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import "./editPopup.scss";


const EditPopup = ({ booking, onCancel, onSave }) => {
  const [f, setF] = useState({
    adults: booking.peopleCount.adults,
    children: booking.peopleCount.children,
    email: booking.userEmail,
    phone: booking.contactPhone,
    preference: booking.contactPreference,
    state: booking.state,
    finalPrice: booking.finalPrice,
    departureDate: booking.departureDate.slice(0,10),
    returnDate: booking.returnDate.slice(0,10),
    notes: booking.notes,
    extraDetails: booking.extraDetails
  });
  const handle = e=> setF({...f, [e.target.name]: e.target.value});
  return (
    <div className="edit-popup-backdrop">
      <div className="edit-popup">
        <h3>Edit Booking</h3>
        <table>
          <tbody>
            <tr><td>Adults</td><td><input name="adults" type="number" value={f.adults} onChange={handle}/></td></tr>
            <tr><td>Children</td><td><input name="children" type="number" value={f.children} onChange={handle}/></td></tr>
            <tr><td>Email</td><td><input name="email" value={f.email} onChange={handle}/></td></tr>
            <tr><td>Phone</td><td><input name="phone" value={f.phone} onChange={handle}/></td></tr>
            <tr><td>Pref.</td>
              <td>
                <select name="preference" value={f.preference} onChange={handle}>
                  <option>email</option><option>call</option><option>whatsapp</option>
                </select>
              </td>
            </tr>
            <tr><td>State</td>
              <td>
                <select name="state" value={f.state} onChange={handle}>
                  <option>pending</option><option>cancelled</option><option>confirmed</option><option>in-progress</option>
                </select>
              </td>
            </tr>
            <tr><td>Price</td><td><input name="finalPrice" type="number" value={f.finalPrice} onChange={handle}/></td></tr>
            <tr><td>Dep. Date</td><td><input name="departureDate" type="date" value={f.departureDate} onChange={handle}/></td></tr>
            <tr><td>Return Date</td><td><input name="returnDate" type="date" value={f.returnDate} onChange={handle}/></td></tr>
            <tr><td>Notes</td><td><textarea name="notes" value={f.notes} onChange={handle}/></td></tr>
            <tr><td>Extra</td><td><textarea name="extraDetails" value={f.extraDetails} onChange={handle}/></td></tr>
          </tbody>
        </table>
        <div className="buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={()=>onSave({
            peopleCount:{adults:+f.adults,children:+f.children,infants:0},
            userEmail:f.email, contactPhone:f.phone,
            contactPreference:f.preference, state:f.state,
            finalPrice:+f.finalPrice, departureDate:f.departureDate,
            returnDate:f.returnDate, notes:f.notes, extraDetails:f.extraDetails
          })}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
