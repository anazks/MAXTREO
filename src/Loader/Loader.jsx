import React from "react";
import neoTokyoLogo from "../Images/LoginWith/neo_tokyo-logo.png";

export default function SimpleSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            {/* Spinning border */}
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500" />

            {/* Non-spinning logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Using an imported image reference */}
              <img
                src={neoTokyoLogo}
                alt="Neo Tokyo Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
