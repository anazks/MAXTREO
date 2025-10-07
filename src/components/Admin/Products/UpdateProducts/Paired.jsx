import React, { useEffect, useState } from 'react';
import { pairProdcut } from '../../../../Services/Products';
import Alert from '../../../user/Alert/Alert';

function Paired({ product, products }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [pairingStrength, setPairingStrength] = useState(3);
  const [description, setDescription] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState('');

  // Use useEffect to open modal when product is passed
  useEffect(() => {
    if (product && product.id) {
      setIsOpen(true);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      primary_product: product?.id,
      paired_product: selectedProduct,
      pairing_strength: pairingStrength,
      description: description || null
    };
    
    console.log("Form Data:", formData);
    
    try {
      let response = await pairProdcut(formData);
      if (response) {
        setAlert(true);
        setMessage(response.statusText || 'Product paired successfully');
        setFormSubmitted(true);
        
        // Reset form after submission
        setTimeout(() => {
          setFormSubmitted(false);
          setSelectedProduct('');
          setPairingStrength(3);
          setDescription('');
          setIsOpen(false); // Close modal after submission
          
          // Hide alert after a bit longer
          setTimeout(() => {
            setAlert(false);
          }, 1000);
        }, 2000);
      }
      console.log(response, "response from");
    } catch (error) {
      console.error("Error pairing products:", error);
      setAlert(true);
      setMessage(error.message || 'Failed to pair products');
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {alert && (
        <Alert
          message={message}
          type="success"
        />
      )}
      
     
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
             

            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Select Product to Pair</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">-- Select a product --</option>
                  {products && products.filter(p => p.id !== product?.id).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">
                  Pairing Strength (1-5)
                  <span className="ml-2 text-sm text-gray-400">Rating from 1-5 indicating how strongly these products pair together</span>
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setPairingStrength(rating)}
                      className={`w-10 h-10 mx-1 rounded-full flex items-center justify-center ${
                        pairingStrength === rating 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">
                  Description
                  <span className="ml-2 text-sm text-gray-400">Optional description explaining why these products work well together</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  rows="3"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                >
                  Add Pairing
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                
                {formSubmitted && (
                  <div className="ml-2 flex items-center text-green-500">
                    <span>✓</span>
                    <span className="ml-1">Pairing added</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Paired;