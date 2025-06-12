import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetUserDataDetailsQuery,
  useDeleteUserDataMutation,
  useUpdateUserDataMutation,
} from "../../redux/api/userdataApiSlice";
import { useGetUserSubscriptionsQuery } from "../../redux/api/subscriptionApiSlice";

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
  const {
    data: userdata,
    isLoading: userLoading,
    error: userError,
  } = useGetUserDataDetailsQuery(params.id);
  const {
    data: userSubscriptions,
    isLoading: subLoading,
    error: subError,
  } = useGetUserSubscriptionsQuery(userdata?.userId, {
    skip: !userdata?.userId,
  });
  const [updateUserData] = useUpdateUserDataMutation();
  const [deleteUserData] = useDeleteUserDataMutation();
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    credit: "",
    debit: "",
    note: "",
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
  });

  useEffect(() => {
    if (userdata) {
      console.log("Userdetails.jsx: Loaded userdata =", userdata);
      setFormData({
        name: userdata.name || "",
        number: userdata.number || "",
        email: userdata.email || "",
        credit: userdata.credit || "",
        debit: userdata.debit || "",
        note: userdata.note || "",
        dateOfBirth: userdata.dateOfBirth?.split("T")[0] || "",
        subscription: userdata.subscription || "",
        subscriptionEndDate: userdata.subscriptionEndDate?.split("T")[0] || "",
        height: userdata.height || "",
        bodyType: userdata.bodyType || "",
        fitnessGoals: userdata.fitnessGoals || "",
        activityLevel: userdata.activityLevel || "",
        dietaryPreferences: userdata.dietaryPreferences || "",
        preferredSports: userdata.preferredSports || "",
        gender: userdata.gender || "",
      });
    }
  }, [userdata]);

  const hasPersonalizedPlan = userSubscriptions?.some(
    (sub) =>
      sub.userId?.toString() === userdata?.userId?.toString() &&
      sub.plan === "Personalized Plan" &&
      sub.status === "active"
  );

  console.log(
    "Userdetails.jsx: hasPersonalizedPlan =",
    hasPersonalizedPlan,
    "userSubscriptions =",
    userSubscriptions
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Userdetails.jsx: Submitting update with data =", {
      userdataId: params.id,
      ...formData,
    });
    try {
      const { data, error } = await updateUserData({
        userdataId: params.id,
        ...formData,
      });

      if (error || data?.error) {
        console.error("Userdetails.jsx: Update error =", error || data?.error);
        toast.error(data?.error || error?.data?.message || "Update failed");
      } else {
        toast.success("Member updated successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("Userdetails.jsx: Update failed =", err);
      toast.error("Update failed: " + (err.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this member permanently?")) return;
    console.log("Userdetails.jsx: Deleting user data with ID =", params.id);
    try {
      await deleteUserData(params.id).unwrap();
      toast.success("Member deleted");
      navigate("/");
    } catch (err) {
      console.error("Userdetails.jsx: Delete error =", err);
      toast.error("Deletion failed: " + (err.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (userLoading || subLoading) {
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

  if (userError || subError) {
    return (
      <div
        className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-8`}
      >
        <div className="max-w-4xl mx-auto mt-[60px] px-4 text-center">
          <p className="text-red-500">
            Error:{" "}
            {userError?.data?.message ||
              subError?.data?.message ||
              "Failed to load data"}
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
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
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
              <FormInput
                id="height"
                label="Height (cm)"
                type="number"
                value={formData.height}
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
                label="Fitness Goals"
                value={formData.fitnessGoals}
                onChange={handleChange}
                options={[
                  "Weight Loss",
                  "Muscle Gain",
                  "Endurance & Stamina",
                  "General Fitness",
                ]}
                required
              />
              <FormSelect
                id="activityLevel"
                label="Activity Level"
                value={formData.activityLevel}
                onChange={handleChange}
                options={[
                  "Sedentary",
                  "Light",
                  "Moderate",
                  "Active",
                  "Very Active",
                ]}
                required
              />
              <FormSelect
                id="dietaryPreferences"
                label="Dietary Preferences"
                value={formData.dietaryPreferences}
                onChange={handleChange}
                options={[
                  "Nigerian Traditional",
                  "Vegetarian",
                  "Vegan",
                  "No Preference",
                ]}
                required
              />
              <FormInput
                id="preferredSports"
                label="Preferred Sports"
                value={formData.preferredSports}
                onChange={handleChange}
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
              <div className="md:col-span-2">
                <FormSelect
                  id="subscription"
                  label="Membership Plan"
                  value={formData.subscription}
                  onChange={handleChange}
                  options={[
                    "Starter Pass",
                    "Pro Athlete",
                    "Personalized Plan",
                    "Elite Membership",
                  ]}
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

            {hasPersonalizedPlan && userdata?.recommendations ? (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">AI Recommendations</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Workout Plan:</strong>{" "}
                    {userdata.recommendations.workoutPlan || "N/A"}
                  </p>
                  <p>
                    <strong>Diet Plan:</strong>{" "}
                    {userdata.recommendations.dietPlan || "N/A"}
                  </p>
                  <p>
                    <strong>Exercise Types:</strong>{" "}
                    {userdata.recommendations.exerciseTypes || "N/A"}
                  </p>
                  <div>
                    <strong>Goal Actions:</strong>
                    <ul className="list-disc pl-5">
                      {userdata.recommendations.goalActions?.map(
                        (action, index) => <li key={index}>{action}</li>
                      ) || <li>No actions available</li>}
                    </ul>
                  </div>
                </div>
              </div>
            ) : hasPersonalizedPlan ? (
              <p className="text-yellow-400 text-sm mt-4">
                AI recommendations are being generated. Please try refreshing or
                updating your profile.
              </p>
            ) : (
              <p className="text-gray-400 text-sm mt-4">
                Subscribe to a Personalized Plan to receive AI recommendations.
              </p>
            )}

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
      className={`w-full p-3 ${SPORT_THEME.border} border text-white rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-800`}
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
