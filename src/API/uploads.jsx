import axios from "axios";
import { AuthHeaders, URLS } from "./config";

export class UploadService {
  uploadStudentPassPort = async (data, onUploadProgress) => {
    let authHeaders = AuthHeaders();
    const options = {
      headers: {
        ...authHeaders,
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    }

    return axios.post(URLS.STUDENT_PASSPORT, data, options)
      .then((res) => {
        if (res.status === 200) {
          return {
            status: res.status,
            message: res.data,
          };
        }
      })
      .catch((err) => {
        return {
          message: "upload failed",
        };
      });
  };


  uploadTeacherPassPort = async (data, onUploadProgress) => {
    let authHeaders = AuthHeaders();
    const options = {
      headers: {
        ...authHeaders,
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    }

    return axios.post(URLS.STAFF_PASSPORT, data, options)
      .then((res) => {
        if (res.status === 200) {
          return {
            status: res.status,
            message: res.data,
          };
        }
      })
      .catch((err) => {
        return {
          message: "upload failed",
        };
      });
  };
}
