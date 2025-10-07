import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?...",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?...",
  "https://media.istockphoto.com/id/526845820/photo/tokyo-tower-night-view.jpg?...",
];

function Top() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white bg-opacity-70 backdrop-blur-sm rounded-xl mt-2 mb-0 p-2 sm:p-3 overflow-visible z-10" >
      <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden relative min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px]"> {/* Reduced height */}
        {/* Image slider */}
        <div className="w-full lg:w-2/3 relative group rounded-xl">
          <div className="bg-black h-28 sm:h-32 md:h-36 lg:h-40 xl:h-full w-full rounded-xl overflow-hidden relative"> {/* Reduced height */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 mix-blend-overlay z-10"></div>

            <div className="absolute inset-0 transition-all duration-500 ease-in-out">
              <img
                src={images[currentImageIndex]}
                alt="Gaming setup"
                className={`object-cover w-full h-full transition-all duration-500 ease-in-out ${
                  isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
                }`}
                loading="lazy"
              />
            </div>

            {/* Navigation buttons - hidden on mobile */}
            <button
              onClick={prevImage}
              className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 z-20 hidden sm:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-2 opacity-0 group-hover:opacity-100 z-20 hidden sm:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicator dots - smaller on mobile */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentImageIndex(index);
                        setIsTransitioning(false);
                      }, 150);
                    }
                  }}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Text Section - Responsive layout */}
        <div className="lg:w-1/3 p-2 sm:p-3 md:p-4 h-auto lg:h-36 xl:h-40"> {/* Reduced height */}
          <div className="bg-white flex flex-col justify-between h-full p-3 sm:p-4 rounded-xl">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">Gaming Squad</p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mt-1 mb-1 leading-tight">Radicle Gaming</h2>
              <p className="text-xs sm:text-sm text-gray-600">Exclusive partnership</p>
            </div>

            <div className="mt-2 sm:mt-3"> {/* Reduced margin */}
              <p className="text-xs text-gray-600 mb-1">Subscribe for Exclusive Content</p> {/* Reduced margin */}
              <button style={{marginTop:"25px"}} className="bg-black text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center space-x-2 w-full hover:bg-gray-800 transition-all duration-200 text-xs sm:text-sm font-medium">
                <span>Subscribe</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Additional mobile-specific styles */
        @media (max-width: 640px) {
          .group:hover .opacity-0 {
            opacity: 0 !important;
          }
        }
        
        /* Touch-friendly image slider for mobile */
        @media (max-width: 768px) {
          .group {
            touch-action: pan-x;
          }
        }
      `}</style>
    </div>
  );
}

export default Top;