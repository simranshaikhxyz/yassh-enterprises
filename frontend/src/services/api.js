import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Intercept requests and attach the Bearer token from localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;

    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;