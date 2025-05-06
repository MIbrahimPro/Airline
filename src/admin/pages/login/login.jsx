import Navbar from "../../components/navbar/adminnavbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("adminToken", data.token);
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="admin-login">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Admin Login</h2>
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    {error && <p className="error">{error}</p>}
                    <button className="backhome" onClick={()=>{navigate("/home");}}>Back to client Side</button>
                </form>
            </div>
        </>
    );
};

export default AdminLogin;
