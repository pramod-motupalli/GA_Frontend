// src/AppWrapper.js
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AppWrapper = ({ children }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const refreshAccessToken = async () => {
        const access = localStorage.getItem("accessToken");
        const refresh = localStorage.getItem("refreshToken");

        if (access && refresh) {
          try {
            const { exp } = jwtDecode(access);
            const isExpired = Date.now() >= exp * 1000;
            // console.log(exp>Date.now())
            if (isExpired) {
              const res = await axios.post("http://localhost:8000/api/users/token/refresh/", {
                refresh,
              });
              localStorage.setItem("accessToken", res.data.access);
              console.log("Access token refreshed.");
            }
          } catch (error) {
            console.error("Session expired or invalid token. Redirecting to login.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        }
      };

      refreshAccessToken();
    }, 60 * 1000); // Check every 1 minute

    return () => clearInterval(interval); // Cleanup
  }, []);

  return children;
};

export default AppWrapper;
