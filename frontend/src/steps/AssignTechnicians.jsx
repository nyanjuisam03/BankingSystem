import React from 'react';
import { TECHNICIANS } from  "../constant/technicians"

 export const AssignTechnician = ({ selectedTicket, onAssign }) => (

    <div className="bg-white rounded-lg shadow p-6 m-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Assign Technician</h2>
      </div>
      <div className="mb-4">
        <p className="mb-2">Selected Ticket: {selectedTicket?.ticket_id}</p>
        <p className="mb-2">Description: {selectedTicket?.description}</p>
        <p className="mb-2">Assigned Technician: {TECHNICIANS[0].name}</p>
      </div>
      <div className="pt-4 border-t">
        <button 
          onClick={onAssign}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Assign and Start Work
        </button>
      </div>
    </div>
  );