// src/redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Subscription", "User", "Userdata"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/users/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    createUserdata: builder.mutation({
      query: (userData) => ({
        url: "/api/userdata",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Userdata"],
    }),
    updateUserdata: builder.mutation({
      query: ({ userdataId, ...userData }) => ({
        url: `/api/userdata/${userdataId}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Userdata"],
    }),
    getUserDataByUserId: builder.query({
      query: () => ({
        url: `/api/userdata/mydata`,
        method: "GET",
      }),
      providesTags: ["Userdata"],
    }),
    getAllUserdata: builder.query({
      query: () => ({
        url: "/api/userdata",
        method: "GET",
      }),
      providesTags: ["Userdata"],
    }),
    getUserSubscriptions: builder.query({
      query: () => ({
        url: `/api/subscriptions/my`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    getAllSubscriptions: builder.query({
      query: () => ({
        url: "/api/subscriptions",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useCreateUserdataMutation,
  useUpdateUserdataMutation,
  useGetUserDataByUserIdQuery,
  useGetAllUserdataQuery,
  useGetUserSubscriptionsQuery,
  useGetAllSubscriptionsQuery,
} = apiSlice;
