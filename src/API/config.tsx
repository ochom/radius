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

  ALL_ROLES: `${VERSION_ROOT}staff-roles`,
  ONE_ROLE: `${VERSION_ROOT}staff-roles/`,

  ALL_STAFFS: `${VERSION_ROOT}staffs`,
  ONE_STAFF: `${VERSION_ROOT}staffs/`,

  ALL_CLASSROOMS: `${VERSION_ROOT}classes`,
  ONE_CLASSROOM: `${VERSION_ROOT}classes/`,

  ALL_SESSIONS: `${VERSION_ROOT}sessions`,
  ONE_SESSION: `${VERSION_ROOT}sessions/`,
};
