import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useUserStore from '../../store/usersStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import WaitingModal from '../Modals/WaitingModal';

const loginSchema = z.object({
  username: z.string().min(3, "User must enter a username"),
  password: z.string().min(6, "User must enter a password")
});

function LoginForm() {
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useUserStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const handleNavigation = (role) => {
    switch (role) {
      case 'customer':
        navigate('/customer');
        break;
      case 'teller':
        navigate('/employee/teller');
        break;
      case 'loan_officer':
        navigate('/employee/loan_officer');
        break;
      case 'admin':
        navigate('/employee/admin');
        break;
      case 'bank_manager':
        navigate('/employee/bank-manager');
        break;
        case 'supplier':
        navigate("/employee/supplier");
        break
      default:
        navigate('/unauthorized');
    }
  };

  const onSubmit = async (data) => {
    try {
      setShowModal(true);

      const response = await login(data);
      console.log("Login successful");
      useUserStore.setState({ user: response.user });
      
      // Store the user role for navigation
      const userRole = response.user.role;

      // Wait 3 seconds, then hide modal and navigate
      setTimeout(() => {
        setShowModal(false);
        reset();
        handleNavigation(userRole);
      }, 3000);

    } catch (error) {
      console.error("Login failed:", error);
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col p-2 h-full">
      <h2 className="px-9 text-2xl font-bold py-8">Welcome Back</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col w-full px-12 py-12">
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
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="text-center">
          <a href="/signIn">Don't have an account? Sign In</a>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white border border-blue-600 px-4 py-2 rounded hover:bg-blue-700"

        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {showModal && <WaitingModal />}
    </div>
  );
}

export default LoginForm;