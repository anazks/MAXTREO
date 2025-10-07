import React, { useEffect, useState } from 'react';
import { getTax, DeleteTax, AddTax } from '../../../Services/Settings';

function Tax() {
  const [taxes, setTaxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaxPopup, setShowTaxPopup] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [taxData, setTaxData] = useState({
    name: '',
    rate: ''
  });

  useEffect(() => {
    fetchTax();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchTax = async () => {
    try {
      setIsLoading(true);
      const response = await getTax();
      setTaxes(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching taxes:", error);
      setError("Failed to load tax data");
      showToast('Failed to load tax data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxData({
      ...taxData,
      [name]: value
    });
  };

  const handleTaxSubmit = async (e) => {
    e.preventDefault();
    
    const rateValue = parseFloat(taxData.rate);
    if (isNaN(rateValue)) {
      showToast('Tax rate must be a valid number', 'error');
      return;
    }
    
    const newTax = {
      tax_name: taxData.name,
      tax_percentage: rateValue
    };
    
    try {
      await AddTax(newTax);
      setShowTaxPopup(false);
      setTaxData({ name: '', rate: '' });
      showToast('Tax added successfully!');
      fetchTax();
    } catch (error) {
      console.error("Error creating tax:", error);
      showToast('Failed to create tax', 'error');
    }
  };

  const handleDeleteTax = async (taxId) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      try {
        await DeleteTax(taxId);
        showToast('Tax deleted successfully!');
        fetchTax();
      } catch (error) {
        console.error("Error deleting tax:", error);
        showToast('Failed to delete tax', 'error');
      }
    }
  };

  if (isLoading && !taxes.length) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-900 text-white font-rajdhani">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-rajdhani mb-8">
      <h2 className="text-2xl font-bold mb-6">Tax Management</h2>
      
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-md shadow-lg ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          } text-white font-medium`}>
            {toast.message}
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Taxes</h3>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
            onClick={() => setShowTaxPopup(true)}
          >
            Add Tax
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 font-medium">
              {error}
            </div>
          ) : (
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tax Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tax Rate (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {taxes.length > 0 ? (
                  taxes.map((tax) => (
                    <tr key={tax.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{tax.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{tax.tax_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{tax.tax_percentage}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                          onClick={() => handleDeleteTax(tax.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      <div className="text-center py-8">
                        <h4 className="text-lg font-medium mb-2">No Taxes Found</h4>
                        <p className="text-gray-400 font-medium">You haven't added any taxes yet. Click "Add Tax" to create your first tax.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Tax Popup */}
      {showTaxPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold">Add New Tax</h3>
              <button 
                className="text-gray-400 hover:text-white text-xl font-medium"
                onClick={() => setShowTaxPopup(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleTaxSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="taxName" className="block text-sm font-medium mb-2">Tax Name (VAT, GST etc.) *</label>
                <input
                  type="text"
                  id="taxName"
                  name="name"
                  value={taxData.name}
                  onChange={handleTaxChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                  placeholder="Enter tax name"
                  autoFocus
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="taxRate" className="block text-sm font-medium mb-2">Tax Rate (in percentage %) *</label>
                <input
                  type="number"
                  id="taxRate"
                  name="rate"
                  value={taxData.rate}
                  onChange={handleTaxChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  min="0"
                  step="0.01"
                  required
                  placeholder="Enter tax rate"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded font-medium"
                  onClick={() => setShowTaxPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tax;