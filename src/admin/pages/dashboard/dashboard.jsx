// import React, { useEffect, useState } from "react";
// import Navbar from "../../components/navbar/adminnavbar";
// import BookingTile from "../../components/bookingTile/bookingTile";
// import { getToken } from "../../utils/auth";
// import "./dashboard.scss";
// import { Bar } from "react-chartjs-2";
// import "chart.js/auto";



// const Dashboard = () => {
//   const [bookings, setBookings] = buseState([]);
//   const [analytics, setAnalytics] = useState(null);

//   useEffect(() => {
//     const token = getToken();
//     // fetch bookings
//     fetch("/api/booking", { headers:{ Authorization:`Bearer ${token}` }})
//       .then(r=>r.json()).then(setBookings);

//     // fetch analytics
//     fetch("/api/booking/analytics/", { headers:{ Authorization:`Bearer ${token}` }})
//       .then(r=>r.json()).then(setAnalytics);
//   }, []);

//   if (!analytics) return <div>Loading...</div>;

//   const chartData = {
//     labels: Object.keys(analytics.byState),
//     datasets: [{
//       label: "Bookings by State",
//       data: Object.values(analytics.byState)
//     }]
//   };

//   return (
//     <div className="admin-dashboard">
//       <Navbar />
//       <section className="analytics-bar">
//         <div className="stat">
//           <h3>Total Bookings</h3>
//           <p>{analytics.totalBookings}</p>
//         </div>
//         <div className="stat">
//           <h3>Revenue</h3>
//           <p>${analytics.revenue.total.toLocaleString()}</p>
//           <small>Avg: ${analytics.revenue.average.toFixed(2)}</small>
//         </div>
//         <div className="stat chart">
//           <Bar data={chartData} />
//         </div>
//       </section>

//       <section className="bookings-list">
//         {bookings.map(b => (
//           <BookingTile
//             key={b._id}
//             booking={b}
//             onDelete={id => {
//               fetch(`/api/booking/${b._id}`, {
//                 method:"DELETE", headers:{ Authorization:`Bearer ${getToken()}` }
//               }).then(()=> setBookings(bs=>bs.filter(x=>x._id!==id)));
//             }}
//             onUpdate={(id, upd)=> {
//               fetch(`/api/booking/${b._id}`, {
//                 method:"PUT",
//                 headers:{
//                   "Content-Type":"application/json",
//                   Authorization:`Bearer ${getToken()}`
//                 },
//                 body: JSON.stringify(upd)
//               })
//                 .then(r=>r.json())
//                 .then(nb=> setBookings(bs=>bs.map(x=>x._id===id?nb:x)));
//             }}
//           />
//         ))}
//       </section>
//     </div>
//   );
// };

// export default Dashboard;



// import React, { useState, useEffect } from "react";
// import axios from "axios";

// // This import auto-registers the scales, controllers, and elements needed by Chart.js
// import "chart.js/auto";
// import { Line, Bar } from "react-chartjs-2";

// import Navbar from "../../components/navbar/adminnavbar";
// import { getToken } from "../../utils/auth";
// import "./dashboard.scss";

// const Dashboard = () => {
//   const token = getToken();
//   const headers = { Authorization: `Bearer ${token}` };

//   // Analytics data state
//   const [analytics, setAnalytics] = useState(null);
//   // All bookings state
//   const [bookings, setBookings] = useState([]);
//   // Filter values state
//   const [statusFilter, setStatusFilter] = useState("");
//   const [departureFilter, setDepartureFilter] = useState("");
//   const [arrivalFilter, setArrivalFilter] = useState("");

//   // Modal state for editing and deleting
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   // To manage expansion state per booking tile
//   const [expandedTiles, setExpandedTiles] = useState({});

//   // Fetch analytics and bookings data on mount
//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const res = await axios.get("/api/booking/analytics", { headers });
//         setAnalytics(res.data);
//       } catch (err) {
//         console.error("Error fetching analytics:", err);
//       }
//     };

//     const fetchBookings = async () => {
//       try {
//         const res = await axios.get("/api/booking", { headers });
//         setBookings(res.data);
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       }
//     };

//     fetchAnalytics();
//     fetchBookings();
//   }, [headers]);

//   // Extract dropdown options from booking flight data
//   const departureOptions = Array.from(
//     new Set(bookings.map(b => b.flight?.departureAirport?.name || ""))
//   ).filter(Boolean);
//   const arrivalOptions = Array.from(
//     new Set(bookings.map(b => b.flight?.arrivalAirport?.name || ""))
//   ).filter(Boolean);

//   // Filtered bookings
//   const filteredBookings = bookings.filter(booking => {
//     const statusMatch = statusFilter ? booking.state === statusFilter : true;
//     const departureMatch = departureFilter
//       ? booking.flight?.departureAirport?.name === departureFilter
//       : true;
//     const arrivalMatch = arrivalFilter
//       ? booking.flight?.arrivalAirport?.name === arrivalFilter
//       : true;
//     return statusMatch && departureMatch && arrivalMatch;
//   });

//   // Prepare data for the charts (only when analytics data is available)
//   const lineChartData = analytics
//     ? {
//         labels: analytics.bookingsLast12Months.map(
//           ({ year, month }) => `${month}/${year}`
//         ),
//         datasets: [
//           {
//             label: "Sales",
//             data: analytics.bookingsLast12Months.map(d => d.salesCount),
//             fill: false,
//             borderColor: "rgba(75,192,192,1)",
//             tension: 0.1,
//           },
//           {
//             label: "Departures",
//             data: analytics.bookingsLast12Months.map(d => d.departingThisMonth),
//             fill: false,
//             borderColor: "rgba(153,102,255,1)",
//             tension: 0.1,
//           },
//         ],
//       }
//     : null;

//   const barChartData = analytics
//     ? {
//         labels: Object.keys(analytics.byState),
//         datasets: [
//           {
//             label: "Bookings by Status",
//             data: Object.values(analytics.byState),
//             backgroundColor: [
//               "rgba(255,99,132,0.6)",
//               "rgba(54,162,235,0.6)",
//               "rgba(255,206,86,0.6)",
//               "rgba(75,192,192,0.6)",
//             ],
//           },
//         ],
//       }
//     : null;

//   // Handlers for expanding/collapsing booking tiles
//   const toggleTile = bookingId => {
//     setExpandedTiles(prev => ({
//       ...prev,
//       [bookingId]: !prev[bookingId],
//     }));
//   };

//   // Open edit modal with a given booking
//   const openEditModal = booking => {
//     setSelectedBooking(booking);
//     setEditModalOpen(true);
//   };

//   // Save updated booking details
//   const handleEditSave = async e => {
//     e.preventDefault();
//     try {
//       const { _id, ...rest } = selectedBooking;
//       const res = await axios.put(`/api/booking/${_id}`, rest, { headers });
//       // Update the bookings state accordingly
//       setBookings(prev => prev.map(b => (b._id === _id ? res.data : b)));
//       setEditModalOpen(false);
//       setSelectedBooking(null);
//     } catch (err) {
//       console.error("Error saving booking update:", err);
//     }
//   };

//   // Open the delete confirmation modal
//   const openDeleteModal = booking => {
//     setSelectedBooking(booking);
//     setDeleteModalOpen(true);
//   };

//   // Confirm deletion of booking
//   const handleDeleteConfirm = async () => {
//     try {
//       await axios.delete(`/api/booking/${selectedBooking._id}`, { headers });
//       setBookings(prev => prev.filter(b => b._id !== selectedBooking._id));
//       setDeleteModalOpen(false);
//       setSelectedBooking(null);
//     } catch (err) {
//       console.error("Error deleting booking:", err);
//     }
//   };

//   // Render the main component
//   return (
//     <>
//       <Navbar />
//       <div className="dashboard-page-admin">
//         <h1>Booking Dashboard</h1>

//         {/* Top Analytics Bar */}
//         {analytics ? (
//           <div className="analytics-bar">
//             <div className="analytics-item">
//               <h3>Total Bookings</h3>
//               <p>{analytics.totalBookings}</p>
//             </div>
//             <div className="analytics-item">
//               <h3>Upcoming (7 Days)</h3>
//               <p>{analytics.upcoming7Days}</p>
//             </div>
//             {/* Add more analytics items as needed */}
//           </div>
//         ) : (
//           <p>Loading analytics...</p>
//         )}

//         {/* Charts Section */}
//         {analytics ? (
//           <div className="charts-container">
//             {lineChartData && (
//               <div className="chart-item">
//                 <h3>Sales & Departures (Last 12 Months)</h3>
//                 <Line data={lineChartData} key="line-chart" />
//               </div>
//             )}
//             {barChartData && (
//               <div className="chart-item">
//                 <h3>Bookings by Status</h3>
//                 <Bar data={barChartData} key="bar-chart" />
//               </div>
//             )}
//           </div>
//         ) : (
//           <p>Loading chart data...</p>
//         )}

//         {/* Filters */}
//         <div className="filters">
//           <div className="filter">
//             <label>Status:</label>
//             <select
//               value={statusFilter}
//               onChange={e => setStatusFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               <option value="pending">Pending</option>
//               <option value="cancelled">Cancelled</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="in-progress">In Progress</option>
//             </select>
//           </div>
//           <div className="filter">
//             <label>Departure Airport:</label>
//             <select
//               value={departureFilter}
//               onChange={e => setDepartureFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {departureOptions.map(option => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="filter">
//             <label>Arrival Airport:</label>
//             <select
//               value={arrivalFilter}
//               onChange={e => setArrivalFilter(e.target.value)}
//             >
//               <option value="">All</option>
//               {arrivalOptions.map(option => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Booking Tiles */}
//         <div className="tiles-container">
//           {filteredBookings.map(booking => (
//             <div key={booking._id} className="booking-tile">
//               <div className="tile-header">
//                 <h4>{booking.customerName}</h4>
//                 <p>{new Date(booking.departureDate).toLocaleDateString()}</p>
//                 <p>Status: {booking.state}</p>
//                 <button onClick={() => toggleTile(booking._id)}>
//                   {expandedTiles[booking._id] ? "Collapse" : "Expand"}
//                 </button>
//               </div>
//               {expandedTiles[booking._id] && (
//                 <div className="tile-details">
//                   <p>Email: {booking.userEmail}</p>
//                   <p>Phone: {booking.contactPhone}</p>
//                   <p>Contact Preference: {booking.contactPreference}</p>
//                   <p>
//                     People: Adults {booking.peopleCount.adults}, Children{" "}
//                     {booking.peopleCount.children}, Infants{" "}
//                     {booking.peopleCount.infants}
//                   </p>
//                   <p>Initial Price: {booking.initialBookingPrice}</p>
//                   <p>Final Price: {booking.finalPrice}</p>
//                   <p>Extra Details: {booking.extraDetails}</p>
//                   <div className="tile-actions">
//                     <button onClick={() => openEditModal(booking)}>Edit</button>
//                     <button onClick={() => openDeleteModal(booking)}>Delete</button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Edit Modal Popup */}
//         {editModalOpen && selectedBooking && (
//           <div className="modal-overlay">
//             <div className="modal">
//               <h3>Edit Booking</h3>
//               <form onSubmit={handleEditSave}>
//                 <label>Customer Name:</label>
//                 <input
//                   type="text"
//                   value={selectedBooking.customerName}
//                   onChange={e =>
//                     setSelectedBooking({
//                       ...selectedBooking,
//                       customerName: e.target.value,
//                     })
//                   }
//                 />
//                 {/* Additional fields as needed */}
//                 <label>Departure Date:</label>
//                 <input
//                   type="date"
//                   value={new Date(selectedBooking.departureDate)
//                     .toISOString()
//                     .substr(0, 10)}
//                   onChange={e =>
//                     setSelectedBooking({
//                       ...selectedBooking,
//                       departureDate: e.target.value,
//                     })
//                   }
//                 />
//                 <label>Return Date:</label>
//                 <input
//                   type="date"
//                   value={new Date(selectedBooking.returnDate)
//                     .toISOString()
//                     .substr(0, 10)}
//                   onChange={e =>
//                     setSelectedBooking({
//                       ...selectedBooking,
//                       returnDate: e.target.value,
//                     })
//                   }
//                 />
//                 {/* You can add more fields for phone, email, state, etc. */}
//                 <div className="modal-actions">
//                   <button type="submit">Save</button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditModalOpen(false);
//                       setSelectedBooking(null);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {deleteModalOpen && selectedBooking && (
//           <div className="modal-overlay">
//             <div className="modal">
//               <h3>Are you sure you want to delete this booking?</h3>
//               <div className="modal-actions">
//                 <button onClick={handleDeleteConfirm}>Delete</button>
//                 <button
//                   onClick={() => {
//                     setDeleteModalOpen(false);
//                     setSelectedBooking(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import Navbar from '../../components/navbar/adminnavbar';
// import { getToken } from '../../utils/auth';
// import './dashboard.scss';

// const BookingDashboard = () => {
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [airports, setAirports] = useState([]);
//   const [filters, setFilters] = useState({ status: '', departureAirport: '', arrivalAirport: '' });
//   const [expandedBookingId, setExpandedBookingId] = useState(null);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [formData, setFormData] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

//   const token = getToken();
//   const headers = { Authorization: `Bearer ${token}` };

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [analyticsRes, airportsRes, bookingsRes] = await Promise.all([
//           axios.get('/api/booking/analytics', { headers }),
//           axios.get('/api/airport', { headers }),
//           axios.get('/api/booking', { headers })
//         ]);
//         setAnalyticsData(analyticsRes.data);
//         setAirports(airportsRes.data);
//         setBookings(bookingsRes.data);
//         setFilteredBookings(bookingsRes.data);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       }
//     };
//     fetchData();
//   }, []);

//   // Apply filters when bookings or filters change
//   useEffect(() => {
//     let filtered = [...bookings];
//     if (filters.status) {
//       filtered = filtered.filter(b => b.state === filters.status);
//     }
//     if (filters.departureAirport) {
//       filtered = filtered.filter(b => b.flight.departureAirport._id === filters.departureAirport);
//     }
//     if (filters.arrivalAirport) {
//       filtered = filtered.filter(b => b.flight.arrivalAirport._id === filters.arrivalAirport);
//     }
//     setFilteredBookings(filtered);
//   }, [bookings, filters]);

//   // Sync form data with editing booking
//   useEffect(() => {
//     if (editingBooking) {
//       setFormData({ ...editingBooking });
//     }
//   }, [editingBooking]);

//   const handleSaveEdit = async () => {
//     try {
//       await axios.put(`/api/booking/${formData._id}`, formData, { headers });
//       const res = await axios.get('/api/booking', { headers });
//       setBookings(res.data);
//       setEditingBooking(null);
//     } catch (err) {
//       console.error('Error saving booking:', err);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`/api/booking/${showDeleteConfirm}`, { headers });
//       const res = await axios.get('/api/booking', { headers });
//       setBookings(res.data);
//       setShowDeleteConfirm(null);
//     } catch (err) {
//       console.error('Error deleting booking:', err);
//     }
//   };

//   const formatDate = (date) => new Date(date).toISOString().split('T')[0];

//   return (
//     <>
//       <Navbar />
//       <div className="dashboard-page-admin">
//         {/* Analytics Summary */}
//         {analyticsData ? (
//           <div className="analytics-summary">
//             <div className="metric">
//               <h3>Total Bookings</h3>
//               <p>{analyticsData.totalBookings}</p>
//             </div>
//             <div className="metric">
//               <h3>Upcoming 7 Days</h3>
//               <p>{analyticsData.upcoming7Days}</p>
//             </div>
//             <div className="metric">
//               <h3>Pending</h3>
//               <p>{analyticsData.byState.pending || 0}</p>
//             </div>
//             <div className="metric">
//               <h3>Confirmed</h3>
//               <p>{analyticsData.byState.confirmed || 0}</p>
//             </div>
//           </div>
//         ) : (
//           <p>Loading analytics...</p>
//         )}

//         {/* Charts */}
//         {analyticsData && (
//           <div className="charts">
//             <LineChart
//               width={500}
//               height={300}
//               data={analyticsData.bookingsLast12Months}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="month"
//                 tickFormatter={(month) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1]}
//               />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="salesCount" stroke="#8884d8" name="Bookings Created" />
//               <Line type="monotone" dataKey="departingThisMonth" stroke="#82ca9d" name="People Departing" />
//             </LineChart>
//             <BarChart
//               width={400}
//               height={300}
//               data={Object.entries(analyticsData.byState).map(([state, count]) => ({ state, count }))}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="state" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#8884d8" />
//             </BarChart>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="filters">
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//           >
//             <option value="">All Statuses</option>
//             <option value="pending">Pending</option>
//             <option value="cancelled">Cancelled</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="in-progress">In Progress</option>
//           </select>
//           <select
//             value={filters.departureAirport}
//             onChange={(e) => setFilters({ ...filters, departureAirport: e.target.value })}
//           >
//             <option value="">All Departure Airports</option>
//             {airports.map(a => (
//               <option key={a._id} value={a._id}>{`${a.code} - ${a.name}`}</option>
//             ))}
//           </select>
//           <select
//             value={filters.arrivalAirport}
//             onChange={(e) => setFilters({ ...filters, arrivalAirport: e.target.value })}
//           >
//             <option value="">All Arrival Airports</option>
//             {airports.map(a => (
//               <option key={a._id} value={a._id}>{`${a.code} - ${a.name}`}</option>
//             ))}
//           </select>
//         </div>

//         {/* Booking Tiles */}
//         <div className="booking-list">
//           {filteredBookings.length > 0 ? (
//             filteredBookings.map(booking => (
//               <div key={booking._id} className="booking-tile">
//                 <div className="basic-info">
//                   <span>{booking.customerName}</span>
//                   <span>{`${booking.flight.departureAirport.code} → ${booking.flight.arrivalAirport.code}`}</span>
//                   <span>{new Date(booking.departureDate).toLocaleDateString()}</span>
//                   <span>{booking.state}</span>
//                   <button
//                     onClick={() => setExpandedBookingId(expandedBookingId === booking._id ? null : booking._id)}
//                   >
//                     {expandedBookingId === booking._id ? 'Collapse' : 'Expand'}
//                   </button>
//                 </div>
//                 {expandedBookingId === booking._id && (
//                   <div className="details">
//                     <p>Email: {booking.userEmail}</p>
//                     <p>Phone: {booking.contactPhone}</p>
//                     <p>Contact Preference: {booking.contactPreference}</p>
//                     <p>People: Adults {booking.peopleCount.adults}, Children {booking.peopleCount.children}, Infants {booking.peopleCount.infants}</p>
//                     <p>Extra Details: {booking.extraDetails || 'None'}</p>
//                     <p>Return Date: {new Date(booking.returnDate).toLocaleDateString()}</p>
//                     <p>Initial Price: ${booking.initialBookingPrice}</p>
//                     <p>Final Price: ${booking.finalPrice}</p>
//                     <p>Notes: {booking.notes || 'None'}</p>
//                     <button className="edit" onClick={() => setEditingBooking(booking)}>Edit</button>
//                     <button className="delete" onClick={() => setShowDeleteConfirm(booking._id)}>Delete</button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>Loading Bookings</p>
//           )}
//         </div>

//         {/* Edit Modal */}
//         {editingBooking && (
//           <div className="modal">
//             <div className="modal-content">
//               <h2>Edit Booking</h2>
//               <label>Customer Name</label>
//               <input
//                 type="text"
//                 value={formData.customerName}
//                 onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
//               />
//               <label>Email</label>
//               <input
//                 type="email"
//                 value={formData.userEmail}
//                 onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
//               />
//               <label>Phone</label>
//               <input
//                 type="text"
//                 value={formData.contactPhone}
//                 onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
//               />
//               <label>Contact Preference</label>
//               <select
//                 value={formData.contactPreference}
//                 onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
//               >
//                 <option value="call">Call</option>
//                 <option value="whatsapp">WhatsApp</option>
//                 <option value="email">Email</option>
//               </select>
//               <label>People Count</label>
//               <div className="people-count">
//                 <input
//                   type="number"
//                   min="1"
//                   value={formData.peopleCount.adults}
//                   onChange={(e) => setFormData({
//                     ...formData,
//                     peopleCount: { ...formData.peopleCount, adults: parseInt(e.target.value, 10) }
//                   })}
//                   placeholder="Adults"
//                 />
//                 <input
//                   type="number"
//                   min="0"
//                   value={formData.peopleCount.children}
//                   onChange={(e) => setFormData({
//                     ...formData,
//                     peopleCount: { ...formData.peopleCount, children: parseInt(e.target.value, 10) }
//                   })}
//                   placeholder="Children"
//                 />
//                 <input
//                   type="number"
//                   min="0"
//                   value={formData.peopleCount.infants}
//                   onChange={(e) => setFormData({
//                     ...formData,
//                     peopleCount: { ...formData.peopleCount, infants: parseInt(e.target.value, 10) }
//                   })}
//                   placeholder="Infants"
//                 />
//               </div>
//               <label>Extra Details</label>
//               <textarea
//                 value={formData.extraDetails || ''}
//                 onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}
//               />
//               <label>Departure Date</label>
//               <input
//                 type="date"
//                 value={formatDate(formData.departureDate)}
//                 onChange={(e) => setFormData({ ...formData, departureDate: new Date(e.target.value) })}
//               />
//               <label>Return Date</label>
//               <input
//                 type="date"
//                 value={formatDate(formData.returnDate)}
//                 onChange={(e) => setFormData({ ...formData, returnDate: new Date(e.target.value) })}
//               />
//               <label>Initial Price</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={formData.initialBookingPrice}
//                 onChange={(e) => setFormData({ ...formData, initialBookingPrice: parseFloat(e.target.value) })}
//               />
//               <label>Final Price</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 value={formData.finalPrice}
//                 onChange={(e) => setFormData({ ...formData, finalPrice: parseFloat(e.target.value) })}
//               />
//               <label>State</label>
//               <select
//                 value={formData.state}
//                 onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//               >
//                 <option value="pending">Pending</option>
//                 <option value="cancelled">Cancelled</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="in-progress">In Progress</option>
//               </select>
//               <label>Notes</label>
//               <textarea
//                 value={formData.notes || ''}
//                 onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               />
//               <button className="save" onClick={handleSaveEdit}>Save</button>
//               <button className="cancel" onClick={() => setEditingBooking(null)}>Cancel</button>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {showDeleteConfirm && (
//           <div className="modal">
//             <div className="modal-content">
//               <h2>Confirm Deletion</h2>
//               <p>Are you sure you want to delete this booking?</p>
//               <button className="delete" onClick={handleDelete}>Delete</button>
//               <button className="cancel" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };




import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Navbar from '../../components/navbar/adminnavbar';
import { getToken } from '../../utils/auth';
import './dashboard.scss';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const statuses = ['pending', 'cancelled', 'confirmed', 'in-progress'];

function BookingDashboard() {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };

  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [airports, setAirports] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [filters, setFilters] = useState({ status: '', departureAirport: '', arrivalAirport: '' });
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, analyticsRes, airportsRes, airlinesRes] = await Promise.all([
          axios.get('/api/booking', { headers }),
          axios.get('/api/booking/analytics', { headers }),
          axios.get('/api/airport', { headers }),
          axios.get('/api/airline', { headers })
        ]);
        setBookings(bookingsRes.data);
        setAnalytics(analyticsRes.data);
        setAirports(airportsRes.data);
        setAirlines(airlinesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Initialize form data when editing a booking
  useEffect(() => {
    if (editingBooking) {
      setFormData({
        id: editingBooking._id,
        customerName: editingBooking.customerName || '',
        userEmail: editingBooking.userEmail || '',
        contactPhone: editingBooking.contactPhone || '',
        contactPreference: editingBooking.contactPreference || 'email',
        peopleCount: { 
          adults: editingBooking.peopleCount?.adults || 1,
          children: editingBooking.peopleCount?.children || 0,
          infants: editingBooking.peopleCount?.infants || 0
        },
        extraDetails: editingBooking.extraDetails || '',
        departureDate: editingBooking.departureDate ? new Date(editingBooking.departureDate).toISOString().split('T')[0] : '',
        returnDate: editingBooking.returnDate ? new Date(editingBooking.returnDate).toISOString().split('T')[0] : '',
        initialBookingPrice: editingBooking.initialBookingPrice || 0,
        state: editingBooking.state || 'pending',
        finalPrice: editingBooking.finalPrice || 0,
        notes: editingBooking.notes || '',
        departureCode: editingBooking.flight?.departureAirport?.code || '',
        arrivalCode: editingBooking.flight?.arrivalAirport?.code || '',
        airlineShortName: editingBooking.flight?.airline?.shortName || ''
      });
    }
  }, [editingBooking]);

  // Compute filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b =>
      (filters.status === '' || b.state === filters.status) &&
      (filters.departureAirport === '' || b.flight?.departureAirport?._id.toString() === filters.departureAirport) &&
      (filters.arrivalAirport === '' || b.flight?.arrivalAirport?._id.toString() === filters.arrivalAirport)
    );
  }, [bookings, filters]);

  // Prepare chart data
  const lineChartData = useMemo(() => {
    if (!analytics) return [];
    return analytics.bookingsLast12Months.map(m => ({
      month: `${monthNames[m.month - 1]} ${m.year}`,
      sales: m.salesCount,
      departures: m.departingThisMonth
    }));
  }, [analytics]);

  const barChartData = useMemo(() => {
    if (!analytics) return [];
    return Object.entries(analytics.byState || {}).map(([state, count]) => ({ state, count }));
  }, [analytics]);

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        customerName: formData.customerName,
        userEmail: formData.userEmail,
        contactPhone: formData.contactPhone,
        contactPreference: formData.contactPreference,
        peopleCount: formData.peopleCount,
        extraDetails: formData.extraDetails,
        departureDate: new Date(formData.departureDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
        initialBookingPrice: parseFloat(formData.initialBookingPrice),
        state: formData.state,
        finalPrice: parseFloat(formData.finalPrice),
        notes: formData.notes,
        departureCode: formData.departureCode,
        arrivalCode: formData.arrivalCode,
        airlineShortName: formData.airlineShortName
      };
      await axios.put(`/api/booking/${formData.id}`, dataToSend, { headers });
      setEditingBooking(null);
      const res = await axios.get('/api/booking', { headers });
      setBookings(res.data);
    } catch (err) {
      alert('Failed to update booking: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/booking/${deletingBookingId}`, { headers });
      setDeletingBookingId(null);
      const res = await axios.get('/api/booking', { headers });
      setBookings(res.data);
    } catch (err) {
      alert('Failed to delete booking: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('peopleCount.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        peopleCount: { ...formData.peopleCount, [field]: parseInt(value) || 0 }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Custom Modal Component
  const CustomModal = ({ isOpen, onRequestClose, children }) => {
    if (!isOpen) return null;
    return (
      <div className="modal-overlay" onClick={onRequestClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  };

  if (loading) return <div className="dashboard-page-admin"><Navbar /><div className="loading">Loading...</div></div>;
  if (error) return <div className="dashboard-page-admin"><Navbar /><div className="error">{error}</div></div>;

  return (
    <>
      <Navbar />
      <div className="dashboard-page-admin">
        <div className="dashboard-content">
          <div className="analytics-section">
            <div className="summary">
              <div className="summary-item"><h3>Total Bookings</h3><p>{analytics?.totalBookings || 0}</p></div>
              <div className="summary-item"><h3>Pending</h3><p>{analytics?.byState?.pending || 0}</p></div>
              <div className="summary-item"><h3>Confirmed</h3><p>{analytics?.byState?.confirmed || 0}</p></div>
              <div className="summary-item"><h3>In-Progress</h3><p>{analytics?.byState?.['in-progress'] || 0}</p></div>
              <div className="summary-item"><h3>Cancelled</h3><p>{analytics?.byState?.cancelled || 0}</p></div>
              <div className="summary-item"><h3>Upcoming 7 Days</h3><p>{analytics?.upcoming7Days || 0}</p></div>
            </div>
            <div className="charts">
              <div className="chart">
                <h3>Sales and Departures (Last 12 Months)</h3>
                <LineChart width={500} height={300} data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                  <Line type="monotone" dataKey="departures" stroke="#82ca9d" name="Departures" />
                </LineChart>
              </div>
              <div className="chart">
                <h3>Booking Status Distribution</h3>
                <BarChart width={300} height={300} data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Count" />
                </BarChart>
              </div>
            </div>
          </div>
          <div className="filters">
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filters.departureAirport} onChange={e => setFilters({ ...filters, departureAirport: e.target.value })}>
              <option value="">All Departure Airports</option>
              {airports.map(a => <option key={a._id} value={a._id}>{`${a.name} (${a.code})`}</option>)}
            </select>
            <select value={filters.arrivalAirport} onChange={e => setFilters({ ...filters, arrivalAirport: e.target.value })}>
              <option value="">All Arrival Airports</option>
              {airports.map(a => <option key={a._id} value={a._id}>{`${a.name} (${a.code})`}</option>)}
            </select>
          </div>
          <div className="bookings-list">
            {filteredBookings.length === 0 ? (
              <p>No bookings found</p>
            ) : (
              filteredBookings.map(b => (
                <div key={b._id} className="booking-card">
                  <div className="basic-info">
                    <h4>{b.customerName}</h4>
                    <p>Flight: {b.flight?.departureAirport?.code} to {b.flight?.arrivalAirport?.code} with {b.flight?.airline?.shortName}</p>
                    <p>Departure: {new Date(b.departureDate).toLocaleDateString()}</p>
                    <p>Return: {new Date(b.returnDate).toLocaleDateString()}</p>
                    <span className={`state ${b.state}`}>{b.state}</span>
                    <button onClick={() => setExpandedBookingId(expandedBookingId === b._id ? null : b._id)}>
                      {expandedBookingId === b._id ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                  {expandedBookingId === b._id && (
                    <div className="full-info">
                      <p>People: Adults {b.peopleCount?.adults || 0}, Children {b.peopleCount?.children || 0}, Infants {b.peopleCount?.infants || 0}</p>
                      <p>Contact: {b.contactPhone} ({b.contactPreference})</p>
                      <p>Email: {b.userEmail}</p>
                      <p>Extra Details: {b.extraDetails || 'None'}</p>
                      <p>Initial Price: ${b.initialBookingPrice}</p>
                      <p>Final Price: ${b.finalPrice}</p>
                      <p>Notes: {b.notes || 'None'}</p>
                      <button onClick={() => setEditingBooking(b)}>Edit</button>
                      <button onClick={() => setDeletingBookingId(b._id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Modal */}
        <CustomModal isOpen={!!editingBooking} onRequestClose={() => setEditingBooking(null)}>
          {formData && (
            <div className="modal-content">
              <h2>Edit Booking</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Customer Name:</label>
                  <input disabled type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input type="email" name="userEmail" value={formData.userEmail} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Contact Phone:</label>
                  <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Contact Preference:</label>
                  <select name="contactPreference" value={formData.contactPreference} onChange={handleInputChange} required>
                    {['call', 'whatsapp', 'email'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Adults:</label>
                  <input type="number" name="peopleCount.adults" min="1" value={formData.peopleCount.adults} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Children:</label>
                  <input type="number" name="peopleCount.children" min="0" value={formData.peopleCount.children} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Infants:</label>
                  <input type="number" name="peopleCount.infants" min="0" value={formData.peopleCount.infants} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Extra Details:</label>
                  <textarea name="extraDetails" value={formData.extraDetails} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Departure Date:</label>
                  <input type="date" name="departureDate" value={formData.departureDate} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Return Date:</label>
                  <input type="date" name="returnDate" value={formData.returnDate} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Initial Price:</label>
                  <input type="number" name="initialBookingPrice" min="0" step="0.01" value={formData.initialBookingPrice} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Final Price:</label>
                  <input type="number" name="finalPrice" min="0" step="0.01" value={formData.finalPrice} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>State:</label>
                  <select name="state" value={formData.state} onChange={handleInputChange} required>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes:</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Departure Airport Code:</label>
                  <input type="text" name="departureCode" value={formData.departureCode} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Arrival Airport Code:</label>
                  <input type="text" name="arrivalCode" value={formData.arrivalCode} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Airline Short Name:</label>
                  <input type="text" name="airlineShortName" value={formData.airlineShortName} onChange={handleInputChange} required />
                </div>
                <div className="modal-buttons">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingBooking(null)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </CustomModal>

        {/* Delete Confirmation Modal */}
        <CustomModal isOpen={!!deletingBookingId} onRequestClose={() => setDeletingBookingId(null)}>
          <div className="modal-content">
            <h2>Are you sure you want to delete this booking?</h2>
            <div className="modal-buttons">
              <button onClick={handleDelete}>Delete</button>
              <button onClick={() => setDeletingBookingId(null)}>Cancel</button>
            </div>
          </div>
        </CustomModal>
      </div>
    </>
  );
}

export default BookingDashboard;