import { apiSlice } from "./apiSlice";
import { SUBSCRIPTION_URL } from "../constants";

export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: SUBSCRIPTION_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    getUserSubscriptions: builder.query({
      query: () => ({
        url: `${SUBSCRIPTION_URL}/my`,
      }),
      providesTags: ["Subscription"],
      keepUnusedDataFor: 60, // Increased to avoid frequent cache clearing
    }),
    getAllSubscriptions: builder.query({
      query: () => ({
        url: SUBSCRIPTION_URL,
      }),
      providesTags: ["Subscription"],
      keepUnusedDataFor: 60,
    }),
    updateSubscription: builder.mutation({
      query: (data) => ({
        url: `${SUBSCRIPTION_URL}/${data.subscriptionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    deleteSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `${SUBSCRIPTION_URL}/${subscriptionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),
    cancelSubscription: builder.mutation({
      query: (subscriptionId) => ({
        url: `${SUBSCRIPTION_URL}/cancel/${subscriptionId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetUserSubscriptionsQuery,
  useGetAllSubscriptionsQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApiSlice;
