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
      refetch(); // Refresh the subscriptions list
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Failed to cancel subscription"
      );
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-black mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="form-input p-4 rounded-sm w-full"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-input p-4 rounded-sm w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-input p-4 rounded-sm w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                className="form-input p-4 rounded-sm w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-center text-black py-2 px-4 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
            {loadingUpdateProfile && <Loader />}
          </form>

          {/* Subscriptions Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">My Subscriptions</h2>
            {loadingSubscriptions ? (
              <Loader />
            ) : subscriptions?.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub._id}
                    className="border p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">Plan: {sub.plan}</p>
                      <p>Amount: ${sub.amount}</p>
                      <p>
                        End Date: {new Date(sub.endDate).toLocaleDateString()}
                      </p>
                      <p>Status: {sub.status}</p>
                    </div>
                    {sub.status === "active" && (
                      <button
                        onClick={() => handleCancelSubscription(sub._id)}
                        disabled={loadingCancel}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        {loadingCancel ? "Canceling..." : "Cancel Subscription"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No subscriptions found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
