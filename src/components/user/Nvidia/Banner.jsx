import React from "react";
import BannerImage from "../../../Images/nv4.png";

// Placeholder for NVIDIA banner image - replace with actual image path

function Banner() {
  return (
    <div
      className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100"
      style={{
        width: "100vw",
        height: "100vh",

        fontFamily: "'Rajdhani', sans-serif",
       
      }}
    >
      <div className="max-w-4xl w-full flex flex-col items-center gap-4">
        {/* Compact Hero Section */}
        <div className="text-center mb-4 px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Welcome to
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              {" "}
              NVIDIA
            </span>
            <span className="block text-lg md:text-xl lg:text-2xl font-semibold text-gray-600 mt-1">
              Technology Hub
            </span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Discover cutting-edge graphics processing technology and AI
            computing solutions.
          </p>
        </div>

        {/* Main NVIDIA Banner - Smaller Size */}
        <a href="/nvidia">
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-lg w-full max-w-10xl border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="relative bg-white rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={BannerImage}
                alt="NVIDIA Technology Solutions"
                className="w-full h-48 md:h-64 lg:h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
              />
              {/* Simple Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>

              {/* Minimal Action Button */}
              <div className="absolute bottom-4 right-4">
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                  Explore
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </a>

        {/* Simple Feature Tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["RTX Graphics", "AI Computing", "GeForce Gaming"].map((feature) => (
            <span
              key={feature}
              className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium hover:bg-green-100 transition-colors duration-200"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
