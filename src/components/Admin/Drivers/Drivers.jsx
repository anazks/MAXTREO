import React, { useState, useEffect } from 'react';
import axios from '../../../Axios/Axios';
import { AlertCircle, Edit, Eye, Trash2, Plus, Search, X, Download, Calendar, Tag, Info, Upload, File } from 'lucide-react';
import Loader from '../../../Loader/Loader'
import Sidebar from '../Sidebar';
import NeoFooter from '../footer';
// Main component for Product Driver Updates management
export default function ProductDriverUpdates() {
  const [updates, setUpdates] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileName, setFileName] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    product: '',
    name: '',
    version: '',
    description: '',
    download_url: '',
    is_critical: false
  });

  // Fetch product updates
  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/inventory/admin/product-updates/');
      setUpdates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product updates');
      console.error('Error fetching updates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for dropdown
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/inventory/admin/product-updates/product_filters/');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchUpdates();
    fetchProducts();
  }, []);

  // Filter updates based on search term
  const filteredUpdates = updates.filter(update => 
    update.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.product_brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view update
  const handleView = (update) => {
    setCurrentUpdate(update);
    setShowViewModal(true);
  };

  // Handle edit update
  const handleEdit = (update) => {
    setCurrentUpdate(update);
    setFormData({
      product: update.product,
      name: update.name,
      version: update.version,
      description: update.description,
      download_url: update.download_url || '',
      is_critical: update.is_critical
    });
    setFileName(update.update_file ? update.update_file.split('/').pop() : "");
    setIsEditing(true);
    setShowAddModal(true);
  };

  // Handle delete update
  const handleDeleteClick = (update) => {
    setCurrentUpdate(update);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/inventory/admin/product-updates/${currentUpdate.id}/`);
      setUpdates(updates.filter(u => u.id !== currentUpdate.id));
      setShowDeleteModal(false);
      setCurrentUpdate(null);
    } catch (err) {
      setError('Failed to delete update');
      console.error('Error deleting update:', err);
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  // Handle form submit (create or update)
  const handleFormSubmit = async () => {
    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add file if selected
      if (uploadFile) {
        formDataToSend.append('update_file', uploadFile);
      }
      
      if (isEditing) {
        // Update existing driver
        await axios.patch(
          `/inventory/admin/product-updates/${currentUpdate.id}/`, 
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        // Create new driver
        await axios.post(
          '/inventory/admin/product-updates/', 
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }
      
      // Refresh list and close modal
      fetchUpdates();
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} driver update`);
      console.error('Error submitting form:', err);
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      product: '',
      name: '',
      version: '',
      description: '',
      download_url: '',
      is_critical: false
    });
    setUploadFile(null);
    setFileName("");
    setIsEditing(false);
    setCurrentUpdate(null);
  };

  // Open add modal
  const handleAddNew = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Get file name from path
  const getFileNameFromPath = (path) => {
    if (!path) return null;
    const parts = path.split('/');
    return parts[parts.length - 1];
  };
  if (loading){
    return <Loader/>
  }

  return (
    <>
    <Sidebar/>
    
    <div className="flex flex-col bg-gray-900 text-white min-h-screen p-6" style={{marginTop:"60px"}}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Driver Updates</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
        >
          <Plus size={18} />
          Add Driver Update
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search updates by name, version or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-900 text-white p-4 rounded-md mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Updates Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Update Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Version</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Released</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <Loader/>
            ) : filteredUpdates.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-400">No updates found</td>
              </tr>
            ) : (
              filteredUpdates.map((update) => (
                <tr key={update.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">{update.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{update.product_brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{update.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{update.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{update.days_ago}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {update.is_critical ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                        Critical
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleView(update)}
                        className="text-blue-400 hover:text-blue-300 transition"
                        title="View Update Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(update)}
                        className="text-yellow-400 hover:text-yellow-300 transition"
                        title="Edit Update"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(update)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Delete Update"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Driver Update' : 'Add New Driver Update'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Product</label>
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.brand__name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Update Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Driver Update Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Version</label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1.0.0"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Download URL (Optional)</label>
                  <input
                    type="url"
                    name="download_url"
                    value={formData.download_url}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/download"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed description of this update"
                ></textarea>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-gray-300 mb-2">Upload Update File</label>
                <div className="flex items-center">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-l-md border border-gray-600 hover:bg-gray-600 cursor-pointer transition-colors">
                    <Upload size={18} />
                    <span>Choose File</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <div className="flex-1 px-4 py-2 bg-gray-700 border border-l-0 border-gray-600 rounded-r-md overflow-hidden text-ellipsis whitespace-nowrap">
                    {fileName || "No file chosen"}
                  </div>
                </div>
                {isEditing && currentUpdate && currentUpdate.update_file && !uploadFile && (
                  <div className="mt-2 flex items-center text-sm text-blue-400">
                    <File size={16} className="mr-1" />
                    <span>Current file: {getFileNameFromPath(currentUpdate.update_file)}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_critical"
                    checked={formData.is_critical}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <span className="ml-2 text-gray-300">Mark as Critical Update</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                >
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && currentUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Driver Update Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{currentUpdate.name}</h3>
                  <div className="text-gray-400">Version {currentUpdate.version}</div>
                </div>
                {currentUpdate.is_critical && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-200">
                    <AlertCircle size={16} className="mr-1" />
                    Critical Update
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-300">
                  <Tag size={18} className="mr-2 text-gray-400" />
                  <span>Product: <span className="text-white">{currentUpdate.product_name}</span></span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Info size={18} className="mr-2 text-gray-400" />
                  <span>Brand: <span className="text-white">{currentUpdate.product_brand}</span></span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar size={18} className="mr-2 text-gray-400" />
                  <span>Released: <span className="text-white">{currentUpdate.days_ago}</span></span>
                </div>
              </div>

              {/* Download links section */}
              {(currentUpdate.update_file || currentUpdate.download_url) && (
                <div className="bg-gray-700 p-4 rounded-md">
                  <h4 className="text-gray-300 mb-3">Downloads</h4>
                  <div className="flex flex-col gap-2">
                    {currentUpdate.update_file && (
                      <div className="flex items-center text-blue-400">
                        <File size={18} className="mr-2" />
                        <a 
                          href={currentUpdate.update_file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {getFileNameFromPath(currentUpdate.update_file)}
                        </a>
                      </div>
                    )}
                    {currentUpdate.download_url && (
                      <div className="flex items-center text-blue-400">
                        <Download size={18} className="mr-2" />
                        <a 
                          href={currentUpdate.download_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          External Download Link
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-300 mb-2">Description</h4>
                <div className="bg-gray-700 p-4 rounded-md text-white">
                  {currentUpdate.description}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(currentUpdate);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-12 w-12 rounded-full bg-red-900 flex items-center justify-center mb-4">
                <AlertCircle size={24} className="text-red-200" />
              </div>
              <h3 className="text-lg font-medium text-white">Delete Driver Update</h3>
              <p className="mt-2 text-gray-300">
                Are you sure you want to delete "{currentUpdate.name}" v{currentUpdate.version} for {currentUpdate.product_name}? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
<NeoFooter/>
    </>
  );
}