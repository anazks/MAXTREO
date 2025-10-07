import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaUser,
  FaShoppingCart,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import "./nav.css";
import SideBar from "../SIdeBar/SideBar";
import { useAuth } from "../../../Context/UserContext";
import { getProductDropDown } from "../../../Services/userApi";
import NavBarMenu from "./NavBarMenu";
import { Link, useNavigate } from "react-router-dom";
import { addTocart } from '../../../Services/userApi';

const ModernNavbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownScroll, setDropdownScroll] = useState({
    top: true,
    bottom: false,
  });
  const [syncingCart, setSyncingCart] = useState(false);
  const [cartSyncStatus, setCartSyncStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { token, setToken, user } = useAuth();
  const dropdownRef = useRef(null);
  const [productsItems, setProductsItems] = useState([]);
  const prevUserRef = useRef(user);

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

  const clearGuestCart = () => {
    try {
      sessionStorage.removeItem('guestCart');
    } catch (error) {
      console.error('Error clearing guest cart:', error);
    }
  };

  // Sync guest cart to user account
  const syncGuestCartToBackend = async () => {
    const guestCartItems = getGuestCart();
    
    if (guestCartItems.length === 0) {
      return { success: true, message: 'No items to sync' };
    }

    setSyncingCart(true);
    let successCount = 0;
    let failureCount = 0;
    const totalItems = guestCartItems.reduce((total, item) => total + item.quantity, 0);

    try {
      for (const item of guestCartItems) {
        for (let i = 0; i < item.quantity; i++) {
          try {
            const result = await addTocart(item.productId);
            if (result) {
              successCount++;
            } else {
              failureCount++;
            }
          } catch (error) {
            console.error(`Failed to add item ${item.productId}:`, error);
            failureCount++;
          }
        }
      }

      if (successCount > 0) {
        clearGuestCart();
      }

      const syncResult = {
        success: failureCount === 0,
        successCount,
        failureCount,
        totalItems,
        message: failureCount === 0 
          ? `Successfully synced ${successCount} items to your cart!`
          : `Synced ${successCount}/${totalItems} items. ${failureCount} items failed to sync.`
      };

      setCartSyncStatus(syncResult);
      
      setTimeout(() => {
        setCartSyncStatus(null);
      }, 5000);

      return syncResult;

    } catch (error) {
      console.error('Error syncing guest cart:', error);
      setCartSyncStatus({
        success: false,
        message: 'Failed to sync cart items. Please try again.'
      });
      
      setTimeout(() => {
        setCartSyncStatus(null);
      }, 5000);
      
      return { success: false, message: 'Sync failed' };
    } finally {
      setSyncingCart(false);
    }
  };

  // Monitor user login state and sync cart
  useEffect(() => {
    const handleUserLogin = async () => {
      if (!prevUserRef.current && user) {
        console.log('User logged in, syncing guest cart...');
        await syncGuestCartToBackend();
      }
      prevUserRef.current = user;
    };

    handleUserLogin();
  }, [user]);

  const getProductDropDownList = async () => {
    try {
      const response = await getProductDropDown();
      setProductsItems(response);
    } catch (error) {
      console.log(error, "error while fetching category products");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      setScrolled(currentScroll > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    getProductDropDownList();
  }, []);

  const openSidebar = () => {
    setIsSidebarOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownScroll = (e) => {
    const element = e.target;
    const isAtTop = element.scrollTop === 0;
    const isAtBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

    setDropdownScroll({
      top: isAtTop,
      bottom: isAtBottom,
    });
  };

  const scrollDropdown = (direction) => {
    if (dropdownRef.current) {
      const scrollAmount = 100;
      if (direction === "up") {
        dropdownRef.current.scrollTop -= scrollAmount;
      } else {
        dropdownRef.current.scrollTop += scrollAmount;
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const categories = [
    "Components",
    "Peripherals", 
    "Gaming",
    "Laptops & PCs",
    "Networking",
    "Software",
    "Accessories"
  ];

  const quickLinks = [
    { name: "Build Your PC", path: "/build-pc" },
    { name: "Deals & Offers", path: "/deals" },
    { name: "Track Order", path: "/track-order" },
    { name: "Support", path: "/support" }
  ];

  const socialMedia = [
    { icon: FaFacebookF, url: "https://facebook.com", color: "#1877F2" },
    { icon: FaTwitter, url: "https://twitter.com", color: "#1DA1F2" },
    { icon: FaInstagram, url: "https://instagram.com", color: "#E4405F" },
    { icon: FaYoutube, url: "https://youtube.com", color: "#FF0000" },
  ];

  return (
    <>
      {/* Cart Sync Status Notification */}
      {cartSyncStatus && (
        <div className={`cart-sync-notification ${cartSyncStatus.success ? 'success' : 'error'}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {cartSyncStatus.success ? '✓' : '✕'}
            </span>
            <div className="notification-text">
              <p>{cartSyncStatus.message}</p>
              {cartSyncStatus.successCount > 0 && cartSyncStatus.failureCount > 0 && (
                <span className="notification-details">
                  Success: {cartSyncStatus.successCount}, Failed: {cartSyncStatus.failureCount}
                </span>
              )}
            </div>
            <button
              className="notification-close"
              onClick={() => setCartSyncStatus(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Cart Syncing Loader */}
      {syncingCart && (
        <div className="cart-sync-loader">
          <div className="loader-spinner"></div>
          <div className="loader-text">
            <p>Syncing your cart...</p>
            <span>Please wait while we add your items</span>
          </div>
        </div>
      )}

      {/* Top Announcement Bar */}
     

      {/* Main Navigation */}
      <nav className={`modern-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* Search Bar - Center */}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <FaSearch className="search-icon" />
                </button>
              </div>
            </form>
          </div>

          {/* User Actions - Right */}
          <div className="actions-section">
            <div className="action-items">
              {user ? (
                <div className="user-welcome">
                  <span>Hi, {user.name || user.email}</span>
                </div>
              ) : (
                <Link to="/login" className="auth-link">
                  <FaUser className="action-icon" />
                  <span>Login</span>
                </Link>
              )}
              
              <Link to="/cart" className="auth-link cart-link">
                <FaShoppingCart className="action-icon" />
                <span>Cart</span>
                {/* <span className="cart-count">0</span> */}
              </Link>

              {/* Social Media Icons */}
              <div className="social-icons" style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={`Follow us on ${social.url.split('.')[1]}`}
                  >
                    <social.icon className="social-icon" style={{ color: social.color, fontSize: '1.2rem' }} />
                  </a>
                ))}
              </div>

              <button className="mobile-menu-btn" onClick={openSidebar}>
                <FaBars />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="categories-nav">
          <div className="categories-container">
            {/* All Categories Dropdown */}
            <div className="dropdown-container">
              <button
                className="category-dropdown-trigger"
                onClick={() => handleDropdownToggle("categories")}
                onMouseEnter={() => setActiveDropdown("categories")}
              >
                <FaBars className="categories-icon" />
                All Categories
                <FaChevronDown className="dropdown-icon" />
              </button>
              <div
                className={`categories-dropdown ${
                  activeDropdown === "categories" ? "active" : ""
                }`}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="dropdown-wrapper">
                  {!dropdownScroll.top && (
                    <button
                      className="scroll-indicator scroll-up"
                      onClick={() => scrollDropdown("up")}
                    >
                      <FaChevronUp />
                    </button>
                  )}
                  <div
                    className="dropdown-content"
                    ref={dropdownRef}
                    onScroll={handleDropdownScroll}
                  >
                    {productsItems.map((item, index) => (
                      <Link
                        key={index}
                        to={`/products/product/${item.slug}`}
                        state={{ id: item.slug, item: item.name }}
                        className="dropdown-item"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  {!dropdownScroll.bottom && (
                    <button
                      className="scroll-indicator scroll-down"
                      onClick={() => scrollDropdown("down")}
                    >
                      <FaChevronDown />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="quick-categories">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="category-link"
                >
                  {category}
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="quick-links">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="quick-link"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </>
  );
};

export default ModernNavbar;