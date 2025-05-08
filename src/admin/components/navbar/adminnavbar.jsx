import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../../utils/auth";
import "./adminnavbar.scss";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        navigate("/admin");
    };

    return (
        <>
            <nav className="admin-navbar">
                <button className="toggle" onClick={() => setOpen(o => !o)}>
                    ☰
                </button>
                <div className="brand">Admin</div>
            </nav>
            {open && <div className="admin-overlay open" onClick={() => setOpen(false)} />}

            {open && 
                <ul className="admin-nav-links open">
                    <li><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li><Link to="/admin/bookings">Bookings</Link></li>
                    <li><Link to="/admin/regions">Regions</Link></li>
                    <li><Link to="/admin/country">Countries</Link></li>
                    <li><Link to="/admin/locations">Locations</Link></li>
                    <li><Link to="/admin/airports">Airports</Link></li>
                    <li><Link to="/admin/airline">Airlines</Link></li>
                    <li><Link to="/admin/siteinfo">Main data</Link></li>
                    <li><Link to="/admin/quotes">Quotes</Link></li>
                    <li><Link to="/admin/flight">Flights</Link></li>
                    <li><Link to="/admin/contact">Contact-us</Link></li>
                    <li><Link to="/admin/changeemail">Email Change</Link></li>
                    <li><Link to="/admin/changepassword">Password Change</Link></li>
                    <li>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            }
        </>
    );
};

export default Navbar;