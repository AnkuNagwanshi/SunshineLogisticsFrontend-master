import axios from "axios";

import toast from "react-hot-toast";

// import { getSessionItem, } from "../lib/helperFucntion";
// import { environment } from '../../devConfig'

// const getAccessToken = () => getSessionItem('authToken')

// const getAccessToken = () => {
//   const role = getSessionItem("userRole");
//   console.log("role from axiosInstance - ", role);

//   switch (role) {
//     case "admin":
//       return getSessionItem("adminToken");
//     case "delivery_agent":
//       return getSessionItem("agentToken");
//     case "customer":
//       return getSessionItem("customerToken");
//     default:
//       return null;
//   }
// };

const axiosInstance = axios.create({
  // baseURL: environment.baseUrl,
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// no need this because i have different three tokens now
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     config.headers["DeviceType"] = "web";
//     return config;
//   },
//   (error) => {
//     console.log("Error", error);
   
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.request.use((config) => {
  const role = sessionStorage.getItem("userRole");
  let token = null;

  if (role === "admin" || role === "sub_admin") token = sessionStorage.getItem("adminToken");
  else if (role === "delivery_agent") token = sessionStorage.getItem("agentToken");
  else if (role === "customer") token = sessionStorage.getItem("customerToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Optional enhancement:
//     // if (error.response?.status === 401) {
//     //   toast.error("Session expired. Please login again.")
//     //   sessionStorage.clear()
//     //   localStorage.removeItem("userData")
//     //   window.location.href = "/login"
//     // }
//     return Promise.reject(error);
//   }
// );

// Optionally: Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";

      if (requestUrl.includes("/admin")) {
        // 🔐 Admin-specific unauthorized message
        toast.error("Unauthorized! Please check your admin credentials.");
        console.warn("Admin unauthorized access attempt.");
        // Redirect admin to admin login page
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1500);
      
      } else if (requestUrl.includes("/login")) {
        // 👥 Common for Customer & Delivery Agent
        toast.error("Unauthorized! Please check your credentials or register first.");
        console.warn("Unauthorized login attempt (customer/agent).");
        // Redirect customer or agent to login page
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        // 🌐 Generic fallback
        toast.error("Unauthorized access! Please log in again.");
        console.warn("Generic unauthorized access detected.");

         // Fallback redirect
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
