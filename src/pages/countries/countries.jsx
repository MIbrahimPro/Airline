// RegionLocationsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RegionLocationsPage = () => {
  const { regionId } = useParams();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch locations for the specified region
        const response = await axios.get(`/api/location/region/${regionId}`);
        setLocations(response.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Error fetching locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [regionId]);

  // Group locations by their country name
  const groupedLocations = locations.reduce((acc, location) => {
    // Ensure the nested country object exists
    if (location.country && location.country.name) {
      const countryName = location.country.name;
      if (!acc[countryName]) {
        acc[countryName] = [];
      }
      acc[countryName].push(location);
    }
    return acc;
  }, {});

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!locations.length) return <div>No locations found for this region.</div>;

  return (
    <div className="region-locations-page">
      <h1>Locations Sorted by Country</h1>
      {/* Loop through each country group */}
      {Object.keys(groupedLocations).map(countryName => (
        <div key={countryName} className="country-group">
          <h2>{countryName}</h2>
          <div className="locations-list">
            {groupedLocations[countryName].map(location => (
              <div key={location._id} className="location-card">
                {location.image && (
                  <img
                    src={location.image}
                    alt={location.name}
                    className="location-image"
                  />
                )}
                <h3>{location.name}</h3>
                {/* Optional details */}
                {location.description && <p>{location.description}</p>}
                {location.dealings && <p>Dealings: {location.dealings}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegionLocationsPage;
