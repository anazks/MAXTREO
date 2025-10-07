import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import {
  createSpecificationForDropDownFromCategory,
  updateSpecificationForDropDownFromCategory,
  getSpecificationForDropDownFromCategory,
  deleteSpecificationForDropDownFromCategory,
  getHeroCarouselForDropDownFromCategory,
} from "../../../../Services/Settings";

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SpecificationsTab({ category, onUpdate }) {
  const [specifications, setSpecifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [specForm, setSpecForm] = useState({
    dropdown_menu: category.id,
    title: "",
    description: "",
    order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setSpecForm({
      dropdown_menu: category.id,
      title: "",
      description: "",
      order: 0,
      is_active: true,
    });
    setEditingSpec(null);
  };

  const fetchHeroCarouselForDropDownFromCategory = async () => {
    if (!category?.slug) return;

    setLoading(true);
    try {
      const response = await getHeroCarouselForDropDownFromCategory(category.slug);
      setSpecifications(response.specifications || []);
      console.log(response.specifications, "Fetched specifications");
    } catch (error) {
      console.error("Error fetching specifications:", error);
      alert("Error fetching specifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (spec = null) => {
    if (spec) {
      // Edit mode
      setEditingSpec(spec);
      setSpecForm({
        dropdown_menu: spec.dropdown_menu,
        title: spec.title,
        description: spec.description,
        order: spec.order,
        is_active: spec.is_active,
      });
    } else {
      // Add mode
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmitSpecification = async () => {
    if (!specForm.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      if (editingSpec) {
        // Update existing specification
        console.log("Updating specification:", editingSpec.id, specForm);
        const response = await updateSpecificationForDropDownFromCategory(editingSpec.id, specForm);
        console.log("Update response:", response);
        
        alert("Specification updated successfully");
      } else {
        // Create new specification
        console.log("Creating specification:", specForm);
        const response = await createSpecificationForDropDownFromCategory(specForm);
        console.log("Create response:", response);
        
        alert("Specification added successfully");
      }
      
      // Refresh the specifications list
      await fetchHeroCarouselForDropDownFromCategory();
      handleCloseModal();
      
    } catch (error) {
      console.error(`Error ${editingSpec ? 'updating' : 'adding'} specification:`, error);
      alert(`Error ${editingSpec ? 'updating' : 'adding'} specification: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpecification = async (spec) => {
    if (!window.confirm(`Are you sure you want to delete "${spec.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      console.log("Deleting specification:", spec.id);
      const response = await deleteSpecificationForDropDownFromCategory(spec.id);
      console.log("Delete response:", response);
      
      alert("Specification deleted successfully");
      
      // Refresh the specifications list
      await fetchHeroCarouselForDropDownFromCategory();
      
    } catch (error) {
      console.error("Error deleting specification:", error);
      alert(`Error deleting specification: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroCarouselForDropDownFromCategory();
  }, [category?.slug]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Specifications</h2>
          <button
            onClick={() => handleOpenModal()}
            disabled={loading}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Specification</span>
          </button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
            <span className="ml-2">Loading...</span>
          </div>
        )}

        <div className="space-y-4">
          {specifications.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              No specifications found. Add your first specification to get started.
            </div>
          ) : (
            specifications.map((spec) => (
              <div
                key={spec.id}
                className="border rounded-lg p-4 hover:shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{spec.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {spec.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Order: {spec.order}</span>
                      {/* <span
                        className={`px-2 py-1 rounded ${
                          spec.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {spec.is_active ? "Active" : "Inactive"}
                      </span> */}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleOpenModal(spec)}
                      disabled={loading}
                      className="text-gray-400 hover:text-blue-600 disabled:opacity-50"
                      title="Edit specification"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSpecification(spec)}
                      disabled={loading}
                      className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                      title="Delete specification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Specification */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSpec ? "Edit Specification" : "Add New Specification"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter specification title"
              value={specForm.title}
              onChange={(e) =>
                setSpecForm({ ...specForm, title: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter specification description"
              value={specForm.description}
              onChange={(e) =>
                setSpecForm({ ...specForm, description: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              placeholder="Display order"
              value={specForm.order}
              onChange={(e) =>
                setSpecForm({
                  ...specForm,
                  order: parseInt(e.target.value) || 0,
                })
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={specForm.is_active}
                onChange={(e) =>
                  setSpecForm({ ...specForm, is_active: e.target.checked })
                }
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleCloseModal}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitSpecification}
            disabled={loading}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingSpec ? "Updating..." : "Adding..."}
              </div>
            ) : (
              editingSpec ? "Update Specification" : "Add Specification"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default SpecificationsTab;