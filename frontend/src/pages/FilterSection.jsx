import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { useAllUserdataQuery } from "../redux/api/userdataApiSlice";
import { useSelector } from "react-redux";
import { AiOutlineForm } from "react-icons/ai";

const FilterSection = ({ filterType, setFilterType }) => {
  return (
    <div className="flex justify-center items-center gap-4 my-6 flex-wrap">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="all"
          name="filter"
          value="all"
          checked={filterType === "all"}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <label htmlFor="all" className="text-gray-700">
          All Users
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="expired"
          name="filter"
          value="expired_subscription"
          checked={filterType === "expired_subscription"}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <label htmlFor="expired" className="text-gray-700">
          Expired Subscriptions
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="active"
          name="filter"
          value="active_subscription"
          checked={filterType === "active_subscription"}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <label htmlFor="active" className="text-gray-700">
          Active Subscriptions
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="expiring_soon"
          name="filter"
          value="expiring_soon"
          checked={filterType === "expiring_soon"}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <label htmlFor="expiring_soon" className="text-gray-700">
          Expiring Soon (3 days)
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="birthdays"
          name="filter"
          value="today_birthdays"
          checked={filterType === "today_birthdays"}
          onChange={(e) => setFilterType(e.target.value)}
          className="form-radio h-4 w-4 text-blue-600"
        />
        <label htmlFor="birthdays" className="text-gray-700">
          Today's Birthdays
        </label>
      </div>
    </div>
  );
};

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { data: allUserdata, error, isLoading } = useAllUserdataQuery();

  // State declarations
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [balance, setBalance] = useState(0);
  const [allTimeTotalDebit, setAllTimeTotalDebit] = useState(0);
  const [allTimeTotalCredit, setAllTimeTotalCredit] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(0);
  const [usersWithSubEndToday, setUsersWithSubEndToday] = useState(0);
  const [todayDataCount, setTodayDataCount] = useState(0);

  const itemsPerPage = 10;

  // Auth check
  if (!userInfo?.isAdmin) {
    return navigate("/login");
  }

  // Filter function
  const filterUserdata = (userData) => {
    if (!userData) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredData = userData.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (filterType) {
      case "expiring_soon":
        filteredData = filteredData.filter((user) => {
          const subEndDate = new Date(user.subscriptionEndDate);
          return (
            subEndDate <= new Date() ||
            (subEndDate - new Date()) / (1000 * 60 * 60 * 24) <= 3
          );
        });
        break;
      case "today_birthdays":
        filteredData = filteredData.filter((user) => {
          const createdDate = new Date(user.createdAt);
          return (
            createdDate.getDate() === today.getDate() &&
            createdDate.getMonth() === today.getMonth()
          );
        });
        break;
      case "active_subscription":
        filteredData = filteredData.filter((user) => {
          const subEndDate = new Date(user.subscriptionEndDate);
          return subEndDate > new Date();
        });
        break;
      case "expired_subscription":
        filteredData = filteredData.filter((user) => {
          const subEndDate = new Date(user.subscriptionEndDate);
          return subEndDate <= new Date();
        });
        break;
      default: // "all"
        break;
    }

    return filteredData;
  };

  // Get filtered and paginated data
  const filteredData = allUserdata ? filterUserdata(allUserdata) : [];
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  // Effects
  useEffect(() => {
    if (allUserdata) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate today's transactions
      const todayTransactions = allUserdata.filter((user) => {
        const transactionDate = new Date(user.createdAt);
        return transactionDate >= today;
      });

      const totalDebitCalc = todayTransactions.reduce(
        (acc, user) => acc + (user.debit || 0),
        0
      );
      const totalCreditCalc = todayTransactions.reduce(
        (acc, user) => acc + (user.credit || 0),
        0
      );

      setTotalDebit(totalDebitCalc);
      setTotalCredit(totalCreditCalc);
      setBalance(totalCreditCalc - totalDebitCalc);

      // Calculate all-time totals
      const allTimeDebit = allUserdata.reduce(
        (acc, user) => acc + (user.debit || 0),
        0
      );
      const allTimeCredit = allUserdata.reduce(
        (acc, user) => acc + (user.credit || 0),
        0
      );

      setAllTimeTotalDebit(allTimeDebit);
      setAllTimeTotalCredit(allTimeCredit);

      // Set other stats
      setTotalRegisteredUsers(allUserdata.length);

      const subEndToday = allUserdata.filter((user) => {
        const subEndDate = new Date(user.subscriptionEndDate);
        return (
          subEndDate.getFullYear() === today.getFullYear() &&
          subEndDate.getMonth() === today.getMonth() &&
          subEndDate.getDate() === today.getDate()
        );
      }).length;
      setUsersWithSubEndToday(subEndToday);

      const todayData = allUserdata.filter((user) => {
        const createdDate = new Date(user.createdAt);
        return (
          createdDate.getFullYear() === today.getFullYear() &&
          createdDate.getMonth() === today.getMonth() &&
          createdDate.getDate() === today.getDate()
        );
      }).length;
      setTodayDataCount(todayData);
    }
  }, [allUserdata]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  // Rest of your JSX remains the same
  return (
    <div className="container mx-auto p-4 sm:p-8 mt-6  bg-gray-50 rounded-lg shadow-md">
      {/* Your existing JSX */}
      <h1 className="text-3xl mt-10 sm:text-4xl mb-4 sm:mb-8 text-center text-gray-800">
        Customer Management Dashboard
      </h1>

      {/* Add FilterSection component here */}
      <FilterSection filterType={filterType} setFilterType={setFilterType} />

      {/* Rest of your existing JSX... */}
    </div>
  );
};

export default Home;
