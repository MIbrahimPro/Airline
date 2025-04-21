// Links.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './links.scss';





const Links = ({ name, selected }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${name}`); 
  };

  return (
    <div
      className={`link${selected ? ' selected' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && handleClick()}
    >
      <img
        src={`../icons/${name}.svg`}
        alt={`${name} icon`}
        className="icon"
      />
      <p>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
    </div>
  );
};

export default Links;
