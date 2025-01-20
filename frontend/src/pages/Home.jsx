import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { useAllUserdataQuery } from "../redux/api/userdataApiSlice";
import { useSelector } from "react-redux";

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo?.isAdmin) {
    return <p>You do not have permission to view this page.</p>;
  }

  const { data: allUserdata, error, isLoading } = useAllUserdataQuery();

  // State for total debit, credit, and balance (today's calculations)
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [balance, setBalance] = useState(0);

  // State for all-time totals
  const [allTimeTotalDebit, setAllTimeTotalDebit] = useState(0);
  const [allTimeTotalCredit, setAllTimeTotalCredit] = useState(0);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered user data based on search query
  const filteredUserdata = allUserdata
    ? allUserdata.filter((userdata) =>
        userdata.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

  // Calculate the index of the last item on the current page
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUserdata.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  useEffect(() => {
    if (allUserdata) {
      // Get the current date at midnight (00:00:00) to filter today's transactions
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 to start from midnight

      // Filter transactions for today only
      const todayTransactions = allUserdata.filter((user) => {
        const transactionDate = new Date(user.createdAt);
        return transactionDate >= today; // Include transactions from today
      });

      // Calculate the total debit and credit for today's transactions
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

      // Calculate balance
      const calculatedBalance = totalCreditCalc - totalDebitCalc;
      setBalance(calculatedBalance);

      // Calculate all-time total debit and credit
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
    }
  }, [allUserdata]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 mt-6  bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl mt-10 sm:text-4xl mb-4 sm:mb-8 text-center text-gray-800">
        D'playce Dashboard
      </h1>
      <div className="flex justify-center items-center">
        <div className="mt-2 flex justify-center items-center gap-6 text-center w-full max-w-[600px] rounded-md bg-blue-950 p-5">
          <h1 className="text-lg font-bold text-white">
            Credit (Today):{" "}
            {totalCredit.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
          <p className="text-lg font-bold text-white">
            Debit (Today):{" "}
            {totalDebit.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-lg font-bold text-white">
            Current Balance:{" "}
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="mt-2 flex justify-center items-center gap-6 text-center w-full max-w-[600px] rounded-md bg-green-700 p-5">
          <h1 className="text-lg font-bold text-white">
            Total Credit:{" "}
            {allTimeTotalCredit.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
          <p className="text-lg font-bold text-white">
            Total Debit:{" "}
            {allTimeTotalDebit.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
      {/* Search Input */}
      <div className="mb-4 mt-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-full max-w-[600px] focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="bg-white p-4 sm:p-6 mt-5 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 hover:bg-gray-800 transition text-white">
              <th className="py-2 px-2 w-[10px] sm:px-4 border">No</th>
              <th className="py-2 px-2 sm:px-4 border">Created At</th>
              <th className="py-2 px-2 sm:px-4 border">Name</th>
              <th className="py-2 px-2 sm:px-4 border">Number</th>
              <th className="py-2 px-2 sm:px-4 border">Credit</th>
              <th className="py-2 px-2 sm:px-4 border">Debit</th>
              <th className="py-2 px-2 sm:px-4 border">Notes</th>
              <th className="py-2 px-2 sm:px-4 border">Currency</th>
              <th className="py-2 px-2 sm:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((userdata, index) => {
              const createdAtDate = new Date(userdata.createdAt);
              const optionsDateTime = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              };
              const formattedDateTime = createdAtDate.toLocaleDateString(
                "en-US",
                optionsDateTime
              );

              // Calculate the display index based on the current page
              const displayIndex = indexOfFirstUser + index + 1; // Adjusted index for display

              return (
                <tr className="text-black" key={userdata._id}>
                  <td className="py-2 px-2 sm:px-4 border">{displayIndex}</td>
                  <td className="py-2 px-2 sm:px-4 border">
                    {formattedDateTime}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.name}</td>
                  <td className="py-2 px-2 sm:px-4 border">
                    {userdata.number}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border font-bold text-green-600 hover:text-white hover:bg-slate-900">
                    {userdata.credit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border font-bold text-red-600 hover:text-white hover:bg-slate-900">
                    {userdata.debit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.note}</td>
                  <td className="py-2 px-2 sm:px-4 border">
                    {userdata.currency}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border flex justify-center items-center mt-2 bg-blue-400 text-white hover:bg-gray-800 transition">
                    <Link to={`/Userdetails/${userdata._id}`}>Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={indexOfLastUser >= filteredUserdata.length}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
