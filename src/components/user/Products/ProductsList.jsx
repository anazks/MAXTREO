import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaSpinner, 
  FaFilter, 
  FaSort,
  FaShoppingCart,
  FaBolt,
  FaChevronLeft,
  FaChevronRight,
  FaStar
} from "react-icons/fa";
import { getAllProduct } from '../../../Services/Products';
import baseUrl from '../../../Static/Static';
import { useAuth } from '../../../Context/UserContext';
import { addTocart as addToCartService } from '../../../Services/userApi';
import Filter from '../Filter/Filter';
import Sorting from '../Sorting/Sorting';
import Alert from '../Alert/Alert';
import Loader from '../Loader/Loader';

function ProductsList() {
  const [filter, setFilter] = useState(false);
  const [sort, setSort] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [guestCart, setGuestCart] = useState([]);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const alertTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Guest cart management functions
  const getGuestCart = () => {
    try {
      const cart = sessionStorage.getItem('guestCart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return [];
    }
  };

  const saveGuestCart = (cartItems) => {
    try {
      sessionStorage.setItem('guestCart', JSON.stringify(cartItems));
      setGuestCart(cartItems);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const addToGuestCart = (productId, product) => {
    const currentCart = getGuestCart();
    const existingItemIndex = currentCart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        productId: productId,
        productName: product.name,
        productPrice: product.price,
        productImage: product.images?.[0]?.image || null,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    saveGuestCart(currentCart);
    return currentCart;
  };

  const getGuestCartCount = () => {
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  };

  // Initialize guest cart on component mount
  useEffect(() => {
    const initialCart = getGuestCart();
    setGuestCart(initialCart);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }

    return () => {
      document.body.classList.remove('dark');
      document.body.classList.remove('light');
    };
  }, [darkMode]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let productData = await getAllProduct();
        setProducts(productData || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Check if scroll buttons should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const showAlert = (data) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    setAlertData(data);

    alertTimeoutRef.current = setTimeout(() => {
      setAlertData(null);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const addTocart = async (id, event) => {
    event.stopPropagation();
    
    try {
      setAddingToCart(id);
      
      if (!user) {
        const product = products.find(p => p.id === id);
        if (product) {
          const updatedCart = addToGuestCart(id, product);
          const cartCount = getGuestCartCount();
          
          showAlert({
            type: "success",
            message: `Item added to cart! You have ${cartCount} item(s) in cart. Login to sync your cart.`,
            productId: id
          });
        }
      } else {
        let addToCart = await addToCartService(id);
        if (addToCart) {
          showAlert({
            type: "success",
            message: "Item successfully added to cart",
            productId: id
          });
        }
      }
    } catch (error) {
      console.log(error);
      showAlert({
        type: "error",
        message: `Failed to add to cart: ${error.message || "Unknown error"}`,
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const handleBuyNow = (product, event) => {
    event.stopPropagation();
    
    if (!user) {
      addToGuestCart(product.id, product);
      showAlert({
        type: "info",
        message: "Please login to proceed with purchase"
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      console.log(product, "buy now product");
    }
  };

  const navigateToDetails = (id) => {
    navigate(`/Details/${id}`);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const viewGuestCart = () => {
    if (guestCart.length === 0) {
      showAlert({
        type: "info",
        message: "Your cart is empty"
      });
      return;
    }

    console.log('Guest cart:', guestCart);
    showAlert({
      type: "info",
      message: `You have ${getGuestCartCount()} items in your cart. Login to sync.`
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollContainerRef.current || filteredProducts.length === 0) return;

    const container = scrollContainerRef.current;
    let scrollInterval;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          // If at the end, scroll to start
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Otherwise scroll right
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }, 4000); // Scroll every 4 seconds
    };

    const stopAutoScroll = () => {
      clearInterval(scrollInterval);
    };

    // Start auto-scroll
    startAutoScroll();

    // Pause auto-scroll on hover
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener('mouseenter', stopAutoScroll);
      container.removeEventListener('mouseleave', startAutoScroll);
    };
  }, [filteredProducts]);

  return (
    <div className={`min-h-screen px-4 py-4 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {alertData && (
        <Alert 
          type={alertData.type}
          message={alertData.message}
          productId={alertData.productId}
          error={alertData.error}
          onClose={() => setAlertData(null)}
        />
      )}

      <div className="w-full mx-auto">
        {/* Header Section - Full Width */}
        <div className={`mb-6 p-4 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold font-[Rajdhani] tracking-tight text-gray-900 dark:text-white relative inline-block">
                Featured Products
              </h1>
              <p className={`mt-2 text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Discover our exclusive collection
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:items-center w-full lg:w-auto">
              {/* Guest Cart Indicator */}
              {!user && guestCart.length > 0 && (
                <button
                  onClick={viewGuestCart}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-sm font-semibold"
                >
                  <FaShoppingCart />
                  <span>Cart ({getGuestCartCount()})</span>
                </button>
              )}

              {/* Search Bar */}
              <div className="relative w-full lg:w-64">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-4 pr-10 py-2.5 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'} outline-none transition-colors duration-300`}
                />
                <FaSearch className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-2">
                <button 
                  className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${filter 
                    ? 'bg-red-600 text-white' 
                    : darkMode 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' 
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                  } transition-colors duration-300 font-semibold text-xs`}
                  onClick={() => {
                    setFilter(!filter);
                    if (sort) setSort(false);
                  }}
                >
                  <FaFilter className={filter ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span>FILTER</span>
                </button>

                <button 
                  className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg ${sort 
                    ? 'bg-red-600 text-white' 
                    : darkMode 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700' 
                      : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                  } transition-colors duration-300 font-semibold text-xs`}
                  onClick={() => {
                    setSort(!sort);
                    if (filter) setFilter(false);
                  }}
                >
                  <FaSort className={sort ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <span>SORT</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        {filter && (
          <div className={`mb-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <Filter products={products} setProducts={setProducts} />
          </div>
        )}

        {/* Sort Section */}
        {sort && (
          <div className={`mb-4 p-4 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
            <Sorting products={products} setProducts={setProducts} />
          </div>
        )}

        {/* Products Horizontal Scroller */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={`text-center py-12 px-4 rounded-lg border ${darkMode ? 'bg-gray-900 text-gray-400 border-gray-800' : 'bg-gray-50 text-gray-600 border-gray-300'}`}>
            <p className="text-base font-semibold">No products found. Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Scroll Buttons */}
            {showScrollButtons && (
              <>
                <button 
                  onClick={scrollLeft}
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-900 text-white border border-gray-800 hover:bg-red-600' 
                      : 'bg-white text-black border border-gray-300 hover:bg-red-600'
                  }`}
                >
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={scrollRight}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-900 text-white border border-gray-800 hover:bg-red-600' 
                      : 'bg-white text-black border border-gray-300 hover:bg-red-600'
                  }`}
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Products Scroll Container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide gap-4 pb-6 px-2 -mx-2 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => navigateToDetails(product.id)}
                  className={`flex-shrink-0 w-64 group rounded-lg overflow-hidden transition-colors duration-300 cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-900 border border-gray-800 hover:bg-gray-800' 
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {/* Product Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                      FEATURED
                    </span>
                  </div>

                  {/* Image Container */}
                  <div className="relative h-40 p-4 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={product.images?.[0]?.image 
                        ? baseUrl + product.images[0].image 
                        : "https://pnghq.com/wp-content/uploads/pnghq.com-gaming-computer-picture-p-4.png"
                      } 
                      alt={product.name}
                      className="max-h-32 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-200">
                        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-gray-500 hover:text-white transition-colors duration-300">
                          <FaBolt />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h2 className="font-[Rajdhani] text-lg font-bold mb-2 line-clamp-2 leading-tight">
                        {product.name}
                      </h2>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map((star) => (
                          <FaStar 
                            key={star}
                            className={`text-xs ${
                              star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-500'
                            }`}
                          />
                        ))}
                        <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          (4.0)
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold font-[Rajdhani]">
                          ₹ {product.price?.toLocaleString()}
                        </span>
                        <span className={`text-xs line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          ₹ {(product.price * 1.2)?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => addTocart(product.id, e)}
                        disabled={addingToCart === product.id}
                        className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1 text-xs font-[Rajdhani] font-semibold transition-colors duration-300 ${
                          addingToCart === product.id
                            ? 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-200 cursor-not-allowed'
                            : darkMode
                              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                        }`}
                      >
                        {addingToCart === product.id ? (
                          <>
                            <FaSpinner className="animate-spin" /> 
                            <span>ADDING...</span>
                          </>
                        ) : (
                          <>
                            <FaShoppingCart /> 
                            <span>ADD TO CART</span>
                          </>
                        )}
                      </button>

                      <button 
                        onClick={(e) => handleBuyNow(product, e)}
                        className="flex-1 py-2.5 rounded-lg text-xs font-[Rajdhani] font-bold bg-red-600 text-white flex items-center justify-center gap-1 hover:bg-red-700 transition-colors duration-300"
                      >
                        <FaBolt />
                        <span>BUY NOW</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-4">
              <div className={`flex gap-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-full p-1.5`}>
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ProductsList;