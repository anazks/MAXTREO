import React, { useEffect, useState } from 'react';
import { getPairedProduct, deletePairedProduct } from '../../../../Services/Products';
import Loader from '../../../../Loader/Loader';

function PairedProducts({ product }) {
  const [pairedProducts, setPairedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchPairedProducts = async () => {
      if (!product?.id) return;
      
      setLoading(true);
      try {
        const products = await getPairedProduct(product.id);
        console.log(products, "paired");
        setPairedProducts(products?.data.paired_products|| []);
      } catch (error) {
        console.error('Failed to fetch paired products:', error);
        setError('Failed to load paired products');
      } finally {
        setLoading(false);
      }
    };

    fetchPairedProducts();
  }, [product?.id]);

  const handleDelete = async (pairingId) => {
    setDeletingId(pairingId);
    try {
      await deletePairedProduct(pairingId);
      // Remove the deleted product from the state
      setPairedProducts(pairedProducts.filter(item => item.id !== pairingId));
    } catch (error) {
      console.error('Failed to delete paired product:', error);
      alert('Failed to delete paired product');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (

    <Loader/>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (pairedProducts.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No paired products found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg max-w-4xl mx-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Pairing Strength
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {pairedProducts.map((item) => (
            <tr key={item.id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-200">{item.paired_product_details.name || 'Unknown Product'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span 
                      key={index}
                      className={`h-3 w-3 rounded-full mx-0.5 ${
                        index < item.pairing_strength 
                          ? 'bg-blue-500' 
                          : 'bg-gray-600'
                      }`}
                    ></span>
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    {item.pairing_strength}/5
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-300">
                  {item.description || 'No description provided'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className={`text-red-400 hover:text-red-300 focus:outline-none ${
                    deletingId === item.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {deletingId === item.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PairedProducts;