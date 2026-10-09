
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach the Bearer token from localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);

      if (parsedUserInfo?.token) {
        config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;