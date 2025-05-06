// src/admin/pages/Regions.jsx
import React, { useState, useEffect } from "react";
import { getToken } from "../../utils/auth";
import Navbar from "../../components/navbar/adminnavbar";
import { useNavigate } from "react-router-dom";
import "./region.scss";

const RegionsPage = () => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const navigate = useNavigate();
    const token = getToken();


    
    const load = async () => {
        const res = await fetch("/api/region");
        const regs = await res.json();
        // for each region, check if it has countries
        const withFlag = await Promise.all(
            regs.map(async (r) => {
                const cr = await fetch(`/api/country/region/${r._id}`);
                const jr = await cr.json();
                return { ...r, hasCountries: jr.length > 0 };
            })
        );
        setRegions(withFlag);
        setLoading(false);
    };



    useEffect(() => {
        load();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        const res = await fetch("/api/region", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newName }),
        });
        const created = await res.json();
        console.log(created);
        setRegions([{ ...created, hasCountries: false }, ...regions]);
        setNewName("");
        load();
    };

    const startEdit = (r) => {
        setEditingId(r._id);
        setEditingName(r.name);
    };
    const cancelEdit = () => {
        setEditingId(null);
        setEditingName("");
    };
    const saveEdit = async (id) => {
        if (!editingName.trim()) return;
        const res = await fetch(`/api/region/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },


            body: JSON.stringify({ name: editingName }),
        });
        const updated = await res.json();
        load();
        cancelEdit();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this region?")) return;
        await fetch(`/api/region/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        setRegions(regions.filter((r) => r._id !== id));
    };

    const viewCountries = (r) => {
        navigate(`/admin/country?regionId=${r._id}&regionName=${encodeURIComponent(r.name)}`);
    };

    if (loading) return <div className="regions-page">Loading…</div>;

    return (
        <>
            <Navbar />

            <div className="regions-page">
                <h1>Manage Continents</h1>

                <form className="add-form" onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="New continent name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type="submit">Add</button>
                </form>

                <table className="regions-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th style={{ width: "200px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regions.map((r) => (
                            <tr key={r._id}>
                                <td>
                                    {editingId === r._id ? (
                                        <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                                    ) : (
                                        r.name
                                    )}
                                </td>
                                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                <td>{new Date(r.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    {editingId === r._id ? (
                                        <>
                                            <button className="save" onClick={() => saveEdit(r._id)}>Save</button>
                                            <button className="cancel" onClick={cancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="edit" onClick={() => startEdit(r)}>Edit</button>
                                            {r.hasCountries ? (
                                                <button className="view" onClick={() => viewCountries(r)}>View Countries</button>
                                            ) : (
                                                <button className="delete" onClick={() => handleDelete(r._id)}>Delete</button>
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

export default RegionsPage;
