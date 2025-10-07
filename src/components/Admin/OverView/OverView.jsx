import React, { useEffect, useState } from 'react';
import { AddOverViewCategory, viewOverView, addoverViewCate } from '../../../Services/Products';
import  Loader  from '../../../Loader/Loader'
import Sidebar from '../Sidebar';
import NeoFooter from '../footer';

function OverView() {
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await viewOverView();
        const formattedData = data.map(category => ({
          ...category,
          attributes: category.attributes || []
        }));
        setCategories(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const data = await AddOverViewCategory({ name: newCategoryName });
      const newCategory = {
        id: data.id || Date.now(),
        name: newCategoryName,
        attributes: []
      };
      
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setShowCategoryModal(false);
      setSelectedCategory(newCategory);
      setShowItemModal(true);
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category. Please try again.");
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !selectedCategory) return;

    try {
      const data = await addoverViewCate({
        category_id: selectedCategory.id,
        name: newItemName
      });

      const updatedCategories = categories.map(category => {
        if (category.id === selectedCategory.id) {
          return {
            ...category,
            attributes: [...category.attributes, {
              id: data.id || Date.now(),
              name: newItemName
            }]
          };
        }
        return category;
      });
      
      setCategories(updatedCategories);
      setNewItemName('');
      setShowItemModal(false);
    } catch (err) {
      console.error("Error adding attribute:", err);
      setError("Failed to add attribute. Please try again.");
    }
  };

  const handleAddItemFromSelect = async () => {
    if (!newItemName.trim() || !selectedCategoryId) return;

    try {
      const category = categories.find(c => c.id === parseInt(selectedCategoryId));
      if (!category) return;

      const data = await addoverViewCate({
        category_id: category.id,
        name: newItemName
      });

      const updatedCategories = categories.map(c => {
        if (c.id === category.id) {
          return {
            ...c,
            attributes: [...c.attributes, {
              id: data.id || Date.now(),
              name: newItemName
            }]
          };
        }
        return c;
      });
      
      setCategories(updatedCategories);
      setNewItemName('');
      setSelectedCategoryId('');
      setShowAddItemsModal(false);
    } catch (err) {
      console.error("Error adding attribute:", err);
      setError("Failed to add attribute. Please try again.");
    }
  };

  const openItemModal = (category) => {
    setSelectedCategory(category);
    setShowItemModal(true);
  };

  const openAddItemsModal = () => {
    setNewItemName('');
    setSelectedCategoryId(categories.length > 0 ? categories[0].id.toString() : '');
    setShowAddItemsModal(true);
  };

  const closeModal = (e) => {
    if (e.target.classList.contains('fixed')) {
      setShowCategoryModal(false);
      setShowItemModal(false);
      setShowAddItemsModal(false);
    }
  };

  const handleKeyPress = (e, actionFunction) => {
    if (e.key === 'Enter') {
      actionFunction();
    }
  };

  if (isLoading) {
    return <Loader/>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-rajdhani p-6">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <p className="text-xl mb-6">{error}</p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
    <Sidebar/>
    
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-rajdhani" style={{margin:"auto",marginTop:"60px", width:"95%"}}>
      <h2 className="text-2xl font-bold mb-6">Overview</h2>
      
      {/* Table of categories and items */}
      {categories.length > 0 ? (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Attributes/Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {categories.map(category => (
                <tr key={category.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{category.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {category.attributes.map(item => (
                        <span key={item.id} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                          {item.name}
                        </span>
                      ))}
                      {category.attributes.length === 0 && (
                        <span className="text-gray-400 italic">No items added</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      className="flex items-center text-blue-400 hover:text-blue-300"
                      onClick={() => openItemModal(category)}
                    >
                      <svg className="w-5 h-5 mr-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>Add Item</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-800 rounded-lg mb-6">
          <svg className="w-12 h-12 text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-gray-300 mb-4">No categories added yet</p>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
            onClick={() => setShowCategoryModal(true)}
          >
            Add Your First Category
          </button>
        </div>
      )}
      
      {/* Action Buttons */}
      {categories.length > 0 && (
        <div className="flex space-x-4 mb-6">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center"
            onClick={() => setShowCategoryModal(true)}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Category
          </button>
          
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium flex items-center"
            onClick={openAddItemsModal}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Items
          </button>
        </div>
      )}
      
      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">Add New Category</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowCategoryModal(false)}
              >
                <svg className="w-6 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddCategory)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium disabled:opacity-50"
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Item Modal (from category) */}
      {showItemModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">Add New Item</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowItemModal(false)}
              >
                <svg className="w-6 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <div className="px-3 py-2 bg-gray-700 rounded-md">{selectedCategory.name}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Attribute Name</label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddItem)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter attribute name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium"
                  onClick={() => setShowItemModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium disabled:opacity-50"
                  onClick={handleAddItem}
                  disabled={!newItemName.trim()}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Overview Items Modal (from button) */}
      {showAddItemsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">Add Overview Item</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowAddItemsModal(false)}
              >
                <svg className="w-6 h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Category</label>
                <select 
                  value={selectedCategoryId} 
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Attribute Name</label>
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddItemFromSelect)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter attribute name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium"
                  onClick={() => setShowAddItemsModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium disabled:opacity-50"
                  onClick={handleAddItemFromSelect}
                  disabled={!newItemName.trim() || !selectedCategoryId}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    <NeoFooter/>
    </>
  );
}

export default OverView;