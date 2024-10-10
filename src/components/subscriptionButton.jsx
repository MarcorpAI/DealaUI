import React from "react";
import { createCheckout } from "../api";

const SubscriptionButton = ({ variantId, planName }) => {
  const handleSubscribe = async () => {
    try {
      const response = await createCheckout(variantId);
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  };

  return <button onClick={handleSubscribe}>Subscribe to {planName}</button>;
};

export default SubscriptionButton;
