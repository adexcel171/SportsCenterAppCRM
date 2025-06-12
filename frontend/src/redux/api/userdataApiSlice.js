import { apiSlice } from "./apiSlice";
import { USERDATA_URL } from "../constants";

export const userdataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addUserData: builder.mutation({
      query: (data) => ({
        url: USERDATA_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserData"],
    }),
    getUserDataByUserId: builder.query({
      query: () => ({
        url: `${USERDATA_URL}/mydata`,
      }),
      providesTags: ["UserData"],
      keepUnusedDataFor: 5,
    }),
    getAllUserData: builder.query({
      query: () => ({
        url: USERDATA_URL,
      }),
      providesTags: ["UserData"],
      keepUnusedDataFor: 5,
    }),
    getUserDataDetails: builder.query({
      query: (userdataId) => ({
        url: `${USERDATA_URL}/${userdataId}`,
      }),
      providesTags: ["UserData"],
      keepUnusedDataFor: 5,
    }),
    updateUserData: builder.mutation({
      query: (data) => ({
        url: `${USERDATA_URL}/${data.userdataId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserData"],
    }),
    deleteUserData: builder.mutation({
      query: (userdataId) => ({
        url: `${USERDATA_URL}/${userdataId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserData"],
    }),
    sendReminder: builder.mutation({
      query: (userdataId) => ({
        url: `${USERDATA_URL}/reminder/${userdataId}`,
        method: "POST",
      }),
      invalidatesTags: ["UserData"],
    }),
  }),
});

export const {
  useAddUserDataMutation,
  useGetUserDataByUserIdQuery,
  useGetAllUserDataQuery,
  useGetUserDataDetailsQuery,
  useUpdateUserDataMutation,
  useDeleteUserDataMutation,
  useSendReminderMutation,
} = userdataApi;
