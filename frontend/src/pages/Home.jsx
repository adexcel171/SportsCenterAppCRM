import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { useAllUserdataQuery } from "../redux/api/userdataApiSlice";

const Home = () => {
  const { data: allUserdata, error, isLoading } = useAllUserdataQuery();

  // State for total debit, credit, and balance
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [balance, setBalance] = useState(0);

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
    }
  }, [allUserdata]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 mt-5">
      <h1 className="text-3xl mt-10 sm:text-4xl mb-4 sm:mb-8 text-center">
        Money Man Dashboard
      </h1>
      <div className=" flex justify-center items-center">
        <div className="mt-2 flex justify-center items-center gap-6 text-center w-[600px] rounded-md  bg-blue-950 p-5">
          <h1 className="text-lg font-bold text-white">
            Total Credit: {totalCredit.toFixed(2)}
          </h1>
          <p className="text-lg font-bold text-white">
            Total Debit: {totalDebit.toFixed(2)}
          </p>
          <p className="text-lg font-bold  text-white">
            Current Balance: {balance.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 hover:bg-gray-800 transition text-white">
              <th className="py-2 px-2 w-[10px] sm:px-4 border">No</th>
              <th className="py-2 px-2 sm:px-4 border">Created At</th>
              <th className="py-2 px-2 sm:px-4 md:w[30px] border">Name</th>
              <th className="py-2 px-2 sm:px-4 border">Number</th>
              <th className="py-2 px-2 sm:px-4 border">Credit</th>
              <th className="py-2 px-2 sm:px-4 border">Debit</th>
              <th className="py-2 px-2 sm:px-4 border">Notes</th>
              <th className="py-2 px-2 sm:px-4 border">Currency</th>
              <th className="py-2 px-2 sm:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUserdata.map((userdata, index) => {
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

              return (
                <tr className="text-black" key={userdata._id}>
                  <td className="py-2 px-2 sm:px-4 border">{index + 1}</td>
                  <td className="py-2 px-2 sm:px-4 border">
                    {formattedDateTime}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.name}</td>
                  <td className="py-2 px-2 sm:px-4 border">
                    {userdata.number}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border font-bold text-green-800  ">
                    {userdata.credit}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border font-bold text-red-600">
                    {userdata.debit}
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
        {/* <div className="mt-4 text-right">
          <p className="text-lg font-bold">
            Total Credit: {totalCredit.toFixed(2)}
          </p>
          <p className="text-lg font-bold">
            Total Debit: {totalDebit.toFixed(2)}
          </p>
          <p className="text-lg font-bold">
            Current Balance: {balance.toFixed(2)}
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
