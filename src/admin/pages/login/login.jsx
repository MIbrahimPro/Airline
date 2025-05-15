import Navbar from "../../components/navbar/adminnavbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [attempts, setAttempts] = useState(0);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

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
            setAttempts(prev => prev + 1);
            setError(err.message);
        }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!window.confirm("Are you sure you want to reset your password?")) {
            return;
        }


        try {
            const res = await fetch("/api/siteinfo/forgot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });



            const data = await res.json();


            if (!res.ok) {
                throw new Error(data.message || "Password Reset Failed");
            }

            setSuccess(data.message)


        } catch (err) {
            setError(err.message);
        }

    }





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

                    {attempts > 0 && (
                        <p onClick={handleForgot} className="forgot">
                            Forgot Password?
                        </p>
                    )}


                    {success && <p className="success">{success}</p>}
                    <button className="backhome" onClick={() => { navigate("/home"); }}>Back to client Side</button>
                </form>
            </div>
        </>
    );
};

export default AdminLogin;
