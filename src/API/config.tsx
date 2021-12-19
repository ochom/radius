import { LoginResponse } from "../Models/auth";

export const API_ROOT = process.env.REACT_APP_API_ROUTE;

export const AuthHeaders = () => {
  let authUser = localStorage.getItem("authUser");
  if (authUser) {
    let user: LoginResponse = JSON.parse(authUser);
    if (user) {
      return {
        Authorization: `Bearer ${user.auth.token}`,
      };
    }
  }
  return null;
};
