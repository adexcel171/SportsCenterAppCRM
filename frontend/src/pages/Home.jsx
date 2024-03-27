import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import Loader from '../components/Loader';
import {
  useAllUserdataQuery,
} from "../redux/api/userdataApiSlice";

const Home = () => {
  const { data: allUserdata, error, isLoading } = useAllUserdataQuery();

  if (isLoading) {
    return  <Loader/>
   
    
  }

  if (error) {
    return <p>Error fetching user data: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
     
      <h1 className="text-2xl sm:text-4xl mb-4 sm:mb-8 text-center">UserData Dashboard</h1>

      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-2 sm:px-4 border">No</th>
              <th className="py-2 px-2 sm:px-4 border">Created At</th>
              <th className="py-2 px-2 sm:px-4 border">Day</th>
              <th className="py-2 px-2 sm:px-4 border">Date</th>
              <th className="py-2 px-2 sm:px-4 border">Name</th>
              <th className="py-2 px-2 sm:px-4 border">Number</th>
              <th className="py-2 px-2 sm:px-4 border">Email</th>
              <th className="py-2 px-2 sm:px-4 border">Amount</th>
              <th className="py-2 px-2 sm:px-4 border">Currency</th>
              <th className="py-2 px-2 sm:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUserdata.map((userdata, index) => (
              <tr className='text-black' key={userdata._id}>
                <td className="py-2 px-2 sm:px-4 border">{index + 1}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.createdAt}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.day}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.date}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.name}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.number}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.email}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.amount}</td>
                <td className="py-2 px-2 sm:px-4 border">{userdata.currency}</td>
                <td className="py-2 px-2 sm:px-4 border bg-black text-white hover:bg-gray-800 transition">
                  {/* Add Link to details page */}
                  <Link to={`/Userdetails/${userdata._id}`}>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
