import React, { useState } from 'react';
import useUserStore from '../../../store/usersStore'

function RegisterNewEmployee() {
    const registerUser = useUserStore(state => state.registerUser);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        isTeller: false,
        tellerCode: '',
        department: '',
        windowNumber: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await registerUser(formData);
            alert('Registration successful!');
            setFormData({
                username: '', password: '', email: '', firstName: '', lastName: '',
                role: '', isTeller: false, tellerCode: '', department: '', windowNumber: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }

        setIsLoading(false);
    };
  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
    <h2 className="text-xl font-bold mb-4">Register New Employee</h2>
    {error && <p className="text-red-500 mb-2">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required className="w-full p-2 border rounded" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="w-full p-2 border rounded" />
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full p-2 border rounded" />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="bank_manager">Manager</option>
            <option value="loan_officer">Loan Ofiicer</option>
        </select>
        <label className="flex items-center space-x-2">
            <input type="checkbox" name="isTeller" checked={formData.isTeller} onChange={handleChange} />
            <span>Is Teller?</span>
        </label>
        {formData.isTeller && (
            <>
                <input type="text" name="tellerCode" value={formData.tellerCode} onChange={handleChange} placeholder="Teller Code" required className="w-full p-2 border rounded" />
                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" required className="w-full p-2 border rounded" />
                <input type="text" name="windowNumber" value={formData.windowNumber} onChange={handleChange} placeholder="Window Number (Optional)" className="w-full p-2 border rounded" />
            </>
        )}
        <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white p-2 rounded">
            {isLoading ? 'Registering...' : 'Register'}
        </button>
    </form>
</div>
  )
}

export default RegisterNewEmployee
