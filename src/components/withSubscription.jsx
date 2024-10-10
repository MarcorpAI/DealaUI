import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkSubscription } from "../api";

const withSubscription = (WrappedComponent) => {
  return (props) => {
    const [isSubscribed, setIsSubscribed] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const checkUserSubscription = async () => {
        try {
          const response = await checkSubscription();
          setIsSubscribed(response.data.is_subscribed);
          if (!response.data.is_subscribed) {
            navigate("/pricing");
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
          navigate("/login");
        }
      };

      checkUserSubscription();
    }, [navigate]);

    if (isSubscribed === null) {
      return <div>Loading...</div>;
    }

    return isSubscribed ? <WrappedComponent {...props} /> : null;
  };
};

export default withSubscription;
