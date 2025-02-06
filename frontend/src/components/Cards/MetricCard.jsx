import React from 'react'

const MetricCard = ({ title, value, loading, error }) => {
  if (loading) return (
      <div className="metric-card bg-white p-4 rounded-lg shadow">
          <h3>{title}</h3>
          <div>Loading...</div>
      </div>
  );

  if (error) return (
      <div className="metric-card bg-white p-4 rounded-lg shadow">
          <h3>{title}</h3>
          <div>Error loading data</div>
      </div>
  );

  return (
      <div className="metric-card bg-white p-4 rounded-lg shadow">
          <h3>{title}</h3>
          <div>{value}</div>
      </div>
  );
};


export default MetricCard
