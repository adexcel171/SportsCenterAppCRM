import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUserdataDetailsQuery,
  useDeleteUserdataMutation,
  useUpdateUserdataMutation,
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
  const { data: userdata } = useGetUserdataDetailsQuery(params.id);
  const [updateUserdata] = useUpdateUserdataMutation();
  const [deleteUserdata] = useDeleteUserdataMutation();
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    credit: "",
    debit: "",
    note: "",
    date: "",
    subscription: "",
    subscriptionEndDate: "",
  });

  useEffect(() => {
    if (userdata) {
      setFormData({
        name: userdata.name || "",
        number: userdata.number || "",
        email: userdata.email || "",
        credit: userdata.credit || "",
        debit: userdata.debit || "",
        note: userdata.note || "",
        date: userdata.date?.split("T")[0] || "",
        subscription: userdata.subscription || "",
        subscriptionEndDate: userdata.subscriptionEndDate?.split("T")[0] || "",
      });
    }
  }, [userdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateUserdata({
        userdataId: params.id,
        ...formData,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Member updated successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this member permanently?")) return;

    try {
      await deleteUserdata(params.id);
      toast.success("Member deleted");
      navigate("/");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div
      className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-8`}
    >
      <div className="max-w-4xl mx-auto mt-[60px] px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🏋️♂️ Member Management
        </h1>

        <div className={`${SPORT_THEME.accent} rounded-xl p-6 shadow-xl`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="name"
                label="Member Name"
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
                label="Credit Balance"
                type="number"
                value={formData.credit}
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

              <div className="md:col-span-2">
                <FormSelect
                  id="subscription"
                  label="Membership Plan"
                  value={formData.subscription}
                  onChange={handleChange}
                  options={["Basic", "Pro", "VIP"]}
                />
              </div>

              <div className="md:col-span-2">
                <FormInput
                  id="subscriptionEndDate"
                  label="Membership Expiry"
                  type="date"
                  value={formData.subscriptionEndDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Trainer Notes
                </label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={handleChange}
                  className={`w-full p-3 ${SPORT_THEME.border} border rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-800`}
                  rows="3"
                  placeholder="Training progress, dietary notes..."
                />
              </div>
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

// Reusable Components
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
      className={`w-full p-3 ${SPORT_THEME.border} border rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-800`}
      required={required}
    />
  </div>
);

const FormSelect = ({ id, label, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`w-full p-3 ${SPORT_THEME.border} border rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-800`}
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

export default Userdetails;
