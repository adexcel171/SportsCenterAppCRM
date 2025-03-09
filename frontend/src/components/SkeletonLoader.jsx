import React from "react";

const SkeletonLoader = () => {
  // Dummy arrays for repeating elements
  const facilityCards = Array(4).fill(0); // Matches 4 facility cards in Landing
  const statsCards = Array(4).fill(0); // Matches 4 stats in Landing

  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative h-screen md:min-h-screen">
        <div className="absolute inset-0 bg-gray-300" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="h-16 sm:h-20 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/2 mx-auto" />
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="h-12 sm:h-14 bg-gray-200 rounded-xl w-48" />
              <div className="h-12 sm:h-14 bg-gray-200 rounded-xl w-48" />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid Skeleton */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-10 sm:h-12 bg-gray-200 rounded w-64 mx-auto mb-4" />
            <div className="h-6 bg-gray-200 rounded w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilityCards.map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="h-48 bg-gray-300" />
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-3/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsCards.map((_, index) => (
              <div key={index} className="p-6">
                <div className="h-12 bg-gray-200 rounded w-16 mx-auto mb-2" />
                <div className="h-6 bg-gray-200 rounded w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="relative bg-gray-300 py-32">
        <div className="absolute inset-0 bg-gray-400/80" />
        <div className="container mx-auto px-4 text-center relative z-10 space-y-6">
          <div className="h-12 sm:h-16 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="h-12 sm:h-14 bg-gray-200 rounded-xl w-48 mx-auto" />
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 text-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Newsletter Section */}
          <div className="bg-gray-800/20 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="h-10 bg-gray-200 rounded w-64 mx-auto" />
              <div className="h-6 bg-gray-200 rounded w-80 mx-auto" />
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="h-10 bg-gray-200 rounded-full flex-1" />
                <div className="h-10 bg-gray-200 rounded-full w-32" />
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-40" />
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-24 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-40" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-6 bg-gray-200 rounded w-32" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-40" />
              <div className="h-6 bg-gray-200 rounded w-48" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-6 bg-gray-200 rounded w-32" />
                <div className="h-6 bg-gray-200 rounded w-32" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-40" />
              <div className="h-16 bg-gray-200 rounded w-full" />
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-6 bg-gray-200 rounded w-32" />
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="h-6 bg-gray-200 rounded w-64" />
              <div className="flex gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SkeletonLoader;
