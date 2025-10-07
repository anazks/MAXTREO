import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { recomendation } from '../../../Services/Products';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function ProductCard({ product }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const scrollInterval = useRef(null);
  const navigate = useNavigate();

  // Memoized fetch function with proper dependencies
  const fetchRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await recomendation({ product_id: product.id });
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [product.id]);

  // Memoized product click handler
  const handleProductClick = useCallback((productId) => {
    navigate(`/Details/${productId}`);
  }, [navigate]);

  // Memoized quick view handler to prevent unnecessary re-renders
  const handleQuickView = useCallback((e, productId) => {
    e.stopPropagation();
    handleProductClick(productId);
  }, [handleProductClick]);

  // Auto-scroll carousel effect with cleanup
  useEffect(() => {
    if (!products.length) return;

    const scrollCarousel = () => {
      if (!carouselRef.current) return;
      
      const container = carouselRef.current;
      const scrollAmount = 1;

      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollAmount;
      }
    };

    scrollInterval.current = setInterval(scrollCarousel, 30);

    const carousel = carouselRef.current;
    const handleMouseEnter = () => clearInterval(scrollInterval.current);
    const handleMouseLeave = () => {
      scrollInterval.current = setInterval(scrollCarousel, 30);
    };

    if (carousel) {
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearInterval(scrollInterval.current);
      if (carousel) {
        carousel.removeEventListener('mouseenter', handleMouseEnter);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [products.length]);

  // Initial data fetch
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Memoized product cards to prevent unnecessary re-renders
    const productCards = useMemo(() => (
    products.map((product, index) => {
      const productDetails = product.recommended_product_details || {};
      const mainImage = productDetails.images?.[0]?.image || '/placeholder-product.jpg';
      const price = productDetails.price ? `₹
${parseFloat(productDetails.price).toFixed(2)}` : '₹0.00';
      return (
        <div 
          className="flex-none w-56 sm:w-60 md:w-64 snap-start bg-white transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-300 rounded-lg overflow-hidden"
          key={`${product.id}-${index}`}
          onClick={() => handleProductClick(productDetails.id)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label={`View ${productDetails.name}`}
          role="button"
          tabIndex={0}
        >
          <div className="relative h-40 md:h-48 overflow-hidden bg-gray-50">
            <img
              src={mainImage}
              alt={productDetails.name || 'Product image'}
              className="w-full h-full object-contain transition-transform duration-500 ease-in-out hover:scale-105"
              loading="lazy"
            />
            
            {product.tag && (
              <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold uppercase text-white
                ${product.tag === 'Popular' ? 'bg-blue-600' : 
                  product.tag === 'Sale' ? 'bg-red-600' : 
                  'bg-green-600'}`}
              >
                {product.tag}
              </span>
            )}
            
            
          {hoveredIndex === index && (
              <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <button 
                  className="w-full py-2 rounded-lg text-xs font-[Rajdhani] font-bold tracking-wider text-black bg-gray-200 hover:bg-red-500 hover:text-white flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md"
                  onClick={(e) => handleQuickView(e, productDetails.id)}
                >
                  View
                </button>
              </div>
            )}
          </div>
          
          <div className="p-3 text-center">
            <h3 className="text-black font-medium truncate text-sm">{productDetails.name}</h3>
            <p className="text-red-600 font-semibold text-base" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              {price}
            </p>
          </div>
        </div>
      );
    })
  ), [products, hoveredIndex, handleProductClick, handleQuickView]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 md:p-8 text-center border border-gray-300 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 uppercase" style={{fontFamily: 'Rajdhani, sans-serif'}}>
          YOU MAY ALSO LIKE:
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white p-6 md:p-8 text-center border border-gray-300 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 uppercase" style={{fontFamily: 'Rajdhani, sans-serif'}}>
          YOU MAY ALSO LIKE:
        </h2>
        <p className="text-red-600 mb-4 text-sm">{error}</p>
        <button 
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render empty state
  if (!products.length) {
    return (
      <div className="bg-white p-6 md:p-8 text-center border border-gray-300 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 uppercase" style={{fontFamily: 'Rajdhani, sans-serif'}}>
          YOU MAY ALSO LIKE:
        </h2>
        <p className="text-gray-600 text-sm">No recommendations available at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 border border-gray-300 rounded-lg">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-black mb-8 uppercase" style={{fontFamily: 'Rajdhani, sans-serif'}}>
        YOU MAY ALSO LIKE:
      </h2>
      
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto pb-4 gap-4 md:gap-6 snap-x scrollbar-hide" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {productCards}
      </div>
      
      {products.length > 4 && (
        <div className="flex justify-center mt-4 gap-1">
          {[...Array(Math.ceil(products.length / 4))].map((_, i) => (
            <button
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300 hover:bg-red-600 transition-colors focus:outline-none"
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollTo({
                    left: i * carouselRef.current.offsetWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};