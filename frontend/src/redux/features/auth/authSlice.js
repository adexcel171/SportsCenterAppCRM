import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: (() => {
    try {
      const storedUserInfo = localStorage.getItem("userInfo");
      const expirationTime = localStorage.getItem("expirationTime");

      if (storedUserInfo && expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime > parseInt(expirationTime)) {
          localStorage.removeItem("userInfo");
          localStorage.removeItem("expirationTime");
          return null;
        }
        return JSON.parse(storedUserInfo);
      }
      return null;
    } catch (error) {
      console.error("Error initializing auth state:", error);
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      try {
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
        // Set expiration to match JWT expiration (30 days)
        const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem("expirationTime", expirationTime);
      } catch (error) {
        console.error("Error saving credentials to localStorage:", error);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      try {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("expirationTime");
      } catch (error) {
        console.error("Error clearing localStorage on logout:", error);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
