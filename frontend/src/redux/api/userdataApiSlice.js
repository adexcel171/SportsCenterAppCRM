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
      query: ({ id, ...data }) => {
        if (!id) throw new Error("Missing user ID for update");
        return {
          url: `${USERDATA_URL}/${id}`, // ✅ correct
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["UserData"],
    }),
    deleteUserData: builder.mutation({
      query: (id) => ({
        url: `${USERDATA_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserData"],
    }),
    sendReminder: builder.mutation({
      query: (id) => ({
        url: `${USERDATA_URL}/reminder/${id}`,
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
