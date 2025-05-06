// src/admin/pages/Countries.jsx
import Navbar from "../../components/navbar/adminnavbar";
import React, { useState, useEffect } from "react";
import { getToken } from "../../utils/auth";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import {  } from 'react-router-dom';
import "./country.scss";
import { convertOffsetToTimes } from "framer-motion";

const CountriesPage = () => {
  const [searchParams] = useSearchParams();
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [hasLocations, setHasLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newRegionId, setNewRegionId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const loc = useLocation();
  const nav = useNavigate();
  const regionId = searchParams.get('regionId');
  const token = getToken();





 
  const load = async () => {
    setLoading(true);
    try {
      // Fetch regions for dropdown
      const rr = await fetch("/api/region");
      if (!rr.ok) {
        const message = `An error occurred fetching regions: ${rr.status}`;
        throw new Error(message);
      }
      setRegions(await rr.json());
  
      // Fetch countries
      let cr;
      if (regionId) {
        cr = await fetch(`/api/country/region/${regionId}`);
      } else {
        cr = await fetch(`/api/country`);
      }
  
      if (!cr.ok) {
        const message = `An error occurred fetching countries: ${cr.status}`;
        throw new Error(message);
      }
      const list = await cr.json();
      setCountries(list);
  
      // For each country, check if it has locations
      const flags = {};
      await Promise.all(
        list.map(async (c) => {
          try {
            const r2 = await fetch(`/api/location/country/${c._id}`);
            if (!r2.ok) {
              const message = `An error occurred fetching locations for country ${c.name} (${c._id}): ${r2.status}`;
              console.error(message); // Log the error for individual country fetch, but don't block all
              flags[c._id] = false; // Assume no locations if fetch fails
              return;
            }
            const j2 = await r2.json();
            flags[c._id] = j2.length > 0;
          } catch (error) {
            console.error(`Error fetching locations for country ${c.name} (${c._id}):`, error);
            flags[c._id] = false; // Assume no locations if there's an error
          }
        })
      );
      setHasLocations(flags);
    } catch (error) {
      console.error("Error during data loading:", error);
      // Optionally set an error state to display a message to the user
      // setError(error.message || "An unexpected error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };







  useEffect(() => {
   
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newRegionId) return;
    const body = {
      name: newName,
      region: { id: newRegionId, name: regions.find(r => r._id === newRegionId).name }
    };
    const res = await fetch("/api/country", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const created = await res.json();
    setCountries([created, ...countries]);
    setHasLocations({ ...hasLocations, [created._id]: false });
    setNewName("");
    setNewRegionId("");
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditingData({ name: c.name, regionId: c.region._id });
  };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    console.group(editingData)
    const body = {
      name: editingData.name,
      region: editingData.regionId,
    };
    const res = await fetch(`/api/country/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const updated = await res.json();
    setCountries(countries.map(c => (c._id === id ? updated : c)));
    setEditingId(null);
    load();
  };





  

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this country?")) return;
    await fetch(`/api/country/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setCountries(countries.filter(c => c._id !== id));
  };

  const viewLocations = (c) => {
    nav(`/admin/locations?countryId=${c._id}&countryName=${encodeURIComponent(c.name)}`);
  };

  if (loading) return <div className="countries-page">Loading…</div>;

  return (
    <><Navbar />
      <div className="countries-page">
        <h1>Manage Countries</h1>

        <form className="add-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Country name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <select
            value={newRegionId}
            onChange={e => setNewRegionId(e.target.value)}
          >
            <option value="">Select region</option>
            {regions.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          <button type="submit">Add</button>
        </form>

        <table className="countries-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Created</th>
              <th>Updated</th>
              <th style={{ width: "200px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map(c => (
              <tr key={c._id}>
                <td>
                  {editingId === c._id ? (
                    <input
                      value={editingData.name}
                      onChange={e => setEditingData({ ...editingData, name: e.target.value })}
                    />
                  ) : (
                    c.name
                  )}
                </td>
                <td>{c.region.name}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                <td>
                  {editingId === c._id ? (
                    <>
                      <button className="save" onClick={() => saveEdit(c._id)}>Save</button>
                      <button className="cancel" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="edit" onClick={() => startEdit(c)}>Edit</button>
                      {hasLocations[c._id] ? (
                        <button className="view" onClick={() => viewLocations(c)}>
                          View Locations
                        </button>
                      ) : (
                        <button className="delete" onClick={() => handleDelete(c._id)}>
                          Delete
                        </button>
                      )}
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

export default CountriesPage;
