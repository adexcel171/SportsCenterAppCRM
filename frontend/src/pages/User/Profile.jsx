import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useGetUserSubscriptionsQuery,
  useCancelSubscriptionMutation,
} from "../../redux/api/subscriptionApiSlice";

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
  console.log("Profile.jsx: userInfo =", JSON.stringify(userInfo, null, 2));
  const {
    data: userSubscriptions,
    isLoading: subLoading,
    error: subError,
    refetch: refetchSubscriptions,
  } = useGetUserSubscriptionsQuery(userInfo?._id, {
    skip: !userInfo?._id,
    refetchOnMountOrArgChange: true,
  });
  const [cancelSubscription] = useCancelSubscriptionMutation();

  // Initialize formData with userInfo
  const [formData, setFormData] = useState({
    name: userInfo?.name || userInfo?.email || "",
    email: userInfo?.email || "",
  });

  useEffect(() => {
    console.log(
      "Profile.jsx: userSubscriptions =",
      JSON.stringify(userSubscriptions, null, 2)
    );
  }, [userSubscriptions]);

  // Check for premium plans (Couple Monthly, Monthly Plan, Personalized Plan, Pro Athlete)
  const hasPremiumPlan = userSubscriptions?.some(
    (sub) =>
      sub.user?.toString() === userInfo?._id?.toString() &&
      (sub.plan === "Couple Monthly" ||
        sub.plan === "Monthly Plan" ||
        sub.plan === "Personalized Plan" ||
        sub.plan === "Pro Athlete") &&
      sub.status === "active"
  );

  console.log(
    "Profile.jsx: hasPremiumPlan =",
    hasPremiumPlan,
    "userSubscriptions =",
    userSubscriptions
  );

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm("Cancel this subscription?")) return;
    console.log(
      "Profile.jsx: Canceling subscription with ID =",
      subscriptionId
    );
    try {
      await cancelSubscription(subscriptionId).unwrap();
      toast.success("Subscription canceled successfully");
      refetchSubscriptions();
    } catch (err) {
      console.error("Profile.jsx: Cancel subscription error =", err);
      toast.error("Cancellation failed: " + (err.data?.message || err.message));
    }
  };

  if (subLoading) {
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

  if (subError) {
    return (
      <div
        className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-6`}
      >
        <div className="max-w-4xl mx-auto mt-2 px-4 text-center">
          <p className="text-red-400">
            Error: {subError?.data?.message || "Failed to load subscriptions"}
          </p>
          <p className="text-gray-400 mt-2">
            Error Details: {JSON.stringify(subError, null, 2)}
          </p>
          <button
            onClick={() => refetchSubscriptions()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${SPORT_THEME.primary} ${SPORT_THEME.text} py-6`}
    >
      <div className="max-w-4xl mx-auto mt-2 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🏋️‍♂️ {formData.name || "My Profile"}
        </h1>

        {/* AI Recommendations */}
        {hasPremiumPlan ? (
          <div
            className={`${SPORT_THEME.accent} rounded-lg p-6 shadow-md mb-4`}
          >
            <p className="text-yellow-400 text-sm">
              AI recommendations are not available yet. Please check back later
              or contact support.
            </p>
          </div>
        ) : (
          <div
            className={`${SPORT_THEME.accent} rounded-lg p-6 shadow-md mb-4`}
          >
            <p className="text-gray-400 text-sm">
              Subscribe to a{" "}
              <a href="/programs" className="text-blue-500 underline">
                Couple Monthly or Monthly Plan
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
              No subscriptions.{" "}
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

export default Profile;
