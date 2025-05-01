import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './imager.scss';

export default function DestinationItem({ dest, activeDest, setActiveDest }) {
  const navigate = useNavigate();

  const handleContainerClick = () => {
    setActiveDest(activeDest === dest._id ? null : dest._id);
  };

  const handleFlyClick = async (e) => {
    e.stopPropagation();
    try {
      const { data: airportIds } = await axios.get(
        `/api/airport/by-location/${dest._id}/ids`
      );
      if (airportIds.length) {
        navigate(`/search?to_id=${airportIds[0]}`);
      }
    } catch (err) {
      console.error('Error fetching airport IDs:', err);
    }
  };

  return (
    <div
      className={`destination-item${activeDest === dest._id ? ' active' : ''}`}
      onClick={handleContainerClick}
    >
      <img className="dest-image" src={dest.image} alt={dest.name} />
      <p className="name">{dest.name}</p>

      <div className="overlay">
        <p className="description">{dest.description}</p>
        <div className="dest-icon" onClick={handleFlyClick}>
          <img src="../icons/fly.svg" alt="Fly Icon" />
        </div>
      </div>
    </div>
  );
}
