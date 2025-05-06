import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import './FAQadmin.scss';

const FAQAdmin = () => {
    const [faqs, setFaqs] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [draft, setDraft] = useState({ question: '', answer: '' });
    const navigate = useNavigate();
    const token = getToken();
    const hdr = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        axios
            .get('/api/siteinfo/admin/all', hdr)
            .then(res => setFaqs(res.data.faq || []))
            .catch(console.error);
    }, []);

    const saveAll = updated =>
        axios
            .put('/api/siteinfo', { faq: updated }, hdr)
            .then(() => setFaqs(updated))
            .catch(console.error);

    const onEdit = i => {
        setEditingIndex(i);
        setDraft({ ...faqs[i] });
    };
    const onSave = i => {
        const updated = faqs.map((f, idx) => (idx === i ? draft : f));
        saveAll(updated);
        setEditingIndex(null);
    };
    const onDelete = i => {
        const updated = faqs.filter((_, idx) => idx !== i);
        saveAll(updated);
    };
    const onAdd = () => {
        if (!draft.question.trim() || !draft.answer.trim()) return;
        const updated = [...faqs, draft];
        saveAll(updated);
        setDraft({ question: '', answer: '' });
    };

    return (
        <div className="faq-admin-container">
            <h2>FAQ Management</h2>
            <button className="back-btn" onClick={() => navigate('/admin/siteinfo')}>
                ← Back to Site Info
            </button>

            {faqs.map((faq, i) => (
                <div key={i} className="faqItem">
                    {editingIndex === i ? (
                        <>
                            <input
                                type="text"
                                placeholder="Question"
                                value={draft.question}
                                onChange={e => setDraft(d => ({ ...d, question: e.target.value }))}
                            />
                            <textarea
                                placeholder="Answer"
                                value={draft.answer}
                                onChange={e => setDraft(d => ({ ...d, answer: e.target.value }))}
                            />
                            <div className="actions">
                                <button onClick={() => onSave(i)}>Save</button>
                                <button onClick={() => setEditingIndex(null)}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h4>{faq.question}</h4>
                            <p>{faq.answer}</p>
                            <div className="actions">
                                <button onClick={() => onEdit(i)}>Edit</button>
                                <button onClick={() => onDelete(i)}>Delete</button>
                            </div>
                        </>
                    )}
                </div>
            ))}

            <div className="newFAQ">
                <h3>Add New FAQ</h3>
                <input
                    type="text"
                    placeholder="Question"
                    value={draft.question}
                    onChange={e => setDraft(d => ({ ...d, question: e.target.value }))}
                />
                <textarea
                    placeholder="Answer"
                    value={draft.answer}
                    onChange={e => setDraft(d => ({ ...d, answer: e.target.value }))}
                />
                <button onClick={onAdd}>Add FAQ</button>
            </div>
        </div>
    );
};

export default FAQAdmin;
