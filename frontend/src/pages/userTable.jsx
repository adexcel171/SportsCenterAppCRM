import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const UserTable = ({ userData, searchQuery, filterType, isAdmin }) => {
  // 🎉 Birthday message generator
  const generateBirthdayMessage = (name) => {
    return `🎉 Happy Birthday ${name}! 🥳 
D’playce Fitness Recreational and Fitness Center wishes you joy, success, and good health this year. Keep shining bright! 🌟`;
  };

  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = userData.filter((user) => {
      if (!user?.name || !user?._id) return false;

      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const subEnd = new Date(user.subscriptionEndDate);
      const dob = user.dateOfBirth ? new Date(user.dateOfBirth) : null;

      switch (filterType) {
        case "active":
          return subEnd > today;
        case "expired":
          return subEnd <= today;
        case "todayBirthday":
          return (
            dob &&
            dob.getDate() === today.getDate() &&
            dob.getMonth() === today.getMonth()
          );
        case "upcomingBirthday":
          if (!dob) return false;
          const thisYearBirthday = new Date(
            today.getFullYear(),
            dob.getMonth(),
            dob.getDate()
          );
          return thisYearBirthday >= today;
        default:
          return true;
      }
    });

    // 🔹 Sort birthdays for birthday filters
    if (filterType === "upcomingBirthday" || filterType === "todayBirthday") {
      filtered = filtered.sort((a, b) => {
        const dobA = new Date(a.dateOfBirth);
        const dobB = new Date(b.dateOfBirth);
        if (!dobA || !dobB) return 0;
        if (dobA.getMonth() !== dobB.getMonth()) {
          return dobA.getMonth() - dobB.getMonth();
        }
        return dobA.getDate() - dobB.getDate();
      });
    }

    return filtered;
  }, [userData, searchQuery, filterType]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {filteredData.length === 0 ? (
        <p className="text-black text-center py-6">
          No members found.{" "}
          <Link
            to="/form"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create or update a profile
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="hidden md:table w-full border-collapse text-black text-base">
            <thead>
              <tr className="bg-gray-200 text-black">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">WhatsApp</th>
                <th className="p-4 text-left">Social Media</th>
                <th className="p-4 text-left">Birthday</th>
                <th className="p-4 text-left">Status</th>
                {isAdmin && <th className="p-4 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => {
                const subEnd = new Date(user.subscriptionEndDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const status = subEnd > today ? "Active" : "Expired";

                return (
                  <tr
                    key={user._id || index}
                    className="border-b border-gray-300 hover:bg-gray-100 transition"
                  >
                    <td className="p-4 font-medium">{user.name || "N/A"}</td>
                    <td className="p-4">{user.email || "N/A"}</td>
                    <td className="p-4">{user.whatsappNumber || "N/A"}</td>
                    <td className="p-4 flex gap-3">
                      {user.socialMedia?.facebook && (
                        <a
                          href={user.socialMedia.facebook}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaFacebook className="text-blue-600 hover:scale-110 transition" />
                        </a>
                      )}
                      {user.socialMedia?.twitter && (
                        <a
                          href={user.socialMedia.twitter}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaTwitter className="text-blue-400 hover:scale-110 transition" />
                        </a>
                      )}
                      {user.socialMedia?.instagram && (
                        <a
                          href={user.socialMedia.instagram}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FaInstagram className="text-pink-600 hover:scale-110 transition" />
                        </a>
                      )}
                    </td>
                    <td className="p-4">
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                      {/* 🎂 Birthday Copy Button */}
                      {user.dateOfBirth &&
                        new Date(user.dateOfBirth).getDate() ===
                          new Date().getDate() &&
                        new Date(user.dateOfBirth).getMonth() ===
                          new Date().getMonth() && (
                          <button
                            onClick={() => {
                              const msg = generateBirthdayMessage(user.name);
                              navigator.clipboard.writeText(msg);
                              toast.success("🎂 Birthday message copied!");
                            }}
                            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Copy Birthday Msg
                          </button>
                        )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="p-4">
                        <Link
                          to={`/userdetails/${user._id}`}
                          className="text-indigo-600 font-semibold hover:underline"
                          onClick={(e) => {
                            if (!user._id) {
                              e.preventDefault();
                              toast.error("Invalid user ID");
                            }
                          }}
                        >
                          Edit
                        </Link>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 text-black">
            {filteredData.map((user, index) => {
              const subEnd = new Date(user.subscriptionEndDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const status = subEnd > today ? "Active" : "Expired";

              return (
                <div
                  key={user._id || index}
                  className="p-4 border rounded-xl shadow-sm bg-gray-50"
                >
                  <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                  <p className="text-sm">{user.email}</p>
                  <p className="text-sm">
                    WhatsApp: {user.whatsappNumber || "N/A"}
                  </p>
                  <div className="flex gap-3 mt-2">
                    {user.socialMedia?.facebook && (
                      <FaFacebook className="text-blue-600" />
                    )}
                    {user.socialMedia?.twitter && (
                      <FaTwitter className="text-blue-400" />
                    )}
                    {user.socialMedia?.instagram && (
                      <FaInstagram className="text-pink-600" />
                    )}
                  </div>
                  <p className="text-sm mt-2">
                    Birthday:{" "}
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {/* 🎂 Birthday Copy Button */}
                  {user.dateOfBirth &&
                    new Date(user.dateOfBirth).getDate() ===
                      new Date().getDate() &&
                    new Date(user.dateOfBirth).getMonth() ===
                      new Date().getMonth() && (
                      <button
                        onClick={() => {
                          const msg = generateBirthdayMessage(user.name);
                          navigator.clipboard.writeText(msg);
                          toast.success("🎂 Birthday message copied!");
                        }}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Copy Birthday Msg
                      </button>
                    )}

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {status}
                  </span>
                  {isAdmin && (
                    <div className="mt-3 flex justify-end">
                      <Link
                        to={`/userdetails/${user._id}`}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
