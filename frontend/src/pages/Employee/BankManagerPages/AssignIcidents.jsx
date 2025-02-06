import React, { useState, useEffect } from 'react';
import { AssignTechnician } from '../../../steps/AssignTechnicians';
import { ResolveIncident } from '../../../steps/ResolveIncident';
import useServiceTicket from '../../../store/serviceTicketStore'
import { SelectIncident } from '../../../steps/SelectIncident';
import { TECHNICIANS } from '../../../constant/technicians';


function AssignIcidents() {

  const { tickets, isLoading, error, fetchAllTickets, updateTicketStatus } = useServiceTicket();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentStep(1);
  };

  const handleAssignTechnician = async () => {
    if (selectedTicket) {
      const result = await updateTicketStatus(
        selectedTicket.ticket_id, 
        'in_progress', 
        TECHNICIANS[0].name
      );
      if (result.success) setCurrentStep(2);
    }
  };

  const handleResolveIncident = async () => {
    if (selectedTicket) {
      const result = await updateTicketStatus(
        selectedTicket.ticket_id, 
        'resolved'
      );
      if (result.success) {
        setCurrentStep(0);
        setSelectedTicket(null);
      }
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <SelectIncident 
            tickets={tickets}
            isLoading={isLoading}
            error={error}
            onSelectTicket={handleSelectTicket}
          />
        );
      case 1:
        return (
          <AssignTechnician 
            selectedTicket={selectedTicket}
            onAssign={handleAssignTechnician}
          />
        );
      case 2:
        return (
          <ResolveIncident 
            selectedTicket={selectedTicket}
            onResolve={handleResolveIncident}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-8xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Bank Incident Management System</h1>
    {renderStep()}
  </div>
  )
}

export default AssignIcidents
