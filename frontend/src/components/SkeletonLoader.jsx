// SkeletonLoader.js
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="container mx-auto p-4 sm:p-8 mt-5">
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-2 sm:px-4 border">No</th>
              <th className="py-2 px-2 sm:px-4 border">Created At</th>
              <th className="py-2 px-2 sm:px-4 border">Day</th>
              <th className="py-2 px-2 sm:px-4 border">Name</th>
              <th className="py-2 px-2 sm:px-4 border">Number</th>
              <th className="py-2 px-2 sm:px-4 border">Email</th>
              <th className="py-2 px-2 sm:px-4 border">Amount</th>
              <th className="py-2 px-2 sm:px-4 border">Subscription</th>
              <th className="py-2 px-2 sm:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr className='text-black' key={index}>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
                <td className="py-2 px-2 sm:px-4 border">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonLoader;
