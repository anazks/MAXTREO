import React, { useEffect, useState, useRef } from "react";
import { FaCartPlus, FaChevronRight, FaTimes } from "react-icons/fa";
import { getPairedProduct } from "../../../Services/Products";
import SingeProductOverview from "../CardPage/SingleProductOverView";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../../Context/UserContext';

function BestPairedWith({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const [pairedProducts, setPairedProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [showOverview, setShowOverview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollContainerRef = useRef(null);
  const scrollInterval = useRef(null);

  const getProducts = async () => {
    try {
      const response = await getPairedProduct(product.id);
      setPairedProducts(response.data.paired_products || []);
    } catch (error) {
      console.error("Error fetching paired products:", error);
      setPairedProducts([]);
    }
  };

  useEffect(() => {
    getProducts();
    console.log("Product from :", product);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector(".best-paired-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, [product.id]);

  const handleProductHover = (id) => {
    setActiveProduct(id);
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    console.log(`Added product ${productId} to cart`);
    // Add your cart logic here
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowOverview(true);
    document.body.style.overflow = "hidden";
  };

  const handleView = (product) => {
    navigate(`/Details/${product.id}`);
  };

  const closeOverview = () => {
    setShowOverview(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {/* Product Overview Modal */}
      {showOverview && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeOverview}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <FaTimes className="text-2xl" />
            </button>
            <SingeProductOverview product={selectedProduct} />
          </div>
        </div>
      )}

      {/* Main Component */}
      <section
        className="best-paired-section py-4 transition-all duration-500 relative border border-gray-300 rounded-lg"
        style={{
          backgroundColor: "#fff",
          minHeight: "30vh",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          fontFamily: "Rajdhani, sans-serif",
        }}
      >
        <div className="h-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
          {/* Header */}
          <div className="text-center mb-2">
            <h3 className="text-sm md:text-base font-bold text-black">
              BEST PAIRED WITH
            </h3>
            <p className="text-xs md:text-sm text-gray-600 text-opacity-90">
              Complete your setup with these premium accessories
            </p>
          </div>

          {/* Products Horizontal Scroll */}
          {pairedProducts.length > 0 ? (
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-2 gap-3 snap-x scrollbar-hide px-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {pairedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-none w-48 snap-start bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-300"
                    onMouseEnter={() => handleProductHover(product.id)}
                    onMouseLeave={() => setActiveProduct(null)}
                  >
                    {/* Product Image */}
                    <div className="h-32 flex items-center justify-center p-2 bg-gray-50 relative">
                      <img
                        src={
                          product.paired_product_details.primary_image ||
                          "/default-product-image.png"
                        }
                        alt={product.paired_product_details.brand_name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-2 flex flex-col">
                      <div className="flex-grow">
                        <h3 className="text-sm font-bold text-black mb-0.5 line-clamp-2">
                          {product.paired_product_details.name}
                        </h3>
                        <p className="text-base font-bold text-red-600">
                          ₹
                          {product.paired_product_details.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {product.paired_product_details.short_description ||
                            "Premium quality accessory"}
                        </p>
                      </div>

                      {/* Action Button - Conditionally rendered based on auth status */}
                      <div className="mt-2">
                        {user ? (
                          <button
                            onClick={() =>
                              handleBuyNow(product.paired_product_details)
                            }
                            className="w-full py-2 rounded-lg text-xs font-[Rajdhani] font-bold tracking-wider text-black bg-gray-200 hover:bg-red-600 hover:text-white flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md border border-gray-300"
                          >
                            Buy Now
                          </button>
                        ) : (
                          <div>
                          <button
                            className="w-full py-2 rounded-lg text-xs font-[Rajdhani] font-bold tracking-wider text-black bg-gray-200 hover:bg-gray-300 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md border border-gray-300"
                            onClick={() =>
                              handleView(product.paired_product_details)
                            }
                          >
                            Quick View
                          </button>
                        </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll indicators */}
              <div className="flex justify-center mt-2 gap-1">
                {pairedProducts.map((_, i) => (
                  <button
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-red-600 transition-colors focus:outline-none"
                    aria-label={`Go to item ${i + 1}`}
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollTo({
                          left: i * 200,
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-black text-opacity-80 text-sm">
                No paired products found
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BestPairedWith;