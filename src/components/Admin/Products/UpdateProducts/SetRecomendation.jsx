import React, { useState, useEffect } from 'react'
import {Addrecomendation} from '../../../../Services/Products'
function SetRecomendation({ product, products }) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(product?.id || '')
  const [recommendationStrength, setRecommendationStrength] = useState(3)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    let data = {
        recommended_product: parseInt(selectedProduct),
        source_product: product.id,
        recommendation_type: recommendationStrength.toString()
      }
    console.log(data,"data.........")
    let resposne = await Addrecomendation(data)
    console.log(resposne,"resposne....")
    setIsOpen(false)
  }
  
  const handleClose = () => {
    setIsOpen(false)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">Product Recommendation</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Select Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Select a product --</option>
              {products?.map((prod) => (
                <option key={prod.id} value={prod.id} className="bg-gray-800">
                  {prod.name || `Product ${prod.id}`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              Recommendation Strength (1-5)
            </label>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name="strength"
                    value={num}
                    checked={recommendationStrength === num}
                    onChange={() => setRecommendationStrength(num)}
                    className="mb-1 h-5 w-5 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-300">{num}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetRecomendation