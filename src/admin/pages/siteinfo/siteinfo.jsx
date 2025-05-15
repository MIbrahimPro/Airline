import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import "./siteinfo.scss";
import { useNavigate } from 'react-router-dom';

const SiteInfoPage = () => {
  const [info, setInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const token = getToken();

  const navigate = useNavigate();

  const handleNavigateFAQ = () => {
    navigate('/admin/FAQ');
  };

  const handleNavigatePrivacy = () => {
    navigate('/admin/privacy');
  };

  const handlePaylater = () => {
    navigate('/admin/lateradmin');
  };

  


  useEffect(() => {
    fetch("/api/siteinfo/admin/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setInfo(data); setForm(data); });
  }, [token]);

  const handle = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const save = async () => {
    console.log( JSON.stringify(form))
    await fetch("/api/siteinfo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    setInfo(form);
    setEditing(false);
  };

  if (!info) return <div className="siteinfo-page">Loading…</div>;

  return (
    <><Navbar />
      <div className="siteinfo-page">
        <h1>Site Information</h1>
        <div className="info-block">
          <label>Contact Email
            <input name="contactEmail" value={form.contactEmail} onChange={handle} disabled={!editing} />
          </label>
          <label>Contact Phone
            <input name="contactPhone" value={form.contactPhone} onChange={handle} disabled={!editing} />
          </label>
          <label>Whatsaap Phone
            <input name="contactWA" value={form.contactWA} onChange={handle} disabled={!editing} />
          </label>
          <label>Address Text
            <textarea name="addressText" value={form.addressText} onChange={handle} disabled={!editing} />
          </label>
          <label>Map Embed Code
            <textarea name="mapEmbedCode" value={form.mapEmbedCode} onChange={handle} disabled={!editing} />
          </label>
          <label>About Short
            <textarea name="aboutInfo" value={form.aboutInfo} onChange={handle} disabled={!editing} />
          </label>
          <label>About Long
            <textarea name="aboutUsLong" value={form.aboutUsLong} onChange={handle} disabled={!editing} />
          </label>
        </div>
        <div className="buttons">
          {editing
            ? <>
              <button onClick={save}>Save All</button>
              <button onClick={() => { setForm(info); setEditing(false); }}>Cancel</button>
            </>
            : <button onClick={() => setEditing(true)}>Edit Site Info</button>
          }
        </div>
        <div className="buttons">
          <button onClick={handleNavigateFAQ}>EDIT FAQ</button>
          <button onClick={handleNavigatePrivacy}>EDIT Privacy Policy</button>
          <button onClick={handlePaylater}>EDIT Paylater</button>
        </div>
      </div>
    </>
  );
};

export default SiteInfoPage;
