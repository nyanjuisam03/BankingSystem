import React from 'react';

const Card = ({ title, description, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        p-6 
        rounded-lg 
        shadow-md 
        bg-white 
        cursor-pointer 
        hover:shadow-lg 
        transition-shadow 
        ${className}
      `}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );

};

export default Card