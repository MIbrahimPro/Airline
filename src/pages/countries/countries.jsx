// // RegionLocationsPage.jsx (updated)
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import './countries.scss';


// import Navbar from "../../components/navbar/navbar";
// import Footer from "../../components/footer/footer";

// const RegionLocationsPage = () => {
//   const { regionId } = useParams();
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const response = await axios.get(`/api/location/region/${regionId}`);
//         setLocations(response.data);
//       } catch (err) {
//         console.error('Error fetching locations:', err);
//         setError('Error fetching locations');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocations();
//   }, [regionId]);

//   const handleFlyClick = async (e, locationId) => {
//     e.stopPropagation();
//     try {
//       const { data: airportIds } = await axios.get(
//         `/api/airport/by-location/${locationId}/ids`
//       );
//       if (airportIds.length) {
//         navigate(`/search?to_id=${airportIds[0]}`);
//       }
//     } catch (err) {
//       console.error('Error fetching airport IDs:', err);
//     }
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;
//   if (!locations.length) return <div className="empty">No locations found for this region.</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="region-locations-page">
//         <h1>Destinations Gallery</h1>
//         <div className="horizontal-scroll-gallery">
//           {locations.map((location) => (
//             <div key={location._id} className="location-card">
//               <img
//                 src={location.image}
//                 alt={location.name}
//                 className="location-image"
//               />
//               <div className="location-name">{location.name}</div>
//               <div className="overlay">
//                 {location.country && <p>Country: {location.country.name}</p>}
//                 {location.description && <p>{location.description}</p>}
//                 <button
//                   className="fly-btn"
//                   onClick={(e) => handleFlyClick(e, location._id)}
//                 >
//                   Fly Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </>

//   );
// };

// export default RegionLocationsPage;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './countries.scss';
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

const RegionLocationsPage = () => {
    const { regionId } = useParams();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`/api/location/region/${regionId}`);
                const sortedLocations = response.data.sort((a, b) => a.name.localeCompare(b.name));
                setLocations(sortedLocations);
            } catch (err) {
                console.error('Error fetching locations:', err);
                setError('Error fetching locations');
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, [regionId]);

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
            </div>
            <Footer />
        </>
    );
};

export default RegionLocationsPage;