import React from 'react';
import './links.scss';

const Links = ({
  name,
  iconSrc,
  selected = false,
  onClick,
  smaller = false,
  className = '',
  as: Component = 'div', // Default to div if no component is passed
  to, // For react-router-dom Link
  ...props // Capture any additional props (e.g., for Link)
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Component
      className={[
        'link',
        selected ? 'selected' : '',
        smaller ? 'smaller' : '',
        className
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && handleClick()}
      to={to} // Pass to prop for Link component
      {...props}
    >
      {iconSrc && (
        <img src={iconSrc} alt={`${name || 'icon'}`} className="icon" />
      )}
      {name && <p>{name.charAt(0).toUpperCase() + name.slice(1)}</p>}
    </Component>
  );
};

export default Links;