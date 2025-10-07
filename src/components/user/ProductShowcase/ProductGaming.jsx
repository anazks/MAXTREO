import React, { useState, useEffect } from "react";
import {
  Monitor,
  Cpu,
  Zap,
  Shield,
  Image,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaFilter, 
  FaSort,
  FaShoppingCart,
  FaBolt
} from "react-icons/fa";
import { getPageData } from "../../../Services/Settings";
import ultimateGaming from "../../../Images/Product_testimages/utimategaming_setups.jpg";
import NeoNavBar from "../NavBar/NavBar";
import Footer from "../Footer/ProductFooter";
import { useLocation, useParams } from "react-router-dom";
import BaseURL from "../../../Static/Static";
import Loader from '../../../Loader/Loader'

const GamingPCWebsite = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [heroSlides, setheroSlides] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // For React Router
  const location = useLocation();
  const DropDownId = location.state?.id; // if using state

  useEffect(() => {
    const fetchData = async () => {
      if (DropDownId) {
        try {
          setLoading(true);
          const data = await getPageData(DropDownId);
          console.log(data, "data for page....");
          if (data) {
            setPageData(data);
            setheroSlides(data.hero_carousels);
            setProducts(data.category_products);
          }
        } catch (error) {
          console.error("Error fetching page data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [DropDownId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + heroSlides.length) % heroSlides.length
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <NeoNavBar />

      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "Rajdhani, sans-serif", marginTop: "60px" }}
      >
        {/* Hero Carousel Section with Background Images */}
        <section className="relative h-screen min-h-[600px] overflow-hidden">
          {/* Background Images */}
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${BaseURL}${slide.image})`,
                  transform: "scale(1.05)",
                }}
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="text-center pt-16 sm:pt-0">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 transform translate-y-0"
                        : "opacity-0 transform translate-y-8 absolute inset-0 flex flex-col justify-center"
                    }`}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight text-white">
                      {slide.head_one}
                      <span className="text-pink-500 block mt-1 sm:mt-2">
                        {slide.head_two}
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-3xl mx-auto px-4">
                      {slide.description}
                    </p>
                    <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full">
                      <button className="bg-pink-600 hover:bg-pink-700 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 text-white shadow-lg flex-1 min-w-0 max-w-[200px]"
                      onClick={() => window.location.href = "/products"}
                      >
                        Shop
                      </button>
                      <button className="border-2 border-white/70 text-white hover:border-pink-500 hover:text-pink-500 hover:bg-white/10 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex-1 min-w-0 max-w-[200px]"
                      onClick={() => window.location.href = "/contact"}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 lg:p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 lg:p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-pink-500 scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
            <div className="flex flex-col items-center text-white/70 animate-bounce">
              <div className="w-5 h-8 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
              </div>
              <span className="text-xs mt-1">Scroll</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-14 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Discover Your Perfect PC with Our
                <span className="text-pink-600 block">
                  Comprehensive Filtering Options
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {pageData?.specifications?.length > 0 &&
                pageData?.specifications?.length > 0 &&
                pageData?.specifications.map((spec, index) => (
                  <>
                    <div className="text-center">
                      <div className="bg-pink-600 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                        <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                        {spec.title || "Advanced Filtering Options"}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm max-w-sm mx-auto">
                        {spec.description ||
                          "Filter by CPU, GPU, RAM, and more to find your ideal gaming setup."}
                      </p>
                    </div>
                  </>
                ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Products
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Discover our range of high-performance gaming systems
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="group rounded-xl overflow-hidden shadow-md transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.01] cursor-pointer bg-white hover:bg-gray-50"
                >
                  {/* Image Container */}
                  <div 
                    className="relative aspect-square p-4 flex items-center justify-center overflow-hidden bg-gray-100"
                    onClick={() => navigate(`/Details/${product.product.id}`)}
                  >
                    {product.product.images && product.product.images.length > 0 ? (
                      <img
                        src={`${BaseURL}${product.product.images[0].image}`}
                        alt={product.product.brand_name}
                        className="max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-3">
                    <h3 
                      className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-dark"
                      onClick={() => navigate(`/Details/${product.product.id}`)}
                    >
                      {product.product.brand_name}
                    </h3>
                    <p 
                      className="text-green-600 text-sm font-bold mb-3"
                      onClick={() => navigate(`/Details/${product.product.id}`)}
                    >
                      ₹ {product.product.price?.toLocaleString()}
                    </p>

                    <div className="flex gap-2">
                      <button 
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-pink-600 text-white hover:bg-dark transition-all duration-300 flex items-center justify-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/Details/${product.product.id}`);
                        }}
                      >
                        <FaBolt className="text-xs" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10 sm:mt-14">
              <button
                 onClick={() => window.location.href = "/products"}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105">
                View All
              </button>
            </div>
          </div>
        </section>

        {/* Bottom Hero Section */}
        <section className="">
          <img
            src={ultimateGaming}
            className="w-full h-auto max-h-[350px] sm:max-h-[400px] object-cover"
            alt="Ultimate Gaming"
          />
        </section>

        {/* Bottom CTA Section */}
        <section className="bg-white text-gray-900 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
              Discover Your Perfect
              <span className="text-pink-600 block">{pageData?.name}</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto">
              Join thousands of satisfied gamers who have found their perfect
              gaming setup. Get expert recommendations tailored to your gaming
              style and budget with our comprehensive selection.
            </p>
            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center w-full">
              <button className="bg-pink-600 hover:bg-pink-700 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 text-white shadow-lg flex-1 min-w-0 max-w-[200px]"
              onClick={() => window.location.href = "/products"}
              >
                Shop
              </button>
              <button className="border-2 border-dark/70 text-dark hover:border-pink-500 hover:text-pink-500 hover:bg-dark/10 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex-1 min-w-0 max-w-[200px]"
              onClick={() => window.location.href = "/contact"}
              >
                Contact
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default GamingPCWebsite;