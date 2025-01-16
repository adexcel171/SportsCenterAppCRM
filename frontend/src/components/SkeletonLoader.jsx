import React from "react";

const SkeletonLoader = () => {
  // Generate dummy rows for the table
  const rows = Array(5).fill(0);

  return (
    <div className="container mx-auto p-4 sm:p-8 mt-6 bg-gray-50 rounded-lg shadow-md animate-pulse">
      {/* Title Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-72 mx-auto mb-8" />

      {/* Stats Cards Skeleton */}
      <div className="flex justify-center items-center">
        <div className="mt-2 flex justify-center items-center gap-6 text-center w-full max-w-[600px] rounded-md bg-gray-200 p-5">
          <div className="h-6 bg-gray-300 rounded w-32" />
          <div className="h-6 bg-gray-300 rounded w-32" />
          <div className="h-6 bg-gray-300 rounded w-32" />
        </div>
      </div>

      {/* Second Stats Card Skeleton */}
      <div className="flex justify-center items-center">
        <div className="mt-2 flex justify-center items-center gap-6 text-center w-full max-w-[600px] rounded-md bg-gray-200 p-5">
          <div className="h-6 bg-gray-300 rounded w-32" />
          <div className="h-6 bg-gray-300 rounded w-32" />
        </div>
      </div>

      {/* Search Input Skeleton */}
      <div className="mb-4 mt-8 flex justify-center">
        <div className="h-10 bg-gray-200 rounded w-full max-w-[600px]" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white p-4 sm:p-6 mt-5 shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 px-2 w-[10px] sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
              <th className="py-2 px-2 sm:px-4">
                <div className="h-6 bg-gray-200 rounded" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((_, index) => (
              <tr key={index}>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded" />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-10 bg-gray-200 rounded w-24" />
        <div className="h-10 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
