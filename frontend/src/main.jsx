import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import About from "./pages/About.jsx";
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
import PageNotFound from "./components/PageNotFound.jsx";
import LandingPage from "./pages/Landing.jsx";
import Contact from "./pages/Contact.jsx";
import Programs from "./pages/Program.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/form" element={<Form />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="contact" element={<Contact />} />
      <Route path="programs" element={<Programs />} />
      <Route path="about" element={<About />} />

      {/* Registered users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/userdetails/:id" element={<Userdetails />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="landing" element={<LandingPage />} />
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
