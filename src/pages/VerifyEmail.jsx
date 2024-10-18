import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email. Please wait...");
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds

  const verifyEmail = async (retryCount = 0) => {
    try {
      console.log("Token being sent to backend:", token);

      const response = await api.get(
        `api/verify-email/${token}/?ngrok-skip-browser-warning=true`
      );

      console.log("Full response:", response);

      if (response.data && response.data.message) {
        if (response.data.message.includes("verified successfully")) {
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login?verified=true"), 3000);
        } else {
          setStatus(response.data.message);
        }
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      if (retryCount < maxRetries) {
        setStatus(
          `Verification attempt failed. Retrying... (${
            retryCount + 1
          }/${maxRetries})`
        );
        setTimeout(() => verifyEmail(retryCount + 1), retryDelay);
      } else {
        setStatus(
          error.response?.data?.error ||
            error.message ||
            "Email verification failed after multiple attempts. Please try again later."
        );
      }
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center p-4 bg-white shadow-md rounded">{status}</div>
    </div>
  );
};

export default VerifyEmail;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";

// const VerifyEmail = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("Verifying your email. Please wait...");
//   const maxRetries = 3;
//   const retryDelay = 2000; // 2 seconds

//   const verifyEmail = async (retryCount = 0) => {
//     try {
//       console.log("Token being sent to backend:", token);

//       const response = await api.get(
//         `api/verify-email/${token}/?ngrok-skip-browser-warning=true`
//       );

//       console.log("Full response:", response);

//       if (response.data && response.data.message) {
//         if (response.data.message.includes("verified successfully")) {
//           setStatus("Email verified successfully! Redirecting to login...");
//           setTimeout(() => navigate("/login?verified=true"), 3000);
//         } else {
//           setStatus(response.data.message);
//         }
//       } else {
//         throw new Error("Unexpected response format");
//       }
//     } catch (error) {
//       console.error("Error verifying email:", error);
//       if (retryCount < maxRetries) {
//         setStatus(
//           `Verification attempt failed. Retrying... (${
//             retryCount + 1
//           }/${maxRetries})`
//         );
//         setTimeout(() => verifyEmail(retryCount + 1), retryDelay);
//       } else {
//         setStatus(
//           error.response?.data?.error ||
//             error.message ||
//             "Email verification failed after multiple attempts. Please try again later."
//         );
//       }
//     }
//   };

//   useEffect(() => {
//     verifyEmail();
//   }, [token, navigate]);

//   return <div>{status}</div>;
// };

// export default VerifyEmail;
