import React from 'react'
import useTicketStore from '../../../../store/BookingTicketStore'
import useNotificationStore from '../../../../store/notificationStore'
import { useSnackbar } from 'notistack';


function ChosingTicketsStepTwo({ ticket, onBack }) {
    const { confirmTicket, completeTicket, isLoading, error } = useTicketStore()
    const { 
      sendTicketStatusChangeNotification,
      getConfirmedTickets,
      loading,
      notificationStatus,
      confirmedTickets
    } = useNotificationStore();
    const { enqueueSnackbar } = useSnackbar();

    const handleStatusUpdate = async (newStatus) => {
      try {
        if (newStatus === 'CONFIRMED') {
          await sendTicketStatusChangeNotification();
          await confirmTicket(ticket.ticket_id) // Use confirmTicket for "CONFIRMED" status
          enqueueSnackbar('Ticket is confirmed ', {
            variant: 'success',
            autoHideDuration: 3000
          });
        } else if (newStatus === 'COMPLETED') {
          await completeTicket(ticket.ticket_id) // Use completeTicket for "COMPLETED" status
          enqueueSnackbar('Ticket is completed ', {
            variant: 'success',
            autoHideDuration: 3000
          });
        } else {
          console.warn('Unsupported status update:', newStatus)
        }
      } catch (err) {
        console.error('Failed to update ticket:', err)
      }
    }

    const appointmentDate = new Date(ticket.appointment_date);
    const now = new Date();
    
    // This will be true if the appointment date has passed
    const isAppointmentPassed = appointmentDate < now;
    

  return (
    <div className="w-full max-w-7xl border rounded shadow-lg p-4 bg-white">
    <header className="mb-4">
      <h2 className="text-2xl font-bold">Handle Ticket #{ticket.ticket_id}</h2>
    </header>
    <main className="space-y-6">
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
       
        <div>
          <p className="font-medium">Current Status</p>
          <p className="capitalize">{ticket.status}</p>
        </div>
        <div className="col-span-2">
          <p className="font-medium">Description</p>
          <p>{ticket.description}</p>
        </div>
       
        <div className="col-span-2">
          <p className="font-medium">Appointment Date</p>
          <p>{new Date(ticket.appointment_date).toLocaleDateString('en-US', {  
    year: 'numeric',  
    month: 'long',  
    day: 'numeric'  
})}</p>
        </div>
        
        <div className="col-span-2">
          <p className="font-medium">Appointment Time</p>
          <p>{ticket.appointment_time}</p>
        </div>
      
        
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 border rounded hover:bg-gray-50"
          onClick={onBack}
        >
          Back
        </button>
        <div className="space-x-2">
        {ticket.status === 'PENDING' && (
  <button
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    onClick={() => handleStatusUpdate('CONFIRMED')}
    disabled={isLoading || isAppointmentPassed}
  >
    Confirm
  </button>
)}
{ticket.status === 'CONFIRMED' && (
  <button
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
    onClick={() => handleStatusUpdate('COMPLETED')}
    disabled={isLoading || isAppointmentPassed}
  >
    Complete
  </button>
)}
{['PENDING', 'CONFIRMED'].includes(ticket.status) && (
  <button
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    onClick={() => console.warn('Cancel functionality not yet implemented')}
    disabled={isLoading || isAppointmentPassed}
  >
    Cancel
  </button>
)}

        </div>
      </div>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </main>
  </div>
  )
}

export default ChosingTicketsStepTwo
