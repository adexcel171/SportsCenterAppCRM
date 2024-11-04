// SkeletonLoader.js
import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="container mx-auto p-4 sm:p-8 mt-5">
      <h1 className="text-3xl mt-10 sm:text-4xl mb-4 sm:mb-8 text-center">
        Money Man Dashboard
      </h1>
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
            {Array.from({ length: 5 }).map((_, index) => (
              <tr className="text-black" key={index}>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
                <td className="py-2 px-2 sm:px-4 border">
                  <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkeletonLoader;
