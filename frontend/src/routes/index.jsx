import { Routes, Route, Navigate } from "react-router-dom";
import Form from "../pages/Form";
import Home from "../pages/Home";
import App from "../App";
import { useSelector } from "react-redux"; // Import useSelector to access user info

const Router = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get user info from Redux store

  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Form />} /> {/* Set Form as the home page */}
        <Route
          path="dashboard"
          element={userInfo?.isAdmin ? <Home /> : <Navigate to="/" />} // Redirect to Form if not admin
        />
      </Route>
    </Routes>
  );
};

export default Router;
