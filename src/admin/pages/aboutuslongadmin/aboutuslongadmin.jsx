// src/pages/AboutUsLongAdmin.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "./aboutusadmin.scss";

export default function AboutUsLongAdmin() {
    const [blocks, setBlocks] = useState([]);
    const [editingIdx, setEditingIdx] = useState(null);
    const [draft, setDraft] = useState({ subheading: "", text: "" });
    const [newBlock, setNewBlock] = useState({ subheading: "", text: "" });
    const navigate = useNavigate();
    const token = getToken();
    const hdr = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
        [token]
    );
    // Fetch existing blocks
    useEffect(() => {
        axios
            .get("/api/siteinfo/admin/all", hdr)
            .then((res) => setBlocks(res.data.aboutUsLong || []))
            .catch(console.error);
    }, [token, hdr]);

    // Save all blocks
    const saveAll = (updated) => {
        axios
            .put("/api/siteinfo", { aboutUsLong: updated }, hdr)
            .then(() => setBlocks(updated))
            .catch(console.error);
    };

    // Edit handlers
    const startEdit = (i) => {
        setEditingIdx(i);
        setDraft({ ...blocks[i] });
    };
    const saveEdit = (i) => {
        const updated = blocks.map((blk, idx) => (idx === i ? draft : blk));
        saveAll(updated);
        setEditingIdx(null);
    };
    const deleteBlock = (i) => {
        const updated = blocks.filter((_, idx) => idx !== i);
        saveAll(updated);
    };

    // New block handlers
    const addBlock = () => {
        if (!newBlock.text.trim()) return;
        const updated = [...blocks, newBlock];
        saveAll(updated);
        setNewBlock({ subheading: "", text: "" });
    };

    return (
        <div className="container aboutus-admin">
            <h2>About Us (Detailed) Management</h2>
            <button
                className="back-btn"
                onClick={() => navigate("/admin/siteinfo")}
            >
                ← Back to Site Info
            </button>

            {blocks.map((blk, i) => (
                <div key={i} className="sectionItem">
                    {editingIdx === i ? (
                        <>
                            <input
                                type="text"
                                placeholder="Optional Subheading"
                                value={draft.subheading}
                                onChange={(e) =>
                                    setDraft((d) => ({
                                        ...d,
                                        subheading: e.target.value,
                                    }))
                                }
                            />
                            <textarea
                                placeholder="Block Text"
                                value={draft.text}
                                onChange={(e) =>
                                    setDraft((d) => ({
                                        ...d,
                                        text: e.target.value,
                                    }))
                                }
                            />
                            <div className="actions">
                                <button onClick={() => saveEdit(i)}>
                                    Save
                                </button>
                                <button onClick={() => setEditingIdx(null)}>
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {blk.subheading && <h3>{blk.subheading}</h3>}
                            <p>{blk.text}</p>
                            <div className="actions">
                                <button onClick={() => startEdit(i)}>
                                    Edit
                                </button>
                                <button onClick={() => deleteBlock(i)}>
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}

            <div className="newSection">
                <h3>Add New Block</h3>
                <input
                    type="text"
                    placeholder="Optional Subheading"
                    value={newBlock.subheading}
                    onChange={(e) =>
                        setNewBlock((b) => ({
                            ...b,
                            subheading: e.target.value,
                        }))
                    }
                />
                <textarea
                    placeholder="Block Text"
                    value={newBlock.text}
                    onChange={(e) =>
                        setNewBlock((b) => ({ ...b, text: e.target.value }))
                    }
                />
                <button className="addSection" onClick={addBlock}>
                    Add Block
                </button>
            </div>
        </div>
    );
}
