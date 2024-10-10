import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Button from "./Button";

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
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("verified") === "true") {
      setMessage("Email verified successfully. You can now log in.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();

    try {
      const res = await api.post(route, { email, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/deala");
      } else {
        setMessage("A verification email has been sent to your email address.");
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1 className="h1 mb-6">{name}</h1>
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
      <Button white className="mt-5" type="submit" disabled={loading}>
        {loading ? "Submitting..." : name}
      </Button>
      {loading && <span className="loading loading-ball loading-lg"></span>}
    </form>
  );
}

export default Form;

// import { useState } from "react";
// import api from "../api";
// import { useNavigate } from "react-router-dom";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import Button from "./Button";
// import ButtonGradient from "../assets/svg/ButtonGradient";

// function Form({ route, method }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState(""); // State for error message
//   const navigate = useNavigate();

//   const name = method === "login" ? "Login" : "Register";

//   const handleSubmit = async (e) => {
//     setLoading(true);
//     setError(""); // Reset error on new submission
//     e.preventDefault();

//     try {
//       const res = await api.post(route, { email, password });
//       if (method === "login") {
//         localStorage.setItem(ACCESS_TOKEN, res.data.access);
//         localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
//         navigate("/deala");
//       } else {
//         setMessage("A verification email has been sent to your email address.");
//         navigate("/login");
//       }
//     } catch (error) {
//       // Use the custom alert design for error
//       setError(
//         error.response?.data?.detail || "An error occurred. Please try again."
//       ); // Customize this based on your API response
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="form-container">
//       <h1 className="h1 mb-6">{name}</h1>
//       {error && ( // Display the error alert if there's an error
//         <div role="alert" className="alert mb-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             className="stroke-info h-6 w-6 shrink-0"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             ></path>
//           </svg>
//           <span>{error}</span>
//         </div>
//       )}
//       <input
//         className="form-input"
//         type="text"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Example@gmail.com"
//         required
//       />
//       <input
//         className="form-input"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//         required
//       />
//       <Button white className="mt-5" type="submit" disabled={loading}>
//         {loading ? "Submitting..." : name}{" "}
//         {/* Loader message during submission */}
//       </Button>
//       {loading && <span className="loading loading-ball loading-lg"></span>}{" "}
//       {/* Loading message */}
//     </form>
//   );
// }

// export default Form;
