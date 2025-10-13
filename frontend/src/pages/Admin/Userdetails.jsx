import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUserDataDetailsQuery,
  useDeleteUserDataMutation,
  useUpdateUserDataMutation,
} from "../../redux/api/userdataApiSlice";

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
    attendance: [],
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
        attendance: userdata.attendance || [],
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
        id,
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

  const handleAddAttendance = (date) => {
    if (!date) return;
    if (
      !formData.attendance.some(
        (d) => new Date(d).toDateString() === new Date(date).toDateString()
      )
    ) {
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
            <table className="w-full table-auto border-collapse">
              <tbody>
                <TableRow
                  label="Member Name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <TableRow
                  label="WhatsApp Number"
                  id="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                />
                <TableRow
                  label="Email Address"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TableRow
                  label="Facebook URL"
                  id="socialMedia.facebook"
                  type="url"
                  value={formData.socialMedia.facebook}
                  onChange={handleChange}
                />
                <TableRow
                  label="Twitter/X URL"
                  id="socialMedia.twitter"
                  type="url"
                  value={formData.socialMedia.twitter}
                  onChange={handleChange}
                />
                <TableRow
                  label="Instagram URL"
                  id="socialMedia.instagram"
                  type="url"
                  value={formData.socialMedia.instagram}
                  onChange={handleChange}
                />
                <TableRow
                  label="Date of Birth"
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <TableRow
                  label="Membership Expiry"
                  id="subscriptionEndDate"
                  type="date"
                  value={formData.subscriptionEndDate}
                  onChange={handleChange}
                />
              </tbody>
            </table>

            {/* Attendance Management */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Attendance Dates
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {formData.attendance && formData.attendance.length > 0 ? (
                  formData.attendance.map((date, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 bg-green-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {new Date(date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendance(index)}
                        className="ml-1 text-red-300 hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No attendance yet.</p>
                )}
              </div>

              <input
                type="date"
                onChange={(e) => handleAddAttendance(e.target.value)}
                className="w-full p-3 border border-gray-700 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
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

const TableRow = ({ label, id, type = "text", value, onChange, required }) => (
  <tr className="border-b border-gray-700">
    <td className="py-3 px-4 text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </td>
    <td className="py-3 px-4">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-3 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-800`}
        required={required}
      />
    </td>
  </tr>
);

export default Userdetails;
