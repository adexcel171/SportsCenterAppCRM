import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineTeam,
  AiOutlineContacts,
} from "react-icons/ai";
import { FaDumbbell, FaRunning, FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      closeSidebar(); // Close sidebar after logout
    } catch (err) {
      console.error("Logout error:", err);
      alert(
        "Logout failed. Please check your internet connection and try again."
      );
    }
  };

  // Close dropdown and sidebar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setDropdownOpen(false);
      setIsSidebarOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-gray-200 text-black shadow-xl z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-red-600 p-2 rounded-full">
            <FaDumbbell className="text-2xl text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            D PLAYCE
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="flex items-center hover:text-red-500 transition-colors"
          >
            <AiOutlineHome className="mr-1" />
            Home
          </Link>
          <Link
            to="/programs"
            className="flex items-center hover:text-red-500 transition-colors"
          >
            <FaDumbbell className="mr-1" />
            Programs
          </Link>
          {/* <Link
            to="/schedule"
            className="flex items-center hover:text-red-500 transition-colors"
          >
            <AiOutlineCalendar className="mr-1" />
            Schedule
          </Link> */}
          <Link
            to="/about"
            className="flex items-center hover:text-red-500 transition-colors"
          >
            <AiOutlineTeam className="mr-1" />
            About
          </Link>
          <Link
            to="/contact"
            className="flex items-center hover:text-red-500 transition-colors"
          >
            <FaPhone className="mr-1" />
            Contact
          </Link>

          {/* User Dropdown */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center hover:text-red-500 transition-colors"
              >
                <span className="flex items-center">
                  <FaRunning className="mr-2" />
                  {userInfo.username}
                </span>
                <svg
                  className={`ml-2 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-gray-700 rounded-t-lg"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="block w-full px-4 py-3 text-left hover:bg-gray-700 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <AiOutlineLogin className="mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <AiOutlineUserAdd className="mr-2" />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-black hover:text-red-500 transition-colors"
        >
          {isSidebarOpen ? (
            <AiOutlineClose size={24} />
          ) : (
            <AiOutlineMenu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 text-white bg-opacity-95 z-40">
          <div className="flex flex-col items-center space-y-8 py-8 text-xl">
            <Link to="/" className="hover:text-red-500" onClick={closeSidebar}>
              <AiOutlineHome className="inline mr-2" />
              Home
            </Link>
            <Link
              to="/programs"
              className="hover:text-red-500"
              onClick={closeSidebar}
            >
              <FaDumbbell className="inline mr-2" />
              Programs
            </Link>
            {/* <Link
              to="/schedule"
              className="hover:text-red-500"
              onClick={closeSidebar}
            >
              <AiOutlineCalendar className="inline mr-2" />
              Schedule
            </Link> */}
            <Link
              to="/about"
              className="hover:text-red-500"
              onClick={closeSidebar}
            >
              <AiOutlineTeam className="inline mr-2" />
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-red-500"
              onClick={closeSidebar}
            >
              <FaPhone className="inline mr-2" />
              Contact
            </Link>

            {userInfo ? (
              <div className="flex flex-col items-center space-y-6 mt-8">
                <Link
                  to="/profile"
                  className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  onClick={closeSidebar}
                >
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-6 mt-8">
                <Link
                  to="/login"
                  className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-center"
                  onClick={closeSidebar}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 text-center"
                  onClick={closeSidebar}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
