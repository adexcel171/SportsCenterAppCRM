import { Outlet, Navigate } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Landing from "./pages/Landing";

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <Navigation />

      <ToastContainer />

      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;
