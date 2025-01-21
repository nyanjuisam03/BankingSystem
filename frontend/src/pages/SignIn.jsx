import React, { useState } from 'react' 
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useUserStore from '../store/usersStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),

});
function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
 const { registerCustomer, isLoading }=useUserStore()
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(registerSchema)
  });
    
const onSubmit= async(data)=>{
try{
  const response=await registerCustomer(data)
  console.log("yes sir")
  navigate("/login")
}
catch(error){
  console.error(error)
}
}

  return (
    <div className="flex flex-col justify-center items-center p-2">
      <h2>Register Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
        <div className="flex flex-col">
          <span>Username</span>
          <input
            {...register('username')}
            placeholder="Username"
            className="border p-2 rounded"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <span>Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register('password')}
              placeholder="Password"
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <span>Email</span>
          <input
            type="email"
            {...register('email')}
            placeholder="Email"
            className="border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <span>First Name</span>
          <input
            {...register('firstName')}
            placeholder="First Name"
            className="border p-2 rounded"
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <span>Last Name</span>
          <input
            {...register('lastName')}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <a href="/login">Already Have an Account? Login</a>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  )
}

export default SignIn
