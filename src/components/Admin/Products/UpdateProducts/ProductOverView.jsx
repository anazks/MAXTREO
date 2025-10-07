import React, { useState, useEffect } from "react";
import Axios from "../../../../Axios/Axios";

function ProductOverView({ product, onProductUpdate }) {
  console.log(product, "------------------");
  
  const [localProduct, setLocalProduct] = useState(product);
  const [alertStatus, setAlertStatus] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    type: '',
    id: null,
    name: '',
    callback: null
  });
  const [newDetails, setNewDetails] = useState({});
  const [loading, setLoading] = useState({});

  // Update local product when prop changes
  useEffect(() => {
    setLocalProduct(product);
  }, [product]);

  // Update local state after successful operations
  const updateLocalProduct = (updatedProduct) => {
    setLocalProduct(updatedProduct);
    if (onProductUpdate) {
      onProductUpdate();
    }
  };

  // Function to show alert
  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertStatus(true);
    setTimeout(() => {
      setAlertStatus(false);
    }, 3000);
  };

  // Custom confirm dialog
  const showDeleteConfirm = (type, id, name, callback) => {
    setDeleteConfirm({
      show: true,
      type,
      id,
      name,
      callback
    });
  };

  const hideDeleteConfirm = () => {
    setDeleteConfirm({
      show: false,
      type: '',
      id: null,
      name: '',
      callback: null
    });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.callback) {
      deleteConfirm.callback();
    }
    hideDeleteConfirm();
  };

  // Delete product attribute
  const handleDeleteAttribute = async (attributeId) => {
    try {
      const response = await Axios.delete(`/inventory/productattribute_value/${attributeId}/`);
      
      if (response.status === 200 || response.status === 204) {
        showAlert("Product attribute deleted successfully!");
        
        // Update local state immediately
        const updatedProduct = {
          ...localProduct,
          attributes: localProduct.attributes.filter(attr => attr.id !== attributeId)
        };
        updateLocalProduct(updatedProduct);
      }
    } catch (error) {
      console.error("Error deleting attribute:", error);
      showAlert("Failed to delete product attribute. Please try again.");
    }
  };

  // Delete attribute detail
  const handleDeleteDetail = async (detailId, attributeId) => {
    try {
      const response = await Axios.delete(`/inventory/productattribute_details/${detailId}/`);
      
      if (response.status === 200 || response.status === 204) {
        showAlert("Attribute detail deleted successfully!");
        
        // Update local state immediately
        const updatedProduct = {
          ...localProduct,
          attributes: localProduct.attributes.map(attr => 
            attr.id === attributeId 
              ? {
                  ...attr,
                  details: attr.details.filter(detail => detail.id !== detailId)
                }
              : attr
          )
        };
        updateLocalProduct(updatedProduct);
      }
    } catch (error) {
      console.error("Error deleting detail:", error);
      showAlert("Failed to delete attribute detail. Please try again.");
    }
  };

  // Add new detail
  const handleAddDetail = async (attributeValueId) => {
    const value = newDetails[attributeValueId]?.trim();
    
    if (!value) {
      showAlert("Please enter a value");
      return;
    }

    if (value.length > 255) {
      showAlert("Value must be 255 characters or less");
      return;
    }

    setLoading(prev => ({ ...prev, [attributeValueId]: true }));

    try {
      const response = await Axios.post('/inventory/productattribute_details/', {
        attribute_value_id: attributeValueId,
        value: value
      });

      if (response.status === 200 || response.status === 201) {
        showAlert("Detail added successfully!");
        setNewDetails(prev => ({ ...prev, [attributeValueId]: '' }));
        
        // Create new detail object - ensure we have the correct structure
        const newDetail = {
          id: response.data?.id || Date.now(), // Use API response ID or fallback
          value: response.data?.value || value, // Use API response value or our input value
          attribute_value_id: attributeValueId
        };
        
        console.log("New detail created:", newDetail); // Debug log
        
        // Update local state immediately
        const updatedProduct = {
          ...localProduct,
          attributes: localProduct.attributes.map(attr => 
            attr.id === attributeValueId 
              ? {
                  ...attr,
                  details: [...(attr.details || []), newDetail]
                }
              : attr
          )
        };
        
        console.log("Updated product:", updatedProduct); // Debug log
        updateLocalProduct(updatedProduct);
      }
    } catch (error) {
      console.error("Error adding detail:", error);
      showAlert("Failed to add detail. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [attributeValueId]: false }));
    }
  };

  // Handle input change
  const handleInputChange = (attributeValueId, value) => {
    setNewDetails(prev => ({
      ...prev,
      [attributeValueId]: value
    }));
  };

  // Handle Enter key press
  const handleKeyPress = (e, attributeValueId) => {
    if (e.key === 'Enter') {
      handleAddDetail(attributeValueId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Alert Component */}
      {alertStatus && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <span>{alertMessage}</span>
            <button 
              onClick={() => setAlertStatus(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete 
              {deleteConfirm.type === 'attribute' ? ' the attribute ' : ' '}
              "<span className="font-medium text-white">{deleteConfirm.name}</span>"?
              {deleteConfirm.type === 'attribute' && (
                <span className="block mt-2 text-sm text-red-400">
                  This will also delete all associated details.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={hideDeleteConfirm}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
       

        <div className="space-y-6">
          {localProduct?.attributes && localProduct.attributes.length > 0 ? (
            localProduct.attributes.map((obj, index) => (
              <div
                key={obj.id || index}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                        {obj.attribute?.category?.name || 'No Category'}
                      </span>
                      <span className="text-xl font-semibold text-gray-100">
                        {obj.attribute?.name || 'Unnamed Attribute'}
                      </span>
                    </div>
                    <button 
                      onClick={() => showDeleteConfirm(
                        'attribute',
                        obj.id,
                        obj.attribute?.name || 'Unnamed Attribute',
                        () => handleDeleteAttribute(obj.id)
                      )}
                      className="text-red-500 hover:text-red-400 hover:bg-red-900/20 px-3 py-1 rounded transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-300 mb-3">
                    Added Details
                  </h3>
                  
                  {/* Existing Details */}
                  <div className="space-y-3 mb-4">
                    {obj.details && obj.details.length > 0 ? (
                      obj.details.map((detail) => (
                        <div
                          key={detail.id}
                          className="flex items-center justify-between space-x-4 bg-gray-700 p-3 rounded-md"
                        >
                          <span className="text-gray-200 font-medium flex-1">
                            {detail.value || 'No value'}
                          </span>
                          <button
                            onClick={() => showDeleteConfirm(
                              'detail',
                              detail.id,
                              detail.value || 'this detail',
                              () => handleDeleteDetail(detail.id, obj.id)
                            )}
                            className="text-red-500 hover:text-red-400 hover:bg-red-900/20 px-2 py-1 rounded text-sm transition-colors duration-200 flex-shrink-0"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No details added yet</p>
                    )}
                  </div>

                  {/* Add New Detail Input */}
                  <div className="flex items-center space-x-3 bg-gray-700 p-3 rounded-md">
                    <input
                      type="text"
                      placeholder="Enter new detail..."
                      value={newDetails[obj.id] || ''}
                      onChange={(e) => handleInputChange(obj.id, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, obj.id)}
                      className="flex-1 bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={255}
                      disabled={loading[obj.id]}
                    />
                    <button
                      onClick={() => handleAddDetail(obj.id)}
                      disabled={loading[obj.id] || !newDetails[obj.id]?.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {loading[obj.id] ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No product attributes available
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ProductOverView;