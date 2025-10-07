import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleProduct } from '../../../../Services/Products';
import BaseURL from '../../../../Static/Static';
import Loader from '../../../../Loader/Loader';
import PairedProducts from './PairedProdcuts';
import ViewImages from './ViewImages';
import Varient from './Varient';

// Main ProductView component with Tailwind styling
export default function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(1);
  const [selectedRam, setSelectedRam] = useState(16);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getSingleProduct(id);
        console.log(productData, "--product data");
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="py-16 text-center text-red-600 bg-red-50 border-l-4 border-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="py-16 text-center text-gray-600 bg-gray-50 border-l-4 border-gray-500">Product not found</div>;
  }

  // For demo, using static data from image
  const demoProduct = {
    name: "THE SPECTRE SERIES",
    category: "GAMING PC",
    price: "2,60,000/-",
    oldPrice: "3.2L",
    description: "This is a sample data space to fill how you see fit. This data is just to see how the space will look filled. Well this looks damn good. Am I right? So what do you think. Will this workout for this space. This is a sample data space to fill how you see fit. This data is just to see how the space will look filled. Well this looks damn good. Am I right? So what do you think. Will this workout for this space. This is a sample data space to fill how you see fit. This data is just to see how the space will look filled. Well this looks damn good. Am I right? So what do you think. Will this workout for this space.",
    storageOptions: [0.5, 1, 2, 3],
    ramOptions: [8, 16, 32, 64]
  };

  const handleStorageSelect = (size) => {
    setSelectedStorage(size);
  };

  const handleRamSelect = (size) => {
    setSelectedRam(size);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-questrial">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image Section */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden mb-4">
            <img 
              src="https://via.placeholder.com/600x600" 
              alt={demoProduct.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product thumbnails - shown in a row */}
          <div className="flex gap-2 justify-center">
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 border border-gray-300 rounded-full">
              &lt;
            </button>
            <div className="h-1 w-16 bg-red-500 my-auto mx-2 rounded"></div>
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 border border-gray-300 rounded-full">
              &gt;
            </button>
            <img 
              src="https://via.placeholder.com/60x60" 
              alt="Thumbnail" 
              className="w-12 h-12 border border-gray-200 rounded"
            />
          </div>
        </div>

        {/* Product Information Section */}
        <div className="w-full md:w-1/2">
          {/* Category */}
          <div className="text-gray-600 font-medium mb-1">{demoProduct.category}</div>
          
          {/* Product Title */}
          <h1 className="font-rajadhani text-3xl font-bold mb-4">{demoProduct.name}</h1>
          
          {/* Pricing */}
          <div className="flex items-baseline mb-6">
            <span className="text-gray-500 line-through mr-2">₹{demoProduct.oldPrice}</span>
            <span className="text-green-600 text-2xl font-bold">₹{demoProduct.price}</span>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 mb-8">
            {demoProduct.description}
          </p>

          {/* Storage Options */}
          <div className="mb-6">
            <h2 className="text-base font-bold mb-2">SELECT STORAGE (ALL DIMENSIONS MENTIONED IN TB)</h2>
            <div className="flex flex-wrap gap-2">
              {demoProduct.storageOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => handleStorageSelect(size)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedStorage === size 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* RAM Options */}
          <div className="mb-6">
            <h2 className="text-base font-bold mb-2">RAM (ALL DIMENSIONS IN GB)</h2>
            <div className="flex flex-wrap gap-2">
              {demoProduct.ramOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => handleRamSelect(size)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedRam === size 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Add to Cart
            </button>
            <button className="w-full py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition duration-300">
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      {/* These components would need to be implemented separately */}
      {/* <PairedProducts product={product}/>
      <ViewImages product={product}/>
      <Varient product={product}/> */}
    </div>
  );
}