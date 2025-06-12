import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useGetUserDataByUserIdQuery,
  useUpdateUserDataMutation,
  useDeleteUserDataMutation,
} from "../../redux/api/userdataApiSlice"; // Corrected file name
import {
  useGetUserSubscriptionsQuery,
  useCancelSubscriptionMutation,
} from "../../redux/api/subscriptionApiSlice"; // Corrected path

// Sport Center Color Theme
const SPORT_THEME = {
  primary: "bg-gray-900",
  secondary: "bg-red-600",
  accent: "bg-gray-800",
  text: "text-white",
  border: "border-gray-700",
};

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetUserDataByUserIdQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });
  const {
    data: userSubscriptions,
    isLoading: subLoading,
    error: subError,
  } = useGetUserSubscriptionsQuery(userInfo?._id, {
    skip: !userInfo?._id,
  });
  const [updateUserData] = useUpdateUserDataMutation();
  const [deleteUserData] = useDeleteUserDataMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

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
    if (userData && userData.length > 0) {
      const data = userData[0];
      console.log("Profile.jsx: Loaded userData =", data);
      setFormData({
        name: data.name || "",
        number: data.number || "",
        email: data.email || "",
        credit: data.credit || "",
        debit: data.debit || "",
        note: data.note || "",
        dateOfBirth: data.dateOfBirth?.split("T")[0] || "",
        subscription: data.subscription || "",
        subscriptionEndDate: data.subscriptionEndDate?.split("T")[0] || "",
        height: data.height || "",
        bodyType: data.bodyType || "",
        fitnessGoals: data.fitnessGoals || "",
        activityLevel: data.activityLevel || "",
        dietaryPreferences: data.dietaryPreferences || "",
        preferredSports: data.preferredSports || "",
        gender: data.gender || "",
      });
    }
  }, [userData]);

  const hasPersonalizedPlan = userSubscriptions?.some(
    (sub) =>
      sub.user?.toString() === userInfo?._id?.toString() &&
      sub.plan === "Personalized Plan" &&
      sub.status === "active"
  );

  console.log(
    "Profile.jsx: hasPersonalizedPlan =",
    hasPersonalizedPlan,
    "userSubscriptions =",
    userSubscriptions
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData || userData.length === 0) {
      toast.error("No profile data to update. Please create a profile.");
      navigate("/form");
      return;
    }
    console.log("Profile.jsx: Submitting update with data =", {
      userdataId: userData[0]._id,
      ...formData,
    });
    try {
      const { data, error } = await updateUserData({
        userdataId: userData[0]._id,
        ...formData,
      });
      if (error || data?.error) {
        console.error("Profile.jsx: Update error =", error || data?.error);
        toast.error(data?.error || error?.data?.message || "Update failed");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Profile.jsx: Update failed =", err);
      toast.error("Update failed: " + (err.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!userData || userData.length === 0) {
      toast.error("No profile data to delete.");
      return;
    }
    if (
      !window.confirm("Delete your profile permanently? This cannot be undone.")
    ) {
      return;
    }
    console.log("Profile.jsx: Deleting user data with ID =", userData[0]._id);
    try {
      await deleteUserData(userData[0]._id).unwrap();
      toast.success("Profile deleted successfully");
      navigate("/form");
    } catch (err) {
      console.error("Profile.jsx: Delete error =", err);
      toast.error("Deletion failed: " + (err.data?.message || err.message));
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm("Cancel this subscription?")) return;
    console.log(
      "Profile.jsx: Canceling subscription with ID =",
      subscriptionId
    );
    try {
      await cancelSubscription(subscriptionId).unwrap();
      toast.success("Subscription canceled successfully");
    } catch (err) {
      console.error("Profile.jsx: Cancel subscription error =", err);
      toast.error("Cancellation failed: " + (err.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (userLoading || subLoading) {
    return (
      <div
        className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-6`}
      >
        <div className="max-w-4xl mx-auto mt-2 px-4 text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (userError || subError) {
    return (
      <div
        className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-6`}
      >
        <div className="max-w-4xl mx-auto mt-2 px-4 text-center">
          <p className="text-red-400">
            Error:{" "}
            {userError?.data?.message ||
              subError?.data?.message ||
              "Failed to load profile"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-6`}
    >
      <div className="max-w-4xl mx-auto mt-2 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">🏋️‍♂️ My Profile</h1>

        {/* Edit Profile Form */}
        <div className={`${SPORT_THEME.accent} rounded-lg p-6 shadow-md mb-4`}>
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="name"
                label="Name"
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
              />
              <FormInput
                id="credit"
                label="Weight (kg)"
                type="number"
                value={formData.credit}
                onChange={handleChange}
              />
              <FormInput
                id="debit"
                label="Debit Balance"
                type="number"
                value={formData.debit}
                onChange={handleChange}
              />
              <FormInput
                id="height"
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={handleChange}
              />
              <FormSelect
                id="bodyType"
                label="Body Type"
                value={formData.bodyType}
                onChange={handleChange}
                options={["Ectomorph", "Mesomorph", "Endomorph"]}
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
              />
              <FormSelect
                id="activityLevel"
                label="Activity Level"
                value={formData.activityLevel}
                onChange={handleChange}
                options={["Sedentary", "Light", "Moderate", "Active"]}
              />
              <FormSelect
                id="dietaryPreferences"
                label="Dietary Preferences"
                value={formData.dietaryPreferences}
                onChange={handleChange}
                options={[
                  "Nigerian Traditional Diet",
                  "Vegetarian",
                  "Vegan",
                  "No Preference",
                ]}
              />
              <FormInput
                id="preferredSports"
                label="Preferred Sports"
                value={formData.preferredSports}
                onChange={handleChange}
              />
              <FormSelect
                id="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other"]}
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
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={handleChange}
                  className={`w-full p-3 ${SPORT_THEME.border} border rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-800`}
                  rows="3"
                  placeholder="Dietary preferences, medical conditions..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              {userData && userData.length > 0 && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`${SPORT_THEME.secondary} px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors`}
                >
                  Delete Profile
                </button>
              )}
              <button
                type="submit"
                className="bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* AI Recommendations */}
        {hasPersonalizedPlan && userData && userData[0]?.recommendations ? (
          <div
            className={`${SPORT_THEME.accent} rounded-lg p-6 shadow-md mb-4`}
          >
            <h2 className="text-lg font-semibold mb-4">AI Recommendations</h2>
            <div className="space-y-2">
              <p>
                <strong>Workout Plan:</strong>{" "}
                {userData[0].recommendations.workoutPlan || "N/A"}
              </p>
              <p>
                <strong>Diet Plan:</strong>{" "}
                {userData[0].recommendations.dietPlan || "N/A"}
              </p>
              <p>
                <strong>Exercise Types:</strong>{" "}
                {userData[0].recommendations.exerciseTypes || "N/A"}
              </p>
              <div>
                <strong>Goal Actions:</strong>
                <ul className="list-disc pl-5">
                  {userData[0].recommendations.goalActions?.map(
                    (action, index) => <li key={index}>{action}</li>
                  ) || <li>No actions available</li>}
                </ul>
              </div>
            </div>
          </div>
        ) : hasPersonalizedPlan ? (
          <div
            className={`${SPORT_THEME.accent} rounded-lg p-6 shadow-md mb-4`}
          >
            <p className="text-yellow-400 text-sm">
              AI recommendations are being generated. Please update your profile
              above or try refreshing.
            </p>
          </div>
        ) : (
          <div
            className={`${SPORT_THEME.accent} rounded-lg p-6 shadow-md mb-4`}
          >
            <p className="text-gray-400 text-sm">
              Subscribe to a{" "}
              <a href="/programs" className="text-blue-500 underline">
                Personalized Plan
              </a>{" "}
              to receive AI recommendations.
            </p>
          </div>
        )}

        {/* Subscriptions */}
        <div className={`${SPORT_THEME.accent} rounded-lg p-6 shadow-md`}>
          <h2 className="text-lg font-semibold mb-4">My Subscriptions</h2>
          {userSubscriptions && userSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {userSubscriptions.map((sub) => (
                <div
                  key={sub._id}
                  className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{sub.plan}</p>
                    <p className="text-sm">
                      Status: {sub.status === "active" ? "Active" : "Canceled"}
                    </p>
                    <p className="text-sm">
                      End Date: {new Date(sub.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  {sub.status === "active" && (
                    <button
                      onClick={() => handleCancelSubscription(sub._id)}
                      className={`${SPORT_THEME.secondary} px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors`}
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              No active subscriptions.{" "}
              <a href="/programs" className="text-blue-500 underline">
                Subscribe now
              </a>
              .
            </p>
          )}
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

export default Profile;
