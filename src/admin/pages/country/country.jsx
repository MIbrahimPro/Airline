// src/admin/pages/Countries.jsx
import Navbar from "../../components/navbar/adminnavbar";
import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../../utils/auth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { } from 'react-router-dom';
import "./country.scss";



const CountriesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [hasLocations, setHasLocations] = useState({});
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newRegionId, setNewRegionId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [filterRegionId, setFilterRegionId] = useState(searchParams.get('regionId') || "");
    const navigate = useNavigate();
    const token = getToken();

    // const load = async () => {
    //     setLoading(true);
    //     try {
    //         // Fetch regions for dropdown
    //         const rr = await fetch("/api/region");
    //         if (!rr.ok) {
    //             throw new Error(`An error occurred fetching regions: ${rr.status}`);
    //         }
    //         setRegions(await rr.json());

    //         // Fetch countries
    //         let cr;
    //         if (filterRegionId) {
    //             cr = await fetch(`/api/country/region/${filterRegionId}`);
    //         } else {
    //             cr = await fetch(`/api/country`);
    //         }

    //         if (!cr.ok) {
    //             throw new Error(`An error occurred fetching countries: ${cr.status}`);
    //         }
    //         const list = await cr.json();
    //         setCountries(list);

    //         // Check if each country has locations
    //         const flags = {};
    //         await Promise.all(
    //             list.map(async (c) => {
    //                 try {
    //                     const r2 = await fetch(`/api/location/country/${c._id}`);
    //                     if (!r2.ok) {
    //                         console.error(`Error fetching locations for country ${c.name} (${c._id}): ${r2.status}`);
    //                         flags[c._id] = false;
    //                         return;
    //                     }
    //                     const j2 = await r2.json();
    //                     flags[c._id] = j2.length > 0;
    //                 } catch (error) {
    //                     console.error(`Error fetching locations for country ${c.name} (${c._id}):`, error);
    //                     flags[c._id] = false;
    //                 }
    //             })
    //         );
    //         setHasLocations(flags);
    //     } catch (error) {
    //         console.error("Error during data loading:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     load();
    // }, [filterRegionId]);


    const load = useCallback(async () => {
        setLoading(true);
        try {
            const rr = await fetch("/api/region");
            if (!rr.ok) throw new Error(`An error occurred fetching regions: ${rr.status}`);
            setRegions(await rr.json());

            const cr = await fetch(
                filterRegionId ? `/api/country/region/${filterRegionId}` : `/api/country`
            );
            if (!cr.ok) throw new Error(`An error occurred fetching countries: ${cr.status}`);
            const list = await cr.json();
            setCountries(list);

            const flags = {};
            await Promise.all(
                list.map(async (c) => {
                    try {
                        const r2 = await fetch(`/api/location/country/${c._id}`);
                        flags[c._id] = r2.ok ? (await r2.json()).length > 0 : false;
                    } catch {
                        flags[c._id] = false;
                    }
                })
            );
            setHasLocations(flags);
        } catch (error) {
            console.error("Error during data loading:", error);
        } finally {
            setLoading(false);
        }
    }, [filterRegionId]);

    useEffect(() => {
        load();
    }, [load]);



    const handleFilterChange = (e) => {
        const regionId = e.target.value;
        setFilterRegionId(regionId);
        setSearchParams(regionId ? { regionId } : {});
    };

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
        navigate(`/admin/locations?countryId=${c._id}&countryName=${encodeURIComponent(c.name)}`);
    };

    if (loading) return <div className="countries-page">Loading…</div>;

    return (
        <>
            <Navbar />
            <div className="countries-page">
                <h1>Manage Countries</h1>

                <div className="filter-section">
                    <label>
                        Filter by Region
                        <select value={filterRegionId} onChange={handleFilterChange}>
                            <option value="">All Regions</option>
                            {regions.map(r => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <form className="edit-form" onSubmit={handleAdd}>
                    <label>
                        Country Name *
                        <input
                            type="text"
                            placeholder="Enter country name"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Region *
                        <select
                            value={newRegionId}
                            onChange={e => setNewRegionId(e.target.value)}
                            required
                        >
                            <option value="">Select region</option>
                            {regions.map(r => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </label>
                    <button type="submit" className="confirm-btn">Add Country</button>
                </form>

                <table className="countries-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Region</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Actions</th>
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
                                <td>
                                    {editingId === c._id ? (
                                        <select
                                            value={editingData.regionId}
                                            onChange={e => setEditingData({ ...editingData, regionId: e.target.value })}
                                        >
                                            <option value="">Select region</option>
                                            {regions.map(r => (
                                                <option key={r._id} value={r._id}>{r.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        c.region.name
                                    )}
                                </td>
                                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    {editingId === c._id ? (
                                        <>
                                            <button className="confirm-btn" onClick={() => saveEdit(c._id)}>Save</button>
                                            <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="edit-btn" onClick={() => startEdit(c)}>Edit</button>
                                            {hasLocations[c._id] ? (
                                                <button className="view-btn" onClick={() => viewLocations(c)}>
                                                    View Locations
                                                </button>
                                            ) : (
                                                <button className="delete-btn" onClick={() => handleDelete(c._id)}>
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
