import React, { useEffect, useRef, useState } from 'react';
import './airlines.scss';

const airlines = [
  'aegean-airlines',
  'air-albania',
  'air-canada',
  'air-france',
  'air-india',
  'air-mauritius',
  'air-new-zealand',
  'air-serbia',
  'air-transat',
  'akasa-air',
  'asiana-airlines',
  'avianca',
  'azerbaijan-airlines',
  'british-airways',
  'brussels-airlines',
  'cathay-pacific',
  'copa-airlines',
  'eurowings',
  'garuda-indonesia',
  'kenya-airways',
  'klm',
  'lufthansa',
  'malaysia-airlines',
  'oman-air',
  'philippine-airlines',
  'qatar-airways',
  'riyadh-air',
  'ryanair',
  'singapore-airlines',
  'starlux-airlines',
  'swiss',
  'transavia',
  'turkish-airlines',
  'united-airlines',
  'vietnam-airlines',
  'virgin-atlantic',
  'westjet'
];

export default function Airlines() {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const computeItems = () => {
      const container = containerRef.current;
      if (!container) return;

      const gap = 40; 
      const logoWidth = 120;
      const singleSetWidth = airlines.length * (logoWidth + gap);
      const needed = Math.ceil((container.clientWidth * 2) / singleSetWidth);
      const repeats = Math.max(needed, 2);

      const arr = Array.from({ length: repeats }).flatMap(() => airlines);
      setItems(arr);
    };

    computeItems();
    window.addEventListener('resize', computeItems);
    return () => window.removeEventListener('resize', computeItems);
  }, []);

  // 2) Auto‑scroll loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;
    let frameId;
    const speed = 0.5; 

    const step = () => {
      container.scrollLeft += speed;
      const singleSetWidth = container.scrollWidth / items.length * airlines.length;
      if (container.scrollLeft >= singleSetWidth) {
        container.scrollLeft -= singleSetWidth;
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [items]);

  return (
    <div className="airline-bar-wrapper">
      <div className="airline-bar" ref={containerRef}>
        {items.map((name, idx) => (
          <div className="airline-logo" key={name + '-' + idx}>
            <img
              src={`../airlines/logos/${name}.svg`}
              alt={name.replace(/-/g, ' ')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
