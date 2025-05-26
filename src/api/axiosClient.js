// src/api/axiosClient.js
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8000/api/users", // Update as needed
});

// Function to check if a token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
};

let isRefreshing = false;
let subscribers = [];

const onRefreshed = (token) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

const subscribeTokenRefresh = (cb) => {
  subscribers.push(cb);
};

// Request interceptor
api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken && isTokenExpired(accessToken)) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await axios.post("http://localhost:8000/api/users/token/refresh/", {
          refresh: refreshToken,
        });

        accessToken = response.data.access;
        localStorage.setItem("accessToken", accessToken);
        isRefreshing = false;
        onRefreshed(accessToken);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Logout user
        return Promise.reject(err);
      }
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(config);
      });
    });
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default api;
