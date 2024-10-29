import React, { useState } from "react";

const PoliciesPage = () => {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("terms")}
          className={`pb-2 ${
            activeTab === "terms" ? "border-b-2 font-bold" : ""
          }`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`pb-2 ${
            activeTab === "privacy" ? "border-b-2 font-bold" : ""
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab("refund")}
          className={`pb-2 ${
            activeTab === "refund" ? "border-b-2 font-bold" : ""
          }`}
        >
          Refund Policy
        </button>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {activeTab === "terms" && (
          <div>
            <h2 className="h1 mb-6">Terms & Conditions</h2>
            <div className="space-y-4">
              <section>
                <h3 className="font-bold mb-2">1. Service Description</h3>
                <p>Our service provides an AI shopping Assitant.</p>
              </section>

              <section>
                <h3 className="font-bold mb-2">2. User Accounts</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must provide accurate registration information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must be at least 18 years old to use the service</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold mb-2">3. Service Usage</h3>
                <p>Users agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Share account credentials</li>
                  <li>Violate any laws or regulations</li>
                  <li>Attempt to gain unauthorized access</li>
                </ul>
              </section>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div>
            <h2 className="h1 mb-6">Privacy Policy</h2>
            <div className="space-y-4">
              <section>
                <h3 className="font-bold mb-2">1. Data Collection</h3>
                <p>We collect the following information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email address</li>
                  <li>Usage data</li>
                  <li>Device information</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold mb-2">2. Data Usage</h3>
                <p>Your data is used for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing our services</li>
                  <li>Account management</li>
                  <li>Service improvements</li>
                </ul>
              </section>
            </div>
          </div>
        )}

        {activeTab === "refund" && (
          <div>
            <h2 className="h1 mb-6">Refund Policy</h2>
            <div className="space-y-4">
              <section>
                <h3 className="font-bold mb-2">1. Refund Eligibility</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Within 14 days of subscription</li>
                  <li>Service unavailability issues</li>
                  <li>Billing errors</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold mb-2">2. Refund Process</h3>
                <p>To request a refund:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact our support team</li>
                  <li>Provide your account details</li>
                  <li>State your reason for refund</li>
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliciesPage;
