import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EmailVerification = () => {
  const { token } = useParams(); // This captures the token from the URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/api/verify-email/${token}/`); // Send the token to the backend
        if (response.data.message) {
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
        } else {
          setMessage("Error verifying email. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setMessage("Invalid token or verification failed.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default EmailVerification;
