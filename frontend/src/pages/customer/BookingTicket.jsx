import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useTicketStore from '../../store/BookingTicketStore';
import useUserStore from "../../store/usersStore";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

const ticketSchema = z.object({
    ticketType: z.enum(["Registration Account Issues", "Loan Application Issues"], {
        required_error: "Please select a service type"
    }),
    appointmentDate: z.string().refine((date) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return new Date(date) >= tomorrow;
    }, "Appointment must be at least 1 day in advance"),
    appointmentTime: z.string()
        .refine((time) => time >= "09:00" && time <= "17:00", 
            "Appointments are only available between 9 AM and 5 PM"),
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must not exceed 500 characters"),
});

function BookingTicket() {
  const navigate = useNavigate();
  const { createTicket, error, clearError, isLoading } = useTicketStore();
  const { user } = useUserStore();
  const [submitError, setSubmitError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const {
      register,
      handleSubmit,
      reset,
      formState: { errors }
  } = useForm({
      resolver: zodResolver(ticketSchema),
      defaultValues: {
          ticketType: "",
          appointmentDate: "",
          appointmentTime: "",
          description: ""
      }
  });

  useEffect(() => {
      return () => {
          clearError();
          setSubmitError("");
      };
  }, [clearError]);

  const onSubmit = async (data) => {
    try {
        // Clear both error states at the start
        setSubmitError("");
        clearError(); // Clear the store error

        if (!user || !user.id) {
            setSubmitError("You must be logged in to book a ticket");
            return;
        }

        // Format the data before sending
        const formattedData = {
            userId: user.id,
            ticketType: data.ticketType,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            description: data.description
        };

        console.log('Submitting ticket data:', formattedData);

        const response = await createTicket(formattedData);
        
        // Check if response exists and doesn't contain an error
        if (response && !response.error) {
            // Clear both error states again just to be safe
            setSubmitError("");
            clearError();
            
            enqueueSnackbar('Ticket successfully booked', {
                variant: 'success',
                autoHideDuration: 3000
              });
              
            reset();
            navigate('/tickets');
            return;
        }
        
        // If we get here, there was an issue with the response
        setSubmitError(response?.error?.message || "Failed to create ticket");

    } catch (error) {
        console.error('Detailed booking error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            error: error
        });

        // Handle specific error cases
        if (error.response) {
            // Server responded with an error status
            if (error.response.status === 500) {
                setSubmitError("Server error occurred. Please try again later.");
            } else if (error.response.data?.message) {
                setSubmitError(error.response.data.message);
            } else {
                setSubmitError("Failed to book ticket. Please try again.");
            }
        } else if (error.request) {
            // Request was made but no response received
            setSubmitError("No response from server. Please check your connection.");
        } else {
            // Something happened in setting up the request
            setSubmitError(error.message || "Failed to book ticket");
        }
    }
};

    return (
        <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Book Bank Visit
            </h2>
            
           

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Service Type *</label>
                    <select
                        {...register("ticketType")}
                        className={`w-full p-2 border rounded ${
                            errors.ticketType ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select a service</option>
                        <option value="Registration Account Issues">Registration Account Issues</option>
                        <option value="Loan Application Issues">Loan Application Issues</option>
                        
                    </select>
                    {errors.ticketType && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.ticketType.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Appointment Date *</label>
                    <input
                        type="date"
                        {...register("appointmentDate")}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full p-2 border rounded ${
                            errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.appointmentDate && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.appointmentDate.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Appointment Time *</label>
                    <input
                        type="time"
                        {...register("appointmentTime")}
                        min="09:00"
                        max="17:00"
                        className={`w-full p-2 border rounded ${
                            errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.appointmentTime && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.appointmentTime.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Description *</label>
                    <textarea
                        {...register("description")}
                        rows="4"
                        placeholder="Please describe your reason for visiting..."
                        className={`w-full p-2 border rounded ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded font-bold 
                    border border-blue-600 text-white 
                    ${isLoading 
                        ? 'bg-gray-200 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:border-blue-700 hover:text-white'
                    }`}
                  
                >
                    {isLoading ? 'Booking...' : 'Book Appointment'}
                </button>
            </form>
        </div>
    );
}

export default BookingTicket;