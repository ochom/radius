import Axios from "axios";
import { AuthHeaders } from "./config";
import { URLS } from "./urls";
import { Response } from "../Models/common";
import { StaffRole } from "../Models/profiles";

export const GetRoles = () => {
  let headers = AuthHeaders();
  return Axios({
    method: "GET",
    url: URLS.ALL__ROLES,
    headers: headers,
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return [];
    });
};

export const CreateRole = (data: any) => {
  let headers = AuthHeaders();
  return Axios({
    method: "POST",
    url: URLS.ALL__ROLES,
    headers: headers,
    data: data,
  })
    .then((res) => {
      let response: Response = {
        status: res.status,
        message: res.data,
      };
      return response;
    })
    .catch((err) => {
      let response: Response = {
        message: err.response ? err.response.data : err,
      };
      return response;
    });
};

export const UpdateRole = (roleID: string, data: StaffRole) => {
  let headers = AuthHeaders();
  return Axios({
    method: "PUT",
    url: URLS.ONE_ROLE + roleID,
    headers: headers,
    data: data,
  })
    .then((res) => {
      let response: Response = {
        status: res.status,
        message: res.data,
      };
      return response;
    })
    .catch((err) => {
      let response: Response = {
        message: err.response ? err.response.data : err,
      };
      return response;
    });
};

export const DeleteRole = (roleID: string) => {
  let headers = AuthHeaders();
  return Axios({
    method: "DELETE",
    url: URLS.ONE_ROLE + roleID,
    headers: headers,
  })
    .then((res) => {
      let response: Response = {
        status: res.status,
        message: res.data,
      };
      return response;
    })
    .catch((err) => {
      let response: Response = {
        message: err.response ? err.response.data : err,
      };
      return response;
    });
};

export const CreateStaff = () => {};

export const GetStaffs = () => {
  let headers = AuthHeaders();
  return Axios({
    method: "GET",
    url: URLS.GET_ALL_STAFFS,
    headers: headers,
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return [];
    });
};
