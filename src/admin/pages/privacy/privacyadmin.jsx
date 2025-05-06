import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import './privacyadmin.scss';

const PrivacyAdmin = () => {
  const [sections, setSections] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draftSection, setDraftSection] = useState({ heading: '', text: '', bullets: [] });
  const [newSection, setNewSection] = useState({ heading: '', text: '', bullets: [] });
  const navigate = useNavigate();
  const token = getToken();
  const hdr = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios
      .get('/api/siteinfo/admin/all', hdr)
      .then(res => setSections(res.data.privacyPolicy || []))
      .catch(console.error);
  }, []);

  const saveAll = updated =>
    axios
      .put('/api/siteinfo', { privacyPolicy: updated }, hdr)
      .then(() => setSections(updated))
      .catch(console.error);

  // Edit existing
  const onEdit = i => {
    setEditingIndex(i);
    setDraftSection(JSON.parse(JSON.stringify(sections[i])));
  };
  const onSave = i => {
    const updated = sections.map((sec, idx) => (idx === i ? draftSection : sec));
    saveAll(updated);
    setEditingIndex(null);
  };
  const onDelete = i => {
    const updated = sections.filter((_, idx) => idx !== i);
    saveAll(updated);
  };

  // Bullets in editing
  const onAddBullet = () => {
    setDraftSection(d => ({ ...d, bullets: [...d.bullets, { heading: '', text: '' }] }));
  };
  const onBulletChange = (bIdx, field, value) => {
    const bullets = draftSection.bullets.map((b, idx) =>
      idx === bIdx ? { ...b, [field]: value } : b
    );
    setDraftSection(d => ({ ...d, bullets }));
  };
  const onDeleteBullet = bIdx => {
    setDraftSection(d => ({ ...d, bullets: d.bullets.filter((_, idx) => idx !== bIdx) }));
  };

  // New section + bullets
  const onAddNewBullet = () => {
    setNewSection(s => ({ ...s, bullets: [...s.bullets, { heading: '', text: '' }] }));
  };
  const onNewBulletChange = (bIdx, field, value) => {
    const bullets = newSection.bullets.map((b, idx) =>
      idx === bIdx ? { ...b, [field]: value } : b
    );
    setNewSection(s => ({ ...s, bullets }));
  };
  const onDeleteNewBullet = bIdx => {
    setNewSection(s => ({ ...s, bullets: s.bullets.filter((_, idx) => idx !== bIdx) }));
  };
  const onAddSection = () => {
    if (!newSection.heading.trim() || !newSection.text.trim()) return;
    const updated = [...sections, newSection];
    saveAll(updated);
    setNewSection({ heading: '', text: '', bullets: [] });
  };

  return (
    <div className="container">
      <h2>Privacy Policy Management</h2>
      <button className="back-btn" onClick={() => navigate('/admin/siteinfo')}>
        ← Back to Site Info
      </button>

      {sections.map((sec, i) => (
        <div key={i} className="sectionItem">
          {editingIndex === i ? (
            <>
              <input
                type="text"
                placeholder="Section Heading"
                value={draftSection.heading}
                onChange={e => setDraftSection(d => ({ ...d, heading: e.target.value }))}
              />
              <textarea
                placeholder="Section Text"
                value={draftSection.text}
                onChange={e => setDraftSection(d => ({ ...d, text: e.target.value }))}
              />

              <div className="bullets">
                <h4>Bullets</h4>
                {draftSection.bullets.map((b, bi) => (
                  <div key={bi} className="bulletItem">
                    <input
                      type="text"
                      placeholder="Bullet Heading"
                      value={b.heading}
                      onChange={e => onBulletChange(bi, 'heading', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Bullet Text"
                      value={b.text}
                      onChange={e => onBulletChange(bi, 'text', e.target.value)}
                    />
                    <button onClick={() => onDeleteBullet(bi)}>Delete</button>
                  </div>
                ))}
                <button className="addBullet" onClick={onAddBullet}>+ Add Bullet</button>
              </div>

              <div className="actions">
                <button onClick={() => onSave(i)}>Save</button>
                <button onClick={() => setEditingIndex(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3>{sec.heading}</h3>
              <p>{sec.text}</p>
              {sec.bullets.length > 0 && (
                <ul>
                  {sec.bullets.map((b, bi) => (
                    <li key={bi}>
                      <strong>{b.heading}</strong>: {b.text}
                    </li>
                  ))}
                </ul>
              )}
              <div className="actions">
                <button onClick={() => onEdit(i)}>Edit</button>
                <button onClick={() => onDelete(i)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="newSection">
        <h3>Add New Section</h3>
        <input
          type="text"
          placeholder="Section Heading"
          value={newSection.heading}
          onChange={e => setNewSection(s => ({ ...s, heading: e.target.value }))}
        />
        <textarea
          placeholder="Section Text"
          value={newSection.text}
          onChange={e => setNewSection(s => ({ ...s, text: e.target.value }))}
        />

        <div className="bullets">
          <h4>Bullets (optional)</h4>
          {newSection.bullets.map((b, bi) => (
            <div key={bi} className="bulletItem">
              <input
                type="text"
                placeholder="Bullet Heading"
                value={b.heading}
                onChange={e => onNewBulletChange(bi, 'heading', e.target.value)}
              />
              <input
                type="text"
                placeholder="Bullet Text"
                value={b.text}
                onChange={e => onNewBulletChange(bi, 'text', e.target.value)}
              />
              <button onClick={() => onDeleteNewBullet(bi)}>Delete</button>
            </div>
          ))}
          <button className="addBullet" onClick={onAddNewBullet}>+ Add Bullet</button>
        </div>

        <button className="addSection" onClick={onAddSection}>Add Section</button>
      </div>
    </div>
  );
};

export default PrivacyAdmin;
