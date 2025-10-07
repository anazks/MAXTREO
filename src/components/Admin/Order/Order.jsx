import React, { useEffect, useState } from 'react';
import { 
  FiPackage, 
  FiUser, 
  FiCreditCard, 
  FiTruck, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPrinter,
  FiRefreshCw
} from 'react-icons/fi';
import { AllOrders } from '../../../Services/Order';
import Loader from '../../../Loader/Loader';

function Order() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await AllOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    if (!status) return (
      <span className="flex items-center bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded-full text-xs sm:text-sm">
        <FiClock className="mr-1" /> Pending
      </span>
    );
    
    switch (status.toLowerCase()) {
      case 'delivered':
        return (
          <span className="flex items-center bg-green-600 bg-opacity-20 text-green-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiCheckCircle className="mr-1" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center bg-blue-600 bg-opacity-20 text-blue-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiTruck className="mr-1" /> Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiClock className="mr-1" /> Processing
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      default:
        return (
          <span className="flex items-center bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiClock className="mr-1" /> Pending
          </span>
        );
    }
  };

  const getPaymentBadge = (status) => {
    if (status == "FAILED" ) return (
      <span className="flex items-center bg-red-600 bg-opacity-20 text-red-400 px-2 py-1 rounded-full text-xs sm:text-sm">
        <FiAlertCircle className="mr-1" /> Unpaid
      </span>
    );
    
    switch (status.toLowerCase()) {
      case 'PAID':
        return (
          <span className="flex items-center bg-green-600 bg-opacity-20 text-green-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiCheckCircle className="mr-1" /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center bg-red-600 bg-opacity-20 text-red-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiAlertCircle className="mr-1" /> Failed
          </span>
        );
      default:
        return (
          <span className="flex items-center bg-red-600 bg-opacity-20 text-red-400 px-2 py-1 rounded-full text-xs sm:text-sm">
            <FiAlertCircle className="mr-1" /> Unpaid
          </span>
        );
    }
  };

  const handlePrevOrder = () => {
    setSelectedOrderIndex(prev => (prev > 0 ? prev - 1 : orders.length - 1));
  };

  const handleNextOrder = () => {
    setSelectedOrderIndex(prev => (prev < orders.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-rajdhani">
        <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-rajdhani p-6">
        <div className="text-red-500 text-4xl mb-4">
          <FiAlertCircle />
        </div>
        <p className="text-xl mb-6 text-center">{error}</p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium flex items-center"
          onClick={fetchOrders}
        >
          <FiRefreshCw className="mr-2" /> Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-rajdhani p-6">
        <FiPackage className="text-4xl text-gray-400 mb-4" />
        <h2 className="text-xl font-medium mb-2">No Orders Found</h2>
        <p className="text-gray-400 mb-4 text-center">There are currently no orders in the system.</p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium flex items-center"
          onClick={fetchOrders}
        >
          <FiRefreshCw className="mr-2" /> Refresh
        </button>
      </div>
    );
  }

  const order = orders[selectedOrderIndex];
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6 font-rajdhani">
      {/* Header with Order Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Order Management</h1>
        
        {orders.length > 1 && (
          <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto">
            <button 
              onClick={handlePrevOrder}
              className="p-1 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Previous order"
            >
              <FiChevronLeft className="text-lg sm:text-xl" />
            </button>
            
            <div className="text-center flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-400 truncate">Order {selectedOrderIndex + 1} of {orders.length}</p>
              <p className="text-sm sm:text-base font-medium truncate">
                #{order.invoice_number} • {order.user_name}
              </p>
            </div>
            
            <button 
              onClick={handleNextOrder}
              className="p-1 sm:p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Next order"
            >
              <FiChevronRight className="text-lg sm:text-xl" />
            </button>
          </div>
        )}
      </div>

      {/* Order Summary Card */}
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">Order #{order.invoice_number}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-gray-400 mt-2 gap-1 sm:gap-0 text-xs sm:text-sm">
              <span className="flex items-center">
                <FiCalendar className="mr-1" /> {formattedDate}
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="truncate">Customer: {order.user_name}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(order.order_status)}
            {getPaymentBadge(order.payment_status)}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6">
        {/* Customer Details */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <FiUser className="text-lg sm:text-xl mr-2" />
            <h3 className="text-base sm:text-lg font-semibold">Customer Details</h3>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-gray-400">Full Name</span>
              <span className="text-right sm:text-left truncate pl-2 sm:pl-0">{order.user_name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-gray-400">User ID</span>
              <span className="text-right sm:text-left truncate pl-2 sm:pl-0">{order.user}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-gray-400">Phone</span>
              <span className="text-right sm:text-left truncate pl-2 sm:pl-0">{order.delivery_address_details?.phone_number || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <FiTruck className="text-lg sm:text-xl mr-2" />
            <h3 className="text-base sm:text-lg font-semibold">Shipping Address</h3>
          </div>
          <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            <p className="truncate">{order.delivery_address_details?.delivery_person_name || order.user_name}</p>
            <p className="truncate">{order.delivery_address_details?.address || 'N/A'}</p>
            <p className="truncate">
              {order.delivery_address_details?.district || 'N/A'}, {order.delivery_address_details?.state || 'N/A'} {order.delivery_address_details?.postal_code || 'N/A'}
            </p>
            <p className="truncate">{order.delivery_address_details?.country || 'N/A'}</p>
            <p className="truncate">{order.delivery_address_details?.phone_number || 'N/A'}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <FiCreditCard className="text-lg sm:text-xl mr-2" />
            <h3 className="text-base sm:text-lg font-semibold">Payment Information</h3>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="text-gray-400">Payment Status</span>
              {getPaymentBadge(order.payment_status)}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-gray-400">Payment ID</span>
              <span className="text-right sm:text-left truncate pl-2 sm:pl-0">{order.payment_order_id || 'N/A'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-gray-400">Payment Method</span>
              <span className="text-right sm:text-left truncate pl-2 sm:pl-0">{order.payment_method || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <FiPackage className="text-lg sm:text-xl mr-2" />
            <h3 className="text-base sm:text-lg font-semibold">Order Summary</h3>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>₹{Number(order.price_before_tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Discount</span>
              <span>₹{Number(order.total_discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax</span>
              <span>₹{Number(order.total_tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-2 sm:pt-3 font-medium">
              <span>Total</span>
              <span>₹{Number(order.total_price).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center">
            <FiPackage className="text-lg sm:text-xl mr-2" />
            <h3 className="text-base sm:text-lg font-semibold">Order Items</h3>
          </div>
          <span className="text-xs sm:text-sm text-gray-400">{order.items?.length || 0} items</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Qty</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {order.items && order.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-750">
                  <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        <img 
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-md object-cover" 
                          src={item.product_image || "https://www.pngmart.com/files/23/Gaming-Pc-PNG.png"} 
                          alt={item.product_name} 
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://www.pngmart.com/files/23/Gaming-Pc-PNG.png";
                          }}
                        />
                      </div>
                      <div className="ml-2 sm:ml-4 min-w-0">
                        <div className="text-xs sm:text-sm font-medium truncate">{item.product_name}</div>
                        <div className="text-xs text-gray-400 truncate">SKU: {item.product_id || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">₹{Number(item.price).toFixed(2)}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{item.quantity}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">₹{(Number(item.price) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
        <button className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium flex items-center justify-center text-xs sm:text-sm">
          <FiPrinter className="mr-1 sm:mr-2" /> Print Invoice
        </button>
        <button className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-xs sm:text-sm">
          Update Status
        </button>
      </div>
    </div>
  );
}

export default Order;