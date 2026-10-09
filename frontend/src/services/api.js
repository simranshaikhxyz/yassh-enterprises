
import axios from "axios";

const API = axios.create({
  baseURL: "https://yassh-enterprises-api.onrender.com",
});

// Attach the Bearer token from localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);

        if (parsedUserInfo?.token) {
          config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
        }
      } catch {
        localStorage.removeItem("userInfo");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;