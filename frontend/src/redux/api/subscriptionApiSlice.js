import { apiSlice } from "./apiSlice";
import { SUBSCRIPTION_URL } from "../constants";

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscriptions: builder.query({
      query: () => ({
        url: `${SUBSCRIPTION_URL}/my-subscriptions`,
      }),
      providesTags: ["Subscription"],
    }),
    createSubscription: builder.mutation({
      query: (subscriptionData) => ({
        url: SUBSCRIPTION_URL,
        method: "POST",
        body: subscriptionData,
      }),
      invalidatesTags: ["Subscription"],
    }),
    getAllSubscriptions: builder.query({
      query: () => ({
        url: `${SUBSCRIPTION_URL}/all`,
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetMySubscriptionsQuery,
  useCreateSubscriptionMutation,
  useGetAllSubscriptionsQuery,
} = subscriptionApi;
