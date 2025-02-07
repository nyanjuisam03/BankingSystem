import React, { useState,useEffect } from 'react';
import { MdCheckCircle, MdError, MdArrowForward, MdArrowBack } from 'react-icons/md';
import useServiceTicket from '../../../store/serviceTicketStore';

function RequistionSupplier() {
    const { tickets, fetchAllTickets, updateServiceTicketStatus } = useServiceTicket();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
  
    useEffect(() => {
        fetchAllTickets();
      }, []); 
    
    // Filter only requisition tickets
    const requisitionTickets = tickets?.filter(ticket => 
      ticket.ticket_type?.toLowerCase() === 'requisition' && 
      ticket.status !== 'resolved'
    ) || [];
  
    const handleTicketSelect = (ticket) => {
      setSelectedTicket(ticket);
      setCurrentStep(2);
    };
  
    const handleResolveTicket = async () => {
      if (!selectedTicket) return;
  
      const result = await updateServiceTicketStatus(selectedTicket.ticket_id, 'resolved');
      
      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Ticket resolved successfully!'
        });
        await fetchAllTickets();
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Failed to resolve ticket'
        });
      }
    };
  
    const handleBack = () => {
      setCurrentStep(1);
      setSelectedTicket(null);
      setStatus({ type: '', message: '' });
    };

  return (
    <div className="w-full max-w-7xl bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          {currentStep === 1 ? 'Step 1: Select Requisition Ticket' : 'Step 2: Resolve Ticket'}
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status Alert */}
        {status.message && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.type === 'success' ? (
              <MdCheckCircle className="h-4 w-4" />
            ) : (
              <MdError className="h-4 w-4" />
            )}
            <p>{status.message}</p>
          </div>
        )}

        {/* Step 1: Ticket Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {requisitionTickets.length === 0 ? (
              <p className="text-gray-500">No pending requisition tickets found.</p>
            ) : (
              requisitionTickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors duration-200"
                  onClick={() => handleTicketSelect(ticket)}
                >
                  <div>
                    <h3 className="font-medium">Ticket #{ticket.ticket_id}</h3>
                    <p className="text-sm text-gray-600">{ticket.description}</p>
                    <span className="text-xs text-gray-500">Status: {ticket.status}</span>
                  </div>
                  <MdArrowForward className="h-5 w-5 text-gray-400" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Step 2: Ticket Resolution */}
        {currentStep === 2 && selectedTicket && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium">Selected Ticket #{selectedTicket.ticket_id}</h3>
              <p className="text-sm text-gray-600 mt-2">{selectedTicket.description}</p>
              <p className="text-sm text-gray-500 mt-1">Current Status: {selectedTicket.status}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <MdArrowBack className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleResolveTicket}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
              >
                <MdCheckCircle className="h-4 w-4" />
                Resolve Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RequistionSupplier
