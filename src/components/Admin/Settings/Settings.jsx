import React, { useEffect, useState } from "react";
import Tax from "../Tax/Tax";
import {
  updateCategory,
  getBrand,
  deleteBrand,
  addBrand,
  getCategory,
  addCategory,
  deleteCategory,
  getTax,
  updateBrand,
  getSubCategory,
  addSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "../../../Services/Settings";
import Loader from "../../../Loader/Loader";
import Sidebar from '../Sidebar';
import NeoFooter from '../footer';

function Settings() {
  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showSubCategoryPopup, setShowSubCategoryPopup] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tax, setTax] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [brandName, setBrandName] = useState("");
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    parent: "",
  });
  const [subcategoryData, setSubcategoryData] = useState({
    name: "",
    description: "",
  });
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const Totalbrands = await getBrand();
      setBrands(Totalbrands.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
      setError("Failed to load brands. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const category = await getCategory();
      setCategories(category.data || []);
    } catch (error) {
      console.error(error);
      setCategories([]);
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubCategory = async () => {
    try {
      setIsLoading(true);
      const subcategories = await getSubCategory();
      setSubcategories(subcategories.data || []);
    } catch (error) {
      console.error(error);
      setSubcategories([]);
      setError("Failed to load subcategories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchtax = async () => {
    try {
      const Taxes = await getTax();
      setTax(Taxes.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBrands();
      await fetchCategory();
      await fetchSubCategory();
      await fetchtax();
    };
    loadData();
  }, []);

  const getParentCategoryName = (parentId) => {
    if (!parentId) return "None";
    const parent = categories.find((cat) => cat.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingBrand) {
        console.log("Editing brand with ID:", editingBrand.id, brandName);
        let data = {
          id: editingBrand.id,
          name: brandName,
        };
        let response = await updateBrand(data);
        console.log(response, "..");
        showToast("Brand updated successfully!");
      } else {
        await addBrand(brandName);
        showToast("Brand added successfully!");
      }
      await fetchBrands();
      setShowBrandPopup(false);
      setBrandName("");
      setEditingBrand(null);
    } catch (error) {
      console.error(error);
      showToast(
        `Failed to ${editingBrand ? "update" : "add"} brand. Please try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Prepare the category object with all necessary fields
      const categoryPayload = {
        name: categoryData.name.trim(),
        description: categoryData.description.trim() || null, // Send null if empty
      };

      if (editingCategory) {
        console.log(
          "Editing category with ID:",
          editingCategory.id,
          "with data:",
          categoryPayload
        );
        // Add the ID to the payload for updates
        categoryPayload.id = editingCategory.id;
        let data = {
          id: categoryPayload.id,
          name: categoryPayload.name,
          description: categoryPayload.description,
        };
        let response = await updateCategory(data);
        console.log(response, "response");
        showToast("Category updated successfully!");
      } else {
        await addCategory(categoryPayload);
        showToast("Category added successfully!");
      }

      await fetchCategory();
      setShowCategoryPopup(false);
      setCategoryData({ name: "", description: "", parent: "" });
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      showToast(
        `Failed to ${
          editingCategory ? "update" : "add"
        } category. Please try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Prepare the subcategory object with all necessary fields
      const subcategoryPayload = {
        name: subcategoryData.name.trim(),
        description: subcategoryData.description.trim() || null, // Send null if empty
      };

      if (editingSubCategory) {
        console.log(
          "Editing subcategory with ID:",
          editingSubCategory.id,
          "with data:",
          subcategoryPayload
        );
        subcategoryPayload.id = editingSubCategory.id;
        let data = {
          id: subcategoryPayload.id,
          name: subcategoryPayload.name,
          description: subcategoryPayload.description,
        };
        let response = await updateSubCategory(data);
        console.log(response, "response");
        showToast("Subcategory updated successfully!");
      } else {
        await addSubCategory(subcategoryPayload);
        showToast("Subcategory added successfully!");
      }

      await fetchSubCategory();
      setShowSubCategoryPopup(false);
      setSubcategoryData({ name: "", description: "" });
      setEditingSubCategory(null);
    } catch (error) {
      console.error(error);
      showToast(
        `Failed to ${
          editingSubCategory ? "update" : "add"
        } subcategory. Please try again.`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubCategoryChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteBrand = async (brandId) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        setIsLoading(true);
        await deleteBrand(brandId);
        await fetchBrands();
        showToast("Brand deleted successfully!");
      } catch (error) {
        console.error(error);
        showToast("Failed to delete brand. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setIsLoading(true);
        await deleteCategory(categoryId);
        await fetchCategory();
        showToast("Category deleted successfully!");
      } catch (error) {
        console.error(error);
        showToast("Failed to delete category. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteSubCategory = async (subcategoryId) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        setIsLoading(true);
        await deleteSubCategory(subcategoryId);
        await fetchSubCategory();
        showToast("Subcategory deleted successfully!");
      } catch (error) {
        console.error(error);
        showToast("Failed to delete subcategory. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setShowBrandPopup(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryData({
      name: category.name,
      description: category.description || "",
      parent: category.parent || "",
    });
    setShowCategoryPopup(true);
  };

  const handleEditSubCategory = (subcategory) => {
    setEditingSubCategory(subcategory);
    setSubcategoryData({
      name: subcategory.name,
      description: subcategory.description || "",
    });
    setShowSubCategoryPopup(true);
  };

  if (
    isLoading &&
    (!brands || !brands.length) &&
    (!categories || !categories.length) &&
    (!subcategories || !subcategories.length)
  ) {
    return <Loader />;
  }

  return (
    <>
    <Sidebar/>
  
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6 font-rajdhani">
      <h2 className="text-2xl font-bold mb-6 md:mb-8">Settings</h2>

      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-3 rounded-md shadow-lg ${
              toast.type === "error" ? "bg-red-600" : "bg-green-600"
            } text-white font-medium`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Brands Section */}
      <div className="mb-8 md:mb-12 bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl font-semibold">Brands</h3>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium w-full sm:w-auto flex items-center justify-center"
            onClick={() => {
              setEditingBrand(null);
              setBrandName("");
              setShowBrandPopup(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Brand
          </button>
        </div>

        <div className="overflow-x-auto">
          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 font-medium">
              {error}
            </div>
          ) : (
            <div className="max-w-full mx-auto">
              <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-24 sm:w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {brands && brands.length > 0 ? (
                    brands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-gray-650">
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-medium">
                          {brand.id}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-medium">
                          {brand.name}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap flex flex-wrap gap-2">
                          <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 sm:px-3 py-1 rounded text-sm font-medium"
                            onClick={() => handleEditBrand(brand)}
                            disabled={isLoading}
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </span>
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded text-sm font-medium"
                            onClick={() => handleDeleteBrand(brand.id)}
                            disabled={isLoading}
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-4 text-center">
                        <div className="text-center py-4">
                          <h4 className="text-lg font-medium mb-2">
                            No Brands Found
                          </h4>
                          <p className="text-gray-400 font-medium">
                            You haven't added any brands yet. Click "Add Brand"
                            to create your first brand.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8 md:mb-12 bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl font-semibold">Categories</h3>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium w-full sm:w-auto flex items-center justify-center"
            onClick={() => {
              setEditingCategory(null);
              setCategoryData({ name: "", description: "", parent: "" });
              setShowCategoryPopup(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 font-medium">
              {error}
            </div>
          ) : (
            <div className="max-w-full mx-auto">
              <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="hidden md:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-24 sm:w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-650">
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-medium">
                          {category.id}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-medium">
                          {category.name}
                        </td>
                        <td className="hidden md:table-cell px-2 sm:px-4 py-3 font-medium">
                          <div className="max-w-xs truncate">
                            {category.description || "No description"}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap flex flex-wrap gap-2">
                          <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 sm:px-3 py-1 rounded text-sm font-medium"
                            onClick={() => handleEditCategory(category)}
                            disabled={isLoading}
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </span>
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded text-sm font-medium"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={isLoading}
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center">
                        <div className="text-center py-4">
                          <h4 className="text-lg font-medium mb-2">
                            No Categories Found
                          </h4>
                          <p className="text-gray-400 font-medium">
                            You haven't added any categories yet. Click "Add
                            Category" to create your first category.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sub Categories Section */}
      <div className="mb-8 md:mb-12 bg-gray-800 rounded-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-xl font-semibold">Sub Categories</h3>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium w-full sm:w-auto flex items-center justify-center"
            onClick={() => {
              setEditingSubCategory(null);
              setSubcategoryData({ name: "", description: "" });
              setShowSubCategoryPopup(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Subcategory
          </button>
        </div>

        <div className="overflow-x-auto">
          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 font-medium">
              {error}
            </div>
          ) : (
            <div className="max-w-full mx-auto">
              <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-600">
                  <tr>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="hidden md:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-24 sm:w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {subcategories && subcategories.length > 0 ? (
                    subcategories.map((subcategory) => (
                      <tr key={subcategory.id} className="hover:bg-gray-650">
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-medium">
                          {subcategory.id}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-medium">
                          {subcategory.name}
                        </td>
                        <td className="hidden md:table-cell px-2 sm:px-4 py-3 font-medium">
                          <div className="max-w-xs truncate">
                            {subcategory.description || "No description"}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap flex flex-wrap gap-2">
                          <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 sm:px-3 py-1 rounded text-sm font-medium"
                            onClick={() => handleEditSubCategory(subcategory)}
                            disabled={isLoading}
                          >
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </span>
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded text-sm font-medium"
                            onClick={() =>
                              handleDeleteSubCategory(subcategory.id)
                            }
                            disabled={isLoading}
                          >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center">
                        <div className="text-center py-4">
                          <h4 className="text-lg font-medium mb-2">
                            No Sub Categories Found
                          </h4>
                          <p className="text-gray-400 font-medium">
                            You haven't added any categories yet. Click "Add Sub
                            Category" to create your first category.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Brand Popup */}
      {showBrandPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">
                {editingBrand ? "Edit Brand" : "Add New Brand"}
              </h3>
              <button
                className="text-gray-400 hover:text-white text-xl font-medium"
                onClick={() => {
                  setShowBrandPopup(false);
                  setEditingBrand(null);
                  setBrandName("");
                }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBrandSubmit} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="brandName"
                  className="block text-sm font-medium mb-2"
                >
                  Brand Name
                </label>
                <input
                  type="text"
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                  placeholder="Enter brand name"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium"
                  onClick={() => {
                    setShowBrandPopup(false);
                    setEditingBrand(null);
                    setBrandName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50 font-medium"
                  disabled={!brandName.trim() || isLoading}
                >
                  {isLoading
                    ? editingBrand
                      ? "Updating..."
                      : "Adding..."
                    : editingBrand
                    ? "Update Brand"
                    : "Add Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                className="text-gray-400 hover:text-white text-xl font-medium"
                onClick={() => {
                  setShowCategoryPopup(false);
                  setEditingCategory(null);
                  setCategoryData({ name: "", description: "", parent: "" });
                }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  value={categoryData.name}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryDescription"
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="categoryDescription"
                  name="description"
                  value={categoryData.description}
                  onChange={handleCategoryChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="Enter category description (optional)"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium"
                  onClick={() => {
                    setShowCategoryPopup(false);
                    setEditingCategory(null);
                    setCategoryData({ name: "", description: "", parent: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50 font-medium"
                  disabled={!categoryData.name.trim() || isLoading}
                >
                  {isLoading
                    ? editingCategory
                      ? "Updating..."
                      : "Adding..."
                    : editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub Category Popup */}
      {showSubCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">
                {editingSubCategory
                  ? "Edit Subcategory"
                  : "Add New Subcategory"}
              </h3>
              <button
                className="text-gray-400 hover:text-white text-xl font-medium"
                onClick={() => {
                  setShowSubCategoryPopup(false);
                  setEditingSubCategory(null);
                  setSubcategoryData({ name: "", description: "" });
                }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubCategorySubmit} className="p-6">
              <div className="mb-4">
                <label
                  htmlFor="subcategoryName"
                  className="block text-sm font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="subcategoryName"
                  name="name"
                  value={subcategoryData.name}
                  onChange={handleSubCategoryChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                  placeholder="Enter subcategory name"
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subcategoryDescription"
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="subcategoryDescription"
                  name="description"
                  value={subcategoryData.description}
                  onChange={handleSubCategoryChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="Enter subcategory description (optional)"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium"
                  onClick={() => {
                    setShowSubCategoryPopup(false);
                    setEditingSubCategory(null);
                    setSubcategoryData({ name: "", description: "" });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50 font-medium"
                  disabled={!subcategoryData.name.trim() || isLoading}
                >
                  {isLoading
                    ? editingSubCategory
                      ? "Updating..."
                      : "Adding..."
                    : editingSubCategory
                    ? "Update Subcategory"
                    : "Add Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Tax />
    </div>
<NeoFooter/>
    </>
  );
}

export default Settings;
