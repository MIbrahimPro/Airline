import Navbar from "../../components/navbar/adminnavbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './dashboard.scss';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = getToken();
                const response = await axios.get('/api/booking/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnalytics(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch analytics data');
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const stateData = Object.entries(analytics.byState).map(([name, value]) => ({ name, value }));

    const formatMonthYear = (year, month) => {
        const date = new Date(year, month - 1);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    const last12MonthsData = analytics.bookingsLast12Months.map(entry => ({
        ...entry,
        date: formatMonthYear(entry.year, entry.month)
    }));

    const allTimeData = analytics.bookingsAllTime.map(entry => ({
        ...entry,
        date: formatMonthYear(entry.year, entry.month)
    }));

    const colors = {
        lightBlue: '#ADD8E6',
        mediumBlue: '#0000FF',
        darkBlue: '#00008B',
        extra: '#4682B4'
    };

    const pieColors = [colors.lightBlue, colors.mediumBlue, colors.darkBlue, colors.extra];

    return (
        <>
            <Navbar />
            <div className="dashboard-admin">

                <div className='column'>

                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Total Bookings</h3>
                            <p className="stat-value">{analytics.totalBookings}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Upcoming 7-Day Bookings</h3>
                            <p className="stat-value">{analytics.upcoming7Days}</p>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3>Bookings by State</h3>
                        <PieChart width={600} height={400}>
                            <Pie
                                data={stateData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                label={({ name, value }) => `${name}: ${value}`}
                                labelLine={true}
                            >
                                {stateData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>

                </div>
                <div className='column'>

                    <div className="top-flights">
                        <h3>Top 3 Flights</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Airline</th>
                                    <th>Departure</th>
                                    <th>Arrival</th>
                                    <th>Bookings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.topFlights.map(flight => (
                                    <tr key={flight.flightId}>
                                        <td>{flight.airline}</td>
                                        <td>{flight.departure}</td>
                                        <td>{flight.arrival}</td>
                                        <td>{flight.bookingsCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className='column'>

                    <div className="line-chart-container">
                        <h3>Bookings and Departures (Last 12 Months)</h3>
                        <LineChart width={600} height={300} data={last12MonthsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="salesCount" stroke={colors.darkBlue} name="Bookings Created" />
                            <Line type="monotone" dataKey="departingThisMonth" stroke={colors.extra} name="People Departing" />
                        </LineChart>
                    </div>

                </div>
                <div className='column'>

                    <div className="line-chart-container">
                        <h3>Departures (All Time)</h3>
                        <LineChart width={600} height={300} data={allTimeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="departingThisMonth" stroke={colors.extra} name="People Departing" />
                        </LineChart>
                    </div>

                </div>

            </div>
        </>
    );
};

export default Dashboard;