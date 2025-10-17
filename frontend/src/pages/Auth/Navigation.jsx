import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineTeam,
  AiOutlineUser,
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
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white text-gray-900 shadow-lg z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-full shadow-md transform hover:scale-105 transition-transform">
              <FaDumbbell className="text-2xl text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              D' Playce
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" icon={<AiOutlineHome />} text="Home" />
            <NavLink to="/programs" icon={<FaDumbbell />} text="Programs" />
            <NavLink to="/gallery" icon={<FaImages />} text="Gallery" />
            <NavLink to="/about" icon={<AiOutlineTeam />} text="About" />
            <NavLink to="/contact" icon={<FaPhone />} text="Contact" />

            {/* User Dropdown / Login */}
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
                  Login
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
      </nav>

      {/* Mobile Bottom Navigation Bar - Only show when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="flex justify-around items-center py-3 px-2">
            <MobileNavIcon
              to="/"
              icon={<AiOutlineHome size={24} />}
              label="Home"
            />
            <MobileNavIcon
              to="/programs"
              icon={<FaDumbbell size={22} />}
              label="Programs"
            />
            <MobileNavIcon
              to="/gallery"
              icon={<FaImages size={22} />}
              label="Gallery"
            />
            {userInfo ? (
              <MobileNavIcon
                to="/profile"
                icon={<AiOutlineUser size={24} />}
                label="Profile"
              />
            ) : (
              <MobileNavIcon
                to="/login"
                icon={<AiOutlineLogin size={24} />}
                label="Login"
              />
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-40 flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
            <Link
              to="/"
              className="flex items-center space-x-3"
              onClick={closeSidebar}
            >
              <div className="bg-gradient-to-r from-red-600 to-orange-500 p-2 rounded-full shadow-md">
                <FaDumbbell className="text-2xl text-white" />
              </div>
              <h1 className="text-xl font-extrabold text-white">D' Playce</h1>
            </Link>
            <button
              onClick={closeSidebar}
              className="text-white hover:text-red-500 transition-colors focus:outline-none"
            >
              <AiOutlineClose size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6">
            <div className="flex flex-col space-y-2 px-4">
              <SidebarLink
                to="/"
                icon={<AiOutlineHome size={24} />}
                text="Home"
                onClick={closeSidebar}
              />
              <SidebarLink
                to="/programs"
                icon={<FaDumbbell size={22} />}
                text="Programs"
                onClick={closeSidebar}
              />
              <SidebarLink
                to="/gallery"
                icon={<FaImages size={22} />}
                text="Gallery"
                onClick={closeSidebar}
              />
              <SidebarLink
                to="/about"
                icon={<AiOutlineTeam size={24} />}
                text="About Us"
                onClick={closeSidebar}
              />
              <SidebarLink
                to="/contact"
                icon={<FaPhone size={22} />}
                text="Contact"
                onClick={closeSidebar}
              />

              <div className="border-t border-gray-700 my-4"></div>

              {userInfo ? (
                <>
                  <SidebarLink
                    to="/profile"
                    icon={<AiOutlineUser size={24} />}
                    text="My Profile"
                    onClick={closeSidebar}
                  />
                  <button
                    onClick={logoutHandler}
                    className="flex items-center space-x-4 px-4 py-3 text-white background-color-red-600 hover:bg-red-700 rounded-lg transition-colors w-full"
                  >
                    <AiOutlineLogin size={24} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <SidebarLink
                  to="/login"
                  icon={<AiOutlineLogin size={24} />}
                  text="Login"
                  onClick={closeSidebar}
                  highlight
                />
              )}
            </div>
          </div>

          {userInfo && (
            <div className="border-t border-gray-700 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center">
                  <FaRunning className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {userInfo.username}
                  </p>
                  <p className="text-gray-400 text-sm">Admin</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// Desktop NavLink Component
const NavLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-900 hover:text-red-500 transition-colors"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

// Mobile Bottom Nav Icon Component
const MobileNavIcon = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center text-gray-600 hover:text-red-500 transition-colors min-w-0 flex-1"
  >
    <div className="mb-1">{icon}</div>
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

// Sidebar Link Component
const SidebarLink = ({ to, icon, text, onClick, highlight }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
      highlight
        ? "bg-red-600 hover:bg-red-700 text-white"
        : "text-white hover:bg-gray-800"
    }`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </Link>
);

export default Navigation;
