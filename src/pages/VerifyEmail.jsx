import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email. Please wait...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`api/verify-email/${token}/`);
        console.log("Verification response:", response);
        if (response.data.message.includes("verified successfully")) {
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login?verified=true"), 3000);
        } else {
          setStatus(
            response.data.message ||
              "Email verification failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus(
          error.response?.data?.error ||
            "Email verification failed. Please try again."
        );
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return <div>{status}</div>;
};

export default VerifyEmail;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";

// const VerifyEmail = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("Verifying your email. Please wait...");

//   useEffect(() => {
//     const verifyEmail = async () => {
//       try {
//         const response = await api.get(`api/verify-email/${token}/`);
//         if (response.data.message === "Email verified successfully!") {
//           setStatus("Email verified successfully! Redirecting to login...");
//           setTimeout(() => navigate("/login"), 3000);
//         } else {
//           setStatus("Email verification failed. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error verifying email:", error);
//         setStatus("Email verification failed. Please try again.");
//       }
//     };

//     verifyEmail();
//   }, [token, navigate]);

//   return <div>{status}</div>;
// };

// export default VerifyEmail;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api";

// const VerifyEmail = () => {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Redirect to login page after a short delay
//     const timer = setTimeout(() => {
//       navigate(`/login?token=${token}`);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [token, navigate]);

//   return <div>Verifying your email. Please wait...</div>;
// };

// export default VerifyEmail;
