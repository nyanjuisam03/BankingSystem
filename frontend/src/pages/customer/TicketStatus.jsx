import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTicketStore from "../../store/BookingTicketStore";

const TicketStatus = () => {
    const { userId } = useParams();
    const { fetchUserTickets, tickets, isLoading, error } = useTicketStore();
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchUserTickets(userId);
    }, [userId, fetchUserTickets]);

    const ticketData = tickets[userId] || [];
    const totalTickets = ticketData.length;

    // Paginate data
    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalTickets);
    const paginatedTickets = ticketData.slice(startIndex, endIndex);

    const nextPage = () => {
        if (endIndex < totalTickets) setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    if (isLoading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

    return (
        <div className="p-4 bg-white shadow-md rounded-lg my-5">
            <h2 className="text-lg font-semibold mb-2">Ticket Status</h2>
        

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-600 text-white">
                            
                            <th className="p-2">Type</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Appointment Date</th>
                            <th className="p-2">Appointment Time</th>
                            {/* <th className="p-2">Created At</th>
                            <th className="p-2">Updated At</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTickets.length > 0 ? (
                            paginatedTickets.map((ticket) => (
                                <tr key={ticket.ticket_id} className="border-b border-gray-200 even:bg-gray-100 text-center">
                                 
                                    <td className="p-2">{ticket.ticket_type}</td>
                                    <td className="p-2">{ticket.description}</td>
                                    <td className={`p-2 font-semibold ${ticket.status === "CONFIRMED" ? "text-green-600" : "text-red-600"}`}>
                                        {ticket.status}
                                    </td>
                                    <td className="p-2">{new Date(ticket.appointment_date).toLocaleDateString()}</td>
                                    <td className="p-2">{ticket.appointment_time}</td>
                                    {/* <td className="p-2">{new Date(ticket.created_at).toLocaleString()}</td>
                                    <td className="p-2">{new Date(ticket.updated_at).toLocaleString()}</td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No tickets available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex items-center">
                    <span className="mr-2">Rows per page:</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value));
                            setCurrentPage(0); // Reset to first page when changing rows per page
                        }}
                        className="border rounded-md p-1 text-sm"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                </div>
                <span>
                    {startIndex + 1}-{endIndex} of {totalTickets}
                </span>
                <div>
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 0}
                        className={`mr-2 px-3 py-1 rounded-md ${
                            currentPage === 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
                        }`}
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={endIndex >= totalTickets}
                        className={`px-3 py-1 rounded-md ${
                            endIndex >= totalTickets ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white"
                        }`}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketStatus;
