import Axios from "axios";
import { AuthHeaders, http, URLS } from "./config";
import { GraphResponse, Response } from "../Models/common";

export class Service {
  getData = async (query: any) => {
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

  createOrUpdate = async (data: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.GRAPH,
      headers: headers,
      data: data,
    })
      .then((res) => {
        let data: GraphResponse = res.data;

        var response: Response;
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
        let response: Response = {
          message: err.response ? err.response.data : err,
        };
        return response;
      });
  };

  delete = async (query: any) => {
    let headers = AuthHeaders();
    return Axios({
      method: "POST",
      url: URLS.GRAPH,
      headers: headers,
      data: query,
    })
      .then((res) => {
        let data: GraphResponse = res.data;

        var response: Response;
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
        let response: Response = {
          message: err.response ? err.response.data : err,
        };
        return response;
      });
  };
}
