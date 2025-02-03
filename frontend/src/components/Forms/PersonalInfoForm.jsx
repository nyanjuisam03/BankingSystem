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

function PersonalInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(personalInfoSchema) });

  const onSubmit = (data) => {
    console.log("Form submitted successfully", data);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      <div className="col-span-1">
        <label className="block text-sm font-medium">Surname</label>
        <input {...register("surname")} className="w-full p-2 border rounded" />
        {errors.surname && <p className="text-red-500 text-sm">{errors.surname.message}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium">First Name</label>
        <input {...register("firstName")} className="w-full p-2 border rounded" />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium">Last Name (Optional)</label>
        <input {...register("lastName")} className="w-full p-2 border rounded" />
      </div>
      
      <div className="col-span-2">
        <label className="block text-sm font-medium">Date of Birth</label>
        <input type="date" {...register("dob")} className="w-full p-2 border rounded" />
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
      </div>
      
      <div className="col-span-2">
        <label className="block text-sm font-medium">National ID/Passport Number</label>
        <input {...register("nationalId")} className="w-full p-2 border rounded" />
        {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId.message}</p>}
      </div>
      
      <div className="col-span-2">
        <label className="block text-sm font-medium">Residential Address</label>
        <input {...register("address")} className="w-full p-2 border rounded" />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium">Phone Number</label>
        <input type="tel" {...register("phoneNumber")} className="w-full p-2 border rounded" />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium">Email Address</label>
        <input type="email" {...register("email")} className="w-full p-2 border rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      
      <div className="col-span-2">
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Next
        </button>
      </div>
    </form>
  </div>
  );
}

export default PersonalInfoForm;
