import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetAllUserDataQuery } from "../redux/api/userdataApiSlice";
import UserTable from "./userTable";
import { AiOutlineFilter } from "react-icons/ai";

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

  // ✅ Normalize `id` → `_id`
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
        _id: user._id || user.id, // always use `_id`
      }));
  }, [userData]);

  if (userDataLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto mt-[60px] px-4 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (userDataError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto mt-[60px] px-4 text-center">
          <p className="text-red-500">
            Error: {userDataError?.data?.error || "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto mt-[60px] px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🏋️ D’playce Fitness Management
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-700 w-full sm:w-1/2 text-white"
          />
          <div className="flex items-center gap-2">
            <AiOutlineFilter className="text-xl" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="todayBirthday">Today’s Birthdays</option>
              <option value="upcomingBirthday">Upcoming Birthdays</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <UserTable
          userData={validatedUserData}
          searchQuery={searchQuery}
          filterType={filterType}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default Home;
