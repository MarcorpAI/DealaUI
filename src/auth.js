import api from "./api"; // Import your Axios instance
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

// This function handles refreshing the access token when it expires.
export const refreshAccessToken = async () => {
  try {
    // Retrieve the refresh token from local storage
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    // If no refresh token exists, stop further actions
    if (!refreshToken) return null;

    // Make a request to the refresh endpoint to get a new access token
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    // Save the new access token in local storage
    const newAccessToken = response.data.access;
    localStorage.setItem(ACCESS_TOKEN, newAccessToken);

    // Return the new access token
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};
