import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import Footer from '../../components/footer/footer';
import './locations.scss';

const continents = [
  { id: 'africa', name: 'Africa', image: '../samples/africa.jpg' },
  { id: 'asia', name: 'Asia', image: '../samples/asia.jpg' },
  { id: 'europe', name: 'Europe', image: '../samples/europe.jpg' },
  { id: 'north-america', name: 'North America', image: '../samples/north-america.jpg' },
  { id: 'south-america', name: 'South America', image: '../samples/south-america.jpg' },
  { id: 'oceania', name: 'Oceania', image: '../samples/oceania.jpg' },
];

const hotDeals = [
  { id: 'paris', name: 'Paris', image: '../samples/paris.jpg', price: '$499' },
  { id: 'tokyo', name: 'Tokyo', image: '../samples/tokyo.jpg', price: '$599' },
  { id: 'new-york', name: 'New York', image: '../samples/new-york.jpg', price: '$399' },
  { id: 'dubai', name: 'Dubai', image: '../samples/dubai.jpg', price: '$449' },
];

export default function LocationsPage() {
const navigate = useNavigate();

  const handleContinentClick = (id) => {
    navigate(`/${id}`);
  };

  const handleHotDealClick = (id) => {
    // For demo purposes, navigating to a search or destination page:
    navigate(`/search?destination=${id}`);
  };

  return (
    <div className="locations-page">
      <Navbar selectedPage="locations" />
      <div className="locations-container">
        {/* Continents Section */}
        <section className="continents-section">
          <h1>Explore by Continent</h1>
          <div className="continents-grid">
            {continents.map((continent) => (
              <div
                key={continent.id}
                className="continent-card"
                onClick={() => handleContinentClick(continent.id)}
              >
                <img src={continent.image} alt={continent.name} />
                <div className="continent-label">{continent.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Deals Section */}
        
      </div>
      <Footer />
    </div>
  );
}
