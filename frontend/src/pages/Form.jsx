import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateUserdataMutation } from "../redux/api/userdataApiSlice";

// Color scheme constants
const COLORS = {
  primary: "bg-blue-800",
  secondary: "bg-blue-600",
  accent: "bg-blue-400",
  text: "text-gray-800",
  highlight: "bg-yellow-100",
};

const Form = () => {
  const navigate = useNavigate();
  const [createUserdata] = useCreateUserdataMutation();
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    credit: 0,
    debit: 0,
    note: "",
    date: "",
    subscription: "",
    subscriptionEndDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        userData.append(key, value);
      });

      const { data } = await createUserdata(userData);

      if (data?.name) {
        toast.success(`${data.name} created successfully!`);
        navigate("/");
      } else {
        toast.warning("Please verify your input and try again.");
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen mt-6  flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-6 md:p-10">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
          Customer Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormInput
              id="number"
              label="Phone Number"
              type="tel"
              value={formData.number}
              onChange={handleChange}
              required
            />

            <FormInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <FormInput
              id="date"
              label="Date of Birth"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <FormInput
              id="credit"
              label="Credit Amount"
              type="number"
              value={formData.credit}
              onChange={handleChange}
              required
            />

            <FormInput
              id="debit"
              label="Debit Amount"
              type="number"
              value={formData.debit}
              onChange={handleChange}
              required
            />
          </div>

          <FormSelect
            id="subscription"
            label="Subscription Type"
            value={formData.subscription}
            onChange={handleChange}
            options={["Weekly", "Monthly", "Yearly"]}
            required
          />

          <FormInput
            id="subscriptionEndDate"
            label="Subscription End Date"
            type="date"
            value={formData.subscriptionEndDate}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              rows="3"
              placeholder="Enter any additional notes..."
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-500 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable Form Input Component
const FormInput = ({ id, label, type, value, onChange, required }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
        type === "date" ? "custom-date-input" : ""
      }`}
      required={required}
    />
  </div>
);

// Reusable Form Select Component
const FormSelect = ({ id, label, value, onChange, options, required }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default Form;
