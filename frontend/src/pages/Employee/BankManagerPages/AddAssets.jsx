import React, { useState } from "react";
import useInventoryStore from '../../../store/assetsStore'

function AddAssets() {
    const { addAsset, isLoading, error } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: "",
    category: "IT Equipment",
    model: "",
    serial_number: "",
    purchase_date: "",
    purchase_price: "",
    assigned_to: "",
    location: "HQ - IT Department",
    status: "Active",
    warranty_expiry: "",
  });

  const categories = ["IT Equipment", "Office Equipment", "Furniture", "ATM Machines", "Other"];
  const locations = ["HQ - IT Department", "HQ - Finance", "Branch A", "Branch B", "Warehouse"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAsset(formData);
    setFormData({
      name: "",
      category: "IT Equipment",
      model: "",
      serial_number: "",
      purchase_date: "",
      purchase_price: "",
      assigned_to: "",
      location: "HQ - IT Department",
      status: "Active",
      warranty_expiry: "",
    });
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Asset</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        {[
          { label: "Asset Name", name: "name", type: "text" },
          { label: "Model", name: "model", type: "text" },
          { label: "Serial Number", name: "serial_number", type: "text" },
          { label: "Purchase Date", name: "purchase_date", type: "date" },
          { label: "Purchase Price (Ksh)", name: "purchase_price", type: "number" },
          { label: "Assigned To", name: "assigned_to", type: "text" },
          { label: "Warranty Expiry", name: "warranty_expiry", type: "date" },
        ].map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700">{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700">Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700">Location:</label>
          <select name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded">
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {isLoading ? "Adding..." : "Add Asset"}
        </button>
      </form>
    </div>
  )
}

export default AddAssets
