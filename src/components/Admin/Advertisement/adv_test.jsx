import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Settings, 
  X, 
  Save,
  Upload,
  ChevronDown,
  ChevronUp,
  Star,
  Image as ImageIcon,
  FileText,
  Package
} from 'lucide-react';

const ProductCategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    is_active: true,
    order: 0
  });

  const [carouselForm, setCarouselForm] = useState({
    image: null,
    alt_text: '',
    head_one: '',
    head_two: '',
    description: '',
    button_text: 'Shop Now',
    button_link: '',
    order: 0,
    is_active: true
  });

  const [specForm, setSpecForm] = useState({
    title: '',
    description: '',
    order: 0,
    is_active: true
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setCategories([
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        description: 'All electronic products',
        is_active: true,
        order: 1,
        total_products: 25,
        hero_carousels: [
          {
            id: 1,
            head_one: 'Latest Electronics',
            head_two: 'Great Deals',
            description: 'Find the best electronic products at amazing prices',
            button_text: 'Shop Now',
            order: 1,
            is_active: true
          }
        ],
        specifications: [
          {
            id: 1,
            title: 'High Quality',
            description: 'Premium quality electronic products with warranty',
            order: 1,
            is_active: true
          }
        ],
        category_products: [
          {
            id: 1,
            is_featured: true,
            order: 1,
            product: {
              id: 1,
              name: 'Smartphone XYZ',
              product_code: 'SP001',
              brand_name: 'TechBrand',
              price: 25000,
              mrp: 30000,
              discount_price: 25000,
              is_available: true,
              images: []
            }
          }
        ]
      }
    ]);

    setProducts([
      {
        id: 1,
        name: 'Smartphone XYZ',
        product_code: 'SP001',
        brand_name: 'TechBrand',
        price: 25000,
        mrp: 30000,
        discount_price: 25000,
        is_available: true,
        images: []
      },
      {
        id: 2,
        name: 'Laptop ABC',
        product_code: 'LP001',
        brand_name: 'CompuBrand',
        price: 45000,
        mrp: 50000,
        discount_price: 45000,
        is_available: true,
        images: []
      }
    ]);
  }, []);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && category.is_active) ||
                         (filterActive === 'inactive' && !category.is_active);
    return matchesSearch && matchesFilter;
  });

  const handleCreateCategory = async () => {
    try {
      setLoading(true);
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', categoryForm.name);
      formDataToSend.append('description', categoryForm.description);
      formDataToSend.append('is_active', categoryForm.is_active);
      formDataToSend.append('order', categoryForm.order);
      
      const response = await axios.post(
        'advertisement/product/categories/',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      // Add the new category to the list with response data
      const newCategory = {
        ...response.data,
        total_products: 0,
        hero_carousels: [],
        specifications: [],
        category_products: []
      };
      
      setCategories([...categories, newCategory]);
      setCategoryForm({ name: '', description: '', is_active: true, order: 0 });
      setShowCreateModal(false);
      
      // Optional: Show success message
      console.log('Category created successfully:', response.data);
      
    } catch (error) {
      console.error('Error creating category:', error);
      // Optional: Show error message to user
      if (error.response) {
        console.error('Server error:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCarousel = () => {
    if (!selectedCategory) return;
    
    const newCarousel = {
      ...carouselForm,
      id: Date.now()
    };

    const updatedCategories = categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, hero_carousels: [...cat.hero_carousels, newCarousel] }
        : cat
    );
    
    setCategories(updatedCategories);
    setSelectedCategory({
      ...selectedCategory,
      hero_carousels: [...selectedCategory.hero_carousels, newCarousel]
    });
    
    setCarouselForm({
      image: null,
      alt_text: '',
      head_one: '',
      head_two: '',
      description: '',
      button_text: 'Shop Now',
      button_link: '',
      order: 0,
      is_active: true
    });
  };

  const handleAddSpecification = () => {
    if (!selectedCategory) return;
    
    const newSpec = {
      ...specForm,
      id: Date.now()
    };

    const updatedCategories = categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, specifications: [...cat.specifications, newSpec] }
        : cat
    );
    
    setCategories(updatedCategories);
    setSelectedCategory({
      ...selectedCategory,
      specifications: [...selectedCategory.specifications, newSpec]
    });
    
    setSpecForm({
      title: '',
      description: '',
      order: 0,
      is_active: true
    });
  };

  const handleAddProduct = (product) => {
    if (!selectedCategory) return;

    const newCategoryProduct = {
      id: Date.now(),
      product: product,
      is_featured: false,
      order: selectedCategory.category_products.length + 1
    };

    const updatedCategories = categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { 
            ...cat, 
            category_products: [...cat.category_products, newCategoryProduct],
            total_products: cat.total_products + 1
          }
        : cat
    );
    
    setCategories(updatedCategories);
    setSelectedCategory({
      ...selectedCategory,
      category_products: [...selectedCategory.category_products, newCategoryProduct],
      total_products: selectedCategory.total_products + 1
    });
    
    setShowProductModal(false);
  };

  const toggleExpand = (type, id) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`]
    }));
  };

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Back to Categories
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Configure: {selectedCategory.name}
                </h1>
              </div>
            </div>
            
            <div className="flex space-x-8 border-b">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'carousel', label: 'Hero Carousel', icon: ImageIcon },
                { id: 'specifications', label: 'Specifications', icon: Settings },
                { id: 'products', label: 'Products', icon: Package }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-pink-600 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Category Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-pink-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">{selectedCategory.total_products}</div>
                  <div className="text-gray-600">Total Products</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedCategory.hero_carousels.length}</div>
                  <div className="text-gray-600">Hero Carousels</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedCategory.specifications.length}</div>
                  <div className="text-gray-600">Specifications</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedCategory.category_products.filter(p => p.is_featured).length}
                  </div>
                  <div className="text-gray-600">Featured Products</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'carousel' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Hero Carousel Items</h2>
                  <button
                    onClick={() => toggleExpand('carousel', 'form')}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Carousel</span>
                  </button>
                </div>

                {expandedItems['carousel-form'] && (
                  <div className="border-t pt-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Header One"
                        value={carouselForm.head_one}
                        onChange={(e) => setCarouselForm({...carouselForm, head_one: e.target.value})}
                        className="border rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Header Two"
                        value={carouselForm.head_two}
                        onChange={(e) => setCarouselForm({...carouselForm, head_two: e.target.value})}
                        className="border rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Alt Text"
                        value={carouselForm.alt_text}
                        onChange={(e) => setCarouselForm({...carouselForm, alt_text: e.target.value})}
                        className="border rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={carouselForm.button_text}
                        onChange={(e) => setCarouselForm({...carouselForm, button_text: e.target.value})}
                        className="border rounded-lg px-3 py-2"
                      />
                      <input
                        type="url"
                        placeholder="Button Link"
                        value={carouselForm.button_link}
                        onChange={(e) => setCarouselForm({...carouselForm, button_link: e.target.value})}
                        className="border rounded-lg px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Order"
                        value={carouselForm.order}
                        onChange={(e) => setCarouselForm({...carouselForm, order: parseInt(e.target.value)})}
                        className="border rounded-lg px-3 py-2"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={carouselForm.description}
                      onChange={(e) => setCarouselForm({...carouselForm, description: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 mt-4"
                      rows="3"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => toggleExpand('carousel', 'form')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddCarousel}
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                      >
                        Add Carousel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedCategory.hero_carousels.map((carousel, index) => (
                    <div key={carousel.id} className="border rounded-lg p-4 hover:shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{carousel.head_one} - {carousel.head_two}</h3>
                          <p className="text-gray-600 text-sm mt-1">{carousel.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Order: {carousel.order}</span>
                            <span>Button: {carousel.button_text}</span>
                            <span className={`px-2 py-1 rounded ${carousel.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {carousel.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Product Specifications</h2>
                  <button
                    onClick={() => toggleExpand('spec', 'form')}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Specification</span>
                  </button>
                </div>

                {expandedItems['spec-form'] && (
                  <div className="border-t pt-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={specForm.title}
                        onChange={(e) => setSpecForm({...specForm, title: e.target.value})}
                        className="border rounded-lg px-3 py-2"
                      />
                      <input
                        type="number"
                        placeholder="Order"
                        value={specForm.order}
                        onChange={(e) => setSpecForm({...specForm, order: parseInt(e.target.value)})}
                        className="border rounded-lg px-3 py-2"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      value={specForm.description}
                      onChange={(e) => setSpecForm({...specForm, description: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 mt-4"
                      rows="4"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => toggleExpand('spec', 'form')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSpecification}
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                      >
                        Add Specification
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedCategory.specifications.map((spec, index) => (
                    <div key={spec.id} className="border rounded-lg p-4 hover:shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{spec.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{spec.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Order: {spec.order}</span>
                            <span className={`px-2 py-1 rounded ${spec.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {spec.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Category Products</h2>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedCategory.category_products.map((categoryProduct, index) => (
                    <div key={categoryProduct.id} className="border rounded-lg p-4 hover:shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{categoryProduct.product.name}</h3>
                            {categoryProduct.is_featured && (
                              <Star size={16} className="text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">Code: {categoryProduct.product.product_code}</p>
                          <p className="text-gray-600 text-sm">Brand: {categoryProduct.product.brand_name}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-pink-600 font-medium">₹{categoryProduct.product.price}</span>
                            <span className="text-gray-500 line-through">₹{categoryProduct.product.mrp}</span>
                            <span>Order: {categoryProduct.order}</span>
                            <span className={`px-2 py-1 rounded ${categoryProduct.product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {categoryProduct.product.is_available ? 'Available' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Edit size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Selection Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto m-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select Products</h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-gray-600 text-sm">Code: {product.product_code}</p>
                        <p className="text-gray-600 text-sm">Brand: {product.brand_name}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-pink-600 font-medium">₹{product.price}</span>
                          <span className="text-gray-500 line-through">₹{product.mrp}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddProduct(product)}
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                      >
                        Add to Category
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 flex items-center space-x-2 font-medium"
            >
              <Plus size={20} />
              <span>Create Category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
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
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{category.total_products}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className="bg-pink-600 text-white px-3 py-1 rounded text-sm hover:bg-pink-700 flex items-center space-x-1"
                        >
                          <Settings size={14} />
                          <span>Configure</span>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
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
                  {searchTerm || filterActive !== 'all' 
                    ? 'No categories found matching your criteria.' 
                    : 'No categories created yet.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Category</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter category description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({...categoryForm, order: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Display order"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={categoryForm.is_active}
                  onChange={(e) => setCategoryForm({...categoryForm, is_active: e.target.checked})}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={!categoryForm.name.trim() || loading}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Category</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryAdmin;