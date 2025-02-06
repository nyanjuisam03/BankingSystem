import React from 'react';

 export const ResolveIncident = ({ selectedTicket, onResolve }) => (
  <div className="bg-white rounded-lg shadow p-6 m-4">
    <div className="mb-4">
      <h2 className="text-xl font-bold">Resolve Incident</h2>
    </div>
    <div className="mb-4">
      <p className="mb-2">Ticket {selectedTicket?.ticket_id} is in progress</p>
      <p className="mb-2">Assigned to: {selectedTicket?.assigned_technician}</p>
    </div>
    <div className="pt-4 border-t">
      <button 
        onClick={onResolve}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Mark as Resolved
      </button>
    </div>
  </div>
);
