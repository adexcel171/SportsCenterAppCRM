import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminRoute from "./pages/Admin/AdminRoute";
import Profile from "./pages/User/Profile";
import UserList from "./pages/Admin/UserList";
import Userdetails from "./pages/Admin/Userdetails.jsx";

import Home from "./pages/Home.jsx";
import Form from "./pages/Form.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/form" element={<Form />} />

      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/userdetails/:id" element={<Userdetails />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
