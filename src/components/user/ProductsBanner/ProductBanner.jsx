import React, { useEffect, useState, useRef } from "react";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import { FaComputer, FaFire, FaMemory, FaHardDrive } from "react-icons/fa6";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "@fontsource/rajdhani";
import "@fontsource/rajdhani/700.css";
import "@fontsource/raleway";
import { featuredProduct } from "../../../Services/Products";
import SingeProductOverview from '../CardPage/SingleProductOverView';
import Loader from '../Loader/Loader';
import {useAuth} from '../../../Context/UserContext'
function ProductBanner() {
    const { token, setToken, user } = useAuth();
  
  const [darkMode, setDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: "50%", y: "50%" });
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const overlayRef = useRef(null);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);
  const [showOverview, setShowOverview] = useState(false);
  const modalRef = useRef(null);

  const handleBuyNow = () => {
    setShowOverview(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeOverview = () => {
    setShowOverview(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeOverview();
      }
    };

    if (showOverview) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOverview]);

  // Fetch featured products
  const getFeaturedProduct = async () => {
    try {
      const response = await featuredProduct();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  // Handle animations on component mount
  useEffect(() => {
    getFeaturedProduct();
    
    const textContent = document.querySelector(".textContents");
    const smallText = document.querySelector(".smallText");
    const rate = document.querySelector(".rate");

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

    // Auto-rotate carousel if more than one product
    if (products.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, 5000);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.body.style.overflow = 'auto'; // Cleanup
    };
  }, [products.length]);

  // Carousel navigation functions
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    resetInterval();
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === products.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    resetInterval();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (products.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, 5000);
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR'
    }).replace(/\.00$/, '');
  };

  // Calculate discount
  const calculateDiscount = (price, mrp) => {
    const discountPercentage = 10; // 10% discount for example
    const discountedPrice = parseFloat(mrp) - parseFloat(price);
    return {
      original: formatPrice(mrp),
      discounted: formatPrice(price),
      savings: formatPrice(discountedPrice)
    };
  };

  if (products.length === 0) {
    return <Loader/>;
  }

  const currentProduct = products[currentIndex];
  const priceInfo = calculateDiscount(currentProduct.product_details.price, currentProduct.product_details.mrp);

  return (
    <>
      {/* Modal/Popup for Product Overview */}
      {showOverview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fadeIn">
          <div 
            ref={modalRef}
            className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
          >
            <button 
              onClick={closeOverview}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SingeProductOverview product={currentProduct} onClose={closeOverview} />
          </div>
        </div>
      )}

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
        {/* Image section - on top for mobile */}
        <div className="w-full md:hidden block h-auto relative mb-8">
          <div className="relative w-full h-full">
            <img
              src={currentProduct.banner_image}
              alt={currentProduct.featured_name}
              className="w-full h-auto rounded-3xl transition-transform duration-500 ease-in-out hover:scale-105 object-cover relative z-10"
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
              {currentProduct.tagline} <br />
              <u>
                <span className="font-mono text-purple-600 animate-glitch">
                  {currentProduct.featured_name}
                </span>
              </u>
            </span>
          </div>

          <div className="smallText w-full max-w-xl h-auto my-5 mx-auto opacity-0 translate-y-5 transition-all duration-600 delay-400">
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaComputer className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                {currentProduct.cpu} - {currentProduct.cpu_clock}
              </span>
            </div>
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaFire className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                {currentProduct.gpu} - {currentProduct.gpu_vram}
              </span>
            </div>
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaMemory className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                {currentProduct.ram}
              </span>
            </div>
            <div className="flex items-center my-2 p-2 rounded-lg transition-all duration-300 hover:bg-purple-600/10 hover:translate-x-1">
              <FaHardDrive className="mr-2 text-purple-600 text-lg" />
              <span className="text-base sm:text-lg font-rajdhani">
                {currentProduct.storage}
              </span>
            </div>
          </div>

          <div className="rate text-center relative p-2 my-5 opacity-0 scale-90 transition-all duration-600 delay-600">
            <span className="text-xl sm:text-2xl font-raleway line-through">
              {priceInfo.original}
            </span>
            <span className="text-xl sm:text-2xl font-raleway font-bold ml-2 inline-block relative">
              {priceInfo.discounted}
            </span>
            <div className="absolute -top-4 right-1/3 bg-purple-600 text-white px-2 py-1 text-xs sm:text-sm font-bold rounded-full -rotate-5 animate-pulse">
              SAVE {priceInfo.savings}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {
              user ?  <button 
              onClick={handleBuyNow} 
              className="buy-now group flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white border-2 border-gray-700 rounded-lg py-3 px-4 w-full sm:w-48 my-2 font-rajdhani font-semibold text-base uppercase tracking-wide cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-600 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-md"
            >
              <IoArrowForwardCircleSharp className="text-xl md:text-2xl text-cyan-400 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="font-bold text-white group-hover:text-cyan-400">
                BUY NOW
              </span>
            </button> :  <button 
               
              className="buy-now group flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white border-2 border-gray-700 rounded-lg py-3 px-4 w-full sm:w-48 my-2 font-rajdhani font-semibold text-base uppercase tracking-wide cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-600 hover:border-cyan-400 hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5 active:shadow-md"
            >
              <IoArrowForwardCircleSharp className="text-xl md:text-2xl text-cyan-400 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="font-bold text-white group-hover:text-cyan-400">
               LOGIN NOW
              </span>
            </button>
            }
           
          </div>
        </div>

        {/* Image section - hidden on mobile, shown on desktop */}
        <div className="hidden md:block w-full md:w-[45%] max-w-lg h-auto relative">
          <div className="relative w-full h-full group">
            <img
              src={currentProduct.banner_image}
              alt={currentProduct.featured_name}
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

        {/* Carousel navigation arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800/80 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-300 z-20"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800/80 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-300 z-20"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Carousel indicators */}
      {products.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-purple-600 w-6" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
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
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
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