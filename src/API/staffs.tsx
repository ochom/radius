import Axios from "axios";
import { API_ROOT, AuthHeaders } from "./config";

export const CreateStaff = () => {};

export const GetStaffs = () => {
  let headers = AuthHeaders();
  return Axios({
    method: "GET",
    url: `${API_ROOT}staffs`,
    headers: headers,
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};
