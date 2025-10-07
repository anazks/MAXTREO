import React, { useEffect, useState } from 'react';
import { getCategoryForUser, getBrandForuser } from '../../../Services/Settings';
import { getReview } from '../../../Services/Products';

function Filter({ products, setProducts }) {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [fetchedBrands, setFetchedBrands] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [currentPriceRange, setCurrentPriceRange] = useState({ min: 0, max: 0 });
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  
  // Predefined price ranges for quick selection
  const predefinedRanges = [
    { label: '₹0-₹50', min: 0, max: 50 },
    { label: '₹50-₹100', min: 50, max: 100 },
    { label: '₹100-₹200', min: 100, max: 200 },
    { label: '₹200-₹500', min: 200, max: 500 },
    { label: '₹500+', min: 500, max: 10000 }
  ];

  const uiCategories = [
    "BY BRAND",
    "CATEGORY",
    "PRICE",
    "AVAILABILITY",
    "RATING",
  ];

  // Helper function to calculate average rating from approved_reviews
  const calculateAverageRating = (approvedReviews) => {
    if (!approvedReviews || !Array.isArray(approvedReviews) || approvedReviews.length === 0) {
      return 0; // Return 0 if no reviews
    }
    
    const totalRating = approvedReviews.reduce((sum, review) => {
      return sum + (review.rating || 0);
    }, 0);
    
    return totalRating / approvedReviews.length;
  };
  
  const fecthReview = async () => {
    try {
      let response = await getReview();
      console.log(response, "--------------Review");
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        fecthReview();
        const categoryRes = await getCategoryForUser();
        const brandRes = await getBrandForuser();
        setFetchedCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);
        setFetchedBrands(Array.isArray(brandRes.data) ? brandRes.data : []);
      } catch (error) {
        console.error(error);
        setFetchedCategories([]);
        setFetchedBrands([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Save original products when first loaded and calculate price range
  useEffect(() => {
    if (products.length && originalProducts.length === 0) {
      setOriginalProducts(products);
      
      // Calculate min and max price
      const prices = products.map(product => parseInt(product.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      setPriceRange({ min: minPrice, max: maxPrice });
      setCurrentPriceRange({ min: minPrice, max: maxPrice });
    }
  }, [products, originalProducts.length]);

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(name => name !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleBrandChange = (brandId) => {
    console.log("Brand ID:", brandId);
    setSelectedBrands(prev => {
      if (prev.includes(brandId)) {
        return prev.filter(name => name !== brandId);
      } else {
        return [...prev, brandId];
      }
    });
  };

  const handlePriceChange = (type, value) => {
    setCurrentPriceRange(prev => {
      const newValue = parseInt(value);
      // Ensure min doesn't exceed max and max doesn't go below min
      if (type === 'min' && newValue > prev.max) {
        return { ...prev, min: prev.max };
      } else if (type === 'max' && newValue < prev.min) {
        return { ...prev, max: prev.min };
      } else {
        return { ...prev, [type]: newValue };
      }
    });
  };

  const handleRangeSelection = (min, max) => {
    setCurrentPriceRange({ min, max });
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    const type = e.target.name;
    handlePriceChange(type, value);
  };

  const handleFilter = () => {
    let filtered = [...originalProducts];

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = parseInt(product.price);
      return price >= currentPriceRange.min && price <= currentPriceRange.max;
    });

    // Filter by availability
    if (selectedAvailability !== '') {
      const isAvailable = selectedAvailability === 'true';
      filtered = filtered.filter(product => product.is_available === isAvailable);
    }

    // Updated Filter by rating - using approved_reviews
    if (selectedRating !== '') {
      const minRating = parseInt(selectedRating);
      filtered = filtered.filter(product => {
        const averageRating = calculateAverageRating(product.approved_reviews);
        return Math.round(averageRating) >= minRating;
      });
    }

    setProducts(filtered);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setCurrentPriceRange({ ...priceRange });
    setSelectedAvailability('');
    setSelectedRating('');
    setProducts(originalProducts);
  };

  const selectedLabel = uiCategories[activeCategory];
  const isCategorySelected = selectedLabel === "CATEGORY";
  const isBrandSelected = selectedLabel === "BY BRAND";
  const isPriceSelected = selectedLabel === "PRICE";
  const isAvailabilitySelected = selectedLabel === "AVAILABILITY";
  const isRatingSelected = selectedLabel === "RATING";

  // Calculate percentage for the slider thumb positions
  const minThumbPosition = ((currentPriceRange.min - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
  const maxThumbPosition = ((currentPriceRange.max - priceRange.min) / (priceRange.max - priceRange.min)) * 100;

  return (
    <div className="w-full bg-white font-sans">
      <div className="max-w-screen-2xl mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Category Column */}
          <div className="w-full md:w-64">
            {uiCategories.map((category, index) => (
              <div
                key={index}
                className={`flex justify-between items-center px-4 py-3 mb-2 rounded cursor-pointer border-l-[3px] transition-all duration-200 ${
                  activeCategory === index
                    ? 'bg-gray-100 border-l-red-500 shadow-sm'
                    : 'bg-white border-l-transparent hover:bg-gray-50 hover:border-l-gray-300'
                }`}
                onClick={() => toggleCategory(index)}
              >
                <h3
                  className={`text-xs uppercase font-medium tracking-wide ${
                    activeCategory === index ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  {category}
                </h3>
                <span className="relative w-3 h-3">
                  <span
                    className={`absolute top-1/2 left-0 w-3 h-0.5 -mt-px ${
                      activeCategory === index ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                  ></span>
                  <span
                    className={`absolute top-0 left-1/2 h-3 w-0.5 -ml-px transition-transform duration-200 ${
                      activeCategory === index
                        ? 'bg-red-500 rotate-90'
                        : 'bg-gray-500'
                    }`}
                  ></span>
                </span>
              </div>
            ))}
          </div>

          {/* Options Column */}
          <div className="w-full">
            {activeCategory !== null && (
              <div className="animate-fade-in">
                {loading ? (
                  <div className="text-center py-6 text-gray-500">Loading options...</div>
                ) : (
                  <div className="space-y-3">
                    {/* Category Multi-Select */}
                    {isCategorySelected && (
                      <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="font-medium text-sm mb-2 text-gray-700">Select Categories:</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Array.isArray(fetchedCategories) &&
                            fetchedCategories.map((cat) => (
                              <label key={cat.id} className="flex items-center space-x-2 text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(cat.name)}
                                  onChange={() => handleCategoryChange(cat.name)}
                                  className="rounded text-red-500 focus:ring-red-500"
                                />
                                <span className="text-sm">{cat.name}</span>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Brand Multi-Select */}
                    {isBrandSelected && (
                      <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="font-medium text-sm mb-2 text-gray-700">Select Brands:</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Array.isArray(fetchedBrands) &&
                            fetchedBrands.map((brand) => (
                              <label key={brand.id} className="flex items-center space-x-2 text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={selectedBrands.includes(brand.name)}
                                  onChange={() => handleBrandChange(brand.name)}
                                  className="rounded text-red-500 focus:ring-red-500"
                                />
                                <span className="text-sm">{brand.name}</span>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Price Range */}
                    {isPriceSelected && (
                      <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="font-medium text-sm mb-3 text-gray-700">Price Range:</div>
                        
                        {/* Quick price range selections - ENHANCED BUTTONS */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-600 mb-2">Quick Ranges:</div>
                          <div className="flex flex-wrap gap-2">
                            {predefinedRanges.map((range, index) => (
                              <button
                                key={index}
                                onClick={() => handleRangeSelection(range.min, range.max)}
                                className={`px-3 py-1.5 text-xs rounded-full transition-all duration-300 shadow-sm 
                                  ${currentPriceRange.min === range.min && currentPriceRange.max === range.max
                                    ? 'bg-indigo-600 text-white transform scale-105 shadow-md' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300'
                                  }`}
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Range Slider */}
                        <div className="mb-4">
                          <div className="relative pt-6 pb-1">
                            <div className="h-1 w-full bg-gray-200 rounded-full">
                              <div 
                                className="absolute h-1 bg-indigo-500 rounded-full" 
                                style={{
                                  left: `${minThumbPosition}%`,
                                  right: `${100 - maxThumbPosition}%`
                                }}
                              ></div>
                            </div>
                            <input
                              type="range"
                              name="min"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={currentPriceRange.min}
                              onChange={handleSliderChange}
                              className="range-slider range-slider-min absolute w-full top-5 h-1 appearance-none bg-transparent pointer-events-none"
                            />
                            <input
                              type="range"
                              name="max"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={currentPriceRange.max}
                              onChange={handleSliderChange}
                              className="range-slider range-slider-max absolute w-full top-5 h-1 appearance-none bg-transparent pointer-events-none"
                            />
                          </div>
                        </div>

                        {/* Numeric inputs */}
                        <div className="flex items-center gap-4">
                          <div className="w-full">
                            <label className="block text-xs text-gray-600 mb-1">Min Price (₹)</label>
                            <input
                              type="number"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={currentPriceRange.min}
                              onChange={(e) => handlePriceChange('min', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                            />
                          </div>
                          <div className="flex items-center justify-center">
                            <span className="text-gray-400">to</span>
                          </div>
                          <div className="w-full">
                            <label className="block text-xs text-gray-600 mb-1">Max Price (₹)</label>
                            <input
                              type="number"
                              min={priceRange.min}
                              max={priceRange.max}
                              value={currentPriceRange.max}
                              onChange={(e) => handlePriceChange('max', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-between text-xs text-gray-500">
                          <span>Min: {priceRange.min}</span>
                          <span>Max: {priceRange.max}</span>
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    {isAvailabilitySelected && (
                      <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="font-medium text-sm mb-2 text-gray-700">Availability:</div>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="availability"
                              value="true"
                              checked={selectedAvailability === 'true'}
                              onChange={() => setSelectedAvailability('true')}
                              className="text-indigo-500 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Available</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="availability"
                              value="false"
                              checked={selectedAvailability === 'false'}
                              onChange={() => setSelectedAvailability('false')}
                              className="text-indigo-500 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Unavailable</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Rating - Interactive Star Design */}
                    {isRatingSelected && (
                      <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="font-medium text-sm mb-3 text-gray-700">Minimum Rating (from user reviews):</div>
                        <div className="rating-stars-container">
                          <div className="flex flex-col space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div 
                                key={rating} 
                                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-indigo-50 ${
                                  selectedRating === rating.toString() ? 'bg-indigo-50 border border-indigo-200 shadow-sm animate-rating-select' : ''
                                }`}
                                onClick={() => setSelectedRating(rating.toString())}
                              >
                                <div className="flex mr-3">
                                  {[...Array(5)].map((_, index) => (
                                    <span 
                                      key={index} 
                                      className={`star-icon ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className={`text-sm transition-all duration-300 ${
                                  selectedRating === rating.toString() ? 'font-medium text-indigo-700' : 'text-gray-600'
                                }`}>
                                  {rating === 5 ? 'Excellent' : 
                                    rating === 4 ? 'Very Good' : 
                                    rating === 3 ? 'Good' : 
                                    rating === 2 ? 'Fair' : 'Acceptable'}
                                  {rating < 5 && ' & up'}
                                </span>
                              </div>
                            ))}
                            <div 
                              className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 hover:bg-indigo-50 ${
                                selectedRating === '' ? 'bg-indigo-50 border border-indigo-200 shadow-sm animate-rating-select' : ''
                              }`}
                              onClick={() => setSelectedRating('')}
                            >
                              <div className="flex mr-3">
                                <span className="text-gray-400 text-sm">
                                  Any rating
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Filter Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        className="px-5 py-2 bg-red-600 text-white font-medium rounded-full text-xs uppercase tracking-wide hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleFilter}
                      >
                        Apply Filter
                      </button>
                      <button
                        className="px-5 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-full text-xs uppercase tracking-wide hover:bg-gray-50 hover:text-red-600 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        onClick={handleReset}
                      >
                        Reset All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Enhanced Range Slider Styles */
        .range-slider {
          -webkit-appearance: none;
        }
        
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #6366f1;
          cursor: pointer;
          pointer-events: auto;
          margin-top: -8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
        }
        
        .range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2px solid #6366f1;
          cursor: pointer;
          pointer-events: auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .range-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
        }
        
        /* Button Press Animation */
        @keyframes buttonPulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        
        /* Rating Stars Styles */
        .rating-stars-container {
          transition: all 0.3s ease;
        }
        
        .star-icon {
          display: inline-block;
          font-size: 1.25rem;
          transition: all 0.3s ease;
          transform-origin: center;
          margin-right: 2px;
        }
        
        @keyframes starPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes ratingSelect {
          0% { transform: translateX(-5px); opacity: 0.7; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        .animate-rating-select {
          animation: ratingSelect 0.3s ease-out forwards;
        }
        
        /* Apply animation to the selected rating's stars */
        div[class*="bg-indigo-50"] .star-icon {
          animation: starPulse 0.5s ease-in-out;
        }
        
        /* Hover effect on stars */
        div:hover .star-icon {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

export default Filter;