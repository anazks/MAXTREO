import React, { useEffect, useState, useRef } from "react";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { FaComputer, FaFire, FaMemory, FaHardDrive } from "react-icons/fa6";
import "@fontsource/rajdhani";
import "@fontsource/rajdhani/700.css";
import "@fontsource/raleway";
import image from "../../../Images/Rectangle 532.jpg";
import { featuredProduct } from "../../../Services/Products";

function ProductBanner() {
  const [darkMode, setDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: "50%", y: "50%" });
  const overlayRef = useRef(null);

  // Handle animations on component mount
  useEffect(() => {
    const textContent = document.querySelector(".textContents");
    const smallText = document.querySelector(".smallText");
    const rate = document.querySelector(".rate");
    featuredProduct();
    // Add animation classes after a short delay
    setTimeout(() => {
      textContent?.classList.add("animate-fadeIn");
      setTimeout(() => {
        smallText?.classList.add("animate-fadeIn");
        setTimeout(() => {
          rate?.classList.add("animate-fadeIn");
        }, 200);
      }, 200);
    }, 200);

    // Track mouse movement for overlay effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: `${e.clientX}px`,
        y: `${e.clientY}px`,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const getFeaturedProduct = async () => {
    try {
      let Products = await featuredProduct();
      console.log(Products, "banner/.....................");
    } catch (error) {
      console.log(error);
    }
  };
  getFeaturedProduct()
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-transparent pointer-events-none z-50 scale-0 rounded-full transition-transform duration-500 ease-in-out"
        style={{
          "--mouse-x": mousePosition.x,
          "--mouse-y": mousePosition.y,
        }}
      ></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background shapes for visual interest */}
        <div className="absolute top-1/4 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      <div
        className={`w-full max-w-6xl mx-auto mt-10 md:mt-16 flex flex-col md:flex-row justify-around gap-5 relative z-10 p-4 transition-colors duration-300 ${
          darkMode ? "text-white bg-gray-900 rounded-xl" : ""
        }`}
      >
        {/* Toggle dark mode button */}

        {/* Image section - on top for mobile */}
        <div className="w-full md:hidden block h-auto relative mb-8">
          <div className="relative w-full h-full">
            <img
              src={image}
              alt="FPS MONGER Gaming PC"
              className="w-full h-auto rounded-3xl transition-transform duration-500 ease-in-out hover:scale-105 object-cover relative z-10 shadow-lg"
            />
            {/* Floating spec indicators on the image */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-600 rounded-full animate-pulse-ring">
              <span className="absolute -top-10 -left-2 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                CPU
              </span>
            </div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-cyan-500 rounded-full animate-pulse-ring">
              <span className="absolute -top-10 -left-2 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                GPU
              </span>
            </div>
          </div>
        </div>

        {/* Text content - below image for mobile */}
        <div className="w-full md:w-1/2 flex flex-col items-start relative p-0 md:p-5">
          <div className="textContents w-full mt-0 md:mt-5 opacity-0 -translate-x-5 transition-all duration-600 delay-200">
            <span className="text-3xl sm:text-4xl md:text-5xl font-rajdhani font-semibold inline-block">
              FRAMES SPEAK MORE <br /> THAN SPECS. <br />
              MEET THE <br />
              FPS{" "}
              <u>
                <span className="font-mono text-purple-600 animate-glitch">
                  MONGER
                </span>
              </u>
            </span>
          </div>

          <div className="smallText w-full max-w-xl h-auto my-5 mx-auto opacity-0 translate-y-5 transition-all duration-600 delay-400">
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaComputer className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                Intel Core i7 14700K - 5.6GHz Max Clock
              </span>
            </div>
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaFire className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                Nvidia RTX 4070Ti - 8GB DDR6 VRAM
              </span>
            </div>
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaMemory className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                Corsair Vengeance DDR5 - 16GB
              </span>
            </div>
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaHardDrive className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                Samsung 970 Evo Pro - 1TB
              </span>
            </div>
          </div>

          <div className="rate text-center relative p-2 my-5 opacity-0 scale-90 transition-all duration-600 delay-600">
            <span className="text-xl sm:text-2xl font-raleway line-through">
              ₹2,77,990
            </span>
            <span className="text-xl sm:text-2xl font-raleway font-bold ml-2 inline-block relative">
              ₹2,57,990
            </span>
            <div className="absolute -top-4 right-1/3 bg-purple-600 text-white px-2 py-1 text-xs sm:text-sm font-bold rounded-full -rotate-5 animate-pulse">
              SAVE ₹20,000
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button className="buy-now group flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white border-2 border-gray-700 rounded-lg py-3 px-4 w-full sm:w-48 my-2 font-rajdhani font-semibold text-base uppercase tracking-wide cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-600 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-md">
              <IoArrowForwardCircleSharp className="text-xl md:text-2xl text-cyan-400 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="font-bold text-white group-hover:text-cyan-400">
                BUY NOW
              </span>
            </button>

            <button className="flex items-center justify-center gap-3 bg-transparent border-2 border-gray-700 rounded-lg py-3 px-4 w-full sm:w-48 my-2 font-rajdhani font-semibold text-base uppercase tracking-wide cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg hover:bg-gray-100 hover:border-purple-600 hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-md">
              <span className="font-bold">CUSTOMIZE</span>
            </button>
          </div>
        </div>

        {/* Image section - hidden on mobile, shown on desktop */}
        <div className="hidden md:block w-full md:w-[45%] max-w-lg h-auto relative">
          <div className="relative w-full h-full group">
            <img
              src={image}
              alt="FPS MONGER Gaming PC"
              className="w-full h-auto max-h-[80vh] rounded-3xl transition-transform duration-500 ease-in-out group-hover:scale-105 object-cover relative z-10 shadow-xl"
            />
            {/* Floating spec indicators on the image */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-purple-600 rounded-full animate-pulse-ring cursor-pointer">
              <span className="absolute -top-10 -left-2 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                CPU
              </span>
            </div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-cyan-500 rounded-full animate-pulse-ring cursor-pointer">
              <span className="absolute -top-10 -left-2 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                GPU
              </span>
            </div>
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-500 rounded-full animate-pulse-ring cursor-pointer">
              <span className="absolute -top-10 -left-2 bg-black/70 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                SSD
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
            box-shadow: 0 0 0 0 rgba(156, 39, 176, 0.7);
          }
          70% {
            transform: scale(1);
            opacity: 0.3;
            box-shadow: 0 0 0 10px rgba(156, 39, 176, 0);
          }
          100% {
            transform: scale(0.8);
            opacity: 0.8;
            box-shadow: 0 0 0 0 rgba(156, 39, 176, 0);
          }
        }

        @keyframes pulse-dot {
          0% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(1);
          }
          100% {
            transform: scale(0.8);
          }
        }

        .animate-glitch {
          animation: glitch 5s infinite alternate;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }

        .animate-pulse-dot {
          animation: pulse-dot 2s infinite;
        }

        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }

        .animate-fadeIn {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
          scale: 1 !important;
        }

        .font-rajdhani {
          font-family: "Rajdhani", sans-serif;
        }

        .font-raleway {
          font-family: "Raleway", sans-serif;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .buy-now {
            height: auto;
            padding: 0.75rem 1rem;
            width: 100%;
          }

          .textContents span {
            font-size: 2rem;
            line-height: 1.2;
          }

          .smallText div {
            padding: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default ProductBanner;
