import Axios from "axios";
import { AuthHeaders, http, URLS } from "../app/config";

export class Service {
  getData = async (query) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.GRAPH,
      headers: headers,
      data: query,
    })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => {
        return null;
      });
  };

  createOrUpdate = async (data) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.GRAPH,
      headers: headers,
      data: data,
    })
      .then((res) => {
        let data = res.data;

        var response = {};
        if (data.errors) {
          response = {
            message: data.errors[0].message,
          };
        } else {
          response = {
            status: http.Ok,
            message: "Request completed successfully",
            data: data.payload,
          };
        }
        return response;
      })
      .catch((err) => {
        let data = err.response.data;
        var response = {};
        if (data.errors) {
          response = {
            message: data.errors[0].message,
          };
        } else {
          response = {
            message: err.response?.data || err,
          };
        }
        return response;
      });
  };

  uploadStudentPassPort = async (query) => {
    let authHeaders = AuthHeaders();
    let headers = { "Content-Type": "multipart", ...authHeaders };

    return Axios({
      method: "POST",
      url: URLS.GRAPH,
      headers: headers,
      data: query,
    })
      .then((res) => {
        let data = res.data;

        var response;
        if (data.errors) {
          response = {
            message: data.errors[0]?.message,
          };
        } else {
          response = {
            status: http.Ok,
            message: "Request completed successfully",
            data: data.payload,
          };
        }
        return response;
      })
      .catch((err) => {
        let response = {
          message: err.response?.data || err,
        };
        return response;
      });
  };

  delete = async (query) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.GRAPH,
      headers: headers,
      data: query,
    })
      .then((res) => {
        let data = res.data;

        var response;
        if (data.errors) {
          response = {
            message: data.errors[0]?.message,
          };
        } else {
          response = {
            status: http.Ok,
            message: "Request completed successfully",
            data: data.payload,
          };
        }
        return response;
      })
      .catch((err) => {
        let response = {
          message: err.response?.data || err,
        };
        return response;
      });
  };
}
