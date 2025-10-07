import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../Context/UserContext';
import { FiHome, FiShoppingBag, FiTool, FiLayers, FiHelpCircle, FiUser, FiLogOut, FiX, FiLogIn, FiUserPlus, FiMapPin } from 'react-icons/fi';
import './loginPopup.css';

function SideBar({ isOpen, onClose }) {
  const { token, setToken, user } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      
      <div className={`sidebar right-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>

          {!token ? (
            <div className="sidebar-auth-buttons">
              <button 
                className="sidebar-btn login-btn"
                onClick={() => { onClose(); navigate("/login"); }}
              >
                <FiLogIn className="btn-icon" /> Login
              </button>
              <button 
                className="sidebar-btn register-btn"
                onClick={() => { onClose(); navigate("/register"); }}
              >
                <FiUserPlus className="btn-icon" /> Register
              </button>
            </div>
          ) : (
            <div className="sidebar-user-info">
              <div className="user-avatar">
                {user?.data?.first_name?.charAt(0) || 'U'}
              </div>
              <p>Welcome, <span>{user?.data?.first_name || "User"}</span></p>
            </div>
          )}

          <ul className="sidebar-menu">
            <li>
              <Link to="/products" onClick={onClose} className="menu-item">
                <FiShoppingBag className="menu-icon" /> 
                <span className="menu-text">Products</span>
              </Link>
            </li>
            <li>
              <Link to="/services" onClick={onClose} className="menu-item">
                <FiTool className="menu-icon" /> 
                <span className="menu-text">Services</span>
              </Link>
            </li>
            <li>
              <Link to="/solutions" onClick={onClose} className="menu-item">
                <FiLayers className="menu-icon" /> 
                <span className="menu-text">Solutions</span>
              </Link>
            </li>
            <li>
              <Link to="/support" onClick={onClose} className="menu-item">
                <FiHelpCircle className="menu-icon" /> 
                <span className="menu-text">Support</span>
              </Link>
            </li>
            <li>
              <Link to="/store" onClick={onClose} className="menu-item">
                <FiHome className="menu-icon" /> 
                <span className="menu-text">Store</span>
              </Link>
            </li>
            {token && (
              <>
                <li>
                  <Link to="/profile" onClick={onClose} className="menu-item">
                    <FiUser className="menu-icon" /> 
                    <span className="menu-text">Profile</span>
                  </Link>
                </li>
                <li>
                  <button 
                    className="menu-item logout-btn"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="menu-icon" /> 
                    <span className="menu-text">Logout</span>
                  </button>
                </li>
              </>
            )}
          </ul>

          <div className="sidebar-locations">
            <h3 className="locations-title">
              <FiMapPin className="title-icon" /> Our Locations
            </h3>
            <div className="location">
              <h4>HQ - Kochi</h4>
              <p>
                Floor no. 2, Koroth Arcade,<br />
                Vennala High School Rd,<br />
                opposite to V-Guard, Vennala,<br />
                Kochi, Kerala 682028
              </p>
            </div>
            <div className="location">
              <h4>Kozhikode</h4>
              <p>
                New Age Buildings, Mofussil Bus<br />
                Stand Building, New, 61/1803,<br />
                Mavoor Rd, Arayidathupalam,<br />
                Kozhikode, Kerala 673004
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;