// src/api/axiosClient.js
import axios from "axios";
import jwtDecode from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8000/api/users",
});

const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return Date.now() >= exp * 1000;
};

api.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken && isTokenExpired(accessToken)) {
    try {
      const response = await axios.post("http://localhost:8000/api/users/token/refresh/", {
        refresh: refreshToken,
      });
      accessToken = response.data.access;
      localStorage.setItem("accessToken", accessToken);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }
  }

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
