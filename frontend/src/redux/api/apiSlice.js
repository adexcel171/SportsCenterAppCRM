import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const userInfo = getState().auth.userInfo;
    const token = userInfo?.token || userInfo?.jwt;
    console.log("apiSlice - UserInfo:", userInfo);
    console.log("apiSlice - Token:", token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      console.warn("apiSlice - No token available");
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  console.log("API Request:", args);
  const result = await baseQuery(args, api, extraOptions);
  console.log("API Response:", result);
  if (result.error?.status === 401) {
    console.error("401 Unauthorized - Logging out");
    api.dispatch(logout());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Subscription", "User"],
  endpoints: (builder) => ({}),
});
