import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// Import SkeletonLoader component
import SkeletonLoader from '../components/SkeletonLoader'; // You need to create this component

import { useAllUserdataQuery } from "../redux/api/userdataApiSlice";

const Home = () => {
  const { data: allUserdata, error, isLoading } = useAllUserdataQuery();

  if (isLoading) {
    // Render skeleton loader while loading
    return <SkeletonLoader />;
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 mt-5">
      <h1 className="text-2xl mt-10 sm:text-4xl mb-4 sm:mb-8 text-center">UserData Dashboard</h1>
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-2 w-[10px] sm:px-4 border">No</th>
              <th className="py-2 px-2 sm:px-4 border">Created At</th>
              <th className="py-2 px-2 sm:px-4 md:w[30px] border">Name</th>
              <th className="py-2 px-2 sm:px-4 border">Number</th>
              <th className="py-2 px-2 sm:px-4 border">Email</th>
              <th className="py-2 px-2 sm:px-4 border">Amount</th>
              <th className="py-2 px-2 sm:px-4 border">Notes</th>
              {/* <th className="py-2 px-2 sm:px-4 border">Date</th> */}
              <th className="py-2 px-2 sm:px-4 border">Currency</th>
              <th className="py-2 px-2 sm:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUserdata.map((userdata, index) => {
              const createdAtDate = new Date(userdata.createdAt);
              const optionsDateTime = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
              const formattedDateTime = createdAtDate.toLocaleDateString('en-US', optionsDateTime);

              return (
                <tr className='text-black' key={userdata._id}>
                  <td className="py-2 px-2 sm:px-4 border">{index + 1}</td>
                  <td className="py-2 px-2 sm:px-4 border">{formattedDateTime}</td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.name}</td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.number}</td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.email}</td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.amount}</td>
                  <td className="py-2 px-2 sm:px-4 border">{userdata.note}</td>
                  {/* <td className="py-2 px-2 sm:px-4 border">{userdata.date}</td> */}
                  <td className="py-2 px-2 sm:px-4 border">{userdata.currency}</td>
                  <td className="py-2 px-2 sm:px-4 border bg-black text-white hover:bg-gray-800 transition">
                    <Link to={`/Userdetails/${userdata._id}`}>Details</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
