import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/auth-reducer";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
