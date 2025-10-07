import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRightCircle } from "lucide-react";
import Top from "./Top";
import { featuredProduct } from "../../../Services/Products";
import { useNavigate } from "react-router-dom";
import BannerBackground from "../../../Images/tokyo.jpg";

export default function GamingPCShowcase() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const hoverTimerRef = useRef(null);
  const productRowRef = useRef(null);
  const navigate = useNavigate();

  const getProducts = useCallback(async () => {
    try {
      const response = await featuredProduct();
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    getProducts();

    const style = document.createElement("style");
    style.innerHTML = `
      .parallelogram-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        height: 200px; /* Fixed height */
      }

      @media (min-width: 1024px) {
        .parallelogram-card {
          transform: skew(-15deg);
          width: 180px; /* Base width */
        }

        .parallelogram-card:hover {
          transform: skew(-15deg);
          width: 280px; /* Increased width on hover */
          height: 250px; /* Increased height by 20px on hover */
          z-index: 50; /* High z-index on hover */
        }

        .parallelogram-content {
          transform: skew(15deg);
        }
      }

      .parallelogram-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .product-scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .product-scroll-container::-webkit-scrollbar {
        display: none;
      }

      .glow-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 160%;
        height: 160%;
        background: radial-gradient(circle, rgba(79, 172, 254, 0.2) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.4s ease-in-out;
        pointer-events: none;
      }

      .parallelogram-card:hover .glow-effect {
        opacity: 1;
      }

      .product-image {
        width: 100px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
      }

      .expanded-content {
        opacity: 0;
        max-height: 0;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(-10px);
        padding: 0;
      }

      .parallelogram-card:hover .expanded-content {
        opacity: 1;
        max-height: 150px;
        transform: translateY(0);
        padding: 0.5rem;
      }

      .buy-now-button {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        border: none;
        border-radius: 20px;
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
      }

      .buy-now-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        background: linear-gradient(135deg, #dc2626, #b91c1c);
      }

      .base-content {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .parallelogram-card:hover .base-content {
        margin-bottom: 0.5rem;
      }

      /* Enhanced Mobile Styles */
      @media (max-width: 1024px) {
        .backbackground {
          display: block !important;
        }

        .product-scroll-container {
          overflow-x: auto;
          padding: 2rem 0;
        }

        .parallelogram-card {
          width: 280px !important; /* Increased width */
          height: 380px !important; /* Increased height for more space */
          margin: 0 16px; /* More spacing */
          border-radius: 24px !important; /* More rounded corners */
          transform: none !important;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15)) !important;
          backdrop-filter: blur(25px) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2) !important;
          border: 2px solid rgba(255, 255, 255, 0.4) !important;
          position: relative;
          z-index: 30 !important; /* Base z-index for mobile cards */
        }

        .parallelogram-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(147, 51, 234, 0.15));
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .parallelogram-card:hover::before {
          opacity: 1;
        }

        .parallelogram-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.3) !important;
          width: 280px !important;
          height: 400px !important; /* Increased height on hover */
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.25)) !important;
          z-index: 50 !important; /* Higher z-index on hover */
        }

        .parallelogram-content {
          transform: none !important;
          padding: 1.25rem 1rem; /* Reduced padding for more space */
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          height: 100% !important;
          position: relative;
          z-index: 40; /* Higher than card base */
        }

        .expanded-content {
          opacity: 1 !important;
          max-height: none !important;
          transform: none !important;
          padding: 0 !important;
        }

        .mobile-product-image {
          width: 100px; /* Optimized image size */
          height: 80px; /* Reduced height to save space */
          object-fit: cover;
          border-radius: 12px; /* Less rounded to save space */
          margin: 0 auto 0.75rem auto; /* Reduced margin */
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .parallelogram-card:hover .mobile-product-image {
          transform: scale(1.05);
        }

        .mobile-gpu-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-radius: 20px;
          padding: 0.375rem 0.75rem; /* Reduced padding */
          font-size: 0.75rem; /* Slightly smaller font */
          font-weight: 700;
          margin-bottom: 0.5rem; /* Reduced margin */
          box-shadow: 0 3px 12px rgba(239, 68, 68, 0.3);
          position: relative;
          overflow: hidden;
        }

        .mobile-gpu-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .parallelogram-card:hover .mobile-gpu-badge::before {
          left: 100%;
        }

        .mobile-product-title {
          font-size: 1rem; /* Optimized title size */
          font-weight: 700;
          margin-bottom: 0.375rem; /* Reduced margin */
          color: #1a1a1a;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
          line-height: 1.2; /* Tighter line height */
          text-align: center;
        }

        .mobile-product-subtitle {
          font-size: 0.8rem; /* Slightly smaller */
          color: rgba(26, 26, 26, 0.7);
          margin-bottom: 0.5rem; /* Reduced margin */
          text-align: center;
          font-weight: 500;
          line-height: 1.2;
        }

        .mobile-price {
          font-size: 1.2rem; /* Slightly smaller price */
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 0.75rem; /* Reduced margin */
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
          text-align: center;
        }

        .mobile-buy-button {
          width: 100%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          border-radius: 12px; /* Less rounded to save space */
          padding: 0.625rem 0.875rem; /* Optimized padding */
          font-size: 0.85rem; /* Optimized font size */
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: auto; /* Push button to bottom */
        }

        .mobile-buy-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .mobile-buy-button:hover::before {
          left: 100%;
        }

        .mobile-buy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
          background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        /* Add subtle animations */
        .parallelogram-card {
          animation: float 6s ease-in-out infinite;
        }
        
        .parallelogram-card:nth-child(2n) {
          animation-delay: -2s;
        }
        
        .parallelogram-card:nth-child(3n) {
          animation-delay: -4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      }

      /* Tablet and smaller mobile adjustments */
      @media (max-width: 640px) {
        .parallelogram-card {
          width: 260px !important; /* Slightly smaller for phones */
          height: 360px !important; /* Increased height for better button visibility */
          margin: 0 12px;
        }

        .parallelogram-card:hover {
          width: 260px !important;
          height: 380px !important; /* Increased hover height */
        }

        .mobile-product-image {
          width: 90px;
          height: 75px;
        }

        .mobile-product-title {
          font-size: 0.95rem;
        }

        .mobile-price {
          font-size: 1.1rem;
        }

        .mobile-buy-button {
          padding: 0.5rem 0.75rem;
          font-size: 0.8rem;
        }
      }

      /* Extra small devices */
      @media (max-width: 480px) {
        .parallelogram-card {
          width: 240px !important;
          height: 340px !important; /* Increased height for button visibility */
          margin: 0 10px;
        }

        .parallelogram-card:hover {
          width: 240px !important;
          height: 360px !important; /* Increased hover height */
        }

        .parallelogram-content {
          padding: 1rem 0.875rem;
        }

        .mobile-product-image {
          width: 85px;
          height: 70px;
        }

        .mobile-product-title {
          font-size: 0.9rem;
        }

        .mobile-price {
          font-size: 1rem;
        }

        .mobile-buy-button {
          padding: 0.5rem;
          font-size: 0.75rem;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [getProducts]);

  useEffect(() => {
    const container = productRowRef.current;
    if (!container || products.length === 0) return;

    // Check if it's a desktop view (width >= 1024px)
    const isDesktop = window.innerWidth >= 1024;
    
    if (isDesktop) {
      // Desktop auto-scroll behavior
      let frame;
      let start;
      const distance = container.scrollWidth - container.clientWidth;
      const duration = 25000;

      const scroll = (time) => {
        if (!start) start = time;
        const progress = Math.min((time - start) / duration, 1);
        container.scrollLeft = progress * distance;

        if (progress < 1) {
          frame = requestAnimationFrame(scroll);
        } else {
          setTimeout(() => {
            container.scrollLeft = 0;
            start = null;
            frame = requestAnimationFrame(scroll);
          }, 2000);
        }
      };

      frame = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(frame);
    } else {
      // Mobile auto-scroll to right behavior - faster (3 seconds)
      let frame;
      let start;
      const distance = container.scrollWidth - container.clientWidth;
      const duration = 3000; // 3 seconds to scroll to right

      const scrollToRight = (time) => {
        if (!start) start = time;
        const progress = Math.min((time - start) / duration, 1);
        container.scrollLeft = progress * distance;

        if (progress < 1) {
          frame = requestAnimationFrame(scrollToRight);
        } else {
          // Pause at the end for 2 seconds, then scroll back to start
          setTimeout(() => {
            const scrollBackDuration = 2000; // 2 seconds to scroll back
            let backStart;
            
            const scrollBack = (time) => {
              if (!backStart) backStart = time;
              const backProgress = Math.min((time - backStart) / scrollBackDuration, 1);
              container.scrollLeft = distance * (1 - backProgress);
              
              if (backProgress < 1) {
                requestAnimationFrame(scrollBack);
              } else {
                // Restart the cycle
                setTimeout(() => {
                  start = null;
                  frame = requestAnimationFrame(scrollToRight);
                }, 1000);
              }
            };
            
            requestAnimationFrame(scrollBack);
          }, 2000);
        }
      };

      frame = requestAnimationFrame(scrollToRight);
      return () => cancelAnimationFrame(frame);
    }
  }, [products]);

  const handleMouseEnter = useCallback((id) => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredProduct(id);
    }, 50);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimerRef.current);
    setHoveredProduct(null);
  }, []);

  const buyNow = useCallback((id) => {
    navigate(`/Details/${id}`);
  }, [navigate]);

  if (products.length === 0) {
    return (
      <div className="w-full h-screen mx-auto p-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-xl flex items-center justify-center">
        <div className="text-xl font-semibold">Loading products...</div>
      </div>
    );
  }

  return (
    <div
   
      className="w-full h-screen mx-auto p-3 bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-xl flex flex-col relative overflow-hidden"
      style={{ fontFamily: "'Rajdhani', sans-serif",opacity: 3.95 }}
    >
      <div
        className="backbackground hidden lg:block"
        style={{
          backgroundImage: `url(${BannerBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "fixed",
          width: "calc(100% - 1.5rem)",
          margin: "auto",
          borderRadius: "20px",
          height: "400px",
          top: "0.75rem",
          left: "0.75rem",
          zIndex: 1, // Lower z-index for background
        }}
      />

      <div className="flex-shrink-0 relative z-10">
        <Top />
      </div>

      <div className="flex-1 overflow-hidden rounded-[30px] flex items-center relative z-20"  style={{width:"100%",margin:'auto',display:'flex',alignItems:'center',justifyContent:'center'}} >
        <div className="w-full h-full flex items-center relative z-20">
          <div className="product-scroll-container w-full h-full flex items-center relative z-20">
            <div
            style={{width:"100%",margin:'auto',display:'flex',alignItems:'center',justifyContent:'center'}}
              ref={productRowRef}
              className="flex space-x-6 min-w-max h-full items-center px-8 relative z-30" // Increased z-index to 30
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="parallelogram-card flex-shrink-0 cursor-pointer relative z-40" // Increased z-index to 40
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={handleMouseLeave}
                 style={{ borderRadius: "20px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}


                >
                  <div className="glow-effect" />

                  <div className="parallelogram-content">
                    <div className="hidden lg:flex items-center h-full justify-center">
                      <div className="flex flex-row items-center w-full px-2">
                        <div className="flex-1 text-center">
                          <div className="base-content">
                            <div className="text-black text-sm font-semibold mb-2">
                              {product.featured_name}
                            </div>
                          </div>

                          <div className="expanded-content">
                            <div className="flex justify-center mb-2">
                              <div className="flex items-center bg-red-600/20 backdrop-blur-sm rounded-full px-2 py-1 border border-red-500/30">
                                <span className="text-red-300 text-xs font-semibold">
                                  {product.gpu}
                                </span>
                              </div>
                            </div>

                            <div className="text-center mb-2">
                              <div className="flex items-center justify-center text-black-300 text-xs mb-1">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                                {product.product_details.name}
                              </div>

                              <div className="text-sm font-bold text-black mb-2">
                                {product.product_details.mrp}
                              </div>
                            </div>

                            <div className="flex justify-center">
                              <button
                                onClick={() => buyNow(product.product_details.id)}
                                className="buy-now-button group"
                              >
                                <span>Buy Now</span>
                                <ArrowRightCircle
                                  className="group-hover:translate-x-1 transition-transform duration-300"
                                  size={14}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 ml-3">
                          <img
                            src={product.banner_image}
                            alt={product.featured_name}
                            className="product-image"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="lg:hidden flex flex-col h-full justify-between">
                      <div className="flex justify-center">
                        <img
                          src={product.banner_image}
                          alt={product.featured_name}
                          className="mobile-product-image"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-center">
                        <div className="mobile-product-title">
                          {product.featured_name}
                        </div>

                        <div className="flex justify-center mb-2">
                          <span className="mobile-gpu-badge">
                            {product.gpu}
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="mobile-product-subtitle">
                            {product.product_details.name}
                          </div>
                          <div className="mobile-price">
                            {product.product_details.mrp}
                          </div>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => buyNow(product.product_details.id)}
                          className="mobile-buy-button group"
                        >
                          <span>Buy Now</span>
                          <ArrowRightCircle 
                            className="group-hover:translate-x-1 transition-transform duration-300"
                            size={16} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/30 pointer-events-none lg:block hidden" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}