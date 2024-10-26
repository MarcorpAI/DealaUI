import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Button from "./Button";
import { LogIn } from "lucide-react";
import Register from "../pages/Register";

function Form({ route, method }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const name = method === "login" ? "Login" : "Register";

  useEffect(() => {
    // Check URL parameters for verification status
    const queryParams = new URLSearchParams(location.search);
    const verified = queryParams.get("verified");
    const expired = queryParams.get("expired");
    const invalid = queryParams.get("invalid");

    if (verified === "true") {
      setMessage("Email verified successfully. You can now log in.");
    } else if (expired === "true") {
      setError(
        "Verification link expired. Please check your email for a new link."
      );
    } else if (invalid === "true") {
      setError("Invalid verification link. Please try registering again.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post(route, { email, password });

      if (method === "login") {
        if (res.data.access && res.data.refresh) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
          navigate("/deala");
        } else {
          setError("Invalid login response. Please try again.");
        }
      } else {
        setMessage(
          "Registration successful! Please check your email for verification instructions."
        );
        // Delay redirect to allow user to read the message
        setTimeout(() => navigate("/login"), 5000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.response?.data?.email?.[0] ||
        "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="h1 mb-6">{name}</h2>
      {message && (
        <div role="alert" className="alert alert-success mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div role="alert" className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <input
        className="form-input"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Example@gmail.com"
        required
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <div className="flex justify-center mt-10">
        <a
          className="text-xs font-code font-bold tracking-wider uppercase border-b"
          href="/pricing"
        ></a>
      </div>
      {name === "Login" ? (
        <p>
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      )}

      <Button white className="mt-5" type="submit" disabled={loading}>
        {loading ? "Submitting..." : name}
      </Button>
      {loading && <span className="loading loading-ball loading-lg"></span>}
    </form>
  );
}

export default Form;
