import React, { useEffect, useState } from "react";
import { getPurchasedProducts, getDrivers } from "../../../Services/userApi";
import Loader from "../../../Loader/Loader";
import ProductFooter from "../Footer/ProductFooter";
import ModernNavbar from "../NavBar/NavBar";
import "./PurchasedProduct.css";
import { FaSync } from "react-icons/fa";
import { ShoppingBag, ChevronDown, ChevronUp, Download, X } from "lucide-react";
import neoImage from "../../../Images/back_ground1.jpg";
import image_on_tokyo from "../../../Images/image_on_tokyo.jpg";

function PurchasedProducts() {
  const [loader, setLoader] = useState(true);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [openAccordions, setOpenAccordions] = useState({});
  const [error, setError] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverModalData, setDriverModalData] = useState({
    title: "",
    drivers: [],
    loading: false,
  });

  // Toggle accordion open/closed state
  const toggleAccordion = (productId) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const fetchPurchasedProducts = async () => {
    try {
      setLoader(true);
      let response = await getPurchasedProducts();

      if (response && response.data) {
        setPurchasedProducts(response.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        error.message || "Failed to load products. Please try again later."
      );
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Function to get driver details from API
  const handleDriverClick = async (product, driverType) => {
    try {
      setDriverModalData({
        title: `${driverType} for ${product.name}`,
        drivers: [],
        loading: true,
      });
      setShowDriverModal(true);

      // Make API call to get drivers
      const response = await getDrivers(product.id, driverType);

      // Assume response.data contains drivers array
      setDriverModalData((prev) => ({
        ...prev,
        drivers: response.data || [],
        loading: false,
      }));
    } catch (error) {
      setDriverModalData((prev) => ({
        ...prev,
        drivers: [],
        error: "Failed to load drivers. Please try again.",
        loading: false,
      }));
    }
  };

  // Function to group attributes by category
  const groupAttributesByCategory = (attributes) => {
    const grouped = {};

    attributes.forEach((attr) => {
      const categoryName = attr.attribute.category.name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(attr);
    });

    return grouped;
  };

  // Driver Modal Component - Now fully responsive
  const DriversModal = () => {
    if (!showDriverModal) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowDriverModal(false)}
        ></div>

        {/* Modal Content - Responsive sizing */}
        <div className="bg-white rounded-lg w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl max-h-[90vh] p-3 sm:p-4 md:p-6 shadow-xl relative z-10 transform transition-all duration-300 scale-100 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-3 sm:mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 pr-2 leading-tight">
              {driverModalData.title}
            </h3>
            <button
              onClick={() => setShowDriverModal(false)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0 p-1"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Body - Scrollable content */}
          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
            {driverModalData.loading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-4 border-gray-300 border-t-pink-500"></div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Loading drivers...</p>
              </div>
            ) : driverModalData.error ? (
              <div className="text-center py-6 sm:py-8 text-red-500 text-sm sm:text-base">
                {driverModalData.error}
              </div>
            ) : driverModalData.drivers.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-600 text-sm sm:text-base">
                No drivers available for this product.
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {driverModalData.drivers.map((driver, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          {driver.is_critical ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-200">
                              Critical
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                              Standard
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base mb-1 break-words">
                          {driver.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                          {driver.description}
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <span className="block">Version: {driver.version}</span>
                          <span className="block">Released: {driver.days_ago}</span>
                        </div>
                      </div>

                      <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded flex items-center gap-1 flex-shrink-0 w-full sm:w-auto justify-center transition-colors duration-200">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 flex justify-end pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowDriverModal(false)}
              className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-xs sm:text-sm font-medium text-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      <ModernNavbar />
      <div>
        <div className="main-container px-2 sm:px-4 lg:px-6">
          <div className="titleContainer"></div>

          {loader ? (
            <Loader />
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4 sm:p-8 text-center bg-gray-50 rounded-lg shadow-sm mx-2 sm:mx-4">
              <div className="text-3xl sm:text-5xl mb-4 bg-pink-100 p-3 sm:p-4 rounded-full">
                ⚠️
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Error loading products
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mb-6">{error}</p>
              <button
                onClick={fetchPurchasedProducts}
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-6 py-2 rounded-md transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FaSync className={loader ? "animate-spin" : ""} /> Retry
              </button>
            </div>
          ) : purchasedProducts && purchasedProducts.length > 0 ? (
            <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
              {/* Background image - hidden on mobile, responsive positioning */}
              <div className="hidden lg:block fixed top-[50px] w-[25%] xl:w-[30%] h-[400px] xl:h-[600px] rounded-[10px] overflow-hidden -z-10 right-[50px] xl:right-[100px] bg-gray-100 bg-opacity-10 backdrop-blur-[2px]">
                <img
                  src={image_on_tokyo}
                  alt="Tokyo"
                  className="h-full w-full object-cover"
                />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2">
                Your Purchased Products
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {purchasedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-600 rounded-lg overflow-hidden bg-opacity-50 backdrop-blur-md mx-2 sm:mx-0"
                  >
                    {/* Product Header - Responsive layout */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden mx-auto sm:mx-0">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Basic Info */}
                      <div className="flex-grow w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg break-words">
                              {product.name}
                            </h3>
                            <span className="text-xs text-gray-500 block">
                              {product.product_code}
                            </span>
                            <p className="text-sm text-gray-700 mt-1">
                              {product.brand_name}
                            </p>
                          </div>

                          <div className="flex justify-center sm:justify-end w-full sm:w-auto">
                           <button
  className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
    openAccordions[product.id] 
      ? "bg-pink-800 shadow-inner" 
      : "bg-pink-600 hover:bg-pink-700 shadow-md"
  }`}
  style={{
    color: "white",
    fontWeight: 500,
    letterSpacing: "0.025em",
    minWidth: "120px",
    border: "none",
    outline: "none",
    transform: openAccordions[product.id] ? "translateY(1px)" : "none"
  }}
  onClick={() => toggleAccordion(product.id)}
>
  <span className="text-sm sm:text-base">
    {openAccordions[product.id] ? "Hide Details" : "Show Details"}
  </span>
  {openAccordions[product.id] ? (
    <ChevronUp className="ml-2 w-4 h-4 transition-transform duration-200" />
  ) : (
    <ChevronDown className="ml-2 w-4 h-4 transition-transform duration-200" />
  )}
</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accordion Content with Animation */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        openAccordions[product.id]
                          ? "max-h-[2000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div
                        className="relative bg-cover bg-center p-3 sm:p-6"
                        style={{
                          backgroundImage: `url(${neoImage})`,
                          backgroundSize: "cover",
                          transform: openAccordions[product.id]
                            ? "translateY(0)"
                            : "translateY(-10px)",
                          transition: "transform 0.5s ease-in-out",
                        }}
                      >
                        {/* Blurred card overlay - Responsive */}
                        <div className="w-full sm:w-11/12 mx-auto bg-white bg-opacity-50 backdrop-blur-md rounded-lg p-3 sm:p-5 shadow-lg">
                          <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                            Product Details & Drivers
                          </h4>

                          {/* Group attributes by category - Responsive grid */}
                          {product.attributes &&
                            Object.entries(
                              groupAttributesByCategory(product.attributes)
                            ).map(([category, attrs]) => (
                              <div key={category} className="mb-3 sm:mb-4">
                                <h5 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
                                  {category}
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                  {attrs.map((attr) => (
                                    <div
                                      key={attr.id}
                                      className="bg-white bg-opacity-80 p-2 sm:p-3 rounded"
                                    >
                                      <span className="block text-xs sm:text-sm font-medium">
                                        {attr.attribute.name}
                                      </span>
                                      <div className="text-xs text-gray-700 mt-1">
                                        {attr.details.map((detail, idx) => (
                                          <span
                                            key={detail.id}
                                            className="block break-words"
                                          >
                                            {detail.value}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                          {/* Driver Downloads Section - Responsive buttons */}
                          <div className="mt-4 border-t border-gray-300 pt-4">
                            <h5 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
                              Downloads & Drivers
                            </h5>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                              <button
                                className="flex items-center justify-center text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors duration-200 transform hover:-translate-y-0.5 hover:shadow-md w-full sm:w-auto"
                                onClick={() =>
                                  handleDriverClick(product, "User Manual")
                                }
                              >
                                <Download className="w-3 h-3 mr-2" /> User Manual
                              </button>
                              <button
                                className="flex items-center justify-center text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors duration-200 transform hover:-translate-y-0.5 hover:shadow-md w-full sm:w-auto"
                                onClick={() =>
                                  handleDriverClick(product, "Driver Package")
                                }
                              >
                                <Download className="w-3 h-3 mr-2" /> Driver Package
                              </button>
                              <button
                                className="flex items-center justify-center text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition-colors duration-200 transform hover:-translate-y-0.5 hover:shadow-md w-full sm:w-auto"
                                onClick={() =>
                                  handleDriverClick(product, "Warranty Info")
                                }
                              >
                                <Download className="w-3 h-3 mr-2" /> Warranty Info
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-white rounded-lg shadow-sm border border-gray-100 text-center mx-2 sm:mx-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-full mb-4">
                <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-pink-500" />
              </div>

              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
                No purchased products yet
              </h3>

              <p className="text-sm sm:text-base text-gray-500 mb-6">
                Discover amazing items to add to your collection
              </p>

              <a
                href="/products"
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 sm:px-6 rounded-md transition-colors duration-300 flex items-center text-sm sm:text-base"
              >
                Browse Products
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Driver Modal */}
      <DriversModal />

      <ProductFooter />
    </div>
  );
}

export default PurchasedProducts;