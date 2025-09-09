import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAddUserDataMutation,
  useUpdateUserDataMutation,
  useGetUserDataByUserIdQuery,
} from "../redux/api/userdataApiSlice";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";

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
    if (userDataError) {
      console.log(
        "Form.jsx: No user data found, allowing profile creation =",
        userDataError
      );
      // Silently allow profile creation
    }
  }, [userData, userDataError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo?._id || typeof userInfo._id !== "string") {
      toast.error("Please log in with a valid user account");
      navigate("/login");
      return;
    }
    try {
      const data = {
        ...formData,
        userId: userInfo._id,
        attendance: Array.isArray(formData.attendance)
          ? formData.attendance.map((date) => date.toISOString().split("T")[0])
          : [],
      };
      console.log("Form.jsx: Submitting data =", data);
      if (userData && userData.length > 0) {
        await updateUserData({ id: userData[0]._id, ...data }).unwrap();
        toast.success("Profile updated!");
      } else {
        await addUserData(data).unwrap();
        toast.success("Profile created!");
      }
      navigate("/");
    } catch (error) {
      console.error("Form.jsx: Submission error =", error);
      toast.error(error?.data?.error || "Failed to submit");
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id.startsWith("socialMedia.")) {
      const platform = id.split(".")[1];
      setFormData({
        ...formData,
        socialMedia: { ...formData.socialMedia, [platform]: value },
      });
    } else {
      setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });
    }
  };

  const handleAttendanceChange = (dates) => {
    setFormData({ ...formData, attendance: Array.isArray(dates) ? dates : [] });
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 text-center">
        <p className="text-red-500">Please log in to access this page</p>
      </div>
    );
  }

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
            <FormInput
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attendance Dates
              </label>
              <DatePicker
                selected={null}
                onChange={handleAttendanceChange}
                multiple
                dateFormat="yyyy-MM-dd"
                className="w-full p-2 border rounded-lg"
                placeholderText="Select attendance dates"
                value={
                  Array.isArray(formData.attendance) &&
                  formData.attendance.length > 0
                    ? formData.attendance
                        .map((date) => new Date(date).toLocaleDateString())
                        .join(", ")
                    : ""
                }
              />
            </div>
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

export default Form;
