import React from 'react';

export const SelectIncident = ({ tickets, isLoading, error, onSelectTicket }) => (
  <div className="bg-white rounded-lg shadow p-6 m-4">
    <div className="mb-4">
      <h2 className="text-xl font-bold">Select Incident</h2>
    </div>
    
    <div>
      {isLoading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border text-left">Ticket ID</th>
              <th className="p-2 border text-left">Description</th>
              <th className="p-2 border text-left">Status</th>
              <th className="p-2 border text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticket_id} className="border-b">
                <td className="p-2 border">{ticket.ticket_id}</td>
                <td className="p-2 border">{ticket.description}</td>
                <td className="p-2 border">{ticket.status}</td>
                <td className="p-2 border">
                  <button 
                    onClick={() => onSelectTicket(ticket)}
                    disabled={ticket.status !== 'open'}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);