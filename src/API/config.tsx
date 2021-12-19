export const API_ROOT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/v1/"
    : "https://project-x.herokuapp.com/";
