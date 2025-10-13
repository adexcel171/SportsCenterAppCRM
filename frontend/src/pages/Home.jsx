import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetAllUserDataQuery } from "../redux/api/userdataApiSlice";
import { AiOutlineFilter } from "react-icons/ai";
import { Link } from "react-router-dom";
import UserTable from "./userTable";

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.isAdmin || false;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useGetAllUserDataQuery(undefined, { skip: !isAdmin || !userInfo });

  // ✅ Normalize `_id`
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

  if (userDataLoading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-200">
        <p>Loading...</p>
      </div>
    );

  if (userDataError)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-red-400 font-medium">
        Error: {userDataError?.data?.error || "Failed to load data"}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 mt-8 text-white tracking-wide">
          🏋️ D’Playce Fitness Management
        </h1>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md shadow-md">
          {/* Search Input */}
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-700 w-full sm:w-1/2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Filter & Button Row */}
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

            {/* Add Profile Button */}
            <Link
              to="/form"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all duration-200"
            >
              ➕ Create / Update Profile
            </Link>
          </div>
        </div>

        {/* User Data Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
          <UserTable
            userData={validatedUserData}
            searchQuery={searchQuery}
            filterType={filterType}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
