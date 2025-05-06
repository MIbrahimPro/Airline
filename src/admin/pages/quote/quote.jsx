import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import "./quote.scss";

const STATUS_COLORS = {
  pending: "#ffc107",
  "in-progress": "#17a2b8",
  responded: "#28a745",
  closed: "#6c757d"
};

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const token = getToken();

  useEffect(() => {
    const hdr = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch("/api/quote", { headers: hdr }).then(r => r.json()),
      fetch("/api/airline", { headers: hdr }).then(r => r.json())
    ]).then(([qData, aData]) => {
      setQuotes(qData);
      setAirlines(aData);
    });
  }, [token]);

  const toggle = id => {
    setExpanded(e => ({ ...e, [id]: !e[id] }));
    setEditingId(null);
  };

  const startEdit = (q, e) => {
    e.stopPropagation();
    // ensure expanded
    setExpanded(e2 => ({ ...e2, [q._id]: true }));
    setEditingId(q._id);
    setForm({
      tripType: q.tripType,
      from: q.from,
      to: q.to,
      preferredAirline: q.preferredAirline?._id || "",
      departureDate: q.departureDate.slice(0, 10),
      arrivalDate: q.arrivalDate.slice(0, 10),
      adults: q.passengerCount.adults,
      children: q.passengerCount.children,
      infants: q.passengerCount.infants,
      status: q.status,
      price: q.price,
      notes: q.notes
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async id => {
    const body = {
      tripType: form.tripType,
      from: form.from,
      to: form.to,
      preferredAirline: form.preferredAirline || null,
      departureDate: form.departureDate,
      arrivalDate: form.arrivalDate,
      passengerCount: { adults: form.adults, children: form.children, infants: form.infants },
      status: form.status,
      price: form.price,
      notes: form.notes
    };
    const res = await fetch(`/api/quote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const updated = await res.json();
    setQuotes(qs => qs.map(q => q._id === id ? updated : q));
    setEditingId(null);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Really delete this quote?")) return;
    await fetch(`/api/quote/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setQuotes(qs => qs.filter(q => q._id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="quotes-page-admin">
        <h1>Get‑a‑Quote Requests</h1>
        <div className="tiles">
          {quotes.map(q => (
            <div key={q._id} className="quote-tile">
              <div className="tile-header">
                <button className="expander" onClick={() => toggle(q._id)}>
                  {expanded[q._id] ? "▲" : "▼"}
                </button>
                <div className="info">
                  <div className="name">{q.customerName}</div>
                  <div className="email">{q.email}</div>
                  <div className="dates">{new Date(q.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="actions">
                  <img
                    src="/icons/edit.svg"
                    alt="edit"
                    className="edit-icon"
                    onClick={e => startEdit(q, e)}
                  />
                  <button className="delete-btn" onClick={e => handleDelete(q._id, e)}>
                    Delete
                  </button>
                  <div
                    className="status-pill"
                    style={{ background: STATUS_COLORS[q.status] }}
                  >
                    {q.status}
                  </div>
                </div>
              </div>

              {expanded[q._id] && (
                <div className="tile-body">
                  <div className="row"><strong>Trip:</strong> {q.tripType}</div>
                  <div className="row"><strong>Route:</strong> {q.from} → {q.to}</div>
                  <div className="row"><strong>Airline:</strong> {q.preferredAirline?.shortName || "Any"}</div>
                  <div className="row"><strong>Dates:</strong> {new Date(q.departureDate).toLocaleDateString()} – {new Date(q.arrivalDate).toLocaleDateString()}</div>
                  <div className="row"><strong>Passengers:</strong> {q.passengerCount.adults} Adults , {q.passengerCount.children} Children, {q.passengerCount.infants} Infants</div>
                  <div className="row"><strong>Contact:</strong> {q.contactPhone || "—"}</div>
                  <div className="row"><strong>Details:</strong> {q.extraDetails || "—"}</div>

                  {editingId === q._id ? (
                    <div className="edit-form">
                      <label>Trip Type
                        <select value={form.tripType} onChange={e => setForm(f => ({ ...f, tripType: e.target.value }))}>
                          <option value="one-way">one‑way</option>
                          <option value="round‑trip">round‑trip</option>
                        </select>
                      </label>
                      <label>From<input value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} /></label>
                      <label>To<input value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} /></label>
                      <label>Airline
                        <select
                          value={form.preferredAirline}
                          onChange={e => setForm(f => ({ ...f, preferredAirline: e.target.value }))}
                        >
                          <option value="">Any</option>
                          {airlines.map(a => (
                            <option key={a._id} value={a._id}>{a.shortName}</option>
                          ))}
                        </select>
                      </label>
                      <label>Dep Date<input type="date" value={form.departureDate}
                        onChange={e => setForm(f => ({ ...f, departureDate: e.target.value }))} /></label>
                      <label>Arr Date<input type="date" value={form.arrivalDate}
                        onChange={e => setForm(f => ({ ...f, arrivalDate: e.target.value }))} /></label>
                      <label>Adults<input type="number" min="1" value={form.adults}
                        onChange={e => setForm(f => ({ ...f, adults: +e.target.value }))} /></label>
                      <label>Children<input type="number" min="0" value={form.children}
                        onChange={e => setForm(f => ({ ...f, children: +e.target.value }))} /></label>
                      <label>Infants<input type="number" min="0" value={form.infants}
                        onChange={e => setForm(f => ({ ...f, infants: +e.target.value }))} /></label>
                      <label>Status
                        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                          {Object.keys(STATUS_COLORS).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <label>Price<input type="number" min="0" value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} /></label>
                      <label>Notes<input value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></label>
                      <div className="edit-buttons">
                        <button onClick={() => saveEdit(q._id)}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="row"><strong>Price:</strong> ${q.price} &nbsp; <strong>Notes:</strong> {q.notes || "—"}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuotesPage;
