import { USERDATA_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const userdataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserdata: builder.query({
      query: ({ keyword }) => ({
        url: `${USERDATA_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Userdata"],
    }),

    getUserdataById: builder.query({
      query: (userdataId) => `${USERDATA_URL}/${userdataId}`,
      providesTags: (result, error, userdataId) => [
        { type: "Userdata", id: userdataId },
      ],
    }),

    allUserdata: builder.query({
      query: () => `${USERDATA_URL}/alluserdata`,
      providesTags: ["Userdata"],
    }),

    getUserdataDetails: builder.query({
      query: (userdataId) => ({
        url: `${USERDATA_URL}/${userdataId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    CreateUserdata: builder.mutation({
      query: (userdata) => ({
        url: `${USERDATA_URL}`,
        method: "POST",
        body: userdata,
      }),
      invalidatesTags: ["Userdata"],
    }),

    updateUserdata: builder.mutation({
      query: ({ userdataId, ...userData }) => ({
        url: `${USERDATA_URL}/${userdataId}`,
        method: "PUT",
        body: userData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Userdata"],
    }),

    deleteUserdata: builder.mutation({
      query: (userdataId) => ({
        url: `${USERDATA_URL}/${userdataId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Userdata"],
    }),

    getFilteredUserdata: builder.query({
      query: ({ checked, radio }) => ({
        url: `${USERDATA_URL}/filtered-userdata`,
        method: "POST",
        body: { checked, radio },
      }),
    }),

    sendReminder: builder.mutation({
      query: (userdataId) => ({
        url: `${USERDATA_URL}/${userdataId}/remind`,
        method: "POST",
      }),
      invalidatesTags: ["Userdata"],
    }),
  }),
});

export const {
  useGetUserdataByIdQuery,
  useGetUserdataQuery,
  useGetUserdataDetailsQuery,
  useAllUserdataQuery,
  useCreateUserdataMutation,
  useUpdateUserdataMutation,
  useDeleteUserdataMutation,
  useGetFilteredUserdataQuery,
  useSendReminderMutation,
} = userdataApiSlice;
