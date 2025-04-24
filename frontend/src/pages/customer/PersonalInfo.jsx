import React, { useEffect, useState } from "react";
import useUserStore from "../../store/usersStore";

function PersonalInfo() {
  const {  getUserDetails, updateUser, isLoading, error } = useUserStore();
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails(5); // Replace with actual user ID
        setUser(userData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [getUserDetails]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(5, user); // Replace with actual user ID
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-center">Loading user data...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

return (
  <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl mx-auto">
  <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile</h2>

  {/* Profile Picture Placeholder */}
  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 text-2xl">
  
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">Username</label>
    <input
      type="text"
      name="username"
      value={user.username}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">Email</label>
    <input
      type="email"
      name="email"
      value={user.email}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">First Name</label>
    <input
      type="text"
      name="firstName"
      value={user.firstName}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">Last Name</label>
    <input
      type="text"
      name="lastName"
      value={user.lastName}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>

  <button
    type="submit"
    className={`w-full border border-blue-700 text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-800 transition-colors duration-200 ${isSubmitting ? "opacity-50" : ""}`}
    disabled={isSubmitting}
  >
    {isSubmitting ? "Updating..." : "Save Changes"}
  </button>
</form>
  )
}

export default PersonalInfo
