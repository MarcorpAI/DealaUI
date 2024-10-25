import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { refreshAccessToken } from "./auth"; // Import the function to refresh token

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header if access token is available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and refresh token if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error, attempt to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevents multiple retries

      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (refreshToken) {
        try {
          // Call function to refresh access token
          const newToken = await refreshAccessToken(refreshToken);
          localStorage.setItem(ACCESS_TOKEN, newToken); // Save new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`; // Set the new token in the headers
          return api(originalRequest); // Retry original request with new token
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
        }
      }
    }

    return Promise.reject(error); // Reject if no valid refresh process
  }
);

// API utility functions
export const checkSubscription = () => api.get("/api/check-subscription/");

export const createCheckout = (variantId) =>
  api.post("/api/create-checkout/", { variant_id: variantId });

export default api;

// import axios from "axios";

// import { ACCESS_TOKEN } from "./constants";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(ACCESS_TOKEN);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

// export const checkSubscription = () => {
//   return api.get("/api/check-subscription/");
// };

// // added not useful comment

// export const createCheckout = (variantId) => {
//   return api.post("/api/create-checkout/", { variant_id: variantId });
// };
