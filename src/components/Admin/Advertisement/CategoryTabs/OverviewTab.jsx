// CategoryTabs/OverviewTab.jsx
import { React, useEffect, useState } from "react";

import { getHeroCarouselForDropDownFromCategory } from "../../../../Services/Settings";

const OverviewTab = ({ category }) => {
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  // Add debug logging to see what category prop is being passed
  console.log("Category prop received:", category);

  // Ensure all values have defaults to prevent errors
  const fetchHeroCarouselForDropDownFromCategory = async () => {
    console.log("fetchHeroCarouselForDropDownFromCategory called");
    console.log("Category slug:", category?.slug);
    
    if (!category?.slug) {
      console.log("No category slug found, returning early");
      return;
    }

    setLoading(true);
    console.log("Starting API call...");
    
    try {
      const response = await getHeroCarouselForDropDownFromCategory(
        category.slug
      );
      console.log("API response received:", response);
      setCategoryData(response);

      console.log(response.specifications, "Fetched specifications");
    } catch (error) {
      console.error("Error fetching specifications:", error);
      alert("Error fetching specifications. Please try again.");
    } finally {
      setLoading(false);
      console.log("API call completed");
    }
  };

  console.log(categoryData, "data from console........");
  
  const totalProducts = categoryData.total_products || 0;
  const heroCarousels = categoryData.hero_carousels || [];
  const specifications = categoryData.specifications || [];
  const categoryProducts = categoryData.category_products || [];
  const featuredProducts = categoryProducts.filter((p) => p.is_featured).length;

  useEffect(() => {
    console.log("useEffect triggered, category:", category);
    fetchHeroCarouselForDropDownFromCategory();
  }, [category?.slug]); // Make sure dependency array includes category.slug

  // Add loading state display
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-lg">Loading category data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Category Overview</h2>
      
      {/* Debug info - remove in production */}
      {/* <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <strong>Debug Info:</strong> Category slug: {category?.slug || 'No slug'}, 
        Data loaded: {Object.keys(categoryData).length > 0 ? 'Yes' : 'No'}
      </div> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-pink-600">
            {totalProducts}
          </div>
          <div className="text-gray-600">Total Products</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {heroCarousels.length}
          </div>
          <div className="text-gray-600">Hero Carousels</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {specifications.length}
          </div>
          <div className="text-gray-600">Specifications</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {featuredProducts}
          </div>
          <div className="text-gray-600">Featured Products</div>
        </div>
      </div>

      {/* Category Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Category Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2">
              <span className="font-medium">Name:</span> {category?.name || 'No name'}
            </div>
            <div className="mb-2">
              <span className="font-medium">Description:</span>{" "}
              {category?.description || "No description"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Order:</span> {category?.order || 0}
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  category?.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {category?.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Quick Stats</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Available Products:</span>
              <span className="font-medium">
                {categoryProducts.filter((p) => p.product?.is_available).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Out of Stock:</span>
              <span className="font-medium">
                {
                  categoryProducts.filter((p) => !p.product?.is_available)
                    .length
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Carousels:</span>
              <span className="font-medium">
                {heroCarousels.filter((c) => c.is_active).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Specifications:</span>
              <span className="font-medium">
                {specifications.filter((s) => s.is_active).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;