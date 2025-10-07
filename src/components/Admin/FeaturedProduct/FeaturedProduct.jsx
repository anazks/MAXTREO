import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiUser,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiFilter,
  FiSearch,
  FiX,
  FiArrowUp,
  FiArrowDown,
  FiSave,
  FiChevronDown,
  FiImage,
  FiEye,
  FiInfo
} from "react-icons/fi";
import Axios from '../../../Axios/Axios';
import Loader from '../../../Loader/Loader'

import Sidebar from '../Sidebar';
import NeoFooter from '../footer';


const allFeaturedProducts = async () => {
  try {
    let response = await Axios.get('/inventory/featured-products/admin-list/');
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteFeaturedProduct = async (id) => {
  try {
    let response = await Axios.delete(`/inventory/featured-products/${id}/`);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addFeaturedProduct = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'banner_image' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    
    let response = await Axios.post('/inventory/featured-products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateFeaturedProduct = async (id, data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'banner_image' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (key !== 'banner_image' || (key === 'banner_image' && data[key] !== null)) {
        formData.append(key, data[key]);
      }
    });
    
    let response = await Axios.patch(`/inventory/featured-products/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    let response = await Axios.get('/inventory/product_admin/');
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//  Modal component
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };
  
  return (
   
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4" style={{marginTop:"60px"}}>
      <div className={`bg-gray-800 rounded-lg w-full ${sizeClasses[size]} mx-auto shadow-xl animate-fade-in`}>
        <div className="flex justify-between items-center border-b border-gray-700 p-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
    

  );
};

// Improved Image Preview component
const ImagePreview = ({ src, alt, onRemove }) => {
  return (
    <div className="mt-2 relative group">
      <img 
        src={src} 
        alt={alt || "Preview"} 
        className="h-32 w-full object-contain rounded border border-gray-600" 
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove image"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
};

// Product Details View Component
const ProductDetailsView = ({ product, onClose }) => {
  if (!product) return null;
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Product Details" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {product.banner_image ? (
            <div className="mb-4">
              <img 
                src={product.banner_image} 
                alt={product.featured_name} 
                className="w-full h-64 object-contain rounded border border-gray-600"
              />
            </div>
          ) : (
            <div className="h-64 bg-gray-700 rounded border border-gray-600 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white">{product.featured_name}</h4>
            <p className="text-gray-400 italic">{product.tagline}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Product</p>
              <p className="text-white">{product.product_details?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className={`inline-flex px-2 text-xs font-medium rounded-full 
                ${product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.is_available ? 'Available' : 'Unavailable'}
              </p>
              {product.is_featured && (
                <p className="ml-1 inline-flex px-2 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  Featured
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">CPU</p>
              <p className="text-white">{product.cpu || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">CPU Clock</p>
              <p className="text-white">{product.cpu_clock || "N/A"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">GPU</p>
              <p className="text-white">{product.gpu || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">GPU VRAM</p>
              <p className="text-white">{product.gpu_vram || "N/A"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">RAM</p>
              <p className="text-white">{product.ram || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Storage</p>
              <p className="text-white">{product.storage || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

function FeaturedProductList() {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  // Sorting and filtering states
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Edit/Add states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    product: '',
    featured_name: '',
    tagline: '',
    cpu: '',
    cpu_clock: '',
    gpu: '',
    gpu_vram: '',
    ram: '',
    storage: '',
    banner_image: null,
    is_available: true,
    is_featured: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [productViewModal, setProductViewModal] = useState({ open: false, product: null });

  // Fetch data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await allFeaturedProducts();
      setFeaturedProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Featured Products:", error);
      setError("Failed to load products. Please try again.");
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts();
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAllProducts();
  }, []);

  // Apply sorting and filtering
  useEffect(() => {
    let result = [...featuredProducts];
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(product => 
        (product.featured_name && product.featured_name.toLowerCase().includes(searchLower)) ||
        (product.tagline && product.tagline.toLowerCase().includes(searchLower)) ||
        (product.product_details?.name && product.product_details.name.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.status !== 'all') {
      if (filters.status === 'available') {
        result = result.filter(product => product.is_available);
      } else if (filters.status === 'unavailable') {
        result = result.filter(product => !product.is_available);
      } else if (filters.status === 'featured') {
        result = result.filter(product => product.is_featured);
      }
    }
    
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'product_name') {
        aValue = a.product_details?.name || '';
        bValue = b.product_details?.name || '';
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredProducts(result);
  }, [featuredProducts, filters, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all'
    });
  };

  // Handle adding new featured product
  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct({
      id: null,
      product: '',
      featured_name: '',
      tagline: '',
      cpu: '',
      cpu_clock: '',
      gpu: '',
      gpu_vram: '',
      ram: '',
      storage: '',
      banner_image: null,
      is_available: true,
      is_featured: false
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  // Handle editing a featured product
  const handleEditProduct = (product) => {
    setIsEditing(true);
    
    setCurrentProduct({
      id: product.id,
      product: product.product || '',
      featured_name: product.featured_name || '',
      tagline: product.tagline || '',
      cpu: product.cpu || '',
      cpu_clock: product.cpu_clock || '',
      gpu: product.gpu || '',
      gpu_vram: product.gpu_vram || '',
      ram: product.ram || '',
      storage: product.storage || '',
      banner_image: null,
      is_available: product.is_available,
      is_featured: product.is_featured
    });
    
    if (product.banner_image) {
      setImagePreview(product.banner_image);
    } else {
      setImagePreview(null);
    }
    
    setIsModalOpen(true);
  };

  // Handle viewing a product details
  const handleViewProduct = (product) => {
    setProductViewModal({
      open: true,
      product
    });
  };

  // Handle deleting a featured product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this featured product?")) {
      try {
        setLoading(true);
        await deleteFeaturedProduct(id);
        showNotification("Featured product deleted successfully!", "success");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting featured product:", error);
        showNotification("Failed to delete product. Please try again.", "error");
        setLoading(false);
      }
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setCurrentProduct(prev => ({
        ...prev,
        [name]: file
      }));
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setCurrentProduct(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setCurrentProduct(prev => ({
      ...prev,
      banner_image: null
    }));
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await updateFeaturedProduct(currentProduct.id, currentProduct);
        showNotification("Featured product updated successfully!", "success");
      } else {
        await addFeaturedProduct(currentProduct);
        showNotification("Featured product added successfully!", "success");
      }
      
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving featured product:", error);
      showNotification(
        `Failed to ${isEditing ? 'update' : 'add'} product. ${error.response?.data?.message || ''}`,
        "error"
      );
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Handle refreshing the list
  const handleRefresh = () => {
    fetchProducts();
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setProductViewModal({ open: false, product: null });
  };

  if (loading && featuredProducts.length === 0) {
    
         return <Loader/>
    
  }

  return (
     <>
    <Sidebar/>
    <div className="bg-white rounded-lg overflow-hidden shadow-lg" style={{ margin:"auto", marginTop:"60px",width:"90%", marginBottom:"20px"}}>
      {/* Header with actions */}
      <div className="p-4 bg-dark flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-white">Featured Products</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 flex items-center transition-colors"
          >
            <FiFilter className="mr-1" /> Filters
          </button>
          <button 
            onClick={handleRefresh}
            className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 flex items-center transition-colors"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            onClick={handleAddProduct}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors"
          >
            <FiPlus className="mr-1" /> Add Featured Product
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="p-4 bg-gray-750 border-b border-gray-600">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-300 mr-2">Search:</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  placeholder="Search products..."
                />
                {filters.searchTerm && (
                  <button 
                    onClick={() => handleFilterChange('searchTerm', '')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-300 mr-2">Status:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="featured">Featured</option>
              </select>
            </div>
            
            <button
              onClick={resetFilters}
              className="px-3 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 flex items-center transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`p-4 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white flex items-center justify-between animate-fade-in`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <FiCheckCircle className="mr-2" />
            ) : (
              <FiAlertCircle className="mr-2" />
            )}
            {notification.message}
          </div>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="text-white hover:text-gray-200"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500 text-white flex items-center animate-fade-in">
          <FiAlertCircle className="mr-2" />
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-white hover:text-gray-200"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto  bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <table className="min-w-full bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  ID
                  {sortField === 'id' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleSort('product_name')}
              >
                <div className="flex items-center">
                  Product
                  {sortField === 'product_name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => handleSort('featured_name')}
              >
                <div className="flex items-center">
                  Featured Name
                  {sortField === 'featured_name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-300">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {product.product_details?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {product.featured_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {product.banner_image ? (
                      <div 
                        className="h-16 w-24 relative cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleViewProduct(product)}
                      >
                        <img 
                          src={product.banner_image} 
                          alt={product.featured_name} 
                          className="h-full w-full object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all">
                          <FiEye className="text-white opacity-0 group-hover:opacity-100" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </span>
                    {product.is_featured && (
                      <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Delete"
                        disabled={loading}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-300">
                  {loading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    "No featured products found."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Results info */}
      <div className="p-4 bg-gray-700 text-sm text-gray-300 flex justify-between items-center">
        <div>
          Showing {filteredProducts.length} of {featuredProducts.length} products
        </div>
        {loading && (
          <div className="flex items-center text-blue-400">
            <FiRefreshCw className="animate-spin mr-2" />
            Loading...
          </div>
        )}
      </div>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Edit Featured Product' : 'Add New Featured Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product *</label>
              <select
                name="product"
                value={currentProduct.product}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a product</option>
                {allProducts.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Featured Name *</label>
              <input
                type="text"
                name="featured_name"
                value={currentProduct.featured_name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={currentProduct.tagline}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">CPU</label>
              <input
                type="text"
                name="cpu"
                value={currentProduct.cpu}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">CPU Clock</label>
              <input
                type="text"
                name="cpu_clock"
                value={currentProduct.cpu_clock}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">GPU</label>
              <input
                type="text"
                name="gpu"
                value={currentProduct.gpu}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">GPU VRAM</label>
              <input
                type="text"
                name="gpu_vram"
                value={currentProduct.gpu_vram}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">RAM</label>
              <input
                type="text"
                name="ram"
                value={currentProduct.ram}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Storage</label>
              <input
                type="text"
                name="storage"
                value={currentProduct.storage}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Banner Image</label>
              <div className="flex items-center">
                <label className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 flex items-center transition-colors">
                  <FiImage className="mr-2" /> 
                  {isEditing && imagePreview ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    name="banner_image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                <span className="ml-3 text-sm text-gray-400">
                  {currentProduct.banner_image 
                    ? currentProduct.banner_image.name || 'Image selected'
                    : 'No file selected'}
                </span>
              </div>
              
              {/* Image preview */}
              {imagePreview && (
                <div className="mt-4">
                  <ImagePreview 
                    src={imagePreview} 
                    alt={currentProduct.featured_name} 
                    onRemove={handleRemoveImage}
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={currentProduct.is_available}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="is_available" className="ml-2 block text-sm text-gray-300">
                Available
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={currentProduct.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-300">
                Featured
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin mr-2" />
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  {isEditing ? 'Update Product' : 'Add Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Product Details Modal */}
      {productViewModal.open && (
        <ProductDetailsView 
          product={productViewModal.product} 
          onClose={handleCloseViewModal} 
        />
      )}
    </div>
    <NeoFooter/>
    </>
  );
}

export default FeaturedProductList;