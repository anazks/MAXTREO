import React, { useState, useEffect } from 'react';
import { getBrand, getCategory, getTax, addProduct, getSubCategory } from '../../../../Services/Settings';
import Alert from '../../../user/Alert/Alert';
import { useNavigate } from 'react-router-dom';

import Sidebar  from '../../Sidebar';
import NeoFooter from '../../footer';

function AddProducts() {
    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    product_code: '',
    name: '',
    brand: '',  
    description: '',
    category: '',
    subcategory:'', 
    mrp: '',  
    price: '', 
    discount_price: '',
    stock: '', 
    is_available: true,
    price_before_tax: '',
    tax_amount: '',
    tax_value: '', 
    youtube_url: '',
    broacher: null,
    whats_inside: '',
    warranty_info:'',
    more_info: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [debugData, setDebugData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const brandsRes = await getBrand();
        const categoriesRes = await getCategory();
        const subcategoryRes  = await getSubCategory();
        const taxRes = await getTax();

        setBrands(brandsRes?.data || []);
        setCategories(categoriesRes?.data || []);
        setSubCategories(subcategoryRes?.data || [])
        setTaxes(taxRes?.data || []);
      } catch (error) {
        console.error('Failed fetching settings:', error);
        setBrands([]);
        setCategories([]);
        setSubCategories([])
        setTaxes([]);
        setAlertData({
          type: 'error',
          message: 'Failed to load form data',
          error: error.message
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (type === 'file') {
      if (files && files.length > 0) {
        const file = files[0];
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (validTypes.includes(file.type)) {
          setFormData(prev => ({ ...prev, [name]: file }));
        } else {
          setErrors(prev => ({ ...prev, [name]: 'Only PDF or Word documents allowed' }));
          return;
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: null }));
      }
    } 
    else if (name === 'brand' || name === 'category' || name === 'tax_value' || name === "subcategory") {
      const numValue = value === '' ? '' : parseInt(value, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (name === 'mrp' || name === 'discount_price') {
      const mrp = name === 'mrp' ? parseFloat(value) : parseFloat(formData.mrp);
      const discount = name === 'discount_price' ? parseFloat(value) : parseFloat(formData.discount_price);

      if (!isNaN(mrp) && !isNaN(discount) && mrp >= discount) {
        setFormData(prev => ({
          ...prev,
          price: (mrp - discount).toFixed(2)
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand) newErrors.brand = 'Please select a brand';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.subcategory) newErrors.subcategory = 'Please select a Subcategory';
    if (!formData.mrp) newErrors.mrp = 'MRP is required';
    if (!formData.price) newErrors.price = 'Selling price is required';
    if (!formData.stock) newErrors.stock = 'Stock quantity is required';
    if (!formData.tax_value) newErrors.tax_value = 'Tax value is required';
    if (!formData.whats_inside) newErrors.whats_inside = 'What\'s inside is required';
    if (!formData.warranty_info) newErrors.warranty_info = 'Warranty information is required';

    if (formData.youtube_url && !formData.youtube_url.includes('youtube.com/watch') && !formData.youtube_url.includes('youtu.be')) {
      newErrors.youtube_url = 'Invalid YouTube URL';
    }

    if (formData.broacher && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(formData.broacher.type)) {
      newErrors.broacher = 'Only PDF or Word documents allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      setIsSubmitting(true);
  
      try {
        const productFormData = new FormData();
        // In your handleSubmit function, before creating FormData:
            let numericTaxAmount = 0; // or whatever default value makes sense
            if (formData.tax_amount === "Inclusive") {
              numericTaxAmount = 1; // or whatever numeric value represents "Inclusive"
            } else if (formData.tax_amount === "Exclusive") {
              numericTaxAmount = 0; // or whatever numeric value represents "Exclusive"
            }

// Then when adding to formData:
productFormData.append("tax_amount", numericTaxAmount);
        
        // productFormData.append("product_code", formData.product_code);
        productFormData.append("name", formData.name);
        productFormData.append("brand", Number(formData.brand));
        productFormData.append("description", formData.description);
        productFormData.append("category", Number(formData.category));
        productFormData.append("subcategory", Number(formData.subcategory));
        productFormData.append("mrp", Number(formData.mrp));
        productFormData.append("price", Number(formData.price));
        
        if (formData.discount_price) {
          productFormData.append("discount_price", Number(formData.discount_price));
        }
        
        productFormData.append("stock", Number(formData.stock));
        productFormData.append("is_available", formData.is_available);
        
        if (formData.price_before_tax) {
          productFormData.append("price_before_tax", Number(formData.price_before_tax));
        }
        
        // if (formData.tax_amount) {
        //   productFormData.append("tax_amount",(formData.tax_amount));
        // }
        
        if (formData.tax_value) {
          productFormData.append("tax_value", Number(formData.tax_value));
        }
        
        productFormData.append("youtube_url", formData.youtube_url || "");
        productFormData.append("whats_inside", formData.whats_inside);
        productFormData.append("warranty_info", formData.warranty_info);
        productFormData.append("more_info", formData.more_info || "");
        
        if (formData.broacher) {
          productFormData.append("broacher", formData.broacher);
        }
  
        const response = await addProduct(productFormData);
        console.log(response,"product added")
        if (response && response.status === 201) {
          setSubmitSuccess(true);
          setDebugData(response.data);
          setAlertData({
            type: 'success',
            message: response.data.message || 'Product created successfully!',
            productId: response.data.data?.id,
            error: null
          });
          
          setTimeout(() => {
            setSubmitSuccess(false);
            setFormData({
              product_code: '',
              name: '',
              brand: '',
              description: '',
              category: '',
              subcategory:'',
              mrp: '',
              price: '',
              discount_price: '',
              stock: '',
              is_available: true,
              price_before_tax: '',
              tax_amount: '',
              tax_value: '',
              youtube_url: '',
              broacher: null,
              whats_inside: '',
              warranty_info:'',
              more_info: ''
            });
            setIsSubmitting(false);
            setDebugData(null);
          }, 2000);
          navigate(`/admin/Updateproducts/${response.data.data.id}`)
          return response.data;
        } else {
          throw new Error('Failed to add product');
        }
      } catch (error) {
        console.error('Failed to submit product:', error);
        setAlertData({
          type: 'error',
          message: 'Failed to add product',
          productId: null,
          error: error.response?.data?.message || error.message
        });
        
        if (error.response && error.response.data) {
          console.error('Server error details:', error.response.data);
          setDebugData(error.response.data);
        }
        
        setIsSubmitting(false);
        return null;
      }
    }
    
    return false;
  };

  const discountPercentage = () => {
    if (!formData.mrp || !formData.price) return null;
    const mrp = parseFloat(formData.mrp);
    const price = parseFloat(formData.price);
    if (isNaN(mrp) || isNaN(price) || mrp <= 0) return null;

    const percentage = ((mrp - price) / mrp) * 100;
    return percentage > 0 ? percentage.toFixed(0) + '%' : null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-rajdhani">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
    <Sidebar/>
    <div className={`min-h-screen bg-gray-900 text-gray-100 p-6 font-rajdhani ${submitSuccess ? 'bg-opacity-90' : ''}`} style={{marginTop:"70px"}}>
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      
      {alertData && (
        <div className={`mb-6 p-4 rounded-md ${
          alertData.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          {alertData.message}
          {alertData.error && <p className="text-sm mt-2">{alertData.error}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"  >
            <div className="space-y-2" style={{display:"none"}}>
              <label className="block text-sm font-medium text-gray-300">Product Code</label>
              <input 
                type="text" 
                name="product_code" 
                value={formData.product_code} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.product_code ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                maxLength="20" 
               
              />
              {errors.product_code && <p className="text-red-400 text-sm">{errors.product_code}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Product Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                maxLength="255" 
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Brand</label>
              <select 
                name="brand" 
                value={formData.brand} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.brand ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {errors.brand && <p className="text-red-400 text-sm">{errors.brand}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.category ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-sm">{errors.category}</p>}
            </div>

             <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Subcategory</label>
              <select 
                name="subcategory" 
                value={formData.subcategory} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.category ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select subcategory</option>
                {subCategories.map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                ))}
              </select>
              {errors.subcategory && <p className="text-red-400 text-sm">{errors.subcategory}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="3"
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.description && <p className="text-red-400 text-sm">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Pricing Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">MRP</label>
              <input 
                type="number" 
                name="mrp" 
                value={formData.mrp} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.mrp ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                step="0.01" 
              />
              {errors.mrp && <p className="text-red-400 text-sm">{errors.mrp}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Discount %</label>
              <input 
                type="number" 
                name="discount_price" 
                value={formData.discount_price} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01" 
              />
            </div>

            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Selling Price</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.price ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                step="0.01" 
              />
              {errors.price && <p className="text-red-400 text-sm">{errors.price}</p>}
              {discountPercentage() && (
                <p className="text-green-400 text-sm">{discountPercentage()} OFF</p>
              )}
            </div> */}

            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Price Before Tax</label>
              <input 
                type="number" 
                name="price_before_tax" 
                value={formData.price_before_tax} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01" 
              />
            </div> */}

           <div>
              <select 
  name="tax_amount" 
  value={formData.tax_amount} 
  onChange={handleChange} 
  className='w-full px-3 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
>
  <option value="1">Inclusive</option>
  <option value="0">Exclusive</option>
</select>
              {/* <input 
                type="number" 
                name="tax_amount" 
                value={formData.tax_amount} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01" 
              />
            </div> */}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Tax Value</label>
              <select 
                name="tax_value" 
                value={formData.tax_value} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.tax_value ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select Tax</option>
                {taxes.map(tax => (
                  <option key={tax.id} value={tax.id}>{tax.name} ({tax.tax_name} - {tax.tax_percentage}%)</option>
                ))}
              </select>
              {errors.tax_value && <p className="text-red-400 text-sm">{errors.tax_value}</p>}
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Inventory</h3>    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Stock Count</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.stock ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                min="0"
                step="1" 
              />
              {errors.stock && <p className="text-red-400 text-sm">{errors.stock}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="is_available" 
                checked={formData.is_available} 
                onChange={handleChange} 
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-300">Available for Sale</label>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Additional Info</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">What's Inside</label>
              <textarea 
                name="whats_inside" 
                value={formData.whats_inside} 
                onChange={handleChange} 
                rows="2"
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.whats_inside ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.whats_inside && <p className="text-red-400 text-sm">{errors.whats_inside}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Warranty Info</label>
              <textarea 
                name="warranty_info" 
                value={formData.warranty_info} 
                onChange={handleChange} 
                rows="3"
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.warranty_info ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              ></textarea>
              {errors.warranty_info && <p className="text-red-400 text-sm">{errors.warranty_info}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">More info Url</label>
              <input 
                type="url" 
                name="more_info" 
                value={formData.more_info} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="200" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Youtube URL</label>
              <input 
                type="url" 
                name="youtube_url" 
                value={formData.youtube_url} 
                onChange={handleChange} 
                className={`w-full px-3 py-2 bg-gray-700 border ${errors.youtube_url ? 'border-red-500' : 'border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                maxLength="200" 
              />
              {errors.youtube_url && <p className="text-red-400 text-sm">{errors.youtube_url}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Brochure (PDF/Doc)</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md border border-gray-600">
                  <span>Choose File</span>
                  <input 
                    type="file" 
                    name="broacher" 
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                  />
                </label>
                <span className="text-gray-400">
                  {formData.broacher ? formData.broacher.name : 'No file chosen'}
                </span>
              </div>
              {errors.broacher && <p className="text-red-400 text-sm">{errors.broacher}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            className={`px-6 py-2 rounded-md font-medium ${
              isSubmitting ? 'bg-blue-700 cursor-not-allowed' : 
              submitSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : submitSuccess ? 'Product Added!' : 'Add Product'}
          </button>
        </div>

        {/* Debug Information */}
        {debugData && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Debug Data:</h3>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
    <NeoFooter/>
    </>

  );
}

export default AddProducts;