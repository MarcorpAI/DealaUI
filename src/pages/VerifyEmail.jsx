import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const maxRetries = 3;
  const retryDelay = 2000;

  const verifyEmail = async (retryCount = 0) => {
    try {
      const response = await api.get(`api/verify-email/${token}`);

      if (response.data?.message) {
        if (response.data.message.includes("verified successfully")) {
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login?verified=true"), 3000);
        } else {
          setStatus(response.data.message);
        }
      } else {
        throw new Error("Unexpected response format");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error verifying email:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        // Token expired or invalid
        navigate("/login?session=expired");
        return;
      }

      if (retryCount < maxRetries) {
        setStatus(
          `Verification attempt failed. Retrying... (${
            retryCount + 1
          }/${maxRetries})`
        );
        setTimeout(() => verifyEmail(retryCount + 1), retryDelay);
      } else {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Email verification failed after multiple attempts.";
        setStatus(errorMessage);

        // If the error indicates an invalid token or expired session
        if (error.response?.data?.invalid) {
          setTimeout(() => navigate("/login?invalid=true"), 3000);
        } else if (error.response?.data?.expired) {
          setTimeout(() => navigate("/login?session=expired"), 3000);
        }

        setLoading(false);
      }
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? (
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <div className="text-center p-4 bg-white shadow-md rounded">
          {status}
        </div>
      )}
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
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(true);
//   const maxRetries = 3;
//   const retryDelay = 2000; // 2 seconds

//   const verifyEmail = async (retryCount = 0) => {
//     try {
//       console.log("Token being sent to backend:", token);

//       const response = await api.get(`api/verify-email/${token}`);

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
//       setLoading(false); // Turn off loading
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
//         setLoading(false); // Turn off loading if max retries reached
//       }
//     }
//   };

//   useEffect(() => {
//     verifyEmail();
//   }, [token, navigate]);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       {loading ? (
//         <div className="mt-8 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
//         </div>
//       ) : (
//         <div className="text-center p-4 bg-white shadow-md rounded">
//           {status}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VerifyEmail;
