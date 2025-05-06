import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "./flightdetail.scss";

const FlightDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const token = getToken();

  const [flight, setFlight] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [form, setForm] = useState({
    departureAirport: { code: "", id: "" },
    arrivalAirport:   { code: "", id: "" },
    airlineId:        "",
    time:             { hours: 0, minutes: 0 },
    prices:           []
  });
  const [depSug, setDepSug] = useState([]);
  const [arrSug, setArrSug] = useState([]);
  const [showDepSug, setShowDepSug] = useState(false);
  const [showArrSug, setShowArrSug] = useState(false);

  const depRef = useRef();
  const arrRef = useRef();

  useEffect(() => {
    // load airlines
    fetch("/api/airline", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setAirlines);

    // load this flight
    fetch(`/api/flight/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(f => {
        setFlight(f);
        setForm({
          departureAirport: { code: f.departureAirport.code, id: f.departureAirport._id },
          arrivalAirport:   { code: f.arrivalAirport.code,   id: f.arrivalAirport._id },
          airlineId:        f.airline._id,
          time:             { ...f.time },
          prices:           f.prices.map(p => ({ ...p, discount: { ...p.discount } }))
        });
      });
  }, [id, token]);

  // fetch airport suggestions
  const fetchSug = (q, setter) => {
    if (!q) return setter([]);
    fetch(`/api/airport/search-advanced?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(setter);
  };

  // departure autocomplete handlers
  const onDepChange = e => {
    const v = e.target.value.toUpperCase();
    setForm(f => ({ ...f, departureAirport: { code: v, id: "" } }));
    fetchSug(v, setDepSug);
    setShowDepSug(true);
  };
  const selectDep = a => {
    setForm(f => ({ ...f, departureAirport: { code: a.airportCode, id: a.airportId } }));
    console.log(a);
    setShowDepSug(false);
  };
  const hideDepSug = () => setTimeout(() => setShowDepSug(false), 150);

  // arrival autocomplete handlers
  const onArrChange = e => {
    const v = e.target.value.toUpperCase();
    setForm(f => ({ ...f, arrivalAirport: { code: v, id: "" } }));
    fetchSug(v, setArrSug);
    setShowArrSug(true);
  };
  const selectArr = a => {
    setForm(f => ({ ...f, arrivalAirport: { code: a.airportCode, id: a.airportId } }));
    console.log(a);
    setShowArrSug(false);
  };
  const hideArrSug = () => setTimeout(() => setShowArrSug(false), 150);

  // airline dropdown
  const handleAirline = e => setForm(f => ({ ...f, airlineId: e.target.value }));

  // time handlers
  const handleTime = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, time: { ...f.time, [name]: Number(value) } }));
  };

  // price handlers
  const handlePrice = (i, field, v) => {
    setForm(f => {
      const ps = f.prices.map((p, idx) => {
        if (idx !== i) return p;
        if (field === "oneWay" || field === "roundTrip") {
          return { ...p, [field]: Number(v) };
        } else {
          const key = field.split(".")[1];
          return { ...p, discount: { ...p.discount, [key]: Number(v) } };
        }
      });
      return { ...f, prices: ps };
    });
  };

  // save with validation
  const save = async () => {
    if (!form.departureAirport.id) {
      alert("Please choose a departure airport from the suggestions.");
      return;
    }
    if (!form.arrivalAirport.id) {
      alert("Please choose an arrival airport from the suggestions.");
      return;
    }
    if (!form.airlineId) {
      alert("Please select an airline.");
      return;
    }
    const body = {
      departureAirport: form.departureAirport.id,
      arrivalAirport:   form.arrivalAirport.id,
      airline:          form.airlineId,
      time:             form.time,
      prices:           form.prices
    };
    await fetch(`/api/flight/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    nav(-1);
  };

  if (!flight) return <p>Loading…</p>;

  return (
    <div className="flight-details-page-admin">
      <h1>Flight Details</h1>
      <button className="back" onClick={() => nav(-1)}>← Back</button>

      <section className="info-section">
        <h2>Information</h2>
        <div className="info-grid">
          <div className="field">
           
           
            <label>Departure Airport</label>
            <input
              ref={depRef}
              className={form.departureAirport.id ? "selected" : ""}
              value={form.departureAirport.code}
              onChange={onDepChange}
              onBlur={hideDepSug}
            />
            {showDepSug && depSug.length > 0 && (
              <ul className="sug-list">
                {depSug.map(a => (
                  <li key={a.airportId} onClick={() => selectDep(a)}>
                    {`${a.airportName} (${a.airportCode}), ${a.locationName}, ${a.countryName}, ${a.regionName}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          
          <div className="field">
            <label>Arrival Airport</label>
            <input
              ref={arrRef}
              className={form.arrivalAirport.id ? "selected" : ""}
              value={form.arrivalAirport.code}
              onChange={onArrChange}
              onBlur={hideArrSug}
            />
            {showArrSug && arrSug.length > 0 && (
              <ul className="sug-list">
                {arrSug.map(a => (
                  <li key={a.airportId} onClick={() => selectArr(a)}>
                    {`${a.airportName} (${a.airportCode}), ${a.locationName}, ${a.countryName}, ${a.regionName}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="field">
            <label>Airline</label>
            <select value={form.airlineId} onChange={handleAirline}>
              <option value="">Select Airline</option>
              {airlines.map(a => (
                <option key={a._id} value={a._id}>{a.shortName}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="time-section">
        <h2>Duration</h2>
        <label>Hours<input name="hours" type="number" min="0"
          value={form.time.hours} onChange={handleTime}/></label>
        <label>Minutes<input name="minutes" type="number" min="0" max="59"
          value={form.time.minutes} onChange={handleTime}/></label>
      </section>

      <section className="prices-section">
        <h2>Monthly Prices</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th><th>One-Way</th><th>Disc OW</th><th>Round-Trip</th><th>Disc RT</th>
            </tr>
          </thead>
          <tbody>
            {form.prices.map((p,i)=>(
              <tr key={i}>
                <td>{p.month}</td>
                <td><input type="number" min="0" value={p.oneWay}
                     onChange={e=>handlePrice(i,"oneWay",e.target.value)}/></td>
                <td><input type="number" min="0" value={p.discount.oneWay}
                     onChange={e=>handlePrice(i,"discount.oneWay",e.target.value)}/></td>
                <td><input type="number" min="0" value={p.roundTrip}
                     onChange={e=>handlePrice(i,"roundTrip",e.target.value)}/></td>
                <td><input type="number" min="0" value={p.discount.roundTrip}
                     onChange={e=>handlePrice(i,"discount.roundTrip",e.target.value)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="actions">
        <button onClick={save}>Save Changes</button>
      </div>
    </div>
  );
};

export default FlightDetails;
