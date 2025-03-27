import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useServiceTicket from '../../store/serviceTicketStore';

const requisitionSchema = z.object({

    description: z.string().min(10, 'Description must be at least 10 characters long'),
    priority: z.enum(['low', 'medium', 'high', 'critical'], { message: 'Invalid priority' }),
    request_type: z.string().min(3, 'Request type is required'),
    requested_items: z.string().min(3, 'At least one item is required'),
    
});

function RequistionForm() {

    const { createTicket } = useServiceTicket();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(requisitionSchema),
    });


    const onSubmit = async (data) => {
        const ticketData = {
           
            ticket_type: 'requisition',
            status: 'open',
            created_by: 3, 
            priority:'Medium',
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
    <div>
       <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Requisition Ticket</h2>


            <div className="mb-3">
  <label className="block font-medium">Request Type</label>
  <select
    {...register('request_type')}
    className="w-full border p-2 rounded"
    defaultValue=""
  >
    <option value="" disabled>Select a request type</option>
    <option value="Cash Replenishment Requisition">
      Cash Replenishment Requisition 
    </option>
    <option value="Stationery & Office Supplies Requisition">
      Stationery & Office Supplies Requisition 
    </option>
   
    <option value="Security & Surveillance Requisition">
      Security & Surveillance Requisition 
    </option>
  </select>
  {errors.request_type && <p className="text-red-500">{errors.request_type.message}</p>}
           </div>


            {/* <div className="mb-3">
                <label className="block font-medium">Title</label>
                <input
                    type="text"
                    {...register('title')}
                    className="w-full border p-2 rounded"
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div> */}

            <div className="mb-3">
                <label className="block font-medium">Description</label>
                <textarea
                    {...register('description')}
                    className="w-full border p-2 rounded"
                />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            {/* <div className="mb-3">
                <label className="block font-medium">Priority</label>
                <select {...register('priority')} className="w-full border p-2 rounded">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
                {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
            </div> */}

          


            <div className="mb-3">
                <label className="block font-medium">Requested Items</label>
                <input
                    type="text"
                    {...register('requested_items')}
                    className="w-full border p-2 rounded"
                />
                {errors.requested_items && <p className="text-red-500">{errors.requested_items.message}</p>}
            </div>

            {/* <div className="mb-3">
                <label className="block font-medium">Estimated Cost</label>
                <input
                    type="number"
                    {...register('estimated_cost')}
                    className="w-full border p-2 rounded"
                />
                {errors.estimated_cost && <p className="text-red-500">{errors.estimated_cost.message}</p>}
            </div> */}

            <button
                type="submit"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
        </form>
    </div>
  )
}

export default RequistionForm
