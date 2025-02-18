import React, { useState } from "react";
import useInventoryStore from "../../../store/assetsStore";

const AddConsumable = () => {
  const { addConsumable, isLoading, error } = useInventoryStore();
  const [formData, setFormData] = useState({
    name: "",
    category: "Office Supplies",
    unit: "Box",
    quantity: "",
    reorder_level: "",
    supplier_name: "",
    supplier_contact: "",
    purchase_price: "",
    last_restocked: "",
  });

  const categories = ["Office Supplies", "IT Supplies", "Cleaning Supplies", "Kitchen Supplies", "Other"];
  const units = ["Box", "Pack", "Bottle", "Roll", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addConsumable(formData);
    setFormData({
      name: "",
      category: "Office Supplies",
      unit: "Box",
      quantity: "",
      reorder_level: "",
      supplier_name: "",
      supplier_contact: "",
      purchase_price: "",
      last_restocked: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Consumable</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        {[
          { label: "Consumable Name", name: "name", type: "text" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "Reorder Level", name: "reorder_level", type: "number" },
          { label: "Supplier Name", name: "supplier_name", type: "text" },
          { label: "Supplier Contact", name: "supplier_contact", type: "email" },
          { label: "Purchase Price (Ksh)", name: "purchase_price", type: "number" },
          { label: "Last Restocked Date", name: "last_restocked", type: "date" },
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

        {/* Unit Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700">Unit:</label>
          <select name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded">
            {units.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {isLoading ? "Adding..." : "Add Consumable"}
        </button>
      </form>
    </div>
  );
};

export default AddConsumable;
