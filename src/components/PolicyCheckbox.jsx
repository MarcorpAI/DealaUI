import React from "react";

const PolicyCheckbox = ({ checked, onChange }) => {
  return (
    <div className="flex items-start space-x-2 mb-4">
      <input
        type="checkbox"
        id="policy-accept"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
        required
      />
      <label htmlFor="policy-accept" className="text-sm">
        I agree to the{" "}
        <a href="/policy" target="_blank" className="text-blue-600">
          Terms & Conditions, Privacy Policy, and Refund Policy
        </a>
      </label>
    </div>
  );
};

export default PolicyCheckbox;
