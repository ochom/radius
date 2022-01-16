import { Auth } from "../Models/common";

export const API_ROOT = process.env.REACT_APP_API_ROUTE;

let VERSION_ROOT = API_ROOT + "/api/v1/";

export const AuthHeaders = () => {
  let authUser = localStorage.getItem("authUser");
  if (authUser) {
    let auth: Auth = JSON.parse(authUser);
    if (auth) {
      return {
        Authorization: `Bearer ${auth.token}`,
      };
    }
  }
  return null;
};

export const http = {
  Ok: 200,
};

export const URLS = {
  GRAPH: `${API_ROOT}/query`,

  LOGIN: `${VERSION_ROOT}login`,
  REGISTER: `${VERSION_ROOT}register`,

  STUDENT_PASSPORT: `${VERSION_ROOT}upload/student-passport`,
};
