import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

import './paylater-admin.scss';

const PayLaterAdmin = () => {
    const [booking, setBooking] = useState({ heading: '', text: '', items: [] });
    const [editingBookingInfo, setEditingBookingInfo] = useState(false);
    const [draftBookingInfo, setDraftBookingInfo] = useState({ heading: '', text: '' });
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [draftEditItem, setDraftEditItem] = useState({  subheading: '', text: '' });
    const [draftNewItem, setDraftNewItem] = useState({  subheading: '', text: '' });
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        const hdr = { headers: { Authorization: `Bearer ${token}` } };
        axios.get('/api/siteinfo/admin/all', hdr)
            .then(res => {
                const fetchedBooking = res.data.booking || { heading: '', text: '', items: [] };
                setBooking(fetchedBooking);
                setDraftBookingInfo({ heading: fetchedBooking.heading, text: fetchedBooking.text });
            })
            .catch(console.error);
    }, [token]);

    const saveBooking = (updatedBooking) => {
        const hdr = { headers: { Authorization: `Bearer ${token}` } };
        axios.put('/api/siteinfo', { booking: updatedBooking }, hdr)
            .then(() => {
                setBooking(updatedBooking);
            })
            .catch(console.error);
    };

    const onEditBookingInfo = () => {
        setDraftBookingInfo({ heading: booking.heading, text: booking.text });
        setEditingBookingInfo(true);
    };

    const onSaveBookingInfo = () => {
        const updatedBooking = { ...booking, heading: draftBookingInfo.heading, text: draftBookingInfo.text };
        saveBooking(updatedBooking);
        setEditingBookingInfo(false);
    };

    const onCancelBookingInfo = () => {
        setEditingBookingInfo(false);
    };

    const onEditItem = (i) => {
        setDraftEditItem({ ...booking.items[i] });
        setEditingItemIndex(i);
    };

    const onSaveItem = (i) => {
        const updatedItems = booking.items.map((item, idx) => idx === i ? draftEditItem : item);
        const updatedBooking = { ...booking, items: updatedItems };
        saveBooking(updatedBooking);
        setEditingItemIndex(null);
    };

    const onCancelItem = () => {
        setEditingItemIndex(null);
    };

    const onDeleteItem = (i) => {
        if (booking.items.length <= 1) return; // Prevent deleting the last item
        const updatedItems = booking.items.filter((_, idx) => idx !== i);
        const updatedBooking = { ...booking, items: updatedItems };
        saveBooking(updatedBooking);
    };

    const onAddItem = () => {
        if (!draftNewItem.subheading.trim() || !draftNewItem.text.trim()) return;
        const updatedItems = [...booking.items, draftNewItem];
        const updatedBooking = { ...booking, items: updatedItems };
        saveBooking(updatedBooking);
        setDraftNewItem({ icon: '', subheading: '', text: '' });
    };

    return (
        <div className="paylater-admin-container">
            <h2>Paylater Management</h2>
            <button className="back-btn" onClick={() => navigate('/admin/siteinfo')}>
                ← Back to Site Info
            </button>

            <div className="paylater-info">
                {editingBookingInfo ? (
                    <>
                        <input
                            type="text"
                            placeholder="Heading"
                            value={draftBookingInfo.heading}
                            onChange={e => setDraftBookingInfo({ ...draftBookingInfo, heading: e.target.value })}
                        />
                        <textarea
                            placeholder="Text"
                            value={draftBookingInfo.text}
                            onChange={e => setDraftBookingInfo({ ...draftBookingInfo, text: e.target.value })}
                        />
                        <div className="actions">
                            <button onClick={onSaveBookingInfo}>Save</button>
                            <button onClick={onCancelBookingInfo}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3>{booking.heading}</h3>
                        <p>{booking.text}</p>
                        <button onClick={onEditBookingInfo}>Edit</button>
                    </>
                )}
            </div>

            {booking.items.map((item, i) => (
                <div key={i} className="paylater-item">
                    {editingItemIndex === i ? (
                        <>
                            <input
                                type="text"
                                placeholder="Subheading"
                                value={draftEditItem.subheading}
                                onChange={e => setDraftEditItem({ ...draftEditItem, subheading: e.target.value })}
                            />
                            <textarea
                                placeholder="Text"
                                value={draftEditItem.text}
                                onChange={e => setDraftEditItem({ ...draftEditItem, text: e.target.value })}
                            />
                            <div className="actions">
                                <button onClick={() => onSaveItem(i)}>Save</button>
                                <button onClick={onCancelItem}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h4>{item.subheading}</h4>
                            <p>{item.text}</p>
                            <div className="actions">
                                <button onClick={() => onEditItem(i)}>Edit</button>
                                {booking.items.length > 1 && (
                                    <button onClick={() => onDeleteItem(i)}>Delete</button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ))}

            <div className="new-item">
                <h3>Add New Item</h3>
                <input
                    type="text"
                    placeholder="Subheading"
                    value={draftNewItem.subheading}
                    onChange={e => setDraftNewItem({ ...draftNewItem, subheading: e.target.value })}
                />
                <textarea
                    placeholder="Text"
                    value={draftNewItem.text}
                    onChange={e => setDraftNewItem({ ...draftNewItem, text: e.target.value })}
                />
                <button onClick={onAddItem}>Add Item</button>
            </div>
        </div>
    );
};

export default PayLaterAdmin;

