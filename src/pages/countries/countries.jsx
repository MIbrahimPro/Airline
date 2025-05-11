import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './countries.scss';
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";





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













const RegionLocationsPage = () => {
    const { regionId } = useParams();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pageSize = 24;



    // const fetchLocations = async (page = 1) => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`/api/location/region/${regionId}`, {
    //             params: {
    //                 page,
    //                 size: pageSize
    //             }
    //         });

    //         const { results, currentPage, totalPages } = response.data;

    //         // Sort the results if needed (although backend pagination already handles a set)
    //         const sortedLocations = results.sort((a, b) => a.name.localeCompare(b.name));

    //         setLocations(sortedLocations);
    //         setCurrentPage(currentPage);
    //         setTotalPages(totalPages);
    //     } catch (err) {
    //         console.error('Error fetching locations:', err);
    //         setError('Error fetching locations');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchLocations();
    // }, [regionId, currentPage]);


    const fetchLocations = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/location/region/${regionId}`, {
                params: {
                    page,
                    size: pageSize
                }
            });

            const { results, currentPage, totalPages } = response.data;
            const sortedLocations = results.sort((a, b) => a.name.localeCompare(b.name));

            setLocations(sortedLocations);
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
        } catch (err) {
            console.error('Error fetching locations:', err);
            setError('Error fetching locations');
        } finally {
            setLoading(false);
        }
    }, [regionId, pageSize]);

    useEffect(() => {
        fetchLocations(currentPage);
    }, [fetchLocations, currentPage]);



    const handleFlyClick = async (e, locationId) => {
        e.stopPropagation();
        try {
            const { data } = await axios.get(`/api/location/firstairport/${locationId}`);
            if (data.hasAirport) {
                navigate(`/search?to_id=${data.firstAirportId}`);
            } else {
                navigate(`/search`);
            }
        } catch (err) {
            console.error('Error fetching airport data:', err);
            navigate(`/search`);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!locations.length) return <div className="empty">No locations found for this region.</div>;

    return (
        <>
            <Navbar />
            <div className="region-locations-page">
                <h1>Destinations Gallery</h1>
                <div className="grid">
                    {locations.map((location) => (
                        <div key={location._id} className="location-card">
                            <div className="image-wrapper">
                                <img src={location.image} alt={location.name} className="image" />
                            </div>
                            <div className="content">
                                <div className="name">
                                    {location.isPopular && <span className="popular">★</span>}
                                    {location.name}
                                </div>
                                <div className="country">{location.country.name}</div>
                                <div className="description">{location.description}</div>
                                <button className="fly-btn" onClick={(e) => handleFlyClick(e, location._id)}>Fly Now</button>
                            </div>

                        </div>
                    ))}
                </div>
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
            <Footer />
        </>
    );
};

export default RegionLocationsPage;