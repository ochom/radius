import Axios from "axios";
import { AuthHeaders } from "./config";
import { URLS } from "./urls";
import { Response } from "../Models/common";

export class SessionService {
  getSessions = async () => {
    let headers = AuthHeaders();
    return Axios({
      method: "GET",
      url: URLS.ALL_SESSIONS,
      headers: headers,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return [];
      });
  };

  createSession = (data: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.ALL_SESSIONS,
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

  updateSession = (ID: string, data: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "PUT",
      url: URLS.ONE_SESSION + ID,
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

  deleteSession = (ID: string) => {
    let headers = AuthHeaders();
    return Axios({
      method: "DELETE",
      url: URLS.ONE_SESSION + ID,
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

export class ClassroomsService {
  getClassrooms = () => {
    let headers = AuthHeaders();
    return Axios({
      method: "GET",
      url: URLS.ALL_CLASSROOMS,
      headers: headers,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return [];
      });
  };

  createClassroom = (data: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.ALL_CLASSROOMS,
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

  updateClassroom = (ID: string, data: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "PUT",
      url: URLS.ONE_CLASSROOM + ID,
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

  deleteClassroom = (ID: string) => {
    let headers = AuthHeaders();
    return Axios({
      method: "DELETE",
      url: URLS.ONE_CLASSROOM + ID,
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
