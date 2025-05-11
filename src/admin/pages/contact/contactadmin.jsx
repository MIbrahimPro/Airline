

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import "./contactadmin.scss";

const STATUS_COLORS = {
    pending: "#ffc107",
    "in-progress": "#17a2b8",
    responded: "#28a745",
    closed: "#6c757d"
};

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [editingNotes, setEditingNotes] = useState({});
    const [notesValue, setNotesValue] = useState({});
    const [filter, setFilter] = useState("all");
    const token = getToken();



    // const fetchContacts = () => {
    //     fetch('/api/contact', { headers: { Authorization: `Bearer ${token}` } })
    //         .then(r => r.json())
    //         .then(data => setContacts(data))
    //         .catch(error => console.error('Error fetching contacts:', error));
    // };

    // useEffect(() => {
    //     fetchContacts();
    // }, [token]);

    const fetchContacts = useCallback(() => {
        fetch('/api/contact', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => setContacts(data))
            .catch(error => console.error('Error fetching contacts:', error));
    }, [token]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);


    const toggleExpand = id => {
        setExpanded(e => ({ ...e, [id]: !e[id] }));
    };

    const handleStatusChange = (id, newStatus, e) => {
        e.stopPropagation();
        fetch(`/api/contact/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(r => r.json())
            .then(updated => {
                setContacts(cs => cs.map(c => (c._id === id ? updated : c)));
            });
    };

    const startEditNotes = (id, e) => {
        e.stopPropagation();
        setEditingNotes(e2 => ({ ...e2, [id]: true }));
        const contact = contacts.find(c => c._id === id);
        setNotesValue(n => ({ ...n, [id]: contact.extraNotes || "" }));
    };

    const handleDeleteContact = async (id) => {
        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error deleting contact:', errorData);
                return;
            }

            await response.json();
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const startDeleteNotes = (id, e) => {
        e.stopPropagation();
        handleDeleteContact(id);
    };
    const saveNotes = id => {
        fetch(`/api/contact/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ extraNotes: notesValue[id] })
        })
            .then(r => r.json())
            .then(updated => {
                setContacts(cs => cs.map(c => (c._id === id ? updated : c)));
                setEditingNotes(e => ({ ...e, [id]: false }));
            });
    };

    const cancelNotes = id => {
        setEditingNotes(e => ({ ...e, [id]: false }));
    };

    const filtered = contacts.filter(c =>
        filter === "all" ? true : c.status === filter
    );

    return (
        <>
            <Navbar />
            <div className="contacts-page-admin">

                <div className="header-bar">
                    <h1>Contact Us Management</h1>
                    <div className="filter-bar">
                        <label>
                            Filter:
                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                onClick={e => e.stopPropagation()}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In‑Progress</option>
                                <option value="responded">Responded</option>
                                <option value="closed">Closed</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="contact-tiles">
                    {filtered.map(c => (
                        <div key={c._id} className="contact-tile">
                            <div className="tile-header" onClick={() => toggleExpand(c._id)}>
                                <div className="info">
                                    <div className="name">{c.name}</div>
                                    <div className="email">{c.email}</div>
                                    <div className="date">{new Date(c.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="status-wrapper">
                                    <select
                                        className="status-pill"
                                        value={c.status}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => handleStatusChange(c._id, e.target.value, e)}
                                        style={{ background: STATUS_COLORS[c.status] }}
                                    >
                                        {Object.keys(STATUS_COLORS).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {expanded[c._id] && (
                                <div className="tile-body">
                                    <p className="message"><strong>Message:</strong> {c.message}</p>
                                    <div className="notes">
                                        <strong>Extra Notes:</strong>
                                        {editingNotes[c._id] ? (
                                            <>
                                                <textarea
                                                    value={notesValue[c._id]}
                                                    onChange={e =>
                                                        setNotesValue(n => ({ ...n, [c._id]: e.target.value }))
                                                    }
                                                />
                                                <div className="notes-buttons">
                                                    <button onClick={() => saveNotes(c._id)}>Save</button>
                                                    <button onClick={() => cancelNotes(c._id)}>Cancel</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="notes-text">{c.extraNotes || "—"}</span>
                                                <button
                                                    className="notes-edit-btn"
                                                    onClick={e => startEditNotes(c._id, e)}
                                                >
                                                    <img src="/icons/edit.svg" alt="edit" />
                                                </button>
                                                <button
                                                    className="notes-delete-btn"
                                                    onClick={e => startDeleteNotes(c._id, e)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ContactsPage;
