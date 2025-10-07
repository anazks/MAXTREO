import { useState, useEffect, useRef } from "react";
import { ArrowRightCircle } from "lucide-react";
import Top from "./Top";
import { featuredProduct } from "../../../Services/Products";
import { useNavigate } from "react-router-dom";

export default function GamingPCShowcase() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const hoverTimerRef = useRef(null);
  const productRowRef = useRef(null);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const response = await featuredProduct();
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
    const style = document.createElement("style");
    style.innerHTML = `
      .parallelogram-card {
        transform: skew(-10deg);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        margin: 0 8px;
      }
      
      .parallelogram-card:hover {
        transform: skew(-10deg) scale(1.03);
        z-index: 10;
        padding: 8px;
      }
      
      .parallelogram-content {
        transform: skew(10deg);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px;
      }
      
      .product-scroll-container::-webkit-scrollbar {
        display: none;
      }
      
      .product-scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow-x: auto;
        overflow-y: hidden;
      }
      
      .glow-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(79, 172, 254, 0.15) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        pointer-events: none;
      }
      
      .parallelogram-card:hover .glow-effect {
        opacity: 0.7;
      }
      
      .product-image {
        width: 100px;
        height: 80px;
        object-fit: contain;
        margin-bottom: 8px;
        transition: all 0.3s ease;
      }
      
      .parallelogram-card:hover .product-image {
        transform: scale(1.1);
      }
      
      .product-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: black;
        text-align: center;
        margin-bottom: 8px;
      }
      
      .expanded-content {
        opacity: 0;
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(-8px);
      }
      
      .parallelogram-card:hover .expanded-content {
        opacity: 1;
        max-height: 180px;
        transform: translateY(0);
      }
      
      @media (max-width: 1024px) {
        .parallelogram-card {
          min-width: 200px;
        }
        
        .product-image {
          width: 90px;
          height: 70px;
        }
      }
      
      @media (max-width: 768px) {
        .parallelogram-card {
          min-width: 180px;
          transform: skew(-8deg);
        }
        
        .parallelogram-content {
          transform: skew(8deg);
          padding: 10px;
        }
        
        .product-image {
          width: 80px;
          height: 60px;
        }
        
        .product-name {
          font-size: 0.9rem;
        }
      }
      
      @media (max-width: 640px) {
        .parallelogram-card {
          min-width: 160px;
          transform: skew(-5deg);
        }
        
        .parallelogram-content {
          transform: skew(5deg);
          padding: 8px;
        }
        
        .product-image {
          width: 70px;
          height: 50px;
        }
        
        .product-name {
          font-size: 0.85rem;
          margin-bottom: 6px;
        }
        
        .parallelogram-card:hover {
          padding: 6px;
        }
      }
      
      @media (max-width: 480px) {
        .parallelogram-card {
          min-width: 140px;
          transform: skew(0);
        }
        
        .parallelogram-content {
          transform: skew(0);
          padding: 6px;
        }
        
        .product-image {
          width: 60px;
          height: 40px;
        }
        
        .product-name {
          font-size: 0.8rem;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const container = productRowRef.current;
    if (!container || products.length === 0) return;

    let animationId;
    let startTime;
    let isScrolling = false;

    const startAutoScroll = () => {
      if (isScrolling) return;
      isScrolling = true;
      startTime = null;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      const duration = Math.max(15000, products.length * 3000);

      const scroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        container.scrollLeft = easeInOut * maxScrollLeft;

        if (progress < 1) {
          animationId = requestAnimationFrame(scroll);
        } else {
          setTimeout(() => {
            container.scrollLeft = 0;
            isScrolling = false;
            startAutoScroll();
          }, 1500);
        }
      };

      animationId = requestAnimationFrame(scroll);
    };

    const timeoutId = setTimeout(startAutoScroll, 1000);

    const handleMouseEnter = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        isScrolling = false;
      }
    };

    const handleMouseLeave = () => {
      if (!isScrolling) {
        setTimeout(startAutoScroll, 500);
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [products]);

  const handleMouseEnter = (id) => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredProduct(id);
    }, 50);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimerRef.current);
    setHoveredProduct(null);
  };

  const BuyNow = (id) => {
    navigate(`/Details/${id}`);
  };

  return (
    <div
      className="w-full h-full bg-white bg-opacity-80 backdrop-blur-sm text-gray-900 flex flex-col relative overflow-hidden"
      style={{
        width: "97vw",
        height: "97vh",
        borderRadius: "20px",
      }}
    >
      <div className="flex-shrink-0">
        {/* <Top /> */}
      </div>

      <div className="flex-1 flex flex-col min-h-0 p-3 md:p-4 lg:p-6">
        <div className="flex-1 flex flex-col min-h-0">
          <div 
            ref={productRowRef}
            className="product-scroll-container flex-1 flex items-center min-h-0 py-3 px-2"
          >
            <div className="flex space-x-3 md:space-x-4 lg:space-x-5 min-w-max h-full items-center">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`parallelogram-card flex-shrink-0 cursor-pointer ${
                    hoveredProduct === product.id 
                      ? "w-56 h-64 md:w-64 md:h-72" 
                      : "w-44 h-52 md:w-52 md:h-60"
                  }`}
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  <div className="glow-effect"></div>

                  <div className="parallelogram-content">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="flex-1 text-center">
                        <div className="product-name">
                          {product.featured_name}
                        </div>

                        <div className="expanded-content">
                          <div className="flex items-center justify-center mb-2">
                            <div className="flex items-center bg-red-600/20 backdrop-blur-sm rounded-full px-2 py-1 border border-red-500/30">
                              <span className="text-red-600 text-xs font-semibold">
                                {product.gpu}
                              </span>
                            </div>
                          </div>

                          <div className="text-center mb-2">
                            <div className="flex items-center justify-center text-black text-xs mb-1">
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                              {product.product_details?.name || 'N/A'}
                            </div>

                            <div className="text-lg font-bold text-black mb-2">
                              {product.product_details?.mrp || 'N/A'}
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() => BuyNow(product.product_details?.id)}
                              className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition-all duration-200 group shadow hover:shadow-md"
                            >
                              <span>Buy Now</span>
                              <ArrowRightCircle
                                className="ml-1 group-hover:translate-x-1 transition-transform duration-200"
                                size={14}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 mt-2">
                        <img
                          src={product.banner_image}
                          alt={product.featured_name}
                          className="product-image"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}