import Axios from "axios";
import { AuthHeaders, URLS } from "./config";

import { Response } from "../Models/common";
import { StaffRole, Staff } from "../Models/profiles";

export class RolesService {
  getRoles = () => {
    let headers = AuthHeaders();
    return Axios({
      method: "GET",
      url: URLS.ALL_ROLES,
      headers: headers,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return [];
      });
  };

  createRole = (data: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.ALL_ROLES,
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

  updateRole = (ID: string, data: StaffRole) => {
    let headers = AuthHeaders();
    return Axios({
      method: "PUT",
      url: URLS.ONE_ROLE + ID,
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

  deleteRole = (ID: string) => {
    let headers = AuthHeaders();
    return Axios({
      method: "DELETE",
      url: URLS.ONE_ROLE + ID,
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
}

export class StaffService {
  getStaffs = () => {
    let headers = AuthHeaders();
    return Axios({
      method: "GET",
      url: URLS.ALL_STAFFS,
      headers: headers,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return [];
      });
  };

  createStaff = (data: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.ALL_STAFFS,
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

  updateStaff = (ID: string, data: Staff) => {
    let headers = AuthHeaders();
    return Axios({
      method: "PUT",
      url: URLS.ONE_STAFF + ID,
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

  deleteStaff = (ID: string) => {
    let headers = AuthHeaders();
    return Axios({
      method: "DELETE",
      url: URLS.ONE_STAFF + ID,
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
}
