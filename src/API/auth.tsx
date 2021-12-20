import Axios from "axios";
import { API_ROOT } from "./config";
import { Response } from "../Models/common";

export const Login = (data: any) => {
  return Axios.post(`${API_ROOT}login`, data)
    .then((res) => {
      let response: Response = {
        status: res.status,
        data: res.data,
        message: "Login successful",
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

export const Register = (data: any) => {
  return Axios.post(`${API_ROOT}register`, data)
    .then((res) => {
      let response: Response = {
        status: res.status,
        data: res.data,
        message: "Registration successful",
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
