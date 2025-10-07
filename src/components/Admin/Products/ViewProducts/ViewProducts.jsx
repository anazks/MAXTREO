import React, { useEffect, useState } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiSearch, FiFilter, FiPlus, FiAlertTriangle, FiSliders, FiMenu, FiX } from 'react-icons/fi';
import { getAllProductAdmin } from '../../../../Services/Products';
import BaseURL from '../../../../Static/Static';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../Loader/Loader';
import { productDelete } from '../../../../Services/Products';
import {getCategory, getBrand} from '../../../../Services/Settings';

import Sidebar  from '../../Sidebar';
import NeoFooter from '../../footer';
function ProductInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Category and brand states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Advanced filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in-stock', 'low-stock', 'out-of-stock'
  const [taxTypeFilter, setTaxTypeFilter] = useState(''); // '', 'inclusive', 'exclusive'
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Mobile responsiveness states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategory();
    fetchBrand();
  }, []);

  const fetchCategory = async () => {
    try {
      let response = await getCategory();
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBrand = async () => {
    try {
      let response = await getBrand();
      if (response && response.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productData = await getAllProductAdmin();
      setProducts(productData);
    } catch (error) {
      console.log(error, "error while fetching data");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleEdit = (productId) => {
    navigate(`/admin/Updateproducts/${productId}`);
  };

  const openDeleteConfirmation = (productId, productName) => {
    setDeleteConfirmation({
      isOpen: true,
      productId,
      productName
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      productId: null,
      productName: ''
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.productId) return;
    
    try {
      setDeleteLoading(true);
      await productDelete(deleteConfirmation.productId);
      // Refresh product list after deletion
      await fetchProducts();
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const addNewProduct = () => {
    try {
      navigate('/admin/AddProduct');
    } catch (error) {
      console.log(error);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterBrand('');
    setPriceRange({ min: '', max: '' });
    setStockFilter('all');
    setTaxTypeFilter('');
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Get category name by id
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Get brand name by id
  const getBrandNameById = (brandId) => {
    const brand = brands.find(b => b._id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };

  // Filter products based on all criteria
  const filteredProducts = products.filter(product => {
    // Basic filter for search term, category and brand
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    const matchesBrand = filterBrand === '' || product.brand === filterBrand;
    
    // Price range filter
    const minPrice = priceRange.min === '' ? 0 : parseFloat(priceRange.min);
    const maxPrice = priceRange.max === '' ? Infinity : parseFloat(priceRange.max);
    const matchesPrice = product.mrp >= minPrice && product.mrp <= maxPrice;
    
    // Stock filter
    let matchesStock = true;
    if (stockFilter === 'in-stock') {
      matchesStock = product.stock > 0;
    } else if (stockFilter === 'low-stock') {
      matchesStock = product.stock > 0 && product.stock < 10;
    } else if (stockFilter === 'out-of-stock') {
      matchesStock = product.stock <= 0;
    }
    
    // Tax type filter - FIXED
    const matchesTaxType = taxTypeFilter === '' || 
                          (taxTypeFilter === 'inclusive' && product.tax === 'Inclusive') ||
                          (taxTypeFilter === 'exclusive' && product.tax === 'Exclusive');
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesTaxType;
  });

  // Product Card Component for mobile view
  const ProductCard = ({ product }) => (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-4">
      <div className="flex items-start space-x-4">
        <img 
          src={product.images?.[0]?.image ? product.images[0].image : "/api/placeholder/80/80"} 
          alt={product.name} 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover bg-gray-700 flex-shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
          <p className="text-2xl font-bold text-blue-400 mt-1">Rs. {product.mrp}</p>
          
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div>
              <span className="text-gray-400">Category:</span>
              <span className="ml-1 text-purple-400">
                {product.category_id ? getCategoryNameById(product.category_id) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Brand:</span>
              <span className="ml-1 text-blue-400">
                {product.brand_id ? getBrandNameById(product.brand_id) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Stock:</span>
              <span className={`ml-1 font-medium ${
                product.stock <= 0 ? 'text-red-400' : 
                product.stock < 10 ? 'text-yellow-400' : 
                'text-green-400'
              }`}>
                {product.stock}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Available:</span>
              <span className={`ml-1 font-medium ${product.is_available ? 'text-green-400' : 'text-red-400'}`}>
                {product.is_available ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          
          <div className="mt-3">
            <span className="text-gray-400 text-sm">Tax Type:</span>
            <span className={`ml-1 text-xs px-2 py-1 rounded ${
              product.tax === 'Inclusive' ? 'bg-blue-900 bg-opacity-20 text-blue-400' : 
              'bg-purple-900 bg-opacity-20 text-purple-400'
            }`}>
              {product.tax || 'N/A'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-700">
        <button 
          className="text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-gray-700 transition-colors"
          onClick={() => handleView(product.id || product._id)}
        >
          <FiEye className="text-lg" />
        </button>
        <button 
          className="text-yellow-400 hover:text-yellow-300 p-2 rounded hover:bg-gray-700 transition-colors"
          onClick={() => handleEdit(product.id || product._id)}
        >
          <FiEdit2 className="text-lg" />
        </button>
        <button 
          className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-gray-700 transition-colors"
          onClick={() => openDeleteConfirmation(product.id || product._id, product.name)}
        >
          <FiTrash2 className="text-lg" />
        </button>
      </div>
    </div>
  );

  // Mobile Filter Panel
  const MobileFilterPanel = () => (
    <>
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gray-800 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button 
                onClick={toggleMobileFilters}
                className="text-gray-400 hover:text-white p-2"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-full overflow-y-auto">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <select 
                  value={filterBrand} 
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stock Status</label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock (&lt;10)</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Tax Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tax Type</label>
                <select
                  value={taxTypeFilter}
                  onChange={(e) => setTaxTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Tax Types</option>
                  <option value="inclusive">Tax Inclusive</option>
                  <option value="exclusive">Tax Exclusive</option>
                </select>
              </div>

              {/* Filter Actions */}
              <div className="flex flex-col space-y-2 pt-4">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Reset Filters
                </button>
                <button
                  onClick={toggleMobileFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Delete Confirmation Dialog Component
  const DeleteConfirmationDialog = () => {
    if (!deleteConfirmation.isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center">
            <FiAlertTriangle className="text-red-500 text-xl mr-3" />
            <h3 className="text-lg font-medium text-white">Confirm Deletion</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this product?
              <span className="block mt-2 font-medium text-white">{deleteConfirmation.productName}</span>
            </p>
            <p className="text-red-400 text-sm mb-6">This action cannot be undone.</p>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={closeDeleteConfirmation}
                disabled={deleteLoading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-800 disabled:opacity-70"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Loader />;
  if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 font-medium">{error}</div>;

  return (
    <>
    <Sidebar/>
    <div className="min-h-screen bg-gray-900 text-gray-100 p-3 sm:p-6 font-rajdhani" style={{marginTop:"70px"}}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">Product Inventory</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          {/* Mobile Filter Button */}
          <button 
            className="md:hidden flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
            onClick={toggleMobileFilters}
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
          
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center justify-center"
            onClick={addNewProduct}
          >
            <FiPlus className="mr-2" />
            Add New Product
          </button>
        </div>
      </div>
      
      {/* Desktop Filters */}
      <div className="hidden md:block bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full lg:w-48 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select 
              value={filterBrand} 
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full lg:w-48 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand._id}>{brand.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={toggleAdvancedFilters}
            className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
          >
            <FiSliders className="mr-2" />
            {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
          </button>
        </div>
        
        {showAdvancedFilters && (
          <div className="border-t border-gray-700 pt-4 mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* Price Range Filter */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-300">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="flex-1 pl-3 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="flex-1 pl-3 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Stock Filter */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-300">Stock Status</label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock (&lt;10)</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              
              {/* Tax Type Filter */}
              <div className="flex flex-col">
                <label className="mb-2 text-sm font-medium text-gray-300">Tax Type</label>
                <select
                  value={taxTypeFilter}
                  onChange={(e) => setTaxTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Tax Types</option>
                  <option value="inclusive">Tax Inclusive</option>
                  <option value="exclusive">Tax Exclusive</option>
                </select>
              </div>
            </div>
            
            {/* Filter actions */}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 flex items-start">
          <div className="bg-blue-600 bg-opacity-20 p-3 rounded-full mr-4 flex-shrink-0">
            <FiEye className="text-blue-400 text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-400 text-sm font-medium">Total Products</h3>
            <p className="text-2xl font-bold my-1">{products.length}</p>
            <p className="text-sm text-gray-400">Filtered: {filteredProducts.length}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 flex items-start">
          <div className="bg-red-600 bg-opacity-20 p-3 rounded-full mr-4 flex-shrink-0">
            <FiFilter className="text-red-400 text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-400 text-sm font-medium">Out of Stock</h3>
            <p className="text-2xl font-bold my-1 text-red-400">
              {products.filter(p => p.stock <= 0).length}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 flex items-start sm:col-span-2 lg:col-span-1">
          <div className="bg-yellow-600 bg-opacity-20 p-3 rounded-full mr-4 flex-shrink-0">
            <FiFilter className="text-yellow-400 text-xl" />
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-400 text-sm font-medium">Low Stock</h3>
            <p className="text-2xl font-bold my-1 text-yellow-400">
              {products.filter(p => p.stock > 0 && p.stock < 10).length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Products Display */}
      {/* Mobile View - Cards */}
      <div className="md:hidden">
        {filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h4 className="text-lg font-medium mb-2">No products found</h4>
            <p className="text-gray-400">No products match your search criteria</p>
          </div>
        )}
      </div>
      
      {/* Desktop View - Table */}
      <div className="hidden md:block bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Available</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Brand</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tax Type</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id || product.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <img 
                        src={product.images?.[0]?.image ? product.images[0].image : "/api/placeholder/50/50"} 
                        alt={product.name} 
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-md object-cover bg-gray-700" 
                      />
                    </td>
                    <td className="px-4 lg:px-6 py-4 font-medium">
                      <div className="max-w-xs truncate">{product.name}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      {product.is_available ? (
                        <span className="text-green-400">Yes</span>
                      ) : (
                        <span className="text-red-400">No</span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap font-medium">Rs. {product.mrp}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-700 text-purple-400 px-2 py-1 rounded text-xs font-medium">
                        {product.category ? product.category : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-700 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                        {product.brand ? product.brand : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.stock <= 0 ? 'bg-red-900 bg-opacity-20 text-red-400' : 
                        product.stock < 10 ? 'bg-yellow-900 bg-opacity-20 text-yellow-400' : 
                        'bg-green-900 bg-opacity-20 text-green-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.tax === 'Inclusive' ? 'bg-blue-900 bg-opacity-20 text-blue-400' : 
                        'bg-purple-900 bg-opacity-20 text-purple-400'
                      }`}>
                        {product.tax || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1 lg:space-x-2">
                        {/* <button 
                          className="text-blue-400 hover:text-blue-300 p-1 lg:p-2 rounded hover:bg-gray-700 transition-colors"
                          onClick={() => handleView(product.id || product._id)}
                          title="View Product"
                        >
                          <FiEye className="text-base lg:text-lg" />
                        </button> */}
                        <button 
                          className="text-yellow-400 hover:text-yellow-300 p-1 lg:p-2 rounded hover:bg-gray-700 transition-colors"
                          onClick={() => handleEdit(product.id || product._id)}
                          title="Edit Product"
                        >
                          <FiEdit2 className="text-base lg:text-lg" />
                        </button>
                        <button 
                          className="text-red-400 hover:text-red-300 p-1 lg:p-2 rounded hover:bg-gray-700 transition-colors"
                          onClick={() => openDeleteConfirmation(product.id || product._id, product.name)}
                          title="Delete Product"
                        >
                          <FiTrash2 className="text-base lg:text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 lg:px-6 py-8 text-center">
                    <div className="text-center">
                      <h4 className="text-lg font-medium mb-2">No products found</h4>
                      <p className="text-gray-400">No products match your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mobile Filter Panel */}
      <MobileFilterPanel />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog />
    </div>
    <NeoFooter/>
    </>
  );
}

export default ProductInventory;