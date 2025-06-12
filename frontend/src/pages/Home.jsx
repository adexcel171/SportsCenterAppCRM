import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import {
  useGetAllUserDataQuery,
  useGetUserDataByUserIdQuery,
} from "../redux/api/userdataApiSlice";
import {
  useGetAllSubscriptionsQuery,
  useGetUserSubscriptionsQuery,
} from "../redux/api/subscriptionApiSlice";
import { useSelector } from "react-redux";
import Landing from "./Landing";
import { AiOutlineForm, AiOutlineFilter } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

const StatCard = ({ title, value, color }) => (
  <div
    className={`${color} p-4 rounded-lg text-white shadow-md hover:shadow-lg transition-shadow duration-200`}
  >
    <h3 className="text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold">
      {typeof value === "number" ? value.toLocaleString() : value || "N/A"}
    </p>
  </div>
);

const RecommendationCard = ({ user, subscriptions, openModal }) => {
  const hasPersonalizedPlan = subscriptions?.some(
    (sub) =>
      sub.userId?.toString() === user._id?.toString() &&
      (sub.plan === "Personalized Plan" || sub.plan === "Personalized") &&
      sub.status === "active"
  );

  console.log(
    "RecommendationCard: user =",
    user.name,
    "hasPersonalizedPlan =",
    hasPersonalizedPlan,
    "recommendations =",
    user.recommendations
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {user.name || "User"}'s Fitness Plan
      </h3>
      <p className="text-gray-600 mb-1">
        <strong>Fitness Goal:</strong> {user.fitnessGoals || "N/A"}
      </p>
      <p className="text-gray-600 mb-1">
        <strong>Activity Level:</strong> {user.activityLevel || "N/A"}
      </p>
      {hasPersonalizedPlan && user.recommendations ? (
        <div>
          <p className="text-gray-600 mb-1">
            <strong>Workout Plan:</strong>{" "}
            {user.recommendations.workoutPlan?.slice(0, 50) + "..." || "N/A"}
          </p>
          <button
            onClick={() =>
              openModal(user.recommendations, user.name, user.fitnessGoals)
            }
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </button>
        </div>
      ) : hasPersonalizedPlan ? (
        <p className="text-yellow-500 text-sm">
          AI recommendations are being generated. Please{" "}
          <Link to="/form" className="text-blue-600 underline">
            update your profile
          </Link>{" "}
          to see recommendations.
        </p>
      ) : (
        <p className="text-gray-500 text-sm">
          Get a{" "}
          <Link to="/programs" className="text-blue-600 underline">
            Personalized Plan
          </Link>{" "}
          for AI recommendations.
        </p>
      )}
    </div>
  );
};

const RecommendationsModal = ({
  isOpen,
  onClose,
  recommendations,
  userName,
  fitnessGoal,
}) => {
  if (!isOpen) return null;

  const goalActions = {
    "Weight Loss": {
      description:
        "Achieve weight loss with a calorie deficit, balanced diet, and regular exercise, including cardio and strength training.",
      actions: [
        "30-45 min moderate cardio (e.g., jogging, cycling) 4-5 days/week.",
        "Strength training (e.g., squats, push-ups) 2-3 days/week.",
        "Eat vegetables, lean proteins (e.g., chicken, fish), and controlled portions of yam or plantain.",
        "Join football or traditional dance (e.g., Bata, Atilogwu) for cardio.",
      ],
    },
    "Muscle Gain": {
      description:
        "Build muscle with strength training and a high-protein diet, focusing on progressive overload.",
      actions: [
        "Strength training (e.g., weightlifting, resistance bands) 4-5 days/week.",
        "High-protein meals (e.g., egusi with fish, beans) with carbs like rice.",
        "Rest 48 hours between muscle groups.",
        "Try wrestling or boxing for strength and agility.",
      ],
    },
    "Endurance & Stamina": {
      description:
        "Improve endurance with cardio exercises and a balanced diet for sustained energy.",
      actions: [
        "Run or cycle 45-60 min at steady pace 3-4 days/week.",
        "Interval training (e.g., sprints, skipping) 1-2 days/week.",
        "Eat energy-rich foods like jollof rice, vegetable stew, or yam.",
        "Participate in football or long-distance running for stamina.",
      ],
    },
  }[fitnessGoal] || { description: "No goal set.", actions: [] };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Plan for {userName || "User"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-semibold text-gray-700">Goal</h4>
            <p className="text-gray-600">{goalActions.description}</p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700">Steps</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {goalActions.actions.map((action, index) => (
                <li key={index} className="text-sm">
                  {action}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700">Workout</h4>
            <p className="text-gray-600 text-sm">
              {recommendations?.workoutPlan || "N/A"}
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700">Diet</h4>
            <p className="text-gray-600 text-sm">
              {recommendations?.dietPlan || "N/A"}
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700">Exercises</h4>
            <p className="text-gray-600 text-sm">
              {recommendations?.exerciseTypes || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedFitnessGoal, setSelectedFitnessGoal] = useState("");

  console.log("Home.jsx: userInfo =", userInfo);

  const isAdmin = userInfo?.isAdmin || false;

  const {
    data: allUserdata,
    error: userErrorAdmin,
    isLoading: userLoadingAdmin,
  } = useGetAllUserDataQuery(undefined, { skip: !isAdmin || !userInfo });

  const {
    data: allSubscriptions,
    error: subErrorAdmin,
    isLoading: subLoadingAdmin,
  } = useGetAllSubscriptionsQuery(undefined, { skip: !isAdmin || !userInfo });

  const {
    data: userData,
    error: userErrorUser,
    isLoading: userLoadingUser,
  } = useGetUserDataByUserIdQuery(userInfo?._id, {
    skip: isAdmin || !userInfo?._id || !userInfo,
  });

  const {
    data: userSubscriptions,
    error: subErrorUser,
    isLoading: subLoadingUser,
  } = useGetUserSubscriptionsQuery(userInfo?._id, {
    skip: isAdmin || !userInfo?._id || !userInfo,
  });

  console.log(
    "Home.jsx: userData =",
    userData,
    "userSubscriptions =",
    userSubscriptions,
    "allUserdata =",
    allUserdata,
    "allSubscriptions =",
    allSubscriptions
  );

  const userDataToUse = useMemo(() => {
    if (isAdmin) return Array.isArray(allUserdata) ? allUserdata : [];
    return Array.isArray(userData) ? userData : userData ? [userData] : [];
  }, [isAdmin, allUserdata, userData]);

  const subscriptionsToUse = useMemo(() => {
    if (isAdmin) return Array.isArray(allSubscriptions) ? allSubscriptions : [];
    return Array.isArray(userSubscriptions) ? userSubscriptions : [];
  }, [isAdmin, allSubscriptions, userSubscriptions]);

  const userError = isAdmin ? userErrorAdmin : userErrorUser;
  const subError = isAdmin ? subErrorAdmin : subErrorUser;
  const userLoading = isAdmin ? userLoadingAdmin : userLoadingUser;
  const subLoading = isAdmin ? subLoadingAdmin : subLoadingUser;

  const dashboardStats = useMemo(() => {
    return userDataToUse.reduce(
      (acc, user) => {
        if (!user) return acc;
        const subEndDate = new Date(user.subscriptionEndDate);
        const createdAt = new Date(user.createdAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (createdAt instanceof Date && !isNaN(createdAt)) {
          if (createdAt >= today) {
            acc.todayCredit += user.credit || 0;
            acc.todayDebit += user.debit || 0;
          }
          if (
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth()
          ) {
            acc.todayBirthdays++;
          }
        }

        acc.allTimeCredit += user.credit || 0;
        acc.allTimeDebit += user.debit || 0;

        if (subEndDate instanceof Date && !isNaN(subEndDate)) {
          if (subEndDate <= today) acc.expiredSubs++;
          else acc.activeSubs++;
          if (subEndDate.toDateString() === today.toDateString())
            acc.subsEndToday++;
        }

        return acc;
      },
      {
        totalUsers: userDataToUse.length || 0,
        todayCredit: 0,
        todayDebit: 0,
        allTimeCredit: 0,
        allTimeDebit: 0,
        expiredSubs: 0,
        activeSubs: 0,
        subsEndToday: 0,
        todayBirthdays: 0,
      }
    );
  }, [userDataToUse]);

  const filteredData = useMemo(() => {
    return userDataToUse.filter((user) => {
      if (!user || !user.name || !user._id) return false;

      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const subEnd = new Date(user.subscriptionEndDate);
      const createdAt = new Date(user.createdAt);
      const today = new Date();

      const hasPersonalizedPlan = subscriptionsToUse?.some(
        (sub) =>
          sub?.userId &&
          user._id &&
          sub.userId.toString() === user._id.toString() &&
          (sub.plan === "Personalized Plan" || sub.plan === "Personalized") &&
          sub.status === "active"
      );

      switch (filterType) {
        case "expiring":
          return (
            matchesSearch &&
            subEnd instanceof Date &&
            !isNaN(subEnd) &&
            subEnd <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
          );
        case "birthdays":
          return (
            matchesSearch &&
            createdAt instanceof Date &&
            !isNaN(createdAt) &&
            createdAt.getDate() === today.getDate() &&
            createdAt.getMonth() === today.getMonth()
          );
        case "active":
          return (
            matchesSearch &&
            subEnd instanceof Date &&
            !isNaN(subEnd) &&
            subEnd > today
          );
        case "expired":
          return (
            matchesSearch &&
            subEnd instanceof Date &&
            !isNaN(subEnd) &&
            subEnd <= today
          );
        case "personalized":
          return matchesSearch && hasPersonalizedPlan;
        default:
          return matchesSearch;
      }
    });
  }, [userDataToUse, searchQuery, filterType, subscriptionsToUse]);

  const openModal = (recommendations, userName, fitnessGoal) => {
    setSelectedRecommendations(recommendations);
    setSelectedUserName(userName);
    setSelectedFitnessGoal(fitnessGoal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecommendations(null);
    setSelectedUserName("");
    setSelectedFitnessGoal("");
  };

  if (!userInfo) return <Landing />;

  if (userLoading || subLoading) return <SkeletonLoader />;

  if (userError || subError) {
    console.log("Home.jsx: userError =", userError, "subError =", subError);
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <p className="text-red-600 bg-red-100 p-2 rounded text-center">
          Error:{" "}
          {userError?.data?.message ||
            subError?.data?.message ||
            "Failed to load data"}
        </p>
        <Link
          to="/form"
          className="flex justify-center items-center gap-2 text-red-600 mt-4"
        >
          <AiOutlineForm />
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="mb-6 text-center">
        <h1 className="text-lg md:text-xl font-bold">
          {isAdmin ? "Admin Dashboard" : "My Fitness Dashboard"}
        </h1>
        {isAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <StatCard
              title="Today Balance"
              value={dashboardStats.todayCredit - dashboardStats.todayDebit}
              color="bg-blue-600"
            />
            <StatCard
              title="Active Subs"
              value={dashboardStats.activeSubs}
              color="bg-green-600"
            />
            <StatCard
              title="Expiring Soon"
              value={dashboardStats.subsEndToday}
              color="bg-blue-600"
            />
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative flex-1">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="expiring">Expiring Soon</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="personalized">Personalized</option>
            </select>
            <AiOutlineFilter className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </header>
      <Link
        to="/form"
        className="flex justify-center items-center gap-2 text-red-600 mb-4"
      >
        <AiOutlineForm />
        Update Profile
      </Link>
      <section className="max-w-2xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Fitness Plans</h2>
        {filteredData.length === 0 ? (
          <p className="text-gray-600">
            No plans found.{" "}
            <Link to="/form" className="text-blue-600 underline">
              Create or update your profile
            </Link>{" "}
            to get started.
          </p>
        ) : (
          filteredData.map((user, index) => (
            <RecommendationCard
              key={user._id || index}
              user={user}
              subscriptions={subscriptionsToUse}
              openModal={openModal}
            />
          ))
        )}
      </section>
      <RecommendationsModal
        isOpen={modalOpen}
        onClose={closeModal}
        recommendations={selectedRecommendations}
        userName={selectedUserName}
        fitnessGoal={selectedFitnessGoal}
      />
    </div>
  );
};

export default Home;
