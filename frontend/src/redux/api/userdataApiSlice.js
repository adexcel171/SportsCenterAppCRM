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
      query: () => `${USERDATA_URL}/allUserdata`,
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

    // Your RTK query should handle JSON like this
    updateUserdata: builder.mutation({
      query: ({ userdataId, ...formData }) => ({
        url: `${USERDATA_URL}/${userdataId}`,
        method: "PUT",
        body: formData, // Ensure this is an object
        headers: {
          "Content-Type": "application/json", // This indicates you are sending JSON
        },
      }),
    }),

    deleteUserdata: builder.mutation({
      query: (userdataId) => ({
        url: `${USERDATA_URL}/${userdataId}`,
        method: "DELETE",
      }),
      providesTags: ["Userdata"],
    }),

    getFilteredUserdata: builder.query({
      query: ({ checked, radio }) => ({
        url: `${USERDATA_URL}/filtered-userdata`,
        method: "POST",
        body: { checked, radio },
      }),
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
} = userdataApiSlice;
