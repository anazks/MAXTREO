import React, { useEffect, useRef, useState } from 'react';

// Sample logo placeholders using external URLs
const logoPlaceholders = {
  amd: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg',
  cooler: 'https://tse2.mm.bing.net/th/id/OIP.3ns0IJDLF6H4O8XkN8QqrgHaEK?pid=Api&P=0&h=180',
  western: 'https://logos-world.net/wp-content/uploads/2023/01/Western-Digital-Logo-1971.png',
  logitech: 'https://s24.q4cdn.com/131595232/files/doc_multimedia/High_Resolution_JPG-LogitechG_horz_RGB_black_SM.jpg',
  samsung: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
  intel: 'https://1000logos.net/wp-content/uploads/2021/05/Intel-logo.png',
  corsair: 'https://logos-world.net/wp-content/uploads/2023/01/Corsair-Logo.png',
};

function Brands() {
  const partners = [
    { name: "AMD", logo: logoPlaceholders.amd, description: "High-Performance Computing" },
    { name: "Cooler Master", logo: logoPlaceholders.cooler, description: "Advanced Cooling Solutions" },
    { name: "Western Digital", logo: logoPlaceholders.western, description: "Data Storage Innovation" },
    { name: "Logitech", logo: logoPlaceholders.logitech, description: "Gaming & Productivity" },
    { name: "Samsung", logo: logoPlaceholders.samsung, description: "Memory & Display Technology" },
    { name: "Intel", logo: logoPlaceholders.intel, description: "Processor Excellence" },
    { name: "Corsair", logo: logoPlaceholders.corsair, description: "Gaming Components" }
  ];

  return (
    <div 
      className="w-full h-screen flex justify-center items-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        padding: "2rem",
        boxSizing: "border-box"
      }}
    >
      <div className="w-full max-w-7xl mx-auto  flex flex-col">
        {/* Fixed Header Section */}
        <div className="text-center mb-2 sm:mb-4 px-4 pt-4" style={{marginTop: '2rem'}}>
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
            Our Technology Partners
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-lg max-w-3xl mx-auto mb-2 px-2">
            Collaborating with industry leaders to deliver cutting-edge solutions and innovation
          </p>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-pink-600 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Content Area - Horizontal scrolling */}
        <div className="flex-1 overflow-hidden flex flex-col" style={{ height: '420px' }}>
          {/* Horizontal scrolling brands container - Increased height */}
          <div className="flex-1 overflow-hidden" > {/* Increased height */}
            <div className="h-full overflow-x-auto py-4 px-1 hide-scrollbar"> {/* Added vertical padding */}
              <div className="flex space-x-3 md:space-x-4 px-2 min-w-max h-full items-center"> {/* Added h-full and items-center */}
                {partners.map((partner, index) => (
                  <div
                    key={`brand-${index}`}
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] flex-shrink-0"
                    style={{ minWidth: '180px', maxWidth: '180px', height: '180px' }} /* Added fixed height */
                  >
                    <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg border border-gray-100 hover:border-pink-500 transition-all duration-300 h-full flex flex-col">
                      <div className="flex flex-col items-center text-center flex-grow">
                        <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-pink-50 transition-colors duration-300 mb-2">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-pink-600 transition-colors duration-300">
                          {partner.name}
                        </h3>
                        <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 mt-1">
                          {partner.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Section - Without icons */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mx-2 mt-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "7+", label: "Partners" },
                { value: "50M+", label: "Products" },
                { value: "100+", label: "Countries" },
                { value: "24/7", label: "Support" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-2 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all duration-200"
                >
                  <div className="text-lg font-bold text-pink-600">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact CTA */}
          <div className="px-2 mt-4 mb-2">
            <button className="w-full bg-dark text-white font-bold py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors duration-300 text-sm">
              Partner With Us
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}

export default Brands;