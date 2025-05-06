import React, { useState } from "react";
import { getToken } from "../../utils/auth";
import Navbar from "../../components/navbar/adminnavbar";
import "./changepassword.scss";

const ChangePasswordPage = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const token = getToken();

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPass !== confirm) {
      setMsg("New passwords do not match");
      return;
    }
    const res = await fetch("/api/siteinfo/password", {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({ oldPassword:oldPass, newPassword:newPass })
    });
    const j = await res.json();
    setMsg(j.message || j.error || "Unexpected response");
  };

  return (
    <><Navbar/>
    <div className="change-password-page">
      <h1>Change Admin Password</h1>
      <form onSubmit={handleSubmit}>
        <label>Current Password<input type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)} required/></label>
        <label>New Password<input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} required/></label>
        <label>Confirm New<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required/></label>
        <button type="submit">Change Password</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </div>
    </>
  );
};

export default ChangePasswordPage;
