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
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
