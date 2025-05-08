// import React, { useState, useEffect } from "react";
// import Navbar from "../../components/navbar/adminnavbar";
// import { getToken } from "../../utils/auth";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./airports.scss";

// const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
//     return (
//         <div className="pagination">
//             <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
//                 Previous
//             </button>
//             <p className='active'>
//                 {currentPage} of {totalPages}
//             </p>
//             <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//                 Next
//             </button>
//         </div>
//     );
// };

// const AirportsPage = () => {
//     const nav = useNavigate();
//     const { search } = useLocation();
//     const qp = new URLSearchParams(search);
//     const locationId = qp.get("locationId");
//     const initialSearch = qp.get("search") || "";

//     // Controlled states
//     const [airports, setAirports] = useState([]);
//     const [locations, setLocations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [form, setForm] = useState({ name: "", code: "", locationId: "" });
//     const [editingId, setEditingId] = useState(null);
//     const [editData, setEditData] = useState({});
//     const [searchInput, setSearchInput] = useState(initialSearch);
//     const [searchQuery, setSearchQuery] = useState(initialSearch);
//     const [currentPage, setCurrentPage] = useState(parseInt(qp.get("page"), 10) || 1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [usage, setUsage] = useState({});
//     const token = getToken();

//     // Load locations if no locationId filter
//     useEffect(() => {
//         if (!locationId) {
//             fetch("/api/location")
//                 .then(r => r.json())
//                 .then(setLocations)
//                 .catch(console.error);
//         }
//     }, [locationId]);

//     // Fetch airports on mount and when parameters change
//     useEffect(() => {
//         fetchAirports(currentPage);
//     }, [locationId, searchQuery, currentPage]);

//     const fetchAirports = async (page = 1) => {
//         setLoading(true);
//         try {
//             let url;
//             if (searchQuery) {
//                 url = `/api/airport/search-advanced?q=${encodeURIComponent(searchQuery)}&page=${page}&size=50`;
//             } else if (locationId) {
//                 url = `/api/airport/by-location/${locationId}`;
//             } else {
//                 url = `/api/airport?page=${page}&size=50`;
//             }

//             const res = await fetch(url);
//             const data = await res.json();

//             let mapped;
//             if (searchQuery) {
//                 mapped = data.results.map(r => ({
//                     _id: r.airportId,
//                     name: r.airportName,
//                     code: r.airportCode,
//                     location: {
//                         _id: r.locationId,
//                         name: r.locationName,
//                         country: { _id: r.countryId, name: r.countryName, region: { _id: r.regionId, name: r.regionName } }
//                     }
//                 }));
//                 setTotalPages(data.totalPages);
//                 setCurrentPage(data.currentPage);
//             } else if (locationId) {
//                 const pageSize = 50;
//                 const total = Math.ceil(data.length / pageSize);
//                 const current = Math.min(page, total);
//                 const start = (current - 1) * pageSize;
//                 mapped = data.slice(start, start + pageSize);
//                 setTotalPages(total);
//                 setCurrentPage(current);
//             } else {
//                 mapped = data.results;
//                 setTotalPages(data.totalPages);
//                 setCurrentPage(data.currentPage);
//             }

//             setAirports(mapped);

//             // Fetch usage in parallel
//             const usageData = await Promise.all(
//                 mapped.map(a =>
//                     fetch(`/api/airport/${a._id}/usage`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
//                 )
//             );
//             setUsage(Object.fromEntries(usageData.map((u, i) => [mapped[i]._id, u])));
//         } catch (err) {
//             console.error("Error fetching airports:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handlers
//     const handleInput = e => {
//         const { name, value } = e.target;
//         setForm(f => ({ ...f, [name]: value }));
//     };

//     const handleAdd = async e => {
//         e.preventDefault();
//         if (!form.name || !form.code || (!locationId && !form.locationId)) return;
//         await fetch("/api/airport", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ name: form.name, code: form.code, location: locationId || form.locationId })
//         });
//         setForm({ name: "", code: "", locationId: "" });
//         fetchAirports(currentPage);
//     };

//     const startEdit = a => setEditingId(a._id) || setEditData({ name: a.name, code: a.code, locationId: a.location._id });
//     const cancelEdit = () => setEditingId(null);
//     const saveEdit = async id => {
//         await fetch(`/api/airport/${id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//             body: JSON.stringify({ name: editData.name, code: editData.code, location: editData.locationId })
//         });
//         fetchAirports(currentPage);
//         cancelEdit();
//     };

//     const handleDelete = async id => {
//         if (!window.confirm("Delete this airport?")) return;
//         await fetch(`/api/airport/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//         fetchAirports(currentPage);
//     };

//     // Search form handler updates state and URL
//     const handleSearch = e => {
//         e.preventDefault();
//         setSearchQuery(searchInput);
//         nav(`?${locationId ? `locationId=${locationId}&` : ""}search=${encodeURIComponent(searchInput)}&page=1`, { replace: true });
//     };

//     const handlePageChange = newPage => {
//         setCurrentPage(newPage);
//         nav(`?${locationId ? `locationId=${locationId}&` : ""}search=${encodeURIComponent(searchQuery)}&page=${newPage}`, { replace: true });
//     };

//     if (loading) return <div className="airports-page">Loading…</div>;

//     return (
//         <>
//             <Navbar />
//             <div className="airports-page">
//                 <h1>Manage Airports {locationId ? `in location` : ""}</h1>

//                 <form className="add-form" onSubmit={handleAdd}>
//                     <input name="name" placeholder="Airport name" value={form.name} onChange={handleInput} />
//                     <input name="code" placeholder="CODE" maxLength={3} value={form.code} onChange={handleInput} />
//                     {!locationId && (
//                         <select name="locationId" value={form.locationId} onChange={handleInput}>
//                             <option value="">Select location</option>
//                             {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
//                         </select>
//                     )}
//                     <button type="submit">Add Airport</button>
//                 </form>

//                 <hr />

//                 <form onSubmit={handleSearch} className="searchform">
//                     <input
//                         name="searchInput"
//                         placeholder="Search airports"
//                         value={searchInput}
//                         onChange={e => setSearchInput(e.target.value)}
//                     />
//                     <button type="submit">Search</button>
//                 </form>

//                 <table className="airports-table">
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Code</th>
//                             {!locationId && <th>Location</th>}
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {airports.map(a => (
//                             <tr key={a._id}>
//                                 {editingId === a._id ? (
//                                     <>
//                                         <td>
//                                             <input
//                                                 value={editData.name}
//                                                 onChange={e => setEditData({ ...editData, name: e.target.value })}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 value={editData.code}
//                                                 onChange={e => setEditData({ ...editData, code: e.target.value })}
//                                             />
//                                         </td>
//                                         {!locationId && (
//                                             <td>
//                                                 <select
//                                                     value={editData.locationId}
//                                                     onChange={e => setEditData({ ...editData, locationId: e.target.value })}
//                                                 >
//                                                     {locations.map(l => (
//                                                         <option key={l._id} value={l._id}>{l.name}</option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                         )}
//                                     </>
//                                 ) : (
//                                     <>
//                                         <td>{a.name}</td>
//                                         <td>{a.code}</td>
//                                         {!locationId && <td>{a.location.name}</td>}
//                                     </>
//                                 )}
//                                 <td>
//                                     {editingId === a._id ? (
//                                         <>
//                                             <button onClick={() => saveEdit(a._id)}>Save</button>
//                                             <button onClick={cancelEdit}>Cancel</button>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <button onClick={() => startEdit(a)}>Edit</button>
//                                             {usage[a._id] && !usage[a._id].usedInFlights && (
//                                                 <button onClick={() => handleDelete(a._id)}>Delete</button>
//                                             )}
//                                         </>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <PaginationControls
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                 />
//             </div>
//         </>
//     );
// };

// export default AirportsPage;




import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./airports.scss"
import Navbar from "../../components/navbar/adminnavbar";
import { getToken } from "../../utils/auth";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <p className='active'>
                {currentPage} of {totalPages}
            </p>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};


const AirportsPage = () => {
    const nav = useNavigate();
    const { search } = useLocation();
    const qp = new URLSearchParams(search);
    const locationId = qp.get("locationId");
    const initialSearch = qp.get("search") || "";

    const [airports, setAirports] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", code: "", locationId: "" });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [searchInput, setSearchInput] = useState(initialSearch);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(parseInt(qp.get("page"), 10) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [usage, setUsage] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const token = getToken();

    useEffect(() => {
        if (!locationId) {
            axios.get("/api/location").then(res => setLocations(res.data)).catch(console.error);
        }
    }, [locationId]);

    useEffect(() => {
        fetchAirports(currentPage);
    }, [locationId, searchQuery, currentPage]);

    const fetchAirports = async (page = 1) => {
        setLoading(true);
        let url;
        try {
            if (searchQuery) url = `/api/airport/search-advanced?q=${encodeURIComponent(searchQuery)}&page=${page}&size=50`;
            else if (locationId) url = `/api/airport/by-location/${locationId}`;
            else url = `/api/airport?page=${page}&size=50`;

            const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            let mapped = [];

            if (searchQuery) {
                mapped = data.results.map(r => ({
                    _id: r.airportId,
                    name: r.airportName,
                    code: r.airportCode,
                    location: { _id: r.locationId, name: r.locationName }
                }));
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else if (locationId) {
                const size = 50;
                const total = Math.ceil(data.length / size);
                const curr = Math.min(page, total);
                mapped = data.slice((curr - 1) * size, (curr - 1) * size + size);
                setTotalPages(total);
                setCurrentPage(curr);
            } else {
                mapped = data.results;
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            }

            setAirports(mapped);
            const usageData = await Promise.all(
                mapped.map(a => axios.get(`/api/airport/${a._id}/usage`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data))
            );
            setUsage(Object.fromEntries(usageData.map((u, i) => [mapped[i]._id, u])));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleInput = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleAdd = async e => {
        e.preventDefault();
        setErrorMsg("");
        try {
            await axios.post(
                "/api/airport",
                { name: form.name, code: form.code, location: locationId || form.locationId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setForm({ name: "", code: "", locationId: "" });
            fetchAirports(currentPage);
        } catch (err) {
            setErrorMsg(err.response.data.error);
            // console.error(err);
        }
    };

    const startEdit = a => {
        setErrorMsg("");
        setEditingId(a._id);
        setEditData({ name: a.name, code: a.code, locationId: a.location._id });
    };

    const cancelEdit = () => setEditingId(null);

    const saveEdit = async id => {
        setErrorMsg("");
        try {
            await axios.put(
                `/api/airport/${id}`,
                { name: editData.name, code: editData.code, location: editData.locationId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAirports(currentPage);
            cancelEdit();
        } catch (err) {
            setErrorMsg(err.response.data.error);
            // console.error(err);
        }
    };

const handleDelete = async id => {
    if (!window.confirm("Delete this airport?")) return;
    await axios.delete(`/api/airport/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchAirports(currentPage);
};

const handleSearch = e => {
    e.preventDefault();
    setSearchQuery(searchInput);
    nav(`?${locationId ? `locationId=${locationId}&` : ""}search=${encodeURIComponent(searchInput)}&page=1`, { replace: true });
};

const handlePageChange = newPage => {
    setCurrentPage(newPage);
    nav(`?${locationId ? `locationId=${locationId}&` : ""}search=${encodeURIComponent(searchQuery)}&page=${newPage}`, { replace: true });
};

if (loading) return <div className="airports-page">Loading…</div>;

return (
    <>
        <Navbar />
        <div className="airports-page">
            <h1>Manage Airports {locationId ? `in location` : ""}</h1>
            <form className="add-form" onSubmit={handleAdd}>
                <input name="name" placeholder="Airport name" value={form.name} onChange={handleInput} />
                <input name="code" placeholder="CODE" maxLength={3} value={form.code} onChange={handleInput} />
                {!locationId && (
                    <select name="locationId" value={form.locationId} onChange={handleInput}>
                        <option value="">Select location</option>
                        {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                    </select>
                )}
                <button type="submit">Add Airport</button>
            </form>

            <hr />

            {errorMsg && <div className="error">{errorMsg}</div>}

            <hr />

            <form onSubmit={handleSearch} className="searchform">
                <input
                    name="searchInput"
                    placeholder="Search airports"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            <table className="airports-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        {!locationId && <th>Location</th>}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {airports.map(a => (
                        <tr key={a._id}>
                            {editingId === a._id ? (
                                <>
                                    <td>
                                        <input
                                            value={editData.name}
                                            onChange={e => setEditData({ ...editData, name: e.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={editData.code}
                                            onChange={e => setEditData({ ...editData, code: e.target.value })}
                                        />
                                    </td>
                                    {!locationId && (
                                        <td>
                                            <select
                                                value={editData.locationId}
                                                onChange={e => setEditData({ ...editData, locationId: e.target.value })}
                                            >
                                                {locations.map(l => (
                                                    <option key={l._id} value={l._id}>{l.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                    )}
                                </>
                            ) : (
                                <>
                                    <td>{a.name}</td>
                                    <td>{a.code}</td>
                                    {!locationId && <td>{a.location.name}</td>}
                                </>
                            )}
                            <td>
                                {editingId === a._id ? (
                                    <>
                                        <button onClick={() => saveEdit(a._id)}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(a)}>Edit</button>
                                        {usage[a._id] && !usage[a._id].usedInFlights && (
                                            <button onClick={() => handleDelete(a._id)}>Delete</button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    </>
);
};


export default AirportsPage;