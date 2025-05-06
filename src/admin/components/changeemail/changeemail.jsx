import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import "./changeemail.scss";

const ChangeEmailPage = () => {
  const [oldEmail, setOldEmail] = useState("");
  const [inputOld, setInputOld] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const token = getToken();

  // fetch current adminEmail
  useEffect(() => {
    fetch("/api/siteinfo/admin/email", {
      headers:{ Authorization:`Bearer ${token}` }
    })
      .then(r=>r.json())
      .then(j=> setOldEmail(j.adminEmail || ""));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (inputOld !== oldEmail) {
      setMsg("Current email does not match");
      return;
    }
    if (newEmail !== confirm) {
      setMsg("New emails do not match");
      return;
    }
    // update via PUT /api/siteinfo
    const res = await fetch("/api/siteinfo", {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({ adminEmail: newEmail })
    });
    const j = await res.json();
    setMsg(j.adminEmail ? "Email updated" : (j.message||"Error"));
  };

  return (
    <><Navbar/>
    <div className="change-email-page">
      <h1>Change Admin Email</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Current Email
          <input type="email" value={inputOld}
            onChange={e=>setInputOld(e.target.value)} required />
        </label>
        <label>
          New Email
          <input type="email" value={newEmail}
            onChange={e=>setNewEmail(e.target.value)} required />
        </label>
        <label>
          Confirm New
          <input type="email" value={confirm}
            onChange={e=>setConfirm(e.target.value)} required />
        </label>
        <button type="submit">Change Email</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </div>
    </>
  );
};

export default ChangeEmailPage;
