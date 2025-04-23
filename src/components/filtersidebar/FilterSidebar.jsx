import React from 'react';
import './FilterSidebar.scss';

const airlines = [
  'aegean-airlines',
  'air-albania',
  'air-canada',
  'airbaltic',
  'british-airways',
  'qatar-airways',
  'riyadh-air',
  'ryanair',
];

export default function FilterSidebar() {
  return (
    <div className="filter-sidebar-inner">
      <div className="fs-header">
        <h3>Filter</h3>
        <button className="reset-btn">Reset</button>
      </div>

      <div className="fs-group">
        <h4>Departure Time</h4>
        <div className="time-buttons">
          <button>Morning<br/><small>6:00–12:00</small></button>
          <button>Noon<br/><small>12:00–18:00</small></button>
          <button>Evening<br/><small>18:00–23:59</small></button>
          <button>Night<br/><small>00:00–6:00</small></button>
        </div>
      </div>

      <div className="fs-group">
        <h4>Price</h4>
        <input type="range" min="0" max="100" />
        <div className="price-inputs">
          <input type="number" placeholder="Min price" />
          <input type="number" placeholder="Max price" />
        </div>
      </div>

      <div className="fs-group">
        <h4>Stops</h4>
        <label><input type="checkbox" /> Direct</label>
        <label><input type="checkbox" /> 1 Stop</label>
        <label><input type="checkbox" /> 2+ Stops</label>
      </div>

      <div className="fs-group">
        <h4>Airlines</h4>
        {airlines.map((a) => (
          <label key={a}>
            <input type="checkbox" />
            {a.replace(/-/g, ' ')}
          </label>
        ))}
      </div>
    </div>
  );
}
