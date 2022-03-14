import Axios from 'axios'
import { URLS } from '../app/config'

export const loadUser = async (token) => {
  let headers = {
    Authorization: `Bearer ${token}`,
  }

  return Axios({
    method: 'GET',
    url: URLS.LOAD_USER,
    headers: headers,
  })
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err
    })
}

export const login = async (data) => {
  return Axios({
    method: 'POST',
    url: URLS.LOGIN,
    data,
  })
    .then((res) => {
      let response = {
        status: res.status,
        data: res.data,
        message: 'Login successful',
      }
      return response
    })
    .catch((err) => {
      let response = {
        message: err.response?.data || err,
      }
      return response
    })
}

export const register = async (data) => {
  return Axios({
    method: 'POST',
    url: URLS.REGISTER,
    data,
  })
    .then((res) => {
      let response = {
        status: res.status,
        data: res.data,
        message: 'Registration successful',
      }
      return response
    })
    .catch((err) => {
      let response = {
        message: err.response?.data || err,
      }
      return response
    })
}
