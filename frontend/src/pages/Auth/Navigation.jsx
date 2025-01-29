import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineForm,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
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
    <nav className="fixed top-0 left-0 w-full bg-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Brand */}
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={closeSidebar}
        >
          <h1 className="font-extrabold text-3xl text-blue-800">D PLAYCE</h1>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/form"
            className="flex items-center text-black hover:text-blue-600 transition-transform hover:translate-x-2"
          >
            <AiOutlineForm className="mr-2" size={24} />
            <span>Form</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center text-black hover:text-blue-600 transition-transform hover:translate-x-2"
          >
            <span>About</span>
          </Link>
          <Link
            to="/blog"
            className="flex items-center text-black hover:text-blue-600 transition-transform hover:translate-x-2"
          >
            <span>Blog</span>
          </Link>

          {/* User Dropdown */}
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-black focus:outline-none"
              >
                <span>{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={closeSidebar}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center text-black hover:text-blue-600 transition-transform hover:translate-x-2"
              >
                <AiOutlineLogin size={24} />
                <span className="ml-2">Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center text-black hover:text-blue-600 transition-transform hover:translate-x-2"
              >
                <AiOutlineUserAdd size={24} />
                <span className="ml-2">Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-black focus:outline-none"
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
        <div className="md:hidden fixed inset-0 bg-gray-200 z-40">
          <div className="flex flex-col items-center space-y-6 py-8">
            <Link
              to="/"
              className="flex items-center text-black hover:text-blue-600"
              onClick={closeSidebar}
            >
              <AiOutlineHome className="mr-2" size={24} />
              <span>Home</span>
            </Link>
            <Link
              to="/form"
              className="flex items-center text-black hover:text-blue-600"
              onClick={closeSidebar}
            >
              <AiOutlineForm className="mr-2" size={24} />
              <span>Form</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center text-black hover:text-blue-600"
              onClick={closeSidebar}
            >
              <span>About</span>
            </Link>
            <Link
              to="/blog"
              className="flex items-center text-black hover:text-blue-600"
              onClick={closeSidebar}
            >
              <span>Blog</span>
            </Link>

            {userInfo ? (
              <div className="flex flex-col items-center space-y-4">
                <Link
                  to="/profile"
                  className="text-black hover:text-blue-600"
                  onClick={closeSidebar}
                >
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className="text-black hover:text-blue-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Link
                  to="/login"
                  className="flex items-center text-black hover:text-blue-600"
                  onClick={closeSidebar}
                >
                  <AiOutlineLogin size={24} />
                  <span className="ml-2">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center text-black hover:text-blue-600"
                  onClick={closeSidebar}
                >
                  <AiOutlineUserAdd size={24} />
                  <span className="ml-2">Register</span>
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
