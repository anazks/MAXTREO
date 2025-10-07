import React, { useState, useEffect } from 'react';
import { 
  Ticket,
  Menu,
  X,
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Star,
  RefreshCw,
  Settings,
  Target,
  LogOut,
  ChevronDown,
  Cpu
} from 'lucide-react';
import { Label } from 'recharts';

function TopNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-container')) {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { href: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/featured', icon: Star, label: 'Featured' },
    { href: '/admin/driver/update', icon: RefreshCw, label: 'Driver Update' },
    { href: '/admin/order-list', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/viewUsers', icon: Users, label: 'Users' },
    { href: '/admin/tickets', icon: Ticket, label: 'Tickets' },
    { href: '/admin/Advertisement/product', icon: Target, label: 'Product Dropdown' },
    { href: '/admin/nvidia-manager', icon: Cpu, label: 'Nvidia Manager'},
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
    { href: '/admin/overview', icon: Target, label: 'Overview' },
  ];

  return (
    <div className="navbar-container">
      {/* Main Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Admin Panel</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.slice(0, 6).map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <IconComponent className="w-4 h-4 mr-2 group-hover:text-pink-600" />
                    {item.label}
                  </a>
                );
              })}

              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  More
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {navigationItems.slice(6).map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600"
                          >
                            <IconComponent className="w-4 h-4 mr-3" />
                            {item.label}
                          </a>
                        );
                      })}
                      <div className="border-t border-gray-100 my-1"></div>
                      <a
                        href="/"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-600 transition-colors duration-200"
                aria-expanded="false"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                  </a>
                );
              })}
              <div className="border-t border-gray-100 my-2"></div>
              <a
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </a>
            </div>
          </div>
        )}
      </nav>

      
    </div>
  );
}

export default TopNavbar;