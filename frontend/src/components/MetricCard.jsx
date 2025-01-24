import React from 'react'

const MetricCard = ({ title, value }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };

export default MetricCard
