import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineForm,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import logo from "../Auth/Excel Logo.png";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      setDropdownOpen(false);
    };

    // Hide modal after initial page load

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup listeners
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert(
        "Logout failed. Please check your internet connection and try again."
      );
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex flex-row justify-between p-4 text-black bg-gray-200 shadow-2xl
    w-full h-[60px] mb-10 fixed top-0`}
    >
      <div className="flex items-center justify-center space-x-6">
        <Link to="/" className="flex items-center ">
          <h1 className="font-bold text-center text-blue-800 text-2xl">
            D'playce
          </h1>
        </Link>

        <Link
          to="/Form"
          className="flex  items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineForm className="mr-2  " size={24} />
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-black">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-5 ml-2s"
              fill="none"
              viewBox="0 0 24 24"
              stroke="black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {dropdownOpen && isModalVisible && (
          <ul
            className={`absolute left-0 top-7 mt-4 space-y- bg-white text-gray-600 ${
              dropdownOpen ? "" : "hidden"
            } transition-all duration-300`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul className="flex items-center justify-center">
            <li>
              <Link
                to="/login"
                className="flex items-center justify-center mr-4 transition-transform transform hover:translate-x-2"
              >
                <AiOutlineLogin size={26} />
                <span className="hidden nav-item-name">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center  transition-transform transform hover:translate-x-2"
              >
                <AiOutlineUserAdd size={26} />
                <span className="hidden nav-item-name">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
