import { React, useEffect, useState } from "react";
import { Plus, X, Star, Edit, Trash2 } from "lucide-react";
import { getAllProductAdmin } from "../../../../Services/Products";
import {
  AddProductToDropDownCategory,
  getProductBySlug,
  DeleteProductByIdSlug
} from "../../../../Services/Settings";

function ProductsTab({ category, onRemoveProduct }) {
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [productFromCategory, setProductFromCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await getAllProductAdmin();
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.error("Error fetching all products:", error);
      setError(error.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addProductToCategory = async (productId, categoryId) => {
    const payload = {
      product: productId,
      dropdown_menu: categoryId,
    };
    try {
      const result = await AddProductToDropDownCategory(payload);
      if (result === null) {
        throw new Error("Failed to add product to category");
      }
      return result;
    } catch (error) {
      console.error("Error adding product to category:", error);
      throw error;
    }
  };

  const getProductFromCategory = async () => {
    if (!category || !category.id) return;

    try {
      setCategoryLoading(true);
      setError(null);
      console.log("Fetching products for category:", category);
      const response = await getProductBySlug(category.slug);
      console.log("Category response----:", response.category_products);
      
      const categoryProducts = Array.isArray(response) ? response : [];
      console.log("Category products:", categoryProducts);
      setProductFromCategory(response.category_products);
    } catch (error) {
      console.error("Error fetching category products:", error);
      setError(error.message || "Failed to fetch category products");
      setProductFromCategory([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleAddProduct = async (product) => {
    if (!category || !category.id) {
      alert("No category selected");
      return;
    }

    try {
      await addProductToCategory(product.id, category.id);
      alert("Product added successfully!");
      setShowProductModal(false);
      setSearchTerm("");
      await getProductFromCategory();
    } catch (error) {
      alert("Failed to add product: " + error.message);
    }
  };

  const handleRemoveProduct = (categoryProductId) => {
    setProductToDelete(categoryProductId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      await DeleteProductByIdSlug(productToDelete);
      
      await getProductFromCategory();
      
      if (typeof onRemoveProduct === "function") {
        onRemoveProduct(productToDelete);
      }
      
      alert("Product removed successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to remove product: " + error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const isProductInCategory = (productId) => {
    return productFromCategory.some(
      (categoryProduct) => categoryProduct.product?.id === productId
    );
  };

  const getPrimaryImageUrl = (images) => {
    if (!Array.isArray(images) || images.length === 0) return null;
    const primaryImage = images.find(img => img.is_primary) || images[0];
    return primaryImage?.image_url || primaryImage?.image;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category?.id) {
      getProductFromCategory();
    } else {
      setProductFromCategory([]);
    }
  }, [category]);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold">
            {category?.name ? `${category.name} - Products` : 'Category Products'}
          </h2>
          <button
            onClick={() => setShowProductModal(true)}
            className="bg-pink-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-pink-700 flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!category?.id}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>

        {!category?.id && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">Please select a category first.</p>
          </div>
        )}

        {category?.id && (
          <div className="space-y-3 sm:space-y-4">
            {categoryLoading ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base">Loading category products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6 sm:py-8 text-red-600">
                <p className="text-sm sm:text-base">Error: {error}</p>
                <button 
                  onClick={getProductFromCategory}
                  className="mt-2 text-pink-600 hover:text-pink-700 text-sm underline"
                >
                  Try Again
                </button>
              </div>
            ) : productFromCategory.length > 0 ? (
              productFromCategory.map((categoryProduct) => {
                const product = categoryProduct.product;
                const primaryImageUrl = getPrimaryImageUrl(product?.images);
                
                return (
                  <div
                    key={categoryProduct.id}
                    className="border rounded-lg p-3 sm:p-4 hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                      <div className="flex space-x-3 flex-1">
                        {primaryImageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={primaryImageUrl}
                              alt={product?.name || 'Product'}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-sm sm:text-base truncate">
                              {product?.name || 'Unknown Product'}
                            </h3>
                            {categoryProduct.is_featured && (
                              <Star
                                size={14}
                                className="text-yellow-500 fill-current sm:size-4 flex-shrink-0"
                              />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Code: {product?.product_code || 'N/A'}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Brand: {product?.brand_name || 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                            <span className="text-pink-600 font-medium">
                              ₹{product?.price || '0'}
                            </span>
                            {product?.mrp && product.mrp !== product.price && (
                              <span className="text-gray-500 line-through">
                                ₹{product.mrp}
                              </span>
                            )}
                            <span className="text-gray-600">
                              Order: {categoryProduct.order || 0}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                product?.is_available
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product?.is_available ? "Available" : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 sm:ml-4 flex-shrink-0">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <Edit size={14} className="sm:size-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(categoryProduct.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={14} className="sm:size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <p className="text-sm sm:text-base">No products found in this category.</p>
                <p className="text-xs sm:text-sm mt-1">
                  Click "Add Product" to get started.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-3 sm:p-6 w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Select Products</h2>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setSearchTerm("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} className="sm:size-6" />
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products by name, code, or brand..."
                className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base">Loading products...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-6 sm:py-8 text-red-600">
                <p className="text-sm sm:text-base">Error: {error}</p>
                <button 
                  onClick={fetchProducts}
                  className="mt-2 text-pink-600 hover:text-pink-700 text-sm underline"
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-sm sm:text-base">
                    {searchTerm ? "No products found matching your search." : "No products available."}
                  </p>
                </div>
              )}
              
              {filteredProducts.map((product) => {
                const isAlreadyInCategory = isProductInCategory(product.id);
                const primaryImageUrl = getPrimaryImageUrl(product.images);
                
                return (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-3 sm:p-4 hover:shadow-sm ${
                      isAlreadyInCategory ? 'bg-gray-50 opacity-60' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                      <div className="flex space-x-3 flex-1">
                        {primaryImageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={primaryImageUrl}
                              alt={product.name || 'Product'}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base mb-1 truncate">
                            {product.name}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Code: {product.product_code}
                            </p>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Brand: {product.brand_name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-4 mt-2 text-xs sm:text-sm">
                            <span className="text-pink-600 font-medium">
                              ₹{product.price}
                            </span>
                            {product.mrp && product.mrp !== product.price && (
                              <span className="text-gray-500 line-through">
                                ₹{product.mrp}
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                product.is_available
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.is_available ? "Available" : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAddProduct(product)}
                        disabled={isAlreadyInCategory}
                        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto ${
                          isAlreadyInCategory
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-pink-600 text-white hover:bg-pink-700'
                        }`}
                      >
                        {isAlreadyInCategory ? 'Already Added' : 'Add to Category'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Confirm Removal</h2>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} className="sm:size-6" />
              </button>
            </div>

            <p className="mb-6 text-gray-700">
              Are you sure you want to remove this product from the category?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsTab;