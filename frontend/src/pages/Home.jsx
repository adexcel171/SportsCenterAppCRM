import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { useAllUserdataQuery } from "../redux/api/userdataApiSlice";
import { useSelector } from "react-redux";
import Landing from "./Landing";
import { AiOutlineForm, AiOutlineFilter } from "react-icons/ai";
import Form from "./Form";

// Color scheme constants
const COLORS = {
  primary: "bg-blue-800",
  secondary: "bg-blue-600",
  accent: "bg-blue-400",
  text: "text-gray-800",
  highlight: "bg-yellow-100",
  success: "bg-green-600",
  warning: "bg-orange-600",
  danger: "bg-red-600",
};

// Utility function to format dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { data: allUserdata, error, isLoading } = useAllUserdataQuery();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Derived data calculations
  const dashboardStats = useMemo(() => {
    if (!allUserdata) return {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allUserdata.reduce(
      (acc, user) => {
        const subEndDate = new Date(user.subscriptionEndDate);
        const createdAt = new Date(user.createdAt);

        // Today's transactions
        if (new Date(user.createdAt) >= today) {
          acc.todayCredit += user.credit || 0;
          acc.todayDebit += user.debit || 0;
        }

        // All-time totals
        acc.allTimeCredit += user.credit || 0;
        acc.allTimeDebit += user.debit || 0;

        // Subscription status
        if (subEndDate <= today) acc.expiredSubs++;
        if (subEndDate > today) acc.activeSubs++;
        if (subEndDate.toDateString() === today.toDateString())
          acc.subsEndToday++;

        // Birthdays
        if (
          createdAt.getDate() === today.getDate() &&
          createdAt.getMonth() === today.getMonth()
        ) {
          acc.todayBirthdays++;
        }

        return acc;
      },
      {
        totalUsers: allUserdata.length,
        todayCredit: 0,
        todayDebit: 0,
        allTimeCredit: 0,
        allTimeDebit: 0,
        expiredSubs: 0,
        activeSubs: 0,
        subsEndToday: 0,
        todayBirthdays: 0,
      }
    );
  }, [allUserdata]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (!allUserdata) return [];

    return allUserdata.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const subEnd = new Date(user.subscriptionEndDate);
      const createdAt = new Date(user.createdAt);
      const today = new Date();

      switch (filterType) {
        case "expiring":
          return subEnd <= new Date(today.getTime() + 3 * 86400000);
        case "birthdays":
          return (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth()
          );
        case "active":
          return subEnd > today;
        case "expired":
          return subEnd <= today;
        default:
          return matchesSearch;
      }
    });
  }, [allUserdata, searchQuery, filterType]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p className="text-red-500 p-4">Error: {error.message}</p>;
  if (!userInfo) return <Landing />;

  return (
    <div className="min-h-screen bg-gray-50 mt-[70px] p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Customer Management Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Today's Balance"
            value={dashboardStats.todayCredit - dashboardStats.todayDebit}
            color={COLORS.primary}
          />
          <StatCard
            title="Active Subs"
            value={dashboardStats.activeSubs}
            color={COLORS.success}
          />
          <StatCard
            title="Expiring Soon"
            value={dashboardStats.subsEndToday}
            color={COLORS.warning}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="relative flex-1">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Customers</option>
              <option value="expiring">Subs Expiring Soon</option>
              <option value="birthdays">Today's Birthdays</option>
              <option value="active">Active Subs</option>
              <option value="expired">Expired Subs</option>
            </select>
            <AiOutlineFilter className="absolute right-3 top-3 text-gray-500" />
          </div>
        </div>
      </header>
      <Link
        to="/form"
        className="flex items-center hover:text-red-500 transition-colors"
      >
        <AiOutlineForm className="mr-1" />
        User Data Form
      </Link>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className={`${COLORS.primary} text-white`}>
            <tr>
              {[
                "Name",
                "Contact",
                "Credit",
                "Debit",
                "Subscription",
                "Actions",
              ].map((header) => (
                <th key={header} className="p-3 text-left whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((user, index) => (
              <TableRow key={user._id} user={user} index={index} />
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={paginatedData.length < itemsPerPage}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ title, value, color }) => (
  <div className={`${color} p-4 rounded-lg text-white`}>
    <h3 className="text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold">
      {typeof value === "number" ? value.toLocaleString() : value}
    </p>
  </div>
);

const TableRow = ({ user, index }) => {
  const subEnd = new Date(user.subscriptionEndDate);
  const isExpiring = subEnd < new Date(new Date().getTime() + 3 * 86400000);

  return (
    <tr className={`hover:bg-gray-50 ${index % 2 ? "bg-gray-100" : ""}`}>
      <td className="p-3 font-medium">{user.name}</td>
      <td className="p-3">
        <div className="text-sm">
          <p>{user.number}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </td>
      <td className="p-3 text-green-600 font-medium">
        {user.credit.toFixed(2)}
      </td>
      <td className="p-3 text-red-600 font-medium">{user.debit.toFixed(2)}</td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            isExpiring
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {formatDate(user.subscriptionEndDate)}
        </span>
      </td>
      <td className="p-3">
        <Link
          to={`/Userdetails/${user._id}`}
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Manage
        </Link>
      </td>
    </tr>
  );
};

export default Home;
