// ProductCategoryAdmin.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Settings,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import axios from "../../../Axios/Axios";
import Loader from "../../../Loader/Loader";
import Sidebar from "../Sidebar";
import NeoFooter from "../footer";
import CategoryConfigurationPage from "./CategoryConfigurationPage";
import CreateCategoryModal from "./CreateCategoryModal";

// Update Category Modal Component
const UpdateCategoryModal = ({ category, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    is_active: category?.is_active || false,
    order: category?.order || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Update Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows="3"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              min="0"
              disabled={loading}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active Category
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
      }`}>
        {type === 'success' && <CheckCircle size={20} />}
        {type === 'error' && <AlertCircle size={20} />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const ProductCategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Fetch categories from API
  const fetchDropDownCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/advertisement/product/categories/");
      setCategories(response.data);
      console.log(response.data, "data from dropdown model.............");
      setError(null);
    } catch (err) {
      setError("Failed to load product categories");
      showToast("Failed to load categories", "error");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete category function - FIXED
  const deleteDropdownCategory = async (slug) => {
    const categoryToDelete = categories.find(cat => cat.slug === slug);
    const categoryName = categoryToDelete ? categoryToDelete.name : slug;
    
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setLoading(true);
      showToast("Deleting category...", "info");
      
      await axios.delete(`/advertisement/product/categories/${slug}/`);
      
      // Remove the deleted category from the state
      setCategories(prevCategories => 
        prevCategories.filter(category => category.slug !== slug)
      );
      
      showToast(`Category "${categoryName}" deleted successfully`, "success");
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete category";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update category function - NEW
  const updateDropdownCategory = async (slug, formData) => {
    try {
      setLoading(true);
      showToast("Updating category...", "info");

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("is_active", formData.is_active);
      formDataToSend.append("order", formData.order);

      const response = await axios.patch(
        `/advertisement/product/categories/${slug}/`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update the category in the state
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.slug === slug ? { ...category, ...response.data } : category
        )
      );

      setShowUpdateModal(false);
      setCategoryToUpdate(null);
      showToast(`Category "${formData.name}" updated successfully`, "success");
      setError(null);

      console.log("Category updated successfully:", response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update category";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (category) => {
    setCategoryToUpdate(category);
    setShowUpdateModal(true);
  };

  // Handle update form submission
  const handleUpdateSubmit = (formData) => {
    if (categoryToUpdate) {
      updateDropdownCategory(categoryToUpdate.slug, formData);
    }
  };

  useEffect(() => {
    fetchDropDownCategories();
  }, []);

  // Filter categories based on search and filter criteria
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && category.is_active) ||
      (filterActive === "inactive" && !category.is_active);
    return matchesSearch && matchesFilter;
  });

  // Handle category creation
  const handleCreateCategory = async (categoryForm) => {
    try {
      setLoading(true);
      showToast("Creating category...", "info");

      const formDataToSend = new FormData();
      formDataToSend.append("name", categoryForm.name);
      formDataToSend.append("description", categoryForm.description);
      formDataToSend.append("is_active", categoryForm.is_active);
      formDataToSend.append("order", categoryForm.order);

      const response = await axios.post(
        "/advertisement/product/categories/",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Add the new category to the list with proper default values
      const newCategory = {
        ...response.data,
        total_products: 0,
        hero_carousels: [],
        specifications: [],
        category_products: [],
      };

      setCategories([...categories, newCategory]);
      setShowCreateModal(false);
      showToast(`Category "${categoryForm.name}" created successfully`, "success");

      console.log("Category created successfully:", response.data);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create category";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection with proper data initialization
  const handleCategorySelect = (category) => {
    // Ensure all required properties exist with default values
    const normalizedCategory = {
      ...category,
      total_products: category.total_products || 0,
      hero_carousels: category.hero_carousels || [],
      specifications: category.specifications || [],
      category_products: category.category_products || [],
    };

    setSelectedCategory(normalizedCategory);
  };

  // Handle category updates
  const handleCategoryUpdate = (updatedCategory) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    setCategories(updatedCategories);
    setSelectedCategory(updatedCategory);
  };

  // Error display
  if (error && categories.length === 0) {
    return (
      <>
        <Sidebar />
        <div className="min-h-screen bg-gray-50" style={{ marginTop: "60px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button
                onClick={fetchDropDownCategories}
                className="ml-auto bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <NeoFooter />
      </>
    );
  }

  // Loading state
  if (loading && categories.length === 0) {
    return <Loader />;
  }

  // Show category configuration page
  if (selectedCategory) {
    return (
      <CategoryConfigurationPage
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onUpdate={handleCategoryUpdate}
      />
    );
  }

  // Main categories list page
  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50" style={{ marginTop: "60px" }}>
        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Product Dropdown Categories
              </h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 sm:mt-0 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 flex items-center space-x-2 font-medium disabled:opacity-50"
                disabled={loading}
              >
                <Plus size={20} />
                <span>Create Category</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                      value={filterActive}
                      onChange={(e) => setFilterActive(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.description || "No description"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            category.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.order || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleCategorySelect(category)}
                            className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700 flex items-center space-x-1 disabled:opacity-50"
                            disabled={loading}
                            title="Configure category"
                          >
                            <Settings size={14} />
                            <span>Configure</span>
                          </button>
                          <button 
                            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            onClick={() => handleEditClick(category)}
                            disabled={loading}
                            title="Edit category"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            onClick={() => deleteDropdownCategory(category.slug)}
                            disabled={loading}
                            title="Delete category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    {searchTerm || filterActive !== "all"
                      ? "No categories found matching your criteria."
                      : "No categories created yet."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Category Modal */}
        {showCreateModal && (
          <CreateCategoryModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateCategory}
            loading={loading}
          />
        )}

        {/* Update Category Modal */}
        {showUpdateModal && categoryToUpdate && (
          <UpdateCategoryModal
            category={categoryToUpdate}
            onClose={() => {
              setShowUpdateModal(false);
              setCategoryToUpdate(null);
            }}
            onSubmit={handleUpdateSubmit}
            loading={loading}
          />
        )}
      </div>
      <NeoFooter />
    </>
  );
};

export default ProductCategoryAdmin;