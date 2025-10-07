// CategoryTabs/CarouselTab.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Upload, Loader2 } from "lucide-react";
import {
  createHeroCarouselForDropDown,
  getHeroCarouselForDropDownFromCategory,
  deleteHeroCarouselForDropDownFromCategory,
  updateHeroCarouselForDropDownFromCategory,
} from "../../../../Services/Settings";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading, carouselTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={!loading ? onClose : undefined}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Carousel
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{carouselTitle}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CarouselTab = ({ category, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [carouselToDelete, setCarouselToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [heroCarousels, setHeroCarousels] = useState([]);
  const [carouselForm, setCarouselForm] = useState({
    dropdown_menu: category?.id || 1,
    image: null,
    imageFile: null,
    alt_text: "",
    head_one: "",
    head_two: "",
    description: "",
    button_text: "Shop Now",
    button_link: "",
    order: 0,
    is_active: true,
  });

  const fetchHeroCarouselForDropDownFromCategory = async () => {
    if (!category?.slug) return;
    
    setFetchLoading(true);
    try {
      const response = await getHeroCarouselForDropDownFromCategory(category.slug);
      setHeroCarousels(response.hero_carousels || []);
    } catch (error) {
      // console.error("Error fetching carousels:", error);
      alert("Error fetching carousels. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const resetForm = () => {
    setCarouselForm({
      dropdown_menu: category?.id || 1,
      image: null,
      imageFile: null,
      alt_text: "",
      head_one: "",
      head_two: "",
      description: "",
      button_text: "Shop Now",
      button_link: "",
      order: 0,
      is_active: true,
    });
  };

  const openModal = (carousel = null) => {
    if (carousel) {
      setEditingCarousel(carousel);
      setCarouselForm({
        dropdown_menu: carousel.dropdown_menu || category?.id || 1,
        image: carousel.image,
        imageFile: null,
        alt_text: carousel.alt_text || "",
        head_one: carousel.head_one || "",
        head_two: carousel.head_two || "",
        description: carousel.description || "",
        button_text: carousel.button_text || "Shop Now",
        button_link: carousel.button_link || "",
        order: carousel.order || 0,
        is_active: carousel.is_active !== undefined ? carousel.is_active : true,
      });
    } else {
      setEditingCarousel(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCarousel(null);
    resetForm();
  };

  const openDeleteModal = (carousel) => {
    setCarouselToDelete(carousel);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCarouselToDelete(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCarouselForm((prev) => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const removeImage = () => {
    setCarouselForm((prev) => ({
      ...prev,
      imageFile: null,
      image: editingCarousel ? editingCarousel.image : null,
    }));
  };

  const createFormData = () => {
    const formData = new FormData();

    formData.append("dropdown_menu", carouselForm.dropdown_menu);
    formData.append("head_one", carouselForm.head_one);
    formData.append("head_two", carouselForm.head_two);
    formData.append("description", carouselForm.description);

    if (carouselForm.alt_text)
      formData.append("alt_text", carouselForm.alt_text);
    if (carouselForm.button_text)
      formData.append("button_text", carouselForm.button_text);
    if (carouselForm.button_link)
      formData.append("button_link", carouselForm.button_link);
    if (carouselForm.order !== undefined)
      formData.append("order", carouselForm.order);
    if (carouselForm.is_active !== undefined) {
      formData.append("is_active", carouselForm.is_active.toString());
    }

    // Attach image file if present
    if (carouselForm.imageFile instanceof File) {
      formData.append("image", carouselForm.imageFile);
    }

    return formData;
  };

  const validateForm = () => {
    if (!carouselForm.head_one.trim()) {
      alert("Header One is required");
      return false;
    }
    if (!carouselForm.head_two.trim()) {
      alert("Header Two is required");
      return false;
    }
    if (!carouselForm.description.trim()) {
      alert("Description is required");
      return false;
    }
    if (!carouselForm.alt_text.trim()) {
      alert("Alt text is required");
      return false;
    }
    if (!carouselForm.button_text.trim()) {
      alert("Button text is required");
      return false;
    }
    if (!editingCarousel && !carouselForm.imageFile) {
      alert("Image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = createFormData();

      if (editingCarousel) {
        // Update existing carousel - pass the carousel ID
        const response = await updateHeroCarouselForDropDownFromCategory(editingCarousel.id, formData);
        
        if (response) {
          alert("Carousel updated successfully!");
          await fetchHeroCarouselForDropDownFromCategory();
          closeModal();
        } else {
          throw new Error("Failed to update carousel");
        }
      } else {
        // Create new carousel
        const responseData = await createHeroCarouselForDropDown(formData);

        if (responseData) {
          // console.log("Carousel created successfully:", responseData);
          alert("Carousel added successfully!");
          await fetchHeroCarouselForDropDownFromCategory();
          closeModal();
        } else {
          throw new Error("Failed to create carousel");
        }
      }
    } catch (error) {
      // console.error("Error submitting carousel:", error);
      alert(
        `Error ${
          editingCarousel ? "updating" : "adding"
        } carousel. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarousel = async () => {
    if (!carouselToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteHeroCarouselForDropDownFromCategory(carouselToDelete.id);
      alert("Carousel deleted successfully!");
      await fetchHeroCarouselForDropDownFromCategory();
      closeDeleteModal();
  
    } catch (error) {
      // console.error("Error deleting carousel:", error);
      alert("Error deleting carousel. Please try again.", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setCarouselForm((prev) => ({ ...prev, [field]: value }));
  };

  // Update dropdown_menu when category changes and fetch data
  useEffect(() => {
    if (category?.id) {
      setCarouselForm((prev) => ({
        ...prev,
        dropdown_menu: category.id,
      }));
    }
    fetchHeroCarouselForDropDownFromCategory();
  }, [category]);

  // Show loading spinner while fetching data
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-pink-600" />
          <p className="mt-2 text-gray-600">Loading carousels...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Hero Carousel Items
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage your hero carousel slides for the homepage
              </p>
            </div>
            <button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:from-pink-700 hover:to-pink-800 disabled:opacity-50 flex items-center space-x-2 w-full sm:w-auto justify-center shadow-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              <Plus size={16} className="sm:size-5" />
              <span className="font-medium">Add New Carousel</span>
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {heroCarousels.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">
                  No carousel items yet
                </h3>
                <p className="mt-2 text-gray-500 text-sm sm:text-base">
                  Get started by adding your first carousel slide
                </p>
                <button
                  onClick={() => openModal()}
                  className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm sm:text-base"
                >
                  Add Your First Carousel
                </button>
              </div>
            ) : (
              heroCarousels.map((carousel, index) => (
                <div
                  key={carousel.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-6 hover:shadow-lg transition-shadow duration-200 bg-white"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start space-y-4 lg:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        {carousel.image && (
                          <div className="flex-shrink-0 self-center sm:self-start">
                            <img
                              src={carousel.image}
                              alt={carousel.alt_text || "Carousel image"}
                              className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 object-cover rounded-lg shadow-md"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
                            {carousel.head_one} - {carousel.head_two}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm mt-2 break-words line-clamp-2">
                            {carousel.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Order: {carousel.order}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Button: {carousel.button_text}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                carousel.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {carousel.is_active ? "Active" : "Active"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 self-end lg:self-start">
                      <button
                        onClick={() => openModal(carousel)}
                        disabled={loading || deleteLoading}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 transition-colors"
                        title="Edit carousel"
                      >
                        <Edit size={16} className="sm:size-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(carousel)}
                        disabled={loading || deleteLoading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                        title="Delete carousel"
                      >
                        <Trash2 size={16} className="sm:size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Carousel */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingCarousel ? "Edit Carousel Slide" : "Add New Carousel Slide"
        }
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image *{" "}
              {!editingCarousel && (
                <span className="text-red-500">(Required)</span>
              )}
            </label>
            <div className="flex flex-col space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 transition-colors"
              />
              {carouselForm.image && (
                <div className="relative inline-block">
                  <img
                    src={carouselForm.image}
                    alt="Preview"
                    className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 object-cover rounded-lg border shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header One *{" "}
                <span className="text-gray-500">(max 50 chars)</span>
              </label>
              <input
                type="text"
                placeholder="Enter main heading"
                value={carouselForm.head_one}
                onChange={(e) => handleFormChange("head_one", e.target.value)}
                maxLength={50}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors text-sm"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {carouselForm.head_one.length}/50 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Two *{" "}
                <span className="text-gray-500">(max 50 chars)</span>
              </label>
              <input
                type="text"
                placeholder="Enter sub heading"
                value={carouselForm.head_two}
                onChange={(e) => handleFormChange("head_two", e.target.value)}
                maxLength={50}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors text-sm"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {carouselForm.head_two.length}/50 characters
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text * <span className="text-gray-500">(max 100 chars)</span>
            </label>
            <input
              type="text"
              placeholder="Alt text for accessibility"
              value={carouselForm.alt_text}
              onChange={(e) => handleFormChange("alt_text", e.target.value)}
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors text-sm"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {carouselForm.alt_text.length}/100 characters
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *{" "}
              <span className="text-gray-500">(max 200 chars)</span>
            </label>
            <textarea
              placeholder="Enter carousel description"
              value={carouselForm.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              maxLength={200}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors text-sm"
              rows="3"
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {carouselForm.description.length}/200 characters
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text *{" "}
                <span className="text-gray-500">(max 20 chars)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Shop Now"
                value={carouselForm.button_text}
                onChange={(e) =>
                  handleFormChange("button_text", e.target.value)
                }
                maxLength={20}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors text-sm"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {carouselForm.button_text.length}/20 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                placeholder="Display order"
                value={carouselForm.order}
                onChange={(e) =>
                  handleFormChange("order", parseInt(e.target.value) || 0)
                }
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Link <span className="text-gray-500">(max 200 chars)</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={carouselForm.button_link}
              onChange={(e) => handleFormChange("button_link", e.target.value)}
              maxLength={200}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors text-sm"
            />
            <div className="text-xs text-gray-500 mt-1">
              {carouselForm.button_link.length}/200 characters
            </div>
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="is_active"
              checked={carouselForm.is_active}
              onChange={(e) => handleFormChange("is_active", e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-900"
            >
              Make this carousel slide active
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
          <button
            onClick={closeModal}
            disabled={loading}
            className="px-4 py-2 sm:px-6 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 w-full sm:w-auto transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-4 py-2 sm:px-6 rounded-lg hover:from-pink-700 hover:to-pink-800 disabled:opacity-50 w-full sm:w-auto transition-all duration-200 transform hover:scale-105 text-sm flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                {editingCarousel ? "Updating..." : "Adding..."}
              </>
            ) : (
              editingCarousel ? "Update Carousel" : "Add Carousel"
            )}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCarousel}
        loading={deleteLoading}
        carouselTitle={carouselToDelete ? `${carouselToDelete.head_one} - ${carouselToDelete.head_two}` : ''}
      />
    </>
  );
};

export default CarouselTab;