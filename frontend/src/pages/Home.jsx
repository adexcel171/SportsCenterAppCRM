import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { useAllUserdataQuery } from "../redux/api/userdataApiSlice";
import { useGetAllSubscriptionsQuery } from "../redux/api/subscriptionApiSlice";
import { useSelector } from "react-redux";
import Landing from "./Landing";
import { AiOutlineForm, AiOutlineFilter } from "react-icons/ai";

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
          {new Date(user.subscriptionEndDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
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

const SubscriptionRow = ({ subscription, index }) => (
  <tr className={`hover:bg-gray-50 ${index % 2 ? "bg-gray-100" : ""}`}>
    <td className="p-3 font-medium">{subscription.name}</td>
    <td className="p-3">{subscription.email}</td>
    <td className="p-3">{subscription.plan}</td>
    <td className="p-3">{subscription.paymentType}</td>
    <td className="p-3">{subscription.amount.toLocaleString()}</td>
    <td className="p-3">
      {new Date(subscription.endDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </td>
    <td className="p-3">{subscription.status}</td>
  </tr>
);

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [subPage, setSubPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: allUserdata,
    error: userError,
    isLoading: userLoading,
  } = useAllUserdataQuery();
  const {
    data: allSubscriptions,
    error: subError,
    isLoading: subLoading,
    refetch, // Add refetch function
  } = useGetAllSubscriptionsQuery();

  console.log("All Subscriptions in Home:", allSubscriptions); // Debug log

  const dashboardStats = useMemo(() => {
    if (!allUserdata) return {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allUserdata.reduce(
      (acc, user) => {
        const subEndDate = new Date(user.subscriptionEndDate);
        const createdAt = new Date(user.createdAt);

        if (new Date(user.createdAt) >= today) {
          acc.todayCredit += user.credit || 0;
          acc.todayDebit += user.debit || 0;
        }

        acc.allTimeCredit += user.credit || 0;
        acc.allTimeDebit += user.debit || 0;

        if (subEndDate <= today) acc.expiredSubs++;
        if (subEndDate > today) acc.activeSubs++;
        if (subEndDate.toDateString() === today.toDateString())
          acc.subsEndToday++;

        if (
          createdAt.getDate() === today.getDate() &&
          createdAt.getMonth() === today.getMonth()
        ) {
          acc.todayBirthdays++;
        }

        return acc;
      },
      {
        totalUsers: allUserdata?.length || 0,
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

  const paginatedUserData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const paginatedSubData = useMemo(() => {
    if (!allSubscriptions) return [];
    const start = (subPage - 1) * itemsPerPage;
    return allSubscriptions.slice(start, start + itemsPerPage);
  }, [allSubscriptions, subPage]);

  if (userLoading || subLoading) return <SkeletonLoader />;
  if (userError)
    return <p className="text-red-500 p-4">Error: {userError.message}</p>;
  if (subError)
    return <p className="text-red-500 p-4">Error: {subError.message}</p>;
  if (!userInfo || !userInfo.isAdmin) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-[70px] p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Customer Management Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Today's Balance"
            value={dashboardStats.todayCredit - dashboardStats.todayDebit}
            color="bg-blue-800"
          />
          <StatCard
            title="Active Subs"
            value={dashboardStats.activeSubs}
            color="bg-green-600"
          />
          <StatCard
            title="Expiring Soon"
            value={dashboardStats.subsEndToday}
            color="bg-orange-600"
          />
        </div>
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
        className="flex items-center hover:text-red-500 transition-colors mb-8"
      >
        <AiOutlineForm className="mr-1" />
        User Data Form
      </Link>

      <div className="bg-white rounded-lg shadow overflow-x-auto mb-12">
        <table className="w-full">
          <thead className="bg-blue-800 text-white">
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
            {paginatedUserData.map((user, index) => (
              <TableRow key={user._id} user={user} index={index} />
            ))}
          </tbody>
        </table>
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
            disabled={paginatedUserData.length < itemsPerPage}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 p-4 border-b">
          Paid Users
        </h2>
        <table className="w-full">
          <thead className="bg-red-500 text-white">
            <tr>
              {[
                "Name",
                "Email",
                "Plan",
                "Payment Type",
                "Amount",
                "End Date",
                "Status",
              ].map((header) => (
                <th key={header} className="p-3 text-left whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedSubData.map((subscription, index) => (
              <SubscriptionRow
                key={subscription._id}
                subscription={subscription}
                index={index}
              />
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={() => setSubPage((p) => Math.max(1, p - 1))}
            disabled={subPage === 1}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {subPage}</span>
          <button
            onClick={() => setSubPage((p) => p + 1)}
            disabled={paginatedSubData.length < itemsPerPage}
            className="px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
