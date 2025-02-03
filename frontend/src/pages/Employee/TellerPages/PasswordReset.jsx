import React from 'react'
import { useState } from "react";
import { FaSpinner,FaEye, FaEyeSlash } from "react-icons/fa";
import useUserStore from '../../../store/usersStore';

function PasswordReset() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle visibility for new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle visibility for confirm password
  const { isLoading, error, success, resetPassword, clearStatus }=useUserStore()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    await resetPassword(username, newPassword);
  };

  const handleNewReset = () => {
    setUsername("");
    setNewPassword("");
    setConfirmPassword("");
    clearStatus();
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-white shadow rounded-lg p-6">
        <div className="bg-green-50 p-4 rounded">
          <p className="text-green-700">Password successfully reset for user: {username}</p>
        </div>
        <button
          onClick={handleNewReset}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset Another Password
        </button>
      </div>
    );
  }


  return (
      <div className="w-full max-w-7xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Reset User Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 p-4 rounded">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white flex items-center justify-center`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  )
}

export default PasswordReset
