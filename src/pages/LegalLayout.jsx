import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const LegalLayout = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        {/* Legal Navigation */}
        <nav className="mb-8 flex flex-wrap gap-4">
          <NavLink
            to="/legal/terms"
            className={({ isActive }) =>
              `px-4 py-2 rounded transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Terms & Conditions
          </NavLink>
          <NavLink
            to="/legal/refund"
            className={({ isActive }) =>
              `px-4 py-2 rounded transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`
            }
          >
            Refund Policy
          </NavLink>
        </nav>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
