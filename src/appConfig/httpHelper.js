const { default: Axios } = require("axios");
const axios = Axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

axios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("jwt"));;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (process.env.REACT_APP_API_WITH_CREDENTIALS === 'true') {
      config.withCredentials = true;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
export default axios;
