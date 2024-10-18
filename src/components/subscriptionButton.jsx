import React from "react";
import { createCheckout } from "../api";
import Button from "./Button";

const SubscriptionButton = ({ variantId, planName }) => {
  const handleSubscribe = async () => {
    try {
      const response = await createCheckout(variantId);
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  };

  return (
    <Button white className="mb-2" onClick={handleSubscribe}>
      Subscribe to {planName}
    </Button>
  );
};

export default SubscriptionButton;
