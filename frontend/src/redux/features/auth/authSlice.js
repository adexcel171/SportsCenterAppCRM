import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: (() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);
        console.log("Initial userInfo from localStorage:", parsed);
        return parsed;
      } catch (error) {
        console.error("Failed to parse userInfo from localStorage:", error);
        return null;
      }
    }
    return null;
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("expirationTime", expirationTime);
      console.log("Credentials set with token:", action.payload.token);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
      console.log("User logged out");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
