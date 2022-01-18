import Axios from "axios";
import { Response } from "../Models/common";
import { URLS } from "./config";

export const Login = (data: any) => {
  return Axios.post(`${URLS.LOGIN}`, data)
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
        message: err.response?.data || err,
      };
      return response;
    });
};

export const Register = (data: any) => {
  return Axios.post(`${URLS.REGISTER}`, data)
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
        message: err.response?.data || err,
      };
      return response;
    });
};
