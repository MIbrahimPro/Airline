import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";
import axios from "axios";
import "./changeemail.scss";

const ChangeEmailPage = () => {
  const [oldEmail, setOldEmail] = useState("");
  const [inputOld, setInputOld] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const token = getToken();

  useEffect(() => {
    axios
      .get("/api/siteinfo/admin/email", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOldEmail(res.data.adminEmail || "");
      })
      .catch(() => {
        setOldEmail("");
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (inputOld !== oldEmail) {
      setMsg("Current email does not match");
      return;
    }
    if (newEmail !== confirm) {
      setMsg("New emails do not match");
      return;
    }

    try {
      await axios.put(
        "/api/siteinfo/admin/email",
        { oldEmail: inputOld, newEmail: newEmail },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg("Email updated successfully");
      setOldEmail(newEmail);
      setInputOld("");
      setNewEmail("");
      setConfirm("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error updating email");
    }
  };

  return (
    <>
      <Navbar />
      <div className="change-email-page">
        <h1>Change Admin Email</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Current Email
            <input
              type="email"
              value={inputOld}
              onChange={(e) => setInputOld(e.target.value)}
              required
            />
          </label>
          <label>
            New Email
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Confirm New Email
            <input
              type="email"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>
          <button type="submit">Change Email</button>
        </form>
        {msg && <p className="message">{msg}</p>}
      </div>
    </>
  );
};

export default ChangeEmailPage;
