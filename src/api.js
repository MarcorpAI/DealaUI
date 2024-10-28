import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track token refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add request interceptor
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

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is not 401 or we've already retried, reject immediately
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      const { access, refresh } = response.data;

      if (access) {
        localStorage.setItem(ACCESS_TOKEN, access);
        if (refresh) {
          localStorage.setItem(REFRESH_TOKEN, refresh);
        }

        // Update auth header for original request
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Process any queued requests
        processQueue(null, access);

        return api(originalRequest);
      } else {
        throw new Error("No access token received");
      }
    } catch (refreshError) {
      // Clear tokens and process queue with error
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      processQueue(refreshError, null);

      // Redirect to login with expired session parameter
      window.location.href = "/login?session=expired";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// API utility functions
export const checkSubscription = () => api.get("/api/check-subscription/");

export const createCheckout = (variantId) =>
  api.post("/api/create-checkout/", { variant_id: variantId });

// Helper function to check if tokens exist
export const hasValidTokens = () => {
  return !!(
    localStorage.getItem(ACCESS_TOKEN) && localStorage.getItem(REFRESH_TOKEN)
  );
};

// Helper function to clear auth state
export const clearAuthState = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};

export default api;

// import axios from "axios";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
// import { refreshAccessToken } from "./auth"; // Import the function to refresh token

// // Create an Axios instance
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// // / Add request interceptor to add token to all requests
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

// // Add response interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If error is 401 and we haven't tried to refresh token yet
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Try to refresh the token
//         const refreshToken = localStorage.getItem(REFRESH_TOKEN);
//         const response = await api.post("/api/token/refresh/", {
//           refresh: refreshToken,
//         });

//         if (response.data.access) {
//           // Store new tokens
//           localStorage.setItem(ACCESS_TOKEN, response.data.access);
//           if (response.data.refresh) {
//             localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
//           }

//           // Retry the original request
//           originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         // If refresh fails, logout user and redirect to login
//         localStorage.removeItem(ACCESS_TOKEN);
//         localStorage.removeItem(REFRESH_TOKEN);
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // API utility functions
// export const checkSubscription = () => api.get("/api/check-subscription/");

// export const createCheckout = (variantId) =>
//   api.post("/api/create-checkout/", { variant_id: variantId });

// export default api;
