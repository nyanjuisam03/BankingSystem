import React, { useState } from 'react' 
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useUserStore from '../store/usersStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'


const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
 });


function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useUserStore()
  const navigate=useNavigate()
 const {
   register,
   handleSubmit, 
   formState: { errors },
   reset
 } = useForm({
   resolver: zodResolver(loginSchema)
 })

 const handleNavigation = (role) => {
  switch (role) {
    case 'customer':
      navigate('/customer');
      case 'teller':
        navigate('/employee/teller');
      break;
    default:
      navigate('/customer'); // Your default route
  }
}

const onSubmit = async (data) => {
  try {
    const response = await login(data);
    console.log("Login successful");

    // Set user in Zustand store after login
    useUserStore.setState({ user: response.user });  // Update Zustand store with logged-in user

    // Navigate based on user role
    handleNavigation(response.user.role);

    reset();
  } catch (error) {
    console.error("Login failed:", error);
  }
};


  return (
    <div class="flex  flex-col justify-center items-center p-2">
      <h2>Login page</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
     <div className='flex flex-col '>
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

     <div className='flex flex-col'>
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


     <div>
      <a href="/signIn">Dont Have an Account,Sign In</a>
     </div>


     <button 
       type="submit"
       disabled={isLoading}
       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
     >
       {isLoading ? 'Logging in...' : 'Login'}
     </button>
   </form>
    </div>
  )
}

export default Login
