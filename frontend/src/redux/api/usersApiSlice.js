import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { setCredentials, logout } from "../features/auth/authSlice";
import { toast } from "react-toastify";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(
            "usersApiSlice - Login data:",
            JSON.stringify(data, null, 2)
          );
          dispatch(setCredentials(data));
          toast.success("Login successful");
        } catch (err) {
          console.error(
            "usersApiSlice - Login error:",
            err?.data?.message || err.error
          );
          toast.error(err?.data?.message || "Login failed");
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(
            "usersApiSlice - Register data:",
            JSON.stringify(data, null, 2)
          );
          dispatch(setCredentials(data));
          toast.success("Registration successful");
        } catch (err) {
          console.error(
            "usersApiSlice - Register error:",
            err?.data?.message || err.error
          );
          toast.error(err?.data?.message || "Registration failed");
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
          toast.success("Logged out successfully");
        } catch (err) {
          console.error(
            "usersApiSlice - Logout error:",
            err?.data?.message || err.error
          );
          toast.error(err?.data?.message || "Logout failed");
        }
      },
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(
            "usersApiSlice - Profile data:",
            JSON.stringify(data, null, 2)
          );
          dispatch(setCredentials(data));
          toast.success("Profile updated successfully");
        } catch (err) {
          console.error(
            "usersApiSlice - Profile error:",
            err?.data?.message || err.error
          );
          toast.error(err?.data?.message || "Profile update failed");
        }
      },
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = userApiSlice;
