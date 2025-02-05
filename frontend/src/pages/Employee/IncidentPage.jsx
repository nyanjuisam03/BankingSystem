import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useServiceTicket from '../../store/serviceTicketStore';

const incidentSchema = z.object({
   
    description: z.string().min(1, 'Description is required'),
    incident_category: z.string().min(1, 'Category is required'),
    priority: z.enum(['low', 'medium', 'high', 'critical'], { message: 'Invalid priority' }),
    // impact_level: z.enum(['low', 'medium', 'high']),
    resolution_notes: z.string().optional(),
});


function IncidentPage() {

    const { createTicket , error } = useServiceTicket();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(incidentSchema),
    });


    const onSubmit = async (data) => {
        const ticketData = {
           
            ticket_type: 'incident',
            status: 'open',
            created_by: 3, 
            ...data,
        };

        const response = await createTicket(ticketData);
        if (response.success) {
            alert('Requisition submitted successfully');
            reset();
        } else {
            alert(`Error: ${response.error}`);
        }
    };
  return (
    <div className="max-w-7xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
    <h2 className="text-2xl font-bold mb-4">Submit Incident Report</h2>
    {error && <div className="text-red-600 mb-4">{error}</div>}

    <form onSubmit={handleSubmit(onSubmit)}>

    <div className="mb-4">
  <label htmlFor="incident_category" className="block font-medium">
    Incident Category
  </label>
  <select
    id="incident_category"
    {...register("incident_category", { required: "Incident category is required" })}
    className="w-full p-2 border rounded"
    defaultValue=""
  >
    <option value="" disabled>Select an incident category</option>
    <option value="System Downtime">
      System Downtime 
    </option>
    <option value="Security Breach">
      Security Breach 
    </option>
    <option value="Hardware Malfunction">
      Hardware Malfunction 
    </option>
    <option value="Customer Dispute">
      Customer Dispute 
    </option>
    <option value="Facility Maintenance Issue">
      Facility Maintenance Issue 
    </option>
  </select>
  {errors.incident_category && (
    <p className="text-red-500">{errors.incident_category.message}</p>
  )}
</div>
        {/* <div className="mb-4">
            <label htmlFor="title" className="block font-medium">Title</label>
            <input
                id="title"
                type="text"
                className="w-full p-2 border rounded"
                {...register('title')}
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div> */}

        <div className="mb-4">
            <label htmlFor="description" className="block font-medium">Description</label>
            <textarea
                id="description"
                className="w-full p-2 border rounded"
                {...register('description')}
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>


        <div className="mb-3">
                <label className="block font-medium">Priority</label>
                <select {...register('priority')} className="w-full border p-2 rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
                {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
            </div>

       


        {/* <div className="mb-4">
            <label htmlFor="impact_level" className="block font-medium">Impact Level</label>
            <select
                id="impact_level"
                className="w-full p-2 border rounded"
                {...register('impact_level')}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            {errors.impact_level && <p className="text-red-500">{errors.impact_level.message}</p>}
        </div> */}

        <div className="mb-4">
            <label htmlFor="resolution_notes" className="block font-medium">Resolution Notes</label>
            <textarea
                id="resolution_notes"
                className="w-full p-2 border rounded"
                {...register('resolution_notes')}
            />
        </div>

        <div className="mt-6 flex justify-between">
            <button
                type="submit"
                className="bg-gray-500 text-white p-2 rounded"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
        </div>
    </form>
</div>
  )
}

export default IncidentPage
