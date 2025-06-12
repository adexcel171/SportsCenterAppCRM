import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAddUserDataMutation,
  useUpdateUserDataMutation,
  useGetUserDataByUserIdQuery,
} from "../redux/api/userdataApiSlice";
import { useSelector } from "react-redux";

const Form = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [addUserData] = useAddUserDataMutation();
  const [updateUserData] = useUpdateUserDataMutation();
  const { data: userData, isLoading } = useGetUserDataByUserIdQuery(
    userInfo?._id,
    {
      skip: !userInfo?._id || !userInfo,
    }
  );

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    credit: "",
    debit: "0",
    dateOfBirth: "",
    subscription: "",
    subscriptionEndDate: "",
    height: "",
    bodyType: "",
    fitnessGoals: "",
    activityLevel: "",
    dietaryPreferences: "",
    preferredSports: "",
    gender: "",
    note: "",
  });

  useEffect(() => {
    if (userData && userData.length > 0) {
      const data = userData[0];
      setFormData({
        name: data.name || "",
        number: data.number || "",
        email: data.email || "",
        credit: data.credit || "",
        debit: data.debit || "0",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "",
        subscription: data.subscription || "",
        subscriptionEndDate: data.subscriptionEndDate
          ? new Date(data.subscriptionEndDate).toISOString().split("T")[0]
          : "",
        height: data.height || "",
        bodyType: data.bodyType || "",
        fitnessGoals: data.fitnessGoals || "",
        activityLevel: data.activityLevel || "",
        dietaryPreferences: data.dietaryPreferences || "",
        preferredSports: data.preferredSports || "",
        gender: data.gender || "",
        note: data.note || "",
      });
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please log in");
      navigate("/login");
      return;
    }
    try {
      const data = { ...formData, userId: userInfo._id };
      console.log("Form.jsx: Submitting data =", data); // Debug submission
      if (userData && userData.length > 0) {
        await updateUserData({ id: userData[0]._id, ...data }).unwrap();
        toast.success("Profile updated!");
      } else {
        await addUserData(data).unwrap();
        toast.success("Profile created!");
      }
      navigate("/");
    } catch (error) {
      console.error("Form.jsx: Submission error =", error); // Debug error
      toast.error(error?.data?.message || "Failed to submit");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-lg font-bold text-center mb-4">
          {userData && userData.length > 0
            ? "Update Profile"
            : "Create Profile"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="name"
              label="Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormInput
              id="number"
              label="Phone"
              type="tel"
              value={formData.number}
              onChange={handleChange}
              required
            />
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <FormInput
              id="credit"
              label="Weight (kg)"
              type="number"
              value={formData.credit}
              onChange={handleChange}
              required
            />
            <FormInput
              id="height"
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={handleChange}
              required
            />
            <FormInput
              id="debit"
              label="Debit Balance"
              type="number"
              value={formData.debit}
              onChange={handleChange}
              required
            />
            <FormSelect
              id="bodyType"
              label="Body Type"
              value={formData.bodyType}
              onChange={handleChange}
              options={["Ectomorph", "Mesomorph", "Endomorph"]}
              required
            />
            <FormSelect
              id="fitnessGoals"
              label="Goals"
              value={formData.fitnessGoals}
              onChange={handleChange}
              options={["Weight Loss", "Muscle Gain", "Endurance & Stamina"]}
              required
            />
            <FormSelect
              id="activityLevel"
              label="Activity"
              value={formData.activityLevel}
              onChange={handleChange}
              options={["Sedentary", "Moderate", "Active"]}
              required
            />
            <FormSelect
              id="dietaryPreferences"
              label="Dietary"
              value={formData.dietaryPreferences}
              onChange={handleChange}
              options={["Nigerian Traditional", "Vegetarian", "Vegan"]}
              required
            />
            <FormSelect
              id="preferredSports"
              label="Sports"
              value={formData.preferredSports}
              onChange={handleChange}
              options={["Football", "Running", "Dance", "Boxing"]}
              required
            />
            <FormSelect
              id="gender"
              label="Gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              required
            />
          </div>
          <FormSelect
            id="subscription"
            label="Subscription"
            value={formData.subscription}
            onChange={handleChange}
            options={[
              "Starter Pass",
              "Pro Athlete",
              "Personalized Plan",
              "Elite Membership",
            ]}
            required
          />
          <FormInput
            id="subscriptionEndDate"
            label="Sub End Date"
            type="date"
            value={formData.subscriptionEndDate}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows="2"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ id, label, type, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg"
      required={required}
    />
  </div>
);

const FormSelect = ({ id, label, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg"
      required={required}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Form;
