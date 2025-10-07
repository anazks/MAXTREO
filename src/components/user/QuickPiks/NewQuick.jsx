import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRightCircle } from 'lucide-react';
import { featuredProduct } from '../../../Services/Products';
import { useNavigate } from 'react-router-dom';

function NewQuick() {
  // Top section images
  const images = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    "https://media.istockphoto.com/id/526845820/photo/tokyo-tower-night-view.jpg?s=2048x2048&w=is&k=20&c=fYGxJ-OgThFhiU4NgJt0plW07TJKk1n1TD9dcdRe8p0=",
  ];

  // Product cards state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const hoverTimerRef = useRef(null);
  const productRowRef = useRef(null);
  const navigate = useNavigate();

  // Fetch products
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
  }, [getProducts]);

  // Top section image slider
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

  // Product cards auto-scroll
  useEffect(() => {
    const container = productRowRef.current;
    if (!container || products.length === 0) return;

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

  return (
    <div className="w-full bg-white bg-opacity-70 backdrop-blur-sm" >
      {/* Top Section */}
      <div className="w-full max-w-5xl mx-auto p-3">
        <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden relative min-h-[200px] md:min-h-[250px]">
          {/* Image slider */}
          <div className="w-full lg:w-2/3 relative group rounded-xl">
            <div className="bg-black h-48 md:h-56 lg:h-full w-full rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 mix-blend-overlay z-10"></div>

              <div className="absolute inset-0 transition-all duration-500 ease-in-out">
                <img
                  src={images[currentImageIndex]}
                  alt="Gaming setup"
                  className={`object-cover w-full h-full transition-all duration-500 ease-in-out ${
                    isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
                  }`}
                  style={{ borderRadius: "10px" }}
                  loading="lazy"
                />
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 md:p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 md:p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 md:h-4 md:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
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
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="lg:w-1/3 p-4 h-48 md:h-56 lg:h-full">
            <div className="bg-white flex flex-col justify-between h-full p-4 rounded-xl">
              <div>
                <p className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  Gaming Squad
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-1 mb-1">
                  Radicle Gaming
                </h2>
                <p className="text-xs md:text-sm text-gray-600">
                  Exclusive partnership
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-2">
                  Subscribe for Exclusive Content
                </p>
                <button className="bg-black text-white rounded-full px-4 py-2 flex items-center justify-center space-x-2 w-full hover:bg-gray-800 transition-all duration-200 text-sm font-medium">
                  <span>Subscribe</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 md:h-4 md:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Cards Section */}
      <div className="w-full p-4">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-xl font-semibold">Loading products...</div>
          </div>
        ) : (
          <div className="product-scroll-container overflow-x-auto pb-4">
            <div
              ref={productRowRef}
              className="flex space-x-4 min-w-max"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`w-64 h-80 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                    hoveredProduct === product.id ? 'transform scale-105 shadow-lg' : ''
                  }`}
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="h-full flex flex-col">
                    <div className="h-40 bg-gray-100 flex items-center justify-center p-4">
                      <img
                        src={product.banner_image}
                        alt={product.featured_name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {product.featured_name}
                      </h3>
                      
                      <div className="mb-2">
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {product.gpu}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.product_details.name}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="text-lg font-bold text-gray-900 mb-3">
                          {product.product_details.mrp}
                        </div>
                        
                        <button
                          onClick={() => buyNow(product.product_details.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center transition-colors duration-200"
                        >
                          <span className="mr-2">Buy Now</span>
                          <ArrowRightCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewQuick;