import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllUserDataQuery } from "../redux/api/userdataApiSlice";
import { useGetAllSubscriptionsQuery } from "../redux/api/subscriptionApiSlice";
import { AiOutlineFilter } from "react-icons/ai";
import { Link } from "react-router-dom";
import UserTable from "./userTable";

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.isAdmin || false;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Redirect non-admins to Landing page
  useEffect(() => {
    if (!isAdmin) {
      console.log("Home.jsx: Non-admin user detected, redirecting to /");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useGetAllUserDataQuery(undefined, { skip: !isAdmin || !userInfo });

  const {
    data: subscriptions,
    error: subscriptionsError,
    isLoading: subscriptionsLoading,
  } = useGetAllSubscriptionsQuery(undefined, { skip: !isAdmin || !userInfo });

  // Normalize userData _id
  const validatedUserData = useMemo(() => {
    if (!userData) return [];
    return userData
      .filter(
        (user) =>
          user &&
          (user._id || user.id) &&
          typeof (user._id || user.id) === "string" &&
          (user._id || user.id).trim() !== "" &&
          user.name
      )
      .map((user) => ({
        ...user,
        _id: user._id || user.id,
      }));
  }, [userData]);

  // Filter active subscriptions
  const activeSubscriptions = useMemo(() => {
    if (!subscriptions) return [];
    return subscriptions.filter((sub) => sub.status === "active");
  }, [subscriptions]);

  if (!isAdmin) {
    return null; // Render nothing while redirecting
  }

  if (userDataLoading || subscriptionsLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-200">
        <p>Loading...</p>
      </div>
    );
  }

  if (userDataError || subscriptionsError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-red-400 font-medium">
        Error:{" "}
        {userDataError?.data?.error ||
          subscriptionsError?.data?.error ||
          "Failed to load data"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 mt-8 text-white tracking-wide">
          🏋️ D’Playce Fitness Management
        </h1>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md shadow-md">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-700 w-full sm:w-1/2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex flex-wrap items-center gap-3 justify-end w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <AiOutlineFilter className="text-xl text-gray-300" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="todayBirthday">Today’s Birthdays</option>
                <option value="upcomingBirthday">Upcoming Birthdays</option>
              </select>
            </div>
            <Link
              to="/form"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all duration-200"
            >
              ➕ Create / Update Profile
            </Link>
          </div>
        </div>

        {/* User Data Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <UserTable
            userData={validatedUserData}
            searchQuery={searchQuery}
            filterType={filterType}
            isAdmin={isAdmin}
          />
        </div>

        {/* Active Subscriptions Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Active Subscriptions</h2>
          {activeSubscriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-700 text-left text-sm font-medium text-gray-200">
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Plan</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">End Date</th>
                    <th className="px-4 py-2">Payment Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSubscriptions.map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b border-gray-700 text-sm text-gray-200"
                    >
                      <td className="px-4 py-2">
                        {sub.name || "Unknown User"}
                      </td>
                      <td className="px-4 py-2">{sub.email}</td>
                      <td className="px-4 py-2">{sub.plan}</td>
                      <td className="px-4 py-2">
                        ₦{sub.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(sub.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{sub.paymentReference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No active subscriptions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
