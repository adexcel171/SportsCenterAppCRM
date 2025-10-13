import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAddUserDataMutation,
  useUpdateUserDataMutation,
  useGetUserDataByUserIdQuery,
} from "../redux/api/userdataApiSlice";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Form = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [addUserData] = useAddUserDataMutation();
  const [updateUserData] = useUpdateUserDataMutation();
  const {
    data: userData,
    isLoading,
    error: userDataError,
  } = useGetUserDataByUserIdQuery(userInfo?._id, {
    skip: !userInfo?._id || !userInfo,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    socialMedia: { facebook: "", twitter: "", instagram: "" },
    dateOfBirth: "",
    attendance: [],
  });

  useEffect(() => {
    if (userData && userData.length > 0) {
      const data = userData[0];
      setFormData({
        name: data.name || "",
        email: data.email || "",
        whatsappNumber: data.whatsappNumber || "",
        socialMedia: {
          facebook: data.socialMedia?.facebook || "",
          twitter: data.socialMedia?.twitter || "",
          instagram: data.socialMedia?.instagram || "",
        },
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().split("T")[0]
          : "",
        attendance: Array.isArray(data.attendance)
          ? data.attendance.map((date) => new Date(date))
          : [],
      });
    }
  }, [userData, userDataError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo?._id) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }

    try {
      const data = {
        ...formData,
        userId: userInfo._id,
        attendance: formData.attendance.map(
          (d) => d.toISOString().split("T")[0]
        ),
      };

      if (userData && userData.length > 0) {
        await updateUserData({ id: userData[0]._id, ...data }).unwrap();
        toast.success("Profile updated!");
      } else {
        await addUserData(data).unwrap();
        toast.success("Profile created!");
      }
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.error || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("socialMedia.")) {
      const key = id.split(".")[1];
      setFormData({
        ...formData,
        socialMedia: { ...formData.socialMedia, [key]: value },
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleAddAttendance = (date) => {
    if (!date) return;
    const alreadyExists = formData.attendance.some(
      (d) => new Date(d).toDateString() === new Date(date).toDateString()
    );
    if (!alreadyExists) {
      setFormData({
        ...formData,
        attendance: [...formData.attendance, date],
      });
    }
  };

  const handleRemoveAttendance = (index) => {
    const updated = formData.attendance.filter((_, i) => i !== index);
    setFormData({ ...formData, attendance: updated });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );

  if (!userInfo)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        Please log in to access this page.
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {userData && userData.length > 0
              ? "Update Your Profile"
              : "Create Your Profile"}
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:underline font-medium text-sm"
          >
            ← Go Back Home
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <FormInput
              id="name"
              label="Full Name"
              value={formData.name}
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
              id="whatsappNumber"
              label="WhatsApp Number"
              type="tel"
              value={formData.whatsappNumber}
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
          </div>

          {/* Social Media */}
          <h2 className="text-lg font-medium text-gray-700 border-b pb-1">
            Social Media
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <FormInput
              id="socialMedia.facebook"
              label="Facebook URL"
              type="url"
              value={formData.socialMedia.facebook}
              onChange={handleChange}
            />
            <FormInput
              id="socialMedia.twitter"
              label="Twitter/X URL"
              type="url"
              value={formData.socialMedia.twitter}
              onChange={handleChange}
            />
            <FormInput
              id="socialMedia.instagram"
              label="Instagram URL"
              type="url"
              value={formData.socialMedia.instagram}
              onChange={handleChange}
            />
          </div>

          {/* Attendance */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendance Dates
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {formData.attendance.length > 0 ? (
                formData.attendance.map((date, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {new Date(date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    <button
                      type="button"
                      className="text-red-500 font-bold ml-1 hover:text-red-700"
                      onClick={() => handleRemoveAttendance(index)}
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No attendance dates added yet.
                </p>
              )}
            </div>

            <DatePicker
              selected={null}
              onChange={handleAddAttendance}
              dateFormat="yyyy-MM-dd"
              placeholderText="Click to add a new date"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ id, label, type = "text", value, onChange, required }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
    />
  </div>
);

export default Form;
