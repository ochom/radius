export const API_ROOT =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8000'
    : 'https://api.radius.lysofts.co.ke'

let VERSION_ROOT = API_ROOT + '/api/v1/'

export const AuthHeaders = () => {
  let token = localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`,
  }
}

export const http = {
  Ok: 200,
}

export const URLS = {
  GRAPH: `${API_ROOT}/query`,

  LOAD_USER: `${VERSION_ROOT}load-user`,
  LOGIN: `${VERSION_ROOT}login`,
  REGISTER: `${VERSION_ROOT}register`,

  STUDENT_PASSPORT: `${VERSION_ROOT}upload/student-passport`,
  STAFF_PASSPORT: `${VERSION_ROOT}upload/teacher-passport`,
  BOOK_COVER: `${VERSION_ROOT}upload/book-cover`,
}
