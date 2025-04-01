import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import {
  useGetMySubscriptionsQuery,
  useCancelSubscriptionMutation,
} from "../../redux/api/subscriptionApiSlice";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const {
    data: subscriptions,
    isLoading: loadingSubscriptions,
    refetch,
  } = useGetMySubscriptionsQuery();
  const [cancelSubscription, { isLoading: loadingCancel }] =
    useCancelSubscriptionMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await cancelSubscription(subscriptionId).unwrap();
      toast.success("Subscription canceled successfully");
      refetch();
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Failed to cancel subscription"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[6rem] sm:mt-[8rem] md:mt-[10rem] bg-gray-100 min-h-screen">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Update Profile Section */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Update Profile
          </h2>
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm sm:text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-6 sm:px-8 py-3 rounded-lg font-bold text-white w-full max-w-[200px] shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                Update
              </button>
            </div>
            {loadingUpdateProfile && <Loader />}
          </form>

          {/* Subscriptions Section */}
          <div className="mt-10 sm:mt-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 text-center bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              My Subscriptions
            </h2>
            {loadingSubscriptions ? (
              <Loader />
            ) : subscriptions?.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {subscriptions.map((sub) => (
                  <div
                    key={sub._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-sm sm:text-base">
                      <p className="font-semibold text-gray-800">
                        Plan: <span className="text-red-600">{sub.plan}</span>
                      </p>
                      <p className="text-gray-700">Amount: ₦{sub.amount}</p>
                      <p className="text-gray-700">
                        End Date: {new Date(sub.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        Status:{" "}
                        <span
                          className={`${
                            sub.status === "active"
                              ? "text-green-600"
                              : "text-gray-500"
                          } font-medium`}
                        >
                          {sub.status}
                        </span>
                      </p>
                    </div>
                    {sub.status === "active" && (
                      <button
                        onClick={() => handleCancelSubscription(sub._id)}
                        disabled={loadingCancel}
                        className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 rounded-lg font-medium text-white w-full sm:w-auto shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {loadingCancel ? "Canceling..." : "Cancel Subscription"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 text-sm sm:text-base">
                No subscriptions found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
