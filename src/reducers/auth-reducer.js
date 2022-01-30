import { createSlice } from "@reduxjs/toolkit";

export const authTypes = {
  USER_LOADING: "USER_LOADING",
  USER_LOADED: "USER_LOADED",
  AUTH_ERROR: "AUTH_ERROR",
};

const authSlice = createSlice({
  name: "counter",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      localStorage.setItem("token", action.payload?.token || null);
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
