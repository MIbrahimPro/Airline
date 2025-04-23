import React, { useEffect, useRef, useState } from 'react';
import './airlines.scss';

const airlines = [
  'aegean-airlines',
  'air-albania',
  'air-canada',
  'british-airways',
  'qatar-airways',
  'riyadh-air',
  'ryanair'
];

export default function Airlines() {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);

  // 1) Compute how many repeats we need so contentWidth ≥ 2×containerWidth
  useEffect(() => {
    const computeItems = () => {
      const container = containerRef.current;
      if (!container) return;

      const gap = 40; // px, match your CSS
      const logoWidth = 120; // px, match your CSS
      const singleSetWidth = airlines.length * (logoWidth + gap);
      const needed = Math.ceil((container.clientWidth * 2) / singleSetWidth);
      // at least 2 repeats:
      const repeats = Math.max(needed, 2);

      // flatten into repeated array
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
    const speed = 0.5; // px/frame

    const step = () => {
      container.scrollLeft += speed;
      // when we've scrolled one "set", reset
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
              src={`../airlines/${name}.svg`}
              alt={name.replace(/-/g, ' ')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
