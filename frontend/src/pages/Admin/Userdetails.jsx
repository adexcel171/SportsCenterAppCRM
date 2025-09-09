import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUserDataDetailsQuery,
  useDeleteUserDataMutation,
  useUpdateUserDataMutation,
} from "../../redux/api/userdataApiSlice";

// Sport Center Color Theme
const SPORT_THEME = {
  primary: "bg-gray-900",
  secondary: "bg-red-600",
  accent: "bg-gray-800",
  text: "text-white",
  border: "border-gray-700",
};

const Userdetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;

  const {
    data: userdata,
    isLoading: userLoading,
    error: userError,
  } = useGetUserDataDetailsQuery(id, {
    skip: !id || typeof id !== "string" || id.trim() === "",
  });

  const [updateUserData] = useUpdateUserDataMutation();
  const [deleteUserData] = useDeleteUserDataMutation();

  const [formData, setFormData] = useState({
    name: "",
    whatsappNumber: "",
    email: "",
    socialMedia: { facebook: "", twitter: "", instagram: "" },
    dateOfBirth: "",
    subscriptionEndDate: "",
  });

  useEffect(() => {
    if (!id || typeof id !== "string" || id.trim() === "") {
      toast.error("Invalid user data ID");
      navigate("/");
      return;
    }
    if (userdata) {
      setFormData({
        name: userdata.name || "",
        whatsappNumber: userdata.whatsappNumber || "",
        email: userdata.email || "",
        socialMedia: {
          facebook: userdata.socialMedia?.facebook || "",
          twitter: userdata.socialMedia?.twitter || "",
          instagram: userdata.socialMedia?.instagram || "",
        },
        dateOfBirth: userdata.dateOfBirth?.split("T")[0] || "",
        subscriptionEndDate: userdata.subscriptionEndDate?.split("T")[0] || "",
      });
    }
  }, [userdata, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || typeof id !== "string" || id.trim() === "") {
      toast.error("Invalid user data ID");
      navigate("/");
      return;
    }
    try {
      await updateUserData({
        id, // ✅ this is normalized from route param
        ...formData,
      }).unwrap();
      toast.success("Member updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Userdetails.jsx: Update error =", err);
      toast.error(err?.data?.error || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!id || typeof id !== "string" || id.trim() === "") {
      toast.error("Invalid user data ID");
      navigate("/");
      return;
    }
    if (!window.confirm("Delete this member permanently?")) return;
    try {
      await deleteUserData(id).unwrap();
      toast.success("Member deleted");
      navigate("/");
    } catch (err) {
      console.error("Userdetails.jsx: Delete error =", err);
      toast.error(err?.data?.error || "Deletion failed");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.startsWith("socialMedia.")) {
      const platform = id.split(".")[1];
      setFormData({
        ...formData,
        socialMedia: { ...formData.socialMedia, [platform]: value },
      });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  if (userLoading) {
    return (
      <div
        className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-8`}
      >
        <div className="max-w-4xl mx-auto mt-[60px] px-4 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div
        className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-8`}
      >
        <div className="max-w-4xl mx-auto mt-[60px] px-4 text-center">
          <p className="text-red-500">
            Error: {userError?.data?.error || "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-8`}
    >
      <div className="max-w-4xl mx-auto mt-[60px] px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🏋️ Member Management
        </h1>

        <div className={`${SPORT_THEME.accent} rounded-xl p-6 shadow-xl`}>
          <form onSubmit={handleSubmit} className="space-y-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="name"
                label="Member Name"
                value={formData.name}
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
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
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
              <FormInput
                id="subscriptionEndDate"
                label="Membership Expiry"
                type="date"
                value={formData.subscriptionEndDate}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleDelete}
                className={`${SPORT_THEME.secondary} px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors`}
              >
                Delete Member
              </button>
              <button
                type="submit"
                className="bg-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ id, label, type = "text", value, onChange, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full p-3 ${SPORT_THEME.border} border text-white rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-800`}
      required={required}
    />
  </div>
);

export default Userdetails;
