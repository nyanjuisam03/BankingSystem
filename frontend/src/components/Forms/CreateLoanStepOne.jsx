import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const personalInfoSchema = z.object({
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  lastName: z.string().optional(),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  nationalId: z.string().min(6, "National ID/Passport Number must be at least 6 characters"),
  address: z.string().min(5, "Residential Address must be at least 5 characters"),
  phoneNumber: z.string().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
});

function CreateLoanStepOne({ onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(personalInfoSchema) });

  const onSubmit = (data) => {
    localStorage.setItem('personalInfo', JSON.stringify(data));
    onNext();
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-4 md:p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg md:text-xl font-bold mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Surname</label>
            <input 
              {...register("surname")} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none"
              placeholder="Enter surname" 
            />
            {errors.surname && <p className="text-red-500 text-xs md:text-sm">{errors.surname.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              {...register("firstName")} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none"
              placeholder="Enter first name" 
            />
            {errors.firstName && <p className="text-red-500 text-xs md:text-sm">{errors.firstName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Last Name (Optional)</label>
          <input 
            {...register("lastName")} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none"
            placeholder="Enter last name (optional)" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input 
            type="date" 
            {...register("dob")} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none" 
          />
          {errors.dob && <p className="text-red-500 text-xs md:text-sm">{errors.dob.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">National ID/Passport Number</label>
          <input 
            {...register("nationalId")} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none"
            placeholder="Enter ID/Passport number" 
          />
          {errors.nationalId && <p className="text-red-500 text-xs md:text-sm">{errors.nationalId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Residential Address</label>
          <input 
            {...register("address")} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none"
            placeholder="Enter residential address" 
          />
          {errors.address && <p className="text-red-500 text-xs md:text-sm">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="tel" 
              {...register("phoneNumber")} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none"
              placeholder="Enter phone number" 
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs md:text-sm">{errors.phoneNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              {...register("email")} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-200 focus:outline-none"
              placeholder="Enter email address" 
            />
            {errors.email && <p className="text-red-500 text-xs md:text-sm">{errors.email.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            className="w-full md:w-1/5 border border-gray-800 text-gray-800 bg-white px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateLoanStepOne;