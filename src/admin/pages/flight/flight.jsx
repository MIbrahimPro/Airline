// import React, { useState, useEffect, useRef } from "react";
// import { getToken } from "../../utils/auth";
// import Navbar from "../../components/navbar/adminnavbar";
// import { useNavigate } from "react-router-dom";

// import "./flight.scss";




// const MONTHS = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
// ];

// const FlightsPage = () => {
//     const [airports, setAirports] = useState([]);
//     const [airlines, setAirlines] = useState([]);
//     const nav = useNavigate();


//     const depRef = useRef();
//     const arrRef = useRef();
//     const [depSug, setDepSug] = useState([]);
//     const [arrSug, setArrSug] = useState([]);
//     const [showDepSug, setShowDepSug] = useState(false);
//     const [showArrSug, setShowArrSug] = useState(false);



//     const [filterForm, setFilterForm] = useState({
//         departure: "",
//         arrival: "",
//         airline: ""
//     });
//     const handleFilterChange = e => {
//         const { name, value } = e.target;
//         setFilterForm(f => ({ ...f, [name]: value }));
//     };




//     const handleFilterSubmit = async e => {
//         e.preventDefault();
//         setLoading(true);

//         const params = new URLSearchParams();

//         if (filterForm.departure) params.append("from", filterForm.departure);
//         if (filterForm.arrival) params.append("to", filterForm.arrival);
//         if (filterForm.airline) params.append("airlines", filterForm.airline);
//         params.append("type", "round-trip"); // or "one-way", your choice
//         params.append("page", 1);

//         const res = await fetch(`/api/flight/filter?${params.toString()}`);
//         const json = await res.json();
//         setFlights(json.data);
//         setPagination(json.pagination);
//         setLoading(false);
//     };



//     // departure autocomplete handlers
//     const onDepChange = e => {
//         const v = e.target.value.toUpperCase();
//         setAddForm(f => ({ ...f, departureAirport: { code: v, id: "" } }));
//         fetchSug(v, setDepSug);
//         setShowDepSug(true);
//     };
//     const selectDep = a => {
//         setAddForm(f => ({ ...f, departureAirport: { code: a.airportCode, id: a.airportId } }));
//         console.log(a);
//         setShowDepSug(false);
//     };
//     const hideDepSug = () => setTimeout(() => setShowDepSug(false), 150);


//     // arrival autocomplete handlers
//     const onArrChange = e => {
//         const v = e.target.value.toUpperCase();
//         setAddForm(f => ({ ...f, arrivalAirport: { code: v, id: "" } }));
//         fetchSug(v, setArrSug);
//         setShowArrSug(true);
//     };
//     const selectArr = a => {
//         setAddForm(f => ({ ...f, arrivalAirport: { code: a.airportCode, id: a.airportId } }));
//         console.log(a);
//         setShowArrSug(false);
//     };
//     const hideArrSug = () => setTimeout(() => setShowArrSug(false), 150);







//     // fetch airport suggestions
//     const fetchSug = (q, setter) => {
//         if (!q) return setter([]);
//         fetch(`/api/airport/search-advanced?q=${encodeURIComponent(q)}`)
//             .then(r => r.json())
//             .then(setter);
//     };





//     const [flights, setFlights] = useState([]);
//     const [pagination, setPagination] = useState({ currentPage: 1233, totalPages: 1 });
//     const [loading, setLoading] = useState(true);

//     const [addForm, setAddForm] = useState({
//         departureAirport: { code: "", id: "" },
//         arrivalAirport: { code: "", id: "" },
//         airlineId: "",
//         time: { hours: 0, minutes: 0 },
//         prices: []
//     });


//     const token = getToken();

//     // load airports & airlines & first page
//     useEffect(() => {
//         const loadLists = async () => {
//             const [a1, a2] = await Promise.all([
//                 fetch("/api/airport").then(r => r.json()),
//                 fetch("/api/airline").then(r => r.json())
//             ]);
//             setAirports(a1);
//             setAirlines(a2);
//         };
//         loadLists();
//         fetchPage(1);
//     }, []);

//     // fetch flights page
//     const fetchPage = async (page = 1) => {
//         setLoading(true);
//         const res = await fetch(`/api/flight?page=${page}`);
//         const json = await res.json();
//         setFlights(json.data);
//         setPagination(json.pagination);
//         setLoading(false);
//     };

//     // handle add-form changes
//     const handleAddChange = e => {
//         const { name, value } = e.target;
//         setAddForm(f => ({ ...f, [name]: name === "hours" || name === "minutes" ? Number(value) : value }));
//     };

//     // submit add-form
//     const handleAdd = async e => {
//         e.preventDefault();
//         const body = {
//             departureCode: addForm.departureAirport.code,
//             arrivalCode: addForm.arrivalAirport.code,
//             airlineShortName: addForm.airline

//         };
//         console.log(body)
//         const res = await fetch("/api/flight/search-or-create", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify(body)
//         });
//         const created = await res.json();
//         console.log(created);
//         fetchPage(pagination.currentPage);
//     };




//     const handleDelete = async id => {
//         if (!window.confirm("Delete this flight?")) return;
//         await fetch(`/api/flight/${id}`, {
//             method: "DELETE",
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         fetchPage(pagination.currentPage);
//     };

//     return (
//         <><Navbar />
//             <div className="flights-page-admin">
//                 <h1>Manage Flights</h1>

//                 {/* ── Add Flight Form ───────────────────────────────────────────── */}
//                 <form className="add-flight-form" onSubmit={handleAdd}>
//                     <h2>Add New Flight</h2>


//                     <div className="field">
//                         <label>Departure Airport</label>
//                         <input
//                             ref={depRef}
//                             className={addForm.departureAirport.id ? "selected" : ""}
//                             value={addForm.departureAirport.code}
//                             onChange={onDepChange}
//                             onBlur={hideDepSug}
//                         />
//                         {showDepSug && depSug.length > 0 && (
//                             <ul className="sug-list">
//                                 {depSug.map(a => (
//                                     <li key={a.airportId} onClick={() => selectDep(a)}>
//                                         {`${a.airportName} (${a.airportCode}), ${a.locationName}, ${a.countryName}, ${a.regionName}`}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>



//                     <div className="field">
//                         <label>Arrival Airport</label>
//                         <input
//                             ref={arrRef}
//                             className={addForm.arrivalAirport.id ? "selected" : ""}
//                             value={addForm.arrivalAirport.code}
//                             onChange={onArrChange}
//                             onBlur={hideArrSug}
//                         />
//                         {showArrSug && arrSug.length > 0 && (
//                             <ul className="sug-list">
//                                 {arrSug.map(a => (
//                                     <li key={a.airportId} onClick={() => selectArr(a)}>
//                                         {`${a.airportName} (${a.airportCode}), ${a.locationName}, ${a.countryName}, ${a.regionName}`}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                     <select name="airline" value={addForm.airline} onChange={handleAddChange} required>
//                         <option value="">Select Airline</option>
//                         {airlines.map(al => (
//                             <option key={al._id} value={al._shortName}>{al.shortName}</option>
//                         ))}
//                     </select>
//                     {/* <label>
//                         Duration Hours
//                         <input name="hours" type="number" min="0" value={addForm.hours} onChange={handleAddChange} />
//                     </label>
//                     <label>
//                         Duration Minutes
//                         <input name="minutes" type="number" min="0" max="59" value={addForm.minutes} onChange={handleAddChange} />
//                     </label> */}
//                     <button type="submit">Add Flight</button>
//                 </form>

//                 <form className="flight-filter-form" onSubmit={handleFilterSubmit}>
//                     <h2>Filter Flights</h2>
//                     <div className="field">
//                         <label>Departure Airport</label>
//                         <input
//                             name="departure"
//                             value={filterForm.departure}
//                             onChange={handleFilterChange}
//                             placeholder="e.g. JFK or New York"
//                         />
//                     </div>
//                     <div className="field">
//                         <label>Arrival Airport</label>
//                         <input
//                             name="arrival"
//                             value={filterForm.arrival}
//                             onChange={handleFilterChange}
//                             placeholder="e.g. LAX or Los Angeles"
//                         />
//                     </div>
//                     <div className="field">
//                         <label>Airline</label>
//                         <select name="airline" value={filterForm.airline} onChange={handleFilterChange}>
//                             <option value="">All Airlines</option>
//                             {airlines.map(al => (
//                                 <option key={al._id} value={al.shortName}>{al.shortName}</option>
//                             ))}
//                         </select>
//                     </div>
//                     <button type="submit">Apply Filter</button>
//                 </form>


//                 {/* ── Flight Table & Pagination ───────────────────────────────── */}
//                 {loading ? <p>Loading…</p> : (
//                     <>
//                         <table className="flights-table">
//                             <thead>
//                                 <tr>
//                                     <th>Departure</th>
//                                     <th>Arrival</th>
//                                     <th>Airline</th>
//                                     <th>Time</th>
//                                     <th>Created</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {flights.map(f => (
//                                     <tr key={f._id}>
//                                         <td>{f.departureAirport.code}</td>
//                                         <td>{f.arrivalAirport.code}</td>
//                                         <td>{f.airline.shortName}</td>
//                                         <td>{f.time.hours}h {f.time.minutes}m</td>
//                                         <td>{new Date(f.createdAt).toLocaleDateString()}</td>
//                                         <td>
//                                             <button onClick={() => nav(`/admin/flight/${f._id}`)}>Edit</button>
//                                             <button onClick={() => handleDelete(f._id)}>Delete</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>

//                         <div className="pagination">
//                             <button disabled={pagination.currentPage <= 1}
//                                 onClick={() => fetchPage(pagination.currentPage - 1)}>Prev</button>
//                             <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
//                             <button disabled={pagination.currentPage >= pagination.totalPages}
//                                 onClick={() => fetchPage(pagination.currentPage + 1)}>Next</button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </>
//     );
// };

// export default FlightsPage;






import React, { useState, useEffect, useRef } from "react";
import { getToken } from "../../utils/auth";
import Navbar from "../../components/navbar/adminnavbar";
import { useNavigate } from "react-router-dom";

import "./flight.scss";

const FlightsPage = () => {
    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const nav = useNavigate();

    // Refs for autocomplete
    const depRef = useRef();
    const arrRef = useRef();
    const depfRef = useRef();
    const arrfRef = useRef();

    // Autocomplete state
    const [depSug, setDepSug] = useState([]);
    const [arrSug, setArrSug] = useState([]);
    const [showDepSug, setShowDepSug] = useState(false);
    const [showArrSug, setShowArrSug] = useState(false);
    const [depfSug, setfDepSug] = useState([]);
    const [arrfSug, setfArrSug] = useState([]);
    const [showfDepSug, setShowfDepSug] = useState(false);
    const [showfArrSug, setShowfArrSug] = useState(false);

    // Flights + pagination
    const [flights, setFlights] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    // Add‑form state
    const [addForm, setAddForm] = useState({
        departureAirport: { code: "", id: "" },
        arrivalAirport: { code: "", id: "" },
        airline: ""
    });

    // Filter‑form state
    const [filterForm, setFilterForm] = useState({
        departureAirport: { code: "", id: "" },
        arrivalAirport: { code: "", id: "" },
        airline: ""
    });

    const token = getToken();

    // ── Autocomplete helpers ────────────────────────────────────
    const fetchSug = (q, setter) => {
        if (!q) return setter([]);
        fetch(`/api/airport/search-advanced?q=${encodeURIComponent(q)}`)
            .then(r => r.json())
            .then(setter);
    };

    // Departure autocomplete
    const onDepChange = e => {
        const v = e.target.value.toUpperCase();
        setAddForm(f => ({ ...f, departureAirport: { code: v, id: "" } }));
        fetchSug(v, setDepSug);
        setShowDepSug(true);
    };
    const onDepFocus = () => {
        if (addForm.departureAirport.code) fetchSug(addForm.departureAirport.code, setDepSug);
        setShowDepSug(true);
    };
    const selectDep = a => {
        setAddForm(f => ({ ...f, departureAirport: { code: a.airportCode, id: a.airportId } }));
        setShowDepSug(false);
    };
    const hideDepSug = () => setTimeout(() => setShowDepSug(false), 200);

      // Departure autocomplete
      const onDepfChange = e => {
        const v = e.target.value.toUpperCase();
        setAddForm(f => ({ ...f, departureAirport: { code: v, id: "" } }));
        fetchSug(v, setDepSug);
        setShowDepSug(true);
    };
    const onDepfFocus = () => {
        if (addForm.departureAirport.code) fetchSug(addForm.departureAirport.code, setDepSug);
        setShowDepSug(true);
    };
    const selectfDep = a => {
        setAddForm(f => ({ ...f, departureAirport: { code: a.airportCode, id: a.airportId } }));
        setShowDepSug(false);
    };
    const hideDepfSug = () => setTimeout(() => setShowDepSug(false), 200);

    // Arrival autocomplete
    const onArrChange = e => {
        const v = e.target.value.toUpperCase();
        setAddForm(f => ({ ...f, arrivalAirport: { code: v, id: "" } }));
        fetchSug(v, setArrSug);
        setShowArrSug(true);
    };
    const onArrFocus = () => {
        if (addForm.arrivalAirport.code) fetchSug(addForm.arrivalAirport.code, setArrSug);
        setShowArrSug(true);
    };
    const selectArr = a => {
        setAddForm(f => ({ ...f, arrivalAirport: { code: a.airportCode, id: a.airportId } }));
        setShowArrSug(false);
    };
    const hideArrSug = () => setTimeout(() => setShowArrSug(false), 200);

    // Arrival autocomplete
    const onArrFChange = e => {
        const v = e.target.value.toUpperCase();
        setAddForm(f => ({ ...f, arrivalAirport: { code: v, id: "" } }));
        fetchSug(v, setArrSug);
        setShowArrSug(true);
    };
    const onArrFFocus = () => {
        if (addForm.arrivalAirport.code) fetchSug(addForm.arrivalAirport.code, setArrSug);
        setShowArrSug(true);
    };
    const selectFArr = a => {
        setAddForm(f => ({ ...f, arrivalAirport: { code: a.airportCode, id: a.airportId } }));
        setShowArrSug(false);
    };
    const hideArrFSug = () => setTimeout(() => setShowArrSug(false), 200);

    // ── Load initial data ───────────────────────────────────────
    useEffect(() => {
        const loadLists = async () => {
            const [a1, a2] = await Promise.all([
                fetch("/api/airport").then(r => r.json()),
                fetch("/api/airline").then(r => r.json())
            ]);
            setAirports(a1);
            setAirlines(a2);
        };
        loadLists();
        fetchPage(1);
    }, []);

    // Fetch page of flights
    const fetchPage = async (page = 1) => {
        setLoading(true);
        const res = await fetch(`/api/flight?page=${page}`);
        const json = await res.json();
        setFlights(json.data);
        setPagination(json.pagination);
        setLoading(false);
    };

    // ── Add flight handlers ─────────────────────────────────────
    const handleAddChange = e => {
        const { name, value } = e.target;
        setAddForm(f => ({
            ...f,
            [name]: name === "hours" || name === "minutes" ? Number(value) : value
        }));
    };

    const handleAdd = async e => {
        e.preventDefault();
        const body = {
            departureCode: addForm.departureAirport.code,
            arrivalCode: addForm.arrivalAirport.code,
            airlineShortName: addForm.airline
        };
        await fetch("/api/flight/search-or-create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        fetchPage(pagination.currentPage);
    };

    const handleDelete = async id => {
        if (!window.confirm("Delete this flight?")) return;
        await fetch(`/api/flight/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPage(pagination.currentPage);
    };

    // ── Filter handlers ────────────────────────────────────────
    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilterForm(f => ({ ...f, [name]: value }));
    };

    const handleFilterSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        const params = new URLSearchParams();
        if (filterForm.departure) params.append("from", filterForm.departure);
        if (filterForm.arrival) params.append("to", filterForm.arrival);
        if (filterForm.airline) params.append("airlines", filterForm.airline);
        params.append("type", "round-trip");
        params.append("page", 1);

        const res = await fetch(`/api/flight/filter?${params.toString()}`);
        const json = await res.json();
        setFlights(json.results);
        setPagination({ currentPage: json.currentPage, totalPages: json.totalPages });
        setLoading(false);
    };

    const resetFilter = () => {
        setFilterForm({ departure: "", arrival: "", airline: "" });
        fetchPage(1);
    };

    return (
        <>
            <Navbar />
            <div className="flights-page-admin">
                <h1>Manage Flights</h1>

                {/* ── Add Flight Form ───────────────────────────── */}
                <form className="add-flight-form" onSubmit={handleAdd}>
                    <h2>Add New Flight</h2>

                    <div className="field">
                        <label>Departure Airport</label>
                        <input
                            ref={depRef}
                            className={addForm.departureAirport.id ? "selected" : ""}
                            value={addForm.departureAirport.code}
                            onChange={onDepChange}
                            onFocus={onDepFocus}
                            onBlur={hideDepSug}
                        />
                        {showDepSug && depSug.length > 0 && (
                            <ul className="sug-list">
                                {depSug.map(a => (
                                    <li key={a.airportId} onMouseDown={() => selectDep(a)}>
                                        {`${a.airportName} (${a.airportCode}), ${a.locationName}`}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="field">
                        <label>Arrival Airport</label>
                        <input
                            ref={arrRef}
                            className={addForm.arrivalAirport.id ? "selected" : ""}
                            value={addForm.arrivalAirport.code}
                            onChange={onArrChange}
                            onFocus={onArrFocus}
                            onBlur={hideArrSug}
                        />
                        {showArrSug && arrSug.length > 0 && (
                            <ul className="sug-list">
                                {arrSug.map(a => (
                                    <li key={a.airportId} onMouseDown={() => selectArr(a)}>
                                        {`${a.airportName} (${a.airportCode}), ${a.locationName}`}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <select name="airline" value={addForm.airline} onChange={handleAddChange} required>
                        <option value="">Select Airline</option>
                        {airlines.map(al => (
                            <option key={al._id} value={al._shortName}>
                                {al.shortName}
                            </option>
                        ))}
                    </select>

                    <button type="submit">Add Flight</button>
                </form>

                {/* ── Filter Flights Form ─────────────────────────── */}
                <form className="flight-filter-form" onSubmit={handleFilterSubmit}>
                    <h2>Filter Flights</h2>
                    <div className="field">

                        <label>Departure Airport</label>
                        <input
                            name="departure"
                            value={filterForm.departure}
                            onChange={handleFilterChange}
                            placeholder="Code or name"
                        />
                        {showDepSug && depSug.length > 0 && (
                            <ul className="sug-list">
                                {depSug.map(a => (
                                    <li key={a.airportId} onClick={() => selectDep(a)}>
                                        {`${a.airportName} (${a.airportCode}), ${a.locationName}, ${a.countryName}, ${a.regionName}`}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className="field">

                        <label>Arrival Airport</label>
                        <input
                            ref={arrfRef}
                            className={filterForm.arrivalAirport.id ? "selected" : ""}
                            value={filterForm.arrivalAirport.code}
                            onChange={onArrFChange}
                            onBlur={hideArrFSug}
                            name="arrival"
                            placeholder="Code or name"
                        />
                        {showfArrSug && arrfSug.length > 0 && (
                            <ul className="sug-list">
                                {arrfSug.map(a => (
                                    <li key={a.airportId} onClick={() => selectArr(a)}>
                                        {`${a.airportName} (${a.airportCode}), ${a.locationName}, ${a.countryName}, ${a.regionName}`}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className="field">
                        <label>Airline</label>
                        <select name="airline" value={filterForm.airline} onChange={handleFilterChange}>
                            <option value="">All Airlines</option>
                            {airlines.map(al => (
                                <option key={al._id} value={al._shortName}>
                                    {al.shortName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">Apply Filter</button>
                    <button type="button" className="reset-btn" onClick={resetFilter}>
                        Reset
                    </button>
                </form>

                {/* ── Flights Table & Pagination ──────────────────── */}
                {loading ? (
                    <p>Loading…</p>
                ) : (
                    <>
                        <table className="flights-table">
                            <thead>
                                <tr>
                                    <th>Departure</th>
                                    <th>Arrival</th>
                                    <th>Airline</th>
                                    <th>Time</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map(f => (
                                    <tr key={f.flightId || f._id}>
                                        <td>{f.depAirportCode || f.departureAirport.code}</td>
                                        <td>{f.arrAirportCode || f.arrivalAirport.code}</td>
                                        <td>{f.airlineName || f.airline.shortName}</td>
                                        <td>{f.flightTime || `${f.time.hours}h ${f.time.minutes}m`}</td>
                                        <td>
                                            {f.departureDate
                                                ? `${f.departureDate.year}-${f.departureDate.month
                                                    .toString()
                                                    .padStart(2, "0")}-${f.departureDate.day
                                                        .toString()
                                                        .padStart(2, "0")}`
                                                : new Date(f.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button onClick={() => nav(`/admin/flight/${f.flightId || f._id}`)}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(f.flightId || f._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <button
                                disabled={pagination.currentPage <= 1}
                                onClick={() => fetchPage(pagination.currentPage - 1)}
                            >
                                Prev
                            </button>
                            <span>
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                disabled={pagination.currentPage >= pagination.totalPages}
                                onClick={() => fetchPage(pagination.currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default FlightsPage;
