import React from 'react'
import { useState,useEffect } from 'react'
import useTicketStore from '../../../../store/BookingTicketStore'

function ChosingTiketsStepOne({ onNext }) {
    const { allTickets, fetchTickets, isLoading } = useTicketStore()

    useEffect(() => {
        fetchTickets()
      }, [fetchTickets])
    
      if (isLoading) return <div className="p-4">Loading tickets...</div>

  return (
    <div className="w-full max-w-2xl border p-6 rounded shadow-lg">
    <div className="mb-4">
      <h2 className="text-2xl font-bold">Select Ticket to Resolve</h2>
    </div>
    <div className="space-y-4">
      {allTickets?.map(ticket => (
        <div 
          key={ticket.id}
          className="p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Ticket #{ticket.ticket_id}</p>
              <p className="text-sm text-gray-600">{ticket.subject}</p>
              <p className="text-sm text-gray-600">
                Created: {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                onNext(ticket)
              }}
            >
              Handle Ticket
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default ChosingTiketsStepOne
