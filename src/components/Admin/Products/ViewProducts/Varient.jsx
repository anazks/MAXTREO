import React, { useEffect, useState } from 'react';
import { getVarient, deleteVarient } from '../../../../Services/Products';
import { AlertCircle, Trash2 } from 'lucide-react';

function Variant({ product }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Only fetch if product exists and has an id
    console.log(product,"prduct")
    if (product && product.id) {
      fetchVariants();
    } else {
      setLoading(false);
    }
  }, [product]);

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const response = await getVarient(product.id);
      console.log(response, "------------------variant");
      
      // Handle both array and object responses
      if (response && response.data) {
        // Check if data is an array, if not, convert to array for mapping
        const variantData = Array.isArray(response.data) ? response.data : [response.data];
        setVariants(variantData);
      } else {
        setVariants([]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load variants");
      setLoading(false);
    }
  };

  const showDeleteConfirmation = (variantId) => {
    setDeleteItemId(variantId);
    setDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(false);
    setDeleteItemId(null);
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;
    
    try {
      setDeleteLoading(true);
      await deleteVarient(deleteItemId);
      // Refresh variants after deletion
      await fetchVariants();
      setDeleteConfirmation(false);
      setDeleteItemId(null);
    } catch (error) {
      console.log(error);
      setError("Failed to delete variant");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-gray-900 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 p-4 rounded-md flex items-start">
        <AlertCircle className="text-red-400 mr-2 flex-shrink-0" size={20} />
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!product || product.variant_parent.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-md text-center">
        <p className="text-gray-400">No variants available for this product</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto bg-gray-900 rounded-lg max-w-4xl mx-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Variant Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Relationship Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Relationship
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {product.variant_parent.map((variant, index) => (
              <tr key={variant.id || index} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {variant.variant_product || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {variant.relationship.name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    variant.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {variant.relationship ? variant.relationship.name : ''}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => showDeleteConfirmation(variant.id)}
                    className="text-red-400 hover:text-red-300 transition-colors focus:outline-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-100 mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this variant? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Variant;