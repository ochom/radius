import { LoginResponse } from "../Models/auth";

export const API_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/v1/"
    : "https://project-x.herokuapp.com/api/v1/";

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
