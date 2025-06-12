import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";

// Log initial state for debugging
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("Store - Action:", action.type);
  console.log("Store - State before:", store.getState().auth);
  const result = next(action);
  console.log("Store - State after:", store.getState().auth);
  return result;
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, loggerMiddleware),
  devTools: true,
});

// Initialize RTK Query listeners
setupListeners(store.dispatch);

// Log initial store state
console.log("Store - Initial state:", store.getState().auth);

export default store;
