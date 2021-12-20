import Axios from "axios";
import { AuthHeaders } from "./config";
import { URLS } from "./urls";

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
