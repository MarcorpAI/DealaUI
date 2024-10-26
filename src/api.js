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
// / Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        const response = await api.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        if (response.data.access) {
          // Store new tokens
          localStorage.setItem(ACCESS_TOKEN, response.data.access);
          if (response.data.refresh) {
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
          }

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user and redirect to login
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
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
