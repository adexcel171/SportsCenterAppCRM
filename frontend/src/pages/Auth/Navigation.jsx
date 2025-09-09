import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineLogin,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineTeam,
} from "react-icons/ai";
import { FaDumbbell, FaRunning, FaPhone, FaImages } from "react-icons/fa";
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
      closeSidebar();
    } catch (err) {
      console.error("Logout error:", err);
      alert(
        "Logout failed. Please check your internet connection and try again."
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setDropdownOpen(false);
      setIsSidebarOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white text-gray-900 shadow-lg z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-full shadow-md transform hover:scale-105 transition-transform">
            <FaDumbbell className="text-2xl text-white" />
          </div>
          <h1 className=" sm:text-2xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            X FITNESS
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" icon={<AiOutlineHome />} text="Home" />
          <NavLink to="/programs" icon={<FaDumbbell />} text="Programs" />
          <NavLink to="/gallery" icon={<FaImages />} text="Gallery" />
          <NavLink to="/about" icon={<AiOutlineTeam />} text="About" />
          <NavLink to="/contact" icon={<FaPhone />} text="Contact" />

          {/* User Dropdown / Admin Login */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-900 hover:text-red-500 transition-colors focus:outline-none"
              >
                <FaRunning className="text-lg" />
                <span className="font-medium">{userInfo.username}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-3 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                <AiOutlineLogin className="inline mr-2" />
                Admin Login
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-900 hover:text-red-500 transition-colors focus:outline-none"
        >
          <AiOutlineMenu size={28} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-40 flex flex-col transition-transform duration-300">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
            <Link
              to="/"
              className="flex items-center space-x-3"
              onClick={closeSidebar}
            >
              <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-full shadow-md">
                <FaDumbbell className="text-2xl text-white" />
              </div>
              <h1 className="text-xl font-extrabold text-white">X FITNESS</h1>
            </Link>
            <button
              onClick={closeSidebar}
              className="text-white hover:text-red-500 transition-colors focus:outline-none"
            >
              <AiOutlineClose size={28} />
            </button>
          </div>
          <div className="flex flex-col items-center space-y-6 py-8 text-white text-lg">
            <NavLink
              to="/"
              icon={<AiOutlineHome />}
              text="Home"
              onClick={closeSidebar}
              mobile
            />
            <NavLink
              to="/programs"
              icon={<FaDumbbell />}
              text="Programs"
              onClick={closeSidebar}
              mobile
            />
            <NavLink
              to="/gallery"
              icon={<FaImages />}
              text="Gallery"
              onClick={closeSidebar}
              mobile
            />
            <NavLink
              to="/about"
              icon={<AiOutlineTeam />}
              text="About"
              onClick={closeSidebar}
              mobile
            />
            <NavLink
              to="/contact"
              icon={<FaPhone />}
              text="Contact"
              onClick={closeSidebar}
              mobile
            />

            {userInfo ? (
              <div className="flex flex-col items-center space-y-4 mt-6">
                <Link
                  to="/profile"
                  className="w-48 px-6 py-3 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-colors"
                  onClick={closeSidebar}
                >
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className="w-48 px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 mt-6">
                <Link
                  to="/login"
                  className="w-48 px-6 py-3 bg-red-600 rounded-lg text-center hover:bg-red-700 transition-colors"
                  onClick={closeSidebar}
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Reusable NavLink Component
const NavLink = ({ to, icon, text, onClick, mobile }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-2 ${
      mobile
        ? "text-white hover:text-red-500"
        : "text-gray-900 hover:text-red-500"
    } transition-colors`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navigation;
