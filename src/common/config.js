export const API_ROOT =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_DEV
    : process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_PROD
    : process.env.REACT_APP_API_TEST;
