import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import "./airports.scss";

const AirportsPage = () => {
  const [airports, setAirports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name:"", code:"", locationId:"", isDeparture:true
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const nav = useNavigate();
  const { search } = useLocation();
  const qp = new URLSearchParams(search);
  const locationId = qp.get("locationId");
  const token = getToken();

  useEffect(() => {
    const load = async () => {
      if (!locationId) {
        const r = await fetch("/api/location");
        setLocations(await r.json());
      }
      const url = locationId
        ? `/api/airport/by-location/${locationId}`
        : "/api/airport";
      const res = await fetch(url);
      setAirports(await res.json());
      setLoading(false);
    };
    load();
  }, [locationId]);

  const handleInput = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type==="checkbox"?checked:value }));
  };

  const handleAdd = async e => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim() || (!locationId && !form.locationId)) return;
    const body = {
      name: form.name,
      code: form.code,
      location: locationId || form.locationId,
      isDeparture: form.isDeparture
    };
    const res = await fetch("/api/airport", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const a = await res.json();
    // populate location object for UI
    const loc = locationId
      ? { _id: locationId, name: decodeURIComponent(qp.get("locationName")||"") }
      : locations.find(l=>l._id===body.location);
    setAirports([ {...a, location: loc}, ...airports ]);
    setForm({ name:"", code:"", locationId:"", isDeparture:true });
  };

  const startEdit = a => {
    setEditingId(a._id);
    setEditData({
      name: a.name,
      code: a.code,
      locationId: a.location._id,
      isDeparture: a.isDeparture
    });
  };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async id => {
    const body = {
      name: editData.name,
      code: editData.code,
      location: editData.locationId,
      isDeparture: editData.isDeparture
    };
    const res = await fetch(`/api/airport/${id}`, {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const updated = await res.json();
    updated.location = locations.find(l=>l._id===body.location) || updated.location;
    setAirports(airports.map(a=>a._id===id?updated:a));
    cancelEdit();
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this airport?")) return;
    await fetch(`/api/airport/${id}`, {
      method:"DELETE",
      headers:{ Authorization:`Bearer ${token}` }
    });
    setAirports(airports.filter(a=>a._id!==id));
  };

  if (loading) return <div className="airports-page">Loading…</div>;

  return (
    <><Navbar/>
    <div className="airports-page">
      <h1>Manage Airports {locationId ? `in location` : ""}</h1>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          name="name" placeholder="Airport name"
          value={form.name} onChange={handleInput}
        />
        <input
          name="code" placeholder="CODE" maxLength={3}
          value={form.code} onChange={handleInput}
        />
        {!locationId && (
          <select name="locationId" value={form.locationId} onChange={handleInput}>
            <option value="">Select location</option>
            {locations.map(l=>(
              <option key={l._id} value={l._id}>{l.name}</option>
            ))}
          </select>
        )}
        <label>
          <input
            name="isDeparture" type="checkbox"
            checked={form.isDeparture} onChange={handleInput}
          /> Is departure
        </label>
        <button type="submit">Add Airport</button>
      </form>

      <table className="airports-table">
        <thead>
          <tr>
            <th>Name</th><th>Code</th>
            {!locationId && <th>Location</th>}
            <th>Departure?</th><th>Created</th><th>Updated</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {airports.map(a=>(
            <tr key={a._id}>
              {editingId===a._id ? (
                <>
                  <td><input
                    value={editData.name}
                    onChange={e=>setEditData({...editData,name:e.target.value})}
                  /></td>
                  <td><input
                    value={editData.code}
                    onChange={e=>setEditData({...editData,code:e.target.value})}
                  /></td>
                  {!locationId && (
                    <td>
                      <select
                        value={editData.locationId}
                        onChange={e=>setEditData({...editData,locationId:e.target.value})}
                      >
                        {locations.map(l=>(
                          <option key={l._id} value={l._id}>{l.name}</option>
                        ))}
                      </select>
                    </td>
                  )}
                  <td>
                    <input
                      type="checkbox"
                      checked={editData.isDeparture}
                      onChange={e=>setEditData({...editData,isDeparture:e.target.checked})}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{a.name}</td>
                  <td>{a.code}</td>
                  {!locationId && <td>{a.location.name}</td>}
                  <td>{a.isDeparture?"Yes":""}</td>
                </>
              )}
              <td>{new Date(a.createdAt).toLocaleDateString()}</td>
              <td>{new Date(a.updatedAt).toLocaleDateString()}</td>
              <td>
                {editingId===a._id ? (
                  <>
                    <button onClick={()=>saveEdit(a._id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>startEdit(a)}>Edit</button>
                    <button onClick={()=>handleDelete(a._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default AirportsPage;
