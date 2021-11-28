import Axios from "axios";
import { API_ROOT } from "../../common/config";

const login = (data) => {
  Axios.post(`${API_ROOT}/login`, data)
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("schoolID", res.data.schoolID);
    })
    .catch();
};

const register = (data) => {
  Axios.post(`${API_ROOT}/signup`, data)
    .then((res) => {})
    .catch();
};

export { login, register };
